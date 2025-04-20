import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack, Text, Button } from "@chakra-ui/react";
import { getCurrentDate } from "../utils/helperFunctions";

export default function InfoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About AutoPost</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>Version 1.0.0</Text>
            <Text>Create posts for multiple social media platforms.</Text>
            <Text>&copy; {getCurrentDate(4)} AutoPost Inc.</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}