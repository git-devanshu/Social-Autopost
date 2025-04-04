import { Box, Button, VStack, HStack, Text, Icon, Input, InputGroup, InputLeftElement, Spacer } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { InfoIcon, LockIcon } from "@chakra-ui/icons";
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
    const [fbAppId, setFbAppId] = useState('');
    const [fbAppSecret, setFbAppSecret] = useState('');
    const [areDetailsSaved, setAreDetailsSaved] = useState(false); //used to check whether facebook app credentials are saved
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

    // for checking profile connections
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

    // for getting the fbAppId
    useEffect(()=>{
        const token = localStorage.getItem('token');
        axios.get(getBaseURL() + '/oauth/facebook/app', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                setFbAppId(res.data.fbAppId);
                if(res.data.fbAppId !== ""){
                    setAreDetailsSaved(true);
                    setFbAppSecret("*******************************");
                }
            }
        })
        .catch(err =>{
            console.error(err);
        });
    }, []);

    const handleSidebarClick = (option) => {
        setActiveOption(option);
    };

    // connect linkedIn profile through OAuth
    const goToLinkedInOAuth = () =>{
        toast('Redirecting to LinkedIn Authentication');
        const token = localStorage.getItem('token');
        const tokenData = decodeToken(token);
        const REDIRECT_URI = getBaseURL() + '/oauth/linkedin/callback';
        const linkedInOAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=w_member_social%20openid%20profile%20email&state=${tokenData.id}`;
        window.location.href = linkedInOAuthURL;
    }

    // connect twitter profile through OAuth
    const goToTwitterOAuth = async() =>{
        toast("Redirecting to Twitter Authentication...");
        const token = localStorage.getItem("token");
        try{
            const response = await axios.post(getBaseURL() + "/oauth/twitter/request-token", {}, {headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
    
    // connect instagram profile through connected facebook page
    const connectInstagram = () =>{
        if(!profileConnection.facebook){
            toast.error("Please connect to your Facebook Page first");
            return;
        }
        const toastId = toast.loading('Connecting to your Linked Instagram Business Account');
        const token = localStorage.getItem('token');
        axios.get(getBaseURL() + '/oauth/instagram/connect', {headers : {
            Authorization: `Bearer ${token}`,
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id: toastId});
                setRefresh(!refresh);
            }
        })
        .catch(err =>{
            console.error(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    // connect facebook page through OAuth
    const goToFacebookOAuth = () =>{
        if(!areDetailsSaved || fbAppId === ""){
            toast.error("You need to save your Facebook App credentials first");
            return;
        }
        toast('Redirecting to Facebook Authentication...');
        const tokenData = decodeToken(localStorage.getItem('token'));
        const REDIRECT_URI = getBaseURL() + `/oauth/facebook/callback?userId=${tokenData.id}`;
        const fbOAuthURL = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=instagram_basic,instagram_content_publish,pages_show_list`;
        window.location.href = fbOAuthURL;
    }

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

    const saveFBAppCredentials = () =>{
        const token = localStorage.getItem('token');
        const toastId = toast.loading('Adding Facebook App credentials');
        axios.post(getBaseURL() + '/oauth/facebook/app/add', {fbAppId, fbAppSecret}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setAreDetailsSaved(true);
            }
        })
        .catch(err =>{
            console.error(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    const removeFBAppCredentials = () =>{
        const token = localStorage.getItem('token');
        const toastId = toast.loading('Removing Facebook App credentials');
        axios.delete(getBaseURL() + '/oauth/facebook/app/remove', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setAreDetailsSaved(false);
                setFbAppId('');
                setFbAppSecret('');
            }
        })
        .catch(err =>{
            console.error(err);
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
                            <Button colorScheme="green" onClick={connectInstagram}>Connect</Button>
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

                    {/* Facebook app credentials */}
                    <Text fontSize="xl" fontWeight="bold" mt={2}>Your Facebook App Credentials</Text>
                    <VStack p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg="gray.50" >
                        <Text alignSelf="start">This is required to connect your Facebook Page and Instagram account linked to it. Once your Facebook Page is connected, removing these credentails won't disconnect your Facebook from this site.</Text>
                        <HStack w="full">
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <InfoIcon color="gray.400" />
                                </InputLeftElement>
                                <Input 
                                    type="text"
                                    name="fbAppId"
                                    value={fbAppId}
                                    onChange={(e)=> setFbAppId(e.target.value)}
                                    required
                                    placeholder="Facebook App ID" 
                                    focusBorderColor="green.400"
                                    isReadOnly={areDetailsSaved}
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <LockIcon color="gray.400" />
                                </InputLeftElement>
                                <Input 
                                    type="password"
                                    name="fbAppSecret"
                                    value={fbAppSecret}
                                    onChange={(e)=> setFbAppSecret(e.target.value)}
                                    required
                                    placeholder="Facebook App Secret" 
                                    focusBorderColor="green.400"
                                    isReadOnly={areDetailsSaved}
                                />
                            </InputGroup>

                            <Spacer/>

                            {areDetailsSaved ?
                                <Button colorScheme="red" width={'140px'} onClick={removeFBAppCredentials}>
                                    Remove
                                </Button> :
                                <Button colorScheme="green" width={'140px'} onClick={saveFBAppCredentials}>
                                    Save
                                </Button>                                
                            }
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
        </HStack>
    );
}