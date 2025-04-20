import {Box, Input, Textarea, Button, Heading, FormControl, FormLabel, VStack, Text} from '@chakra-ui/react';
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import { getBaseURL } from '../utils/helperFunctions';
  
const ReportIssueForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSubmit = (e) => {
        if (!title || !description){
            e.target.form.reportValidity();
            return;
        }
        const token = localStorage.getItem('token');
        const toastId = toast.loading("Reporting Issue");
        axios.post(getBaseURL() + '/report-issue', {title, description}, {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setTitle('');
                setDescription('');
            }
        })
        .catch(err =>{
            toast.error(err.response.data.message, {id : toastId});
            console.log(err);
        });
    };
  
    return (
        <Box
            p={6}
            borderRadius="lg"
            maxW="2xl"
            mx="auto"
            mt={8}
        >
            <Heading as="h3" size="md" mb={4} textAlign="center">
                Report an Issue
            </Heading>
            <form>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Issue Title</FormLabel>
                        <Input
                            placeholder="Enter a short title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Describe the issue in detail"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                        />
                    </FormControl>
                    <Button colorScheme="green" width="full" onClick={handleSubmit}>
                        Send Report
                    </Button>
                </VStack>
            </form>
            <Text mt={5}>You will receive the response for this issue on your registered email id within 5 working days.</Text>
        </Box>
    );
};

export default ReportIssueForm;
  