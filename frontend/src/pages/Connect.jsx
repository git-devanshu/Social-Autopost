import { Box, Button, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast';
import {getBaseURL, decodeToken} from '../utils/helperFunctions';
import axios from 'axios';
import Sidebar from "../components/sidebar";
import {useNavigate, useLocation} from 'react-router-dom';

export default function Connect() {
    const navigate = useNavigate();
    const location = useLocation();

    const [refresh, setRefresh] = useState(false);
    const [profileConnection, setProfileConnection] = useState({
        instagram: false,
        facebook: false,
        linkedin: false,
        twitter: false,
        igUsername : '',
        fbName : '',
        ldnName : '',
        xUsername : ''
    });
    const [activeOption, setActiveOption] = useState("Connect");

    const getQueryParams = (query) =>{
        return query.substring(1).split('&')
            .reduce((params, param) =>{
                const [key, value] = param.split('=');
                params[key] = value;
                return params;
            }, {});
    };

    //this is for showing alerts when redirected by oauth
    useEffect(() => {
        const queryParams = getQueryParams(location.search);
        if(queryParams.success === 'true'){
            toast.success('Profile Connected Successfully');
            navigate('/connect-profiles');
        } 
        else if(queryParams.error === 'oauth_failed'){
            toast.error('Profile Authentication Failed')
            navigate('/connect-profiles');
        }
        else if(queryParams.oauth_token && queryParams.oauth_verifier){
            const toastId = toast.loading("Connecting to Twitter...");
            const token = localStorage.getItem("token");

            axios.post(getBaseURL() + "/oauth/twitter/get-token", {
                oauth_token: queryParams.oauth_token,
                oauth_verifier: queryParams.oauth_verifier,
            }, {headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data.message, { id: toastId });
                }
                navigate("/connect-profiles");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, { id: toastId });
                navigate("/connect-profiles");
            });
        }
    }, [location, navigate]);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const toastId = toast.loading('Checking Profile Connections...');
        axios.get(getBaseURL() + '/oauth/profile-connection', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                setProfileConnection(res.data.profileConnection);
                toast.success(res.data.message, {id : toastId});
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }, [refresh]);

    const handleSidebarClick = (option) => {
        setActiveOption(option);
    };

    const goToLinkedInOAuth = () =>{
        toast('Redirecting to LinkedIn Authentication');
        const token = localStorage.getItem('token');
        const tokenData = decodeToken(token);
        const REDIRECT_URI = getBaseURL() + '/oauth/linkedin/callback';
        const linkedInOAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=w_member_social%20openid%20profile%20email&state=${tokenData.id}`;
        window.location.href = linkedInOAuthURL;
    }

    const goToTwitterOAuth = async() =>{
        toast("Redirecting to Twitter Authentication...");
        const token = localStorage.getItem("token");
        try{
            const response = await axios.post(getBaseURL() + "/oauth/twitter/request-token", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if(response.data.oauth_token){
                const twitterOAuthURL = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.data.oauth_token}`;
                window.location.href = twitterOAuthURL;
            } 
            else{
                toast.error("Failed to get Twitter request token");
            }
        }
        catch(error){
            console.error("Error during Twitter OAuth:", error);
            toast.error("Error during Twitter OAuth");
        }
    };
    

    const goToInstagramOAuth = () =>{}


    const goToFacebookOAuth = () =>{}


    const removeConnection = (platform) =>{
        const toastId = toast.loading('Removing Account Connection...');
        const token = localStorage.getItem('token');
        axios.delete(getBaseURL() + `/oauth/logout/${platform}`, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <HStack align="stretch" h="100vh" spacing={0}>
            {/* Sidebar */}
            <Sidebar activeOption={activeOption} handleSidebarClick={handleSidebarClick} />

            <Box flex={1} p={6} overflowY="auto">
                <Text fontSize="2xl" fontWeight="bold" mb={4}>Connect Your Accounts</Text>
                <VStack spacing={4} align="stretch">
                    {/* for instagram */}
                    <HStack justify="space-between" p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg={profileConnection.instagram ? "green.100" : "gray.50"}>
                        <HStack>
                            <Icon as={FaInstagram} boxSize={6} color={"#E1306C"} />
                            <Text fontSize="lg" fontWeight="medium">Instagram</Text>
                            {profileConnection.instagram && <Text fontSize="sm" color="gray.600">(@{profileConnection.igUsername})</Text>}
                        </HStack>
                        {profileConnection.instagram ? (
                            <Button colorScheme="red" onClick={() => removeConnection('instagram')}>Disconnect</Button>
                        ) : (
                            <Button colorScheme="green" onClick={goToInstagramOAuth}>Connect</Button>
                        )}
                    </HStack>

                    {/* for facebook */}
                    <HStack justify="space-between" p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg={profileConnection.facebook ? "green.100" : "gray.50"}>
                        <HStack>
                            <Icon as={FaFacebook} boxSize={6} color={"#1877F2"} />
                            <Text fontSize="lg" fontWeight="medium">Facebook</Text>
                            {profileConnection.facebook && <Text fontSize="sm" color="gray.600">({profileConnection.fbName})</Text>}
                        </HStack>
                        {profileConnection.facebook ? (
                            <Button colorScheme="red" onClick={() => removeConnection('facebook')}>Disconnect</Button>
                        ) : (
                            <Button colorScheme="green" onClick={goToFacebookOAuth}>Connect</Button>
                        )}
                    </HStack>

                    {/* for linkedin */}
                    <HStack justify="space-between" p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg={profileConnection.linkedin ? "green.100" : "gray.50"}>
                        <HStack>
                            <Icon as={FaLinkedin} boxSize={6} color={"#0A66C2"} />
                            <Text fontSize="lg" fontWeight="medium">LinkedIn</Text>
                            {profileConnection.linkedin && <Text fontSize="sm" color="gray.600">({profileConnection.ldnName})</Text>}
                        </HStack>
                        {profileConnection.linkedin ? (
                            <Button colorScheme="red" onClick={() => removeConnection('linkedin')}>Disconnect</Button>
                        ) : (
                            <Button colorScheme="green" onClick={goToLinkedInOAuth}>Connect</Button>
                        )}
                    </HStack>

                    {/* for twitter */}
                    <HStack justify="space-between" p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg={profileConnection.twitter ? "green.100" : "gray.50"}>
                        <HStack>
                            <Icon as={FaTwitter} boxSize={6} color={"#1DA1F2"} />
                            <Text fontSize="lg" fontWeight="medium">Twitter</Text>
                            {profileConnection.twitter && <Text fontSize="sm" color="gray.600">(@{profileConnection.xUsername})</Text>}
                        </HStack>
                        {profileConnection.twitter ? (
                            <Button colorScheme="red" onClick={() => removeConnection('twitter')}>Disconnect</Button>
                        ) : (
                            <Button colorScheme="green" onClick={goToTwitterOAuth}>Connect</Button>
                        )}
                    </HStack>
                </VStack>
            </Box>
        </HStack>
    );
}