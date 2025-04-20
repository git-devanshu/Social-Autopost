import React from 'react';
import { Box, Button, Heading, Text, Center, VStack } from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const navigateToHome = () =>{
      navigate('/');
    }

    return (
        <Center h="100vh" bg="#5EBD81" p={4}>
            <VStack spacing={6} textAlign="center" align="center" mt="-400px">
                <Box>
                    <Heading as="h1" size="4xl" color="white">
                        404
                    </Heading>
                    <Text fontSize="xl" color="white" mt={2}>
                        Oops! The page you're looking for is missing.
                    </Text>
                </Box>

                <Button
                    to="/"
                    size="lg"
                    colorScheme="orange"
                    variant="solid"
                    mt={4}
                    onClick={navigateToHome}
                >
                    Go Back to Home
                </Button>
            </VStack>
        </Center>
    );
};

export default NotFound;
