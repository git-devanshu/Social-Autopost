import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack, Text, Button } from "@chakra-ui/react";

export default function InfoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About AutoPost</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>Version 1.0.0</Text>
            <Text>Create and schedule posts for multiple social media platforms.</Text>
            <Text>© 2023 AutoPost Inc. All rights reserved.</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}