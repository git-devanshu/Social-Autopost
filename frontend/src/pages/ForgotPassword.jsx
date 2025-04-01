import React, { useState } from "react";
import axios from 'axios';
import { Box, Button, Flex, Heading, Input, Link, Stack, Text, Image, HStack, PinInput, PinInputField, Fade } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [vfcode, setVfcode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [showResetFields, setShowResetFields] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');   
    const [password, setPassword] = useState('');

    const verifyUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Verifying email...');
        axios.post(getBaseURL() + '/auth/forgot-password', {email})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setShowVerification(true);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const confirmVerificationCode = () => {
        setShowResetFields(true);
    }

    const resetPassword = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Setting new password...');
        axios.post(getBaseURL()+'/auth/reset-password', {vfcode, password, email})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 1500);
            }
            else{
                toast.error(res.data.message, {id :toastId});
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }


    return (
        <Flex height="100vh" alignItems="center" justifyContent="center" bg="#5EBD81" px={6}>
            <Box display="flex" flexDirection={{ base: "column", md: "row" }} alignItems="center" justifyContent="center" width="full" maxW="900px" bg="white" borderRadius="lg" boxShadow="lg" p={8}>
                {/* Left Section with Image */}
                <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={6}>
                    <Image src="/assets/forgot-password.svg" alt="Forgot Password" boxSize={{ base: "150px", md: "300px" }} />
                </Box>
                
                {/* Right Section with Form */}
                <Box flex={1} p={6}>
                    <Stack spacing={6} textAlign="left">
                        <Heading size="3xl" color="green.400">Forgot Password?</Heading>
                        
                        {!showVerification ? (
                            <>
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
                            <Fade in={showVerification}>
                                <Stack spacing={4}>
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
                                        onClick={confirmVerificationCode}
                                    >
                                        Confirm
                                    </Button>
                                </Stack>
                            </Fade>
                        ) : (
                            <Fade in={showResetFields}>
                                <Stack spacing={4}>
                                    <Text color="gray.600">Set New Password !</Text>
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
                            </Fade>
                        )}
                        <Link href="/" color="#5EBD81" fontSize="sm" cursor="pointer">Try LogIn</Link>
                    </Stack>
                </Box>
            </Box>
        </Flex>
    );
};

export default ForgotPassword;