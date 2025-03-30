import React, { useState, useEffect } from 'react'
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import {Stack, Button} from '@chakra-ui/react';
import {toast} from 'react-hot-toast';
import {FaInstagram, FaFacebook, FaLinkedin, FaTwitter} from "react-icons/fa";
import {getBaseURL} from '../utils/helperFunctions';
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const [caption, setCaption] = useState('');
    const [mediaURL, setMediaURL] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [mediaType, setMediaType] = useState('image');

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
            navigate('/dashboard');
        } 
        else if(queryParams.error === 'oauth_failed'){
            toast.error('Profile Authentication Failed')
            navigate('/dashboard');
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
                navigate("/dashboard");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, { id: toastId });
                navigate("/dashboard");
            });
        }
    }, [location, navigate]);
    

    const uploadPost = (platform) =>{
        setIsDisabled(true);
        const token = localStorage.getItem('token');
        const toastId = toast.loading('Uploading, Please wait...');
        axios.post(getBaseURL() + `/upload/${platform}`, {caption, mediaURL, mediaType}, {headers : {
            authorization : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id: toastId});
                console.log(res.data.response);
            }
            setIsDisabled(false);
        })
        .catch(err => {
            console.log(err);
            setIsDisabled(false);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    const navigateToLinkProfiles = () =>{
        navigate('/connect-profiles');
    }

    const handleMediaChange = (e) =>{
        setMediaType(e.target.value);
    }

    return (
        <div>
            {mediaType === 'image' ? 
                <ImageUpload onUpload={(url)=>setMediaURL(url)} h={200} w={360}/> : 
                <VideoUpload onUpload={(url)=>setMediaURL(url)} h={200} w={360}/>
            }
            
            <textarea name='caption' value={caption} onChange={(e)=>setCaption(e.target.value)} />
            <select value={mediaType} onChange={handleMediaChange}>
                <option value="image">IMAGE</option>
                <option value="video">VIDEO</option>
            </select>

            <Button onClick={navigateToLinkProfiles}>Link Profiles</Button>
            
            <Stack direction={'row'}>
                <Button
                    leftIcon={<FaInstagram />}
                    colorScheme="pink"
                    variant="solid"
                    onClick={() => uploadPost('instagram')}
                    disabled = {isDisabled}
                >Instagram</Button>

                <Button
                    leftIcon={<FaFacebook />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => uploadPost('facebook')}
                    disabled = {isDisabled}
                >Facebook</Button>

                <Button
                    leftIcon={<FaLinkedin />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => uploadPost('linkedin')}
                    disabled = {isDisabled}
                >LinkedIn</Button>

                <Button
                    leftIcon={<FaTwitter />}
                    colorScheme="gray"
                    variant="solid"
                    onClick={() => uploadPost('twitter')}
                    disabled = {isDisabled}
                >Twitter</Button>
            </Stack>
        </div>
    )
}
