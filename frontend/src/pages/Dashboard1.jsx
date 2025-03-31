import { 
    Box, Button, Input, Textarea, VStack, HStack, Text, IconButton, Menu, 
    MenuButton, MenuList, MenuItem, Avatar, Spacer, Modal, 
    ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter 
} from "@chakra-ui/react";
import { 
    FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaSignOutAlt, FaEdit, 
    FaCalendarAlt, FaShareAlt, FaUserFriends, FaUpload, FaPencilAlt, 
    FaHistory, FaImage, FaVideo 
} from "react-icons/fa";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import SocialMediaPreview from "../components/SocialMediaPreview";
import MainContent from "../components/MainContent";

export default function AutoPost() {
    const [activeOption, setActiveOption] = useState("Post");
  
    const handleSidebarClick = (option) => {
      setActiveOption(option);
    };
  
    return (
        <HStack align="stretch" h="100vh" spacing={0}>
            {/* Sidebar */}
            <Sidebar activeOption={activeOption} handleSidebarClick={handleSidebarClick} />
            <MainContent />
        </HStack>
    );
}
  