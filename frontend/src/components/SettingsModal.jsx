import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack, Text, Button } from "@chakra-ui/react";

export default function SettingsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold">Appearance</Text>
            <Button variant="outline">Dark Mode</Button>
            <Text fontWeight="bold">Notifications</Text>
            <Button variant="outline">Notification Preferences</Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}