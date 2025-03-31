import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack, Button, Input } from "@chakra-ui/react";
import { FaImage, FaVideo } from "react-icons/fa";

export default function MediaUploadModal({ 
  isOpen, 
  onClose, 
  handleMediaUpload,
  mediaFiles,
  setUploadError,
  // uploadError
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        setUploadError(null);
        onClose();
      }}
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Media</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMediaUpload(e.target.files, 'image')}
              display="none"
              id="image-upload"
            />
            <Button 
              as="label" 
              htmlFor="image-upload" 
              leftIcon={<FaImage />} 
              w="full"
              colorScheme="blue"
            >
              Upload Images
            </Button>

            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleMediaUpload(e.target.files, 'video')}
              display="none"
              id="video-upload"
            />
            <Button 
              as="label" 
              htmlFor="video-upload" 
              leftIcon={<FaVideo />} 
              w="full"
              colorScheme="blue"
            >
              Upload Videos
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button 
            onClick={() => {
              setUploadError(null);
              onClose();
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            ml={3}
            onClick={() => {
              if (mediaFiles.length === 0) {
                setUploadError('Please upload at least one file');
              } else {
                onClose();
              }
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}