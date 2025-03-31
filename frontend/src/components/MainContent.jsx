import { Box, Text, useDisclosure, useToast, useColorMode } from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Header";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import InfoModal from "./InfoModal";
import TextEditor from "./TextEditor";
import MediaPreview from "./MediaPreviews";
import MediaUploadModal from "./MediaUploadModal";
import SocialMediaPreview from "./SocialMediaPreview";
import { useNavigate, useLocation } from "react-router-dom";
import {toast} from 'react-hot-toast';

export default function MainContent() {
    // non functional states
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const profileFileInputRef = useRef(null);

    const [verifiedText, setVerifiedText] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);

// --------------------------------------------------

    const navigate = useNavigate();
    const location = useLocation();
    const {colorMode} = useColorMode();
    const maxChars = 63206;

    const profileModal = useDisclosure();
    const settingsModal = useDisclosure();
    const infoModal = useDisclosure();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const [caption, setCaption] = useState(''); //original text typed in the text box
    const [mediaURL, setMediaURL] = useState(null); //final media url to be sent to backend
    const [mediaType, setMediaType] = useState('image'); //final media type to be sent to backend
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const [username, setUsername] = useState("User Profile");
    const [notificationsCount, setNotificationsCount] = useState(3);

    // get the query params
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

    useEffect(() => {
        return () => {
            mediaFiles.forEach(file => {
              if (file.url) URL.revokeObjectURL(file.url);
            });
        };
    }, [mediaFiles]);

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

    const handleVerifyClick = () => {
        setVerifiedText(caption);
        setIsVerified(true);
    };




















    return (
        <Box flex={1} p={6} overflowY="auto">
            <Header
                username={username}
                notificationsCount={notificationsCount}
                clearNotifications={() => setNotificationsCount(0)}
                profileModal={profileModal}
                settingsModal={settingsModal}
                infoModal={infoModal}
            />
            <ProfileModal
                isOpen={profileModal.isOpen}
                onClose={profileModal.onClose}
                username={username}
                setUsername={setUsername}
                profileFileInputRef={profileFileInputRef}
            />
            <SettingsModal isOpen={settingsModal.isOpen} onClose={settingsModal.onClose} />
            <InfoModal isOpen={infoModal.isOpen} onClose={infoModal.onClose} />

            {/* Main part */}
            <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Write Something
                </Text>
                
                <TextEditor
                    text={caption}
                    maxChars={maxChars}
                    handleTextChange={(e)=>setCaption(e.target.value)}
                    isEmojiPickerOpen={isEmojiPickerOpen}
                    setIsEmojiPickerOpen={setIsEmojiPickerOpen}
                    handleEmojiClick={handleEmojiClick}
                    colorMode={colorMode}
                    onOpen={onOpen}
                    isUploading={isUploading}
                    uploadError={uploadError}
                    handleVerifyClick={handleVerifyClick}
                />
            </Box>

            {mediaFiles.length > 0 && (
                <MediaPreview mediaFiles={mediaFiles} removeMedia={(id) => setMediaFiles(mediaFiles.filter(file => file.id !== id))} />
            )}
            

            <MediaUploadModal
                isOpen={isOpen}
                onClose={onClose}
                handleMediaUpload={(files) => {
                    const file = files[0]; // Only take the first file
                    if (!file) return;

                    const newMedia = {
                        url: URL.createObjectURL(file),
                        type: file.type.startsWith("image") ? "image" : "video",
                        id: Math.random().toString(36).substring(2, 9),
                        file
                    };

                    setMediaFiles([newMedia]); // Always replace existing media
                }}
                mediaFiles={mediaFiles}
                setUploadError={setUploadError}
                uploadError={uploadError}
            />

            <SocialMediaPreview text={verifiedText} isVerified={isVerified} maxChars={maxChars} mediaFiles={mediaFiles} />
        </Box>
    );
}
