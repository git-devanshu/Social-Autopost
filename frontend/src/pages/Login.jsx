import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import { Box, Button, Center, Flex, Heading, Input, InputGroup, InputLeftElement, Link, Stack, Text } from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email : '',
        password : ''
    });

    const navigateToSignup = () =>{
        navigate('/signup');
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const loginUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        axios.post(getBaseURL() + '/auth/login', user)
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                localStorage.setItem('token', res.data.token);
                setTimeout(()=>{
                    navigate('/dashboard');
                }, 1500);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <Flex height="100vh">
      {/* Left Section */}
      <Box flex={1} bg="green.400" color="white" display="flex" alignItems="center" justifyContent="center" p={12}>
        <Text fontSize="5xl" fontWeight="bold">
          One Dashboard, Infinite Possibilities. Sign in to Take Control!
        </Text>
      </Box>
      
      {/* Right Section */}
      <Center flex={1} bg="white">
        <Box p={10} borderWidth={1} borderRadius="lg" borderColor="green.400" boxShadow="md" width="sm">
          <Heading size="lg" textAlign="center" color="green.400" mb={8}>Login</Heading>
          
          <Stack spacing={5}>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <EmailIcon color="gray.400" />
                </InputLeftElement>
                <Input 
                    type="text"
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
            
            <Link href="/forgot-password" color="gray.500" fontSize="md" textAlign="right">Forget Password ?</Link>
            
            <Button onClick={loginUser} colorScheme="orange" width="full" size="lg">Login</Button>
            
            <Text fontSize="md" color="gray.500" textAlign="center">
              New user ? <Link onClick={navigateToSignup} color="green.500">SignUp</Link>
            </Text>
          </Stack>
        </Box>
      </Center>
    </Flex>
    );
};

export default Login;