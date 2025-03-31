import React, { useEffect, useState } from 'react'
import {Stack, Button} from '@chakra-ui/react';
import {toast} from 'react-hot-toast';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import {getBaseURL, decodeToken} from '../utils/helperFunctions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ConnectProfiles() {
    const navigate = useNavigate();

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

    const navigateToPost = () =>{
        navigate('/dashboard');
    }

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
        <div>
            <Stack direction={'row'}>
                <Button
                    leftIcon={<FaInstagram />}
                    colorScheme="pink"
                    variant="solid"
                    onClick={goToInstagramOAuth}
                >
                    Connect Instagram
                </Button>
                <Button onClick={()=>removeConnection('instagram')} colorScheme="red">Disconnect</Button>
            </Stack><br/>

            <Stack direction={'row'}>
                <Button
                    leftIcon={<FaFacebook />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={goToFacebookOAuth}
                >
                    Connect Facebook
                </Button>
                <Button onClick={()=>removeConnection('facebook')} colorScheme="red">Disconnect</Button>
            </Stack><br/>

            <Stack direction={'row'}>
                <Button
                    leftIcon={<FaLinkedin />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={goToLinkedInOAuth}
                >
                    Connect LinkedIn
                </Button>
                <Button onClick={()=>removeConnection('linkedin')} colorScheme="red">Disconnect</Button>
            </Stack><br/>

            <Stack direction={'row'}>
                <Button
                    leftIcon={<FaTwitter />}
                    colorScheme="gray"
                    variant="solid"
                    onClick={goToTwitterOAuth}
                >
                    Connect Twitter
                </Button>
                <Button onClick={()=>removeConnection('twitter')} colorScheme="red">Disconnect</Button>
            </Stack><br/>
            

            <Button onClick={navigateToPost}>Go Back to Post</Button>

            <div>
                <p>LinkedIn : {profileConnection.linkedin ? 'Connected' : 'Not Connected'} <b>{profileConnection.ldnName}</b></p>
                <p>Twitter : {profileConnection.twitter ? 'Connected' : 'Not Connected'} <b>@{profileConnection.xUsername}</b></p>
                <p>Instagram : {profileConnection.instagram ? 'Connected' : 'Not Connected'} <b>@{profileConnection.igUsername}</b></p>
                <p>Facebook : {profileConnection.facebook ? 'Connected' : 'Not Connected'} <b>{profileConnection.fbName}</b></p>
            </div>
        </div>
    );
}
