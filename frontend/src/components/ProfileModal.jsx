import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack, Box, Button, Input, Avatar } from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  username, 
  setUsername, 
  profileImage, 
  handleProfileImageUpload,
  profileFileInputRef 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Box textAlign="center">
              <Avatar 
                name={username} 
                src={profileImage} 
                size="xl"
                mb={2}
              />
              <Button 
                leftIcon={<FaCamera />}
                onClick={() => profileFileInputRef.current.click()}
              >
                Change Photo
              </Button>
              <Input
                type="file"
                accept="image/*"
                ref={profileFileInputRef}
                onChange={handleProfileImageUpload}
                display="none"
              />
            </Box>
            <Box width="100%">
              <Text mb={2}>Username</Text>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}