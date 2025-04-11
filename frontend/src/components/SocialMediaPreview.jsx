import {Box, VStack, HStack, Text, IconButton, Textarea, Button} from "@chakra-ui/react";
import {FaPencilAlt, FaCheck, FaTwitter, FaInstagram, FaLinkedin, FaFacebook} from "react-icons/fa";
import {useState, useEffect} from "react";
import {toast} from 'react-hot-toast';
import axios from 'axios';
import {getBaseURL} from '../utils/helperFunctions';

export default function SocialMediaPreview({ caption, isVerified, mediaURL, mediaType }) {
    const [isDisabled, setIsDisabled] = useState(false); //to check if uploading is underway and disable other buttons
    
    const platforms = [
        { name: "Twitter", color: "blue.100", textColor: "blue.600", border: "2px solid #1AA2F8", maxChars: 280, icon: FaTwitter, colorScheme: "twitter", bgColor: "#1DA1F2" },
        { name: "Instagram", color: "red.100", textColor: "red.600", border: "2px solid #FF4D4C", maxChars: 2200, icon: FaInstagram, colorScheme: "pink", bgColor: "#E1306C" },
        { name: "LinkedIn", color: "blue.300", textColor: "blue.800", border: "2px solid #0B66C3", maxChars: 3000, icon: FaLinkedin, colorScheme: "linkedin", bgColor: "#0077B5" },
        { name: "Facebook", color: "gray.200", textColor: "gray.700", border: "2px solid gray", maxChars: 63206, icon: FaFacebook, colorScheme: "facebook", bgColor: "#1877F2" },
    ];

    const [editableTexts, setEditableTexts] = useState(
        platforms.reduce((acc, platform) => ({ ...acc, [platform.name]: "" }), {})
    );

    const [editing, setEditing] = useState(
        platforms.reduce((acc, platform) => ({ ...acc, [platform.name]: false }), {})
    );

    useEffect(() => {
        if(isVerified){
            setEditableTexts(platforms.reduce((acc, platform) => ({ ...acc, [platform.name]: caption }), {}));
        }
    }, [isVerified, caption]);

    const uploadPost = (platform, uploadText) =>{
        setIsDisabled(true);
        const token = localStorage.getItem('token');
        const toastId = toast.loading('Uploading may take some time, do not refresh the page.');
        axios.post(getBaseURL() + `/upload/${platform}`, {caption : uploadText, mediaURL, mediaType}, {headers : {
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
            if(err.response.status === 500 && platform === "Twitter" && mediaURL){
                toast.error("Maybe the image is unsupported, try uploading another");
            }
        });
    }

    const handleEditClick = (platformName) => {
        setEditing(prev => ({ ...prev, [platformName]: !prev[platformName] }));
    };

    const handleTextChange = (platformName, newText) => {
        setEditableTexts(prev => ({ ...prev, [platformName]: newText }));
    };

    return (
        <Box mt={6} maxH="450px" overflowY="auto" p={2} border="1px solid gray" borderRadius="md" css={{
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            }
        }}>
            <VStack spacing={4} align="stretch">
                {platforms.map((platform, index) => {
                    const isExceedingLimit = editableTexts[platform.name].length > platform.maxChars;
                    const Icon = platform.icon;
                    return (
                        <Box key={index} bg={platform.color} p={4} borderRadius="md" border={platform.border}>
                            <HStack justifyContent="space-between">
                                <HStack>
                                    <Icon color={platform.textColor} />
                                    <Text color={platform.textColor} fontWeight="bold">
                                        {platform.name}
                                    </Text>
                                </HStack>
                                <IconButton 
                                    icon={editing[platform.name] ? <FaCheck /> : <FaPencilAlt />} 
                                    size="sm" 
                                    variant="ghost" 
                                    aria-label={`Edit ${platform.name} post`} 
                                    onClick={() => handleEditClick(platform.name)}
                                />
                            </HStack>

                            {editing[platform.name] ? (
                                <Textarea
                                    value={editableTexts[platform.name]}
                                    onChange={(e) => handleTextChange(platform.name, e.target.value)}
                                    isInvalid={isExceedingLimit}
                                />
                            ) : (
                                <Text>{editableTexts[platform.name] || "No content yet. Click verify to preview!"}</Text>
                            )}

                            <Text fontSize="sm" color={isExceedingLimit ? "red.500" : "gray.500"}>
                                {editableTexts[platform.name].length}/{platform.maxChars} characters
                            </Text>

                            {isExceedingLimit && (
                                <Text fontSize="sm" color="red.500">Character limit exceeded for {platform.name}!</Text>
                            )}
                            {!isExceedingLimit && editableTexts[platform.name] && (
                                <Button 
                                    mt={2} 
                                    colorScheme={platform.colorScheme} 
                                    leftIcon={<Icon />} 
                                    bg={platform.bgColor} 
                                    color="white" 
                                    _hover={{ bg: platform.bgColor, opacity: 0.8 }}
                                    _active={{ bg: platform.bgColor, opacity: 0.6 }}
                                    disabled={isDisabled}
                                    onClick={()=> uploadPost(platform.name, editableTexts[platform.name])}
                                >
                                    Post to {platform.name}
                                </Button>
                            )}
                        </Box>
                    );
                })}
            </VStack>
        </Box>
    );
}