import { Box, VStack, HStack, Text, Icon, Select, Input, Button, Image } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Sidebar from "../components/sidebar";
import { useNavigate } from 'react-router-dom';
import {getBaseURL, formatDate} from '../utils/helperFunctions';
import {toast} from 'react-hot-toast';
import axios from 'axios';

export default function History() {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [activeOption, setActiveOption] = useState("History");
    const [platformFilter, setPlatformFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [refresh, setRefresh] = useState(false);

    const platformIcons = {
        instagram: { icon: FaInstagram, color: "#E1306C" },
        facebook: { icon: FaFacebook, color: "#1877F2" },
        twitter: { icon: FaTwitter, color: "#1DA1F2" },
        linkedin: { icon: FaLinkedin, color: "#0A66C2" }
    };

    useEffect(()=>{
        const toastId = toast.loading('Loading user post history');
        const token = localStorage.getItem('token');
        axios.get(getBaseURL() + '/history/get', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                setHistory(res.data);
                console.log(res.data);
                toast.success('User history loaded', {id : toastId});
            }
        })
        .catch(err =>{
            console.error(err);
            toast.error(err.response.data.message || 'Failed to load user history', {id : toastId});
        });
    }, [refresh]);

    const handleDelete = (recordId) => {
        const toastId = toast.loading('Removing record from history');
        const token = localStorage.getItem('token');
        axios.delete(getBaseURL() + `/history/remove/${recordId}`, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                setRefresh(!refresh);
                toast.success(res.data.message, {id : toastId});
            }
        })
        .catch(err =>{
            console.error(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    };

    const handleSidebarClick = (option) => {
        setActiveOption(option);
    };

    const filteredHistory = history.filter(item => 
        (platformFilter === "all" || item.platform === platformFilter) &&
        (!dateFilter || item.uploadDate === dateFilter)
    );

    return (
        <HStack align="stretch" h="100vh" spacing={0}>
            <Sidebar activeOption={activeOption} handleSidebarClick={handleSidebarClick} />

            <Box flex={1} p={6} overflowY="auto">
                <HStack justifyContent="space-between" mb={4}>
                    <Text fontSize="2xl" fontWeight="bold">Post History</Text>
                    <HStack>
                        <Text fontSize="lg" fontWeight="semibold">Filter:</Text>
                        <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                            <option value="all">All Platforms</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                        </Select>
                        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                    </HStack>
                </HStack>

                <VStack spacing={4} align="stretch">
                    {filteredHistory?.length > 0 ? filteredHistory.reverse().map((item, index) => (
                        <VStack key={index} p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" bg="gray.50" position="relative" >
                            <HStack justifyContent="space-between" w="100%">
                                <HStack>
                                    <Icon as={platformIcons[item.platform].icon} boxSize={6} color={platformIcons[item.platform].color} />
                                    <Text fontSize="lg" fontWeight="medium">{item.platform.toUpperCase()}</Text>
                                </HStack>
                                <Button size="sm" colorScheme="red" onClick={() => handleDelete(item._id)}>
                                    <Icon as={FaTrash} />
                                </Button>
                            </HStack>
                            <VStack align="start" spacing={1} flex={1} w="100%">
                                <Text fontSize="lg" fontWeight="bold">{item.accountName}</Text>
                                <Text fontSize="md" color="gray.600">{item.caption}</Text>
                                <Text fontSize="sm" color="gray.500">
                                    {formatDate(item.uploadDate)} {item.uploadTime}
                                </Text>

                                {/* Media Preview (if mediaURL exists) */}
                                {item.mediaURL !== 'none' && (
                                    <Box mt={2} w="100%" maxW="400px" borderRadius="md" overflow="hidden">
                                        {item.mediaType.toUpperCase() === "IMAGE" ? (
                                            <Image src={item.mediaURL} alt="Media preview" borderRadius="md" />
                                        ) : item.mediaType.toUpperCase() === "VIDEO" ? (
                                            <video controls width="100%">
                                                <source src={item.mediaURL} type="video/mp4" />
                                            </video>
                                        ) : null}
                                    </Box>
                                )}
                            </VStack>       
                        </VStack>
                    )) : (
                        <Text>No history available</Text>
                    )}
                </VStack>
            </Box>
        </HStack>
    );
}
