import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { getBaseURL } from '../utils/helperFunctions';
import { Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement, Link, Stack, Text } from "@chakra-ui/react";
import { EmailIcon, LockIcon, InfoIcon } from "@chakra-ui/icons";

const Signup = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const registerUser = (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        const toastId = toast.loading('Registering...');
        axios.post(getBaseURL() + '/auth/signup', {
            email: user.email,
            name: user.name,
            password: user.password
        })
        .then(res => {
            if (res.status === 201) {
                toast.success(res.data.message, { id: toastId });
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
        });
    };

    return (
        <Flex height="100vh">
            {/* Left Section */}
            <Box flex={1} bg="white" display="flex" alignItems="center" justifyContent="center" p={12}>
                <Box p={10} borderWidth={1} borderRadius="lg" borderColor="green.400" boxShadow="md" width="sm">
                    <Heading size="lg" textAlign="center" color="green.600" mb={8}>SignUp</Heading>
                    
                    <Stack spacing={5}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <EmailIcon color="gray.400" />
                            </InputLeftElement>
                            <Input 
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                                placeholder="Email" 
                                focusBorderColor="green.400" 
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <InfoIcon color="gray.400" />
                            </InputLeftElement>
                            <Input 
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                                placeholder="Name" 
                                focusBorderColor="green.400" 
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <LockIcon color="gray.400" />
                            </InputLeftElement>
                            <Input 
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                maxLength={30}
                                placeholder="Password" 
                                focusBorderColor="green.400" 
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <LockIcon color="gray.400" />
                            </InputLeftElement>
                            <Input 
                                type="password" 
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm Password" 
                                focusBorderColor="green.400" 
                            />
                        </InputGroup>

                        <Button onClick={registerUser} colorScheme="orange" width="full" size="lg">SignUp</Button>

                        <Text fontSize="md" color="gray.500" textAlign="center">
                            Already a User? <Link onClick={() => navigate('/')} color="green.500">Login</Link>
                        </Text>
                    </Stack>
                </Box>
            </Box>

            {/* Right Section */}
            <Box flex={1} bg="green.400" display="flex" alignItems="center" justifyContent="center" p={12}>
                <Text fontSize="5xl" fontWeight="bold" color="white" textAlign="center">
                    All Your Socials, One Dashboard. Join Now!
                </Text>
            </Box>
        </Flex>
    );
};

export default Signup;
