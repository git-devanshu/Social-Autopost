import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Header";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import InfoModal from "./InfoModal";
import SocialMediaPreview from "./SocialMediaPreview";
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import { FaSmile } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import {Box, Textarea, HStack, Text, Select, IconButton, Popover, PopoverTrigger, PopoverContent, Button, PopoverBody, useDisclosure, useColorMode} from "@chakra-ui/react";
import { decodeToken } from "../utils/helperFunctions";

export default function MainContent() {
    const {colorMode} = useColorMode();
    const textareaRef = useRef(null);
    const maxChars = 63206;

    const profileModal = useDisclosure();
    const settingsModal = useDisclosure();
    const infoModal = useDisclosure();

    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState(''); //original text typed in the text box
    const [mediaURL, setMediaURL] = useState(null); //final media url to be sent to backend
    const [mediaType, setMediaType] = useState('image'); //final media type to be sent to backend
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [verifiedText, setVerifiedText] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        setUsername(decodedToken.name);
    }, []);

    const handleEmojiClick = useCallback((emojiData) => {
        const textarea = document.getElementById('post-textarea');
        if (!textarea) return;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        setCaption(prev => {
            const newText = prev.substring(0, startPos) + emojiData.emoji + prev.substring(endPos);
            return newText.length <= maxChars ? newText : prev;
        });
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = startPos + emojiData.emoji.length;
            textarea.focus();
        }, 0);
    }, [maxChars]);

    const handleMediaChange = (e) =>{
        setMediaType(e.target.value);
    }

    const handleVerifyClick = () => {
        setVerifiedText(caption);
        setIsVerified(true);
    };

    return (
        <Box flex={1} p={6} overflowY="auto">
            <Header
                username={username}
                profileModal={profileModal}
                settingsModal={settingsModal}
                infoModal={infoModal}
            />
            <ProfileModal
                isOpen={profileModal.isOpen}
                onClose={profileModal.onClose}
                username={username}
                setUsername={setUsername}
            />
            <SettingsModal isOpen={settingsModal.isOpen} onClose={settingsModal.onClose} />
            <InfoModal isOpen={infoModal.isOpen} onClose={infoModal.onClose} />

            {/* Main part */}
            <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Write Something
                </Text>

                <Box position="relative">
                    <Textarea ref={textareaRef} id="post-textarea" placeholder="What you want to share..." value={caption} onChange={(e)=>setCaption(e.target.value)} isInvalid={caption.length > maxChars} mb={2} minH="150px" pr="40px" />
                    
                    {/* Character Count & Emoji Picker */}
                    <HStack justify="space-between" mt={1}>
                        <HStack>
                            <Popover 
                                isOpen={isEmojiPickerOpen}
                                onClose={() => setIsEmojiPickerOpen(false)}
                                closeOnBlur={false} 
                                placement="bottom-start"
                            >
                                <PopoverTrigger>
                                    <IconButton
                                        icon={<FaSmile />}
                                        aria-label="Add emoji"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                    />
                                </PopoverTrigger>
                                <PopoverContent width="auto" border="none">
                                    <PopoverBody p={0}> 
                                    <EmojiPicker 
                                        onEmojiClick={handleEmojiClick}  
                                        width={300}
                                        height={350}
                                        theme={colorMode === 'dark' ? 'dark' : 'light'}
                                    />
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </HStack>
                        <Text color={caption.length > maxChars ? "red.500" : "gray.500"} fontSize="sm">
                            {caption.length}/{maxChars}
                        </Text>
                    </HStack>
                    
                    <HStack mt={2}>
                        <Button colorScheme="yellow" onClick={handleVerifyClick}>Verify</Button>
                        <Select value={mediaType} onChange={handleMediaChange} width={'130px'}>
                            <option value="image">IMAGE</option>
                            <option value="video">VIDEO</option>
                        </Select>
                        {/* <Button colorScheme="red" onClick={()=>setMediaURL(null)}>{mediaType === "image" ? "Clear Image" : "Clear Video"}</Button> */}
                    </HStack>
                </Box>
            </Box>

            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={6}>
                {mediaType === 'image' ? 
                    <ImageUpload onUpload={(url)=>setMediaURL(url)} h={200} w={360}/> : 
                    <VideoUpload onUpload={(url)=>setMediaURL(url)} h={200} w={360}/>
                }
            </Box>

            <SocialMediaPreview caption={verifiedText} isVerified={isVerified} mediaURL={mediaURL} mediaType={mediaType}/>
        </Box>
    );
}
