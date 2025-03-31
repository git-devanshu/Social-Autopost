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

export default function MainContent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState("");
  const [verifiedText, setVerifiedText] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const maxChars = 63206;
  const { colorMode } = useColorMode();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [username, setUsername] = useState("User Profile");
  const [notificationsCount, setNotificationsCount] = useState(3);
  
  const profileModal = useDisclosure();
  const settingsModal = useDisclosure();
  const infoModal = useDisclosure();
  const profileFileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [mediaFiles]);

  const handleTextChange = (e) => {
    if (e.target.value.length <= maxChars) setText(e.target.value);
  };

  const handleEmojiClick = useCallback((emojiData) => {
    const textarea = document.getElementById('post-textarea');
    if (!textarea) return;
    
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    setText(prev => {
      const newText = prev.substring(0, startPos) + 
                    emojiData.emoji + 
                    prev.substring(endPos);
      return newText.length <= maxChars ? newText : prev;
    });
  
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + emojiData.emoji.length;
      textarea.focus();
    }, 0);
  }, [maxChars]);

  const handleVerifyClick = () => {
    setVerifiedText(text);
    setIsVerified(true);
  };

  return (
    <Box flex={1} p={6} overflowY="auto">
      <Header
        username={username}
        profileImage={profileImage}
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
        profileImage={profileImage}
        profileFileInputRef={profileFileInputRef}
      />
      <SettingsModal isOpen={settingsModal.isOpen} onClose={settingsModal.onClose} />
      <InfoModal isOpen={infoModal.isOpen} onClose={infoModal.onClose} />
      <Box mb={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Write Something
        </Text>
        
        <TextEditor
          text={text}
          maxChars={maxChars}
          handleTextChange={handleTextChange}
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
