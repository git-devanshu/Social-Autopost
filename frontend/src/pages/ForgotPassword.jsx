import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Button, Flex, Heading, Input, Link, Stack, Text, Image, HStack, PinInput, PinInputField, ScaleFade, Fade } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import emailImage from '../assets/Forgot.png'
import verifyImage from '../assets/OTP.png'
import resetImage from '../assets/Reset.png'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [vfcode, setVfcode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');   

    const [showVerification, setShowVerification] = useState(false); //to show pin input
    const [showResetFields, setShowResetFields] = useState(false); //to show new password field

    const getQueryParams = (query) =>{
        return query.substring(1).split('&')
            .reduce((params, param) =>{
                const [key, value] = param.split('=');
                params[key] = value;
                return params;
            }, {});
    };

    // for managing the reset password flow using url parameters
    useEffect(()=>{
        const queryParams = getQueryParams(location.search);
        if(queryParams.code === "true"){
            setShowVerification(true);
            setEmail(queryParams.email);
        }
        else if(queryParams.new_password === "true"){
            setShowVerification(true);
            setShowResetFields(true);
            setEmail(queryParams.email);
            setVfcode(queryParams.vfcode);
        }
    }, [navigate, location]);

    const verifyUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Verifying email...');
        axios.post(getBaseURL() + '/auth/get-vfcode', {email})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate(`/forgot-password?code=true&email=${email}`);
                }, 300);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const verifyCode = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Checking Verification Code...');
        axios.post(getBaseURL() + '/auth/verify-vfcode', {vfcode, email})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate(`/forgot-password?new_password=true&email=${email}&vfcode=${vfcode}`);
                }, 300);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const resetPassword = (e) =>{
        e.preventDefault();
        if(newPassword !== confirmPassword){
            toast.error('Enter the same password');
            return;
        }
        const toastId = toast.loading('Setting new password...');
        axios.post(getBaseURL() + '/auth/reset-password', {newPassword, email, vfcode})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 1000);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const getCurrentImage = () => {
        if (showResetFields) return resetImage;
        if (showVerification) return verifyImage;
        return emailImage;
    };

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center" bg="#5EBD81" px={6}>
            <ScaleFade in={true} initialScale={0.9}>
                <Box display="flex" flexDirection={{ base: "column", md: "row" }} alignItems="center" justifyContent="center" width="full" maxW="900px" bg="white" borderRadius="lg" boxShadow="lg" p={8} transition="all 0.3s ease-in-out">
                    {/* Left Section with Image */}
                    <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={6} transition="all 0.3s ease-in-out">
                        <Image src={getCurrentImage()} alt="Forgot Password Step" boxSize={{ base: "150px", md: "350px" }} transition="opacity 0.5s ease-in-out" />
                    </Box>
                    
                    {/* Right Section with Form */}
                    <Box flex={1} p={6}>
                        <Stack spacing={6} textAlign="left">
                            
                            
                            {!showVerification ? (
                                <>
                                    <Heading size="3xl" color="green.400">Forgot Password?</Heading>
                                    <Text color="gray.600">Enter the email address associated with your account.</Text>
                                    <Input 
                                        type="text"
                                        name="email"
                                        placeholder="Enter Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        focusBorderColor="green.400"
                                    />
                                    <Button 
                                        onClick={verifyUser}
                                        colorScheme="orange" 
                                        width="full"
                                    >
                                        Send Verification Code
                                    </Button>
                                </>
                            ) : !showResetFields ? (
                                <Stack spacing={4}>
                                    <Heading size="3xl" color="green.400">Verify using Code</Heading>
                                    <Text color="gray.600">Enter Verification Code.</Text>
                                    <HStack justifyContent="center">
                                        <PinInput type="number" value={vfcode} onChange={(value) => setVfcode(value)}>
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                        </PinInput>
                                    </HStack>
                                    <Button 
                                        colorScheme="orange" 
                                        width="full"
                                        onClick={verifyCode}
                                    >
                                        Confirm
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={4}>
                                    <Heading size="3xl" color="green.400">Don't Forget This One 😊</Heading>
                                    <Text color="gray.600">Set New Password!</Text>
                                    <Input 
                                        type="password"
                                        name="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        focusBorderColor="green.400"
                                    />
                                    <Input 
                                        type="password"
                                        name="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        focusBorderColor="green.400"
                                    />
                                    <Button 
                                        onClick={resetPassword}
                                        colorScheme="orange" 
                                        width="full"
                                    >
                                        Reset Password
                                    </Button>
                                </Stack>
                            )}
                            <Link href="/" color="#5EBD81" fontSize="sm" cursor="pointer">Try LogIn</Link>
                        </Stack>
                    </Box>
                </Box>
            </ScaleFade>
        </Flex>



    );
};

export default ForgotPassword;