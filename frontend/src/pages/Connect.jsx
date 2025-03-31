import { Box, Button, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import Sidebar from "../components/sidebar";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "#E1306C" },
  { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { name: "Twitter", icon: FaTwitter, color: "#1DA1F2" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0A66C2" },
];

export default function Connect() {
  const [connections, setConnections] = useState({
    Instagram: null,
    Facebook: null,
    Twitter: null,
    LinkedIn: null,
  });

  const handleConnect = (platform) => {
    const username = prompt(`Enter your ${platform} username:`);
    if (username) {
      setConnections((prev) => ({ ...prev, [platform]: username }));
    }
  };

  const handleDisconnect = (platform) => {
    setConnections((prev) => ({ ...prev, [platform]: null }));
  };

  return (
    <HStack align="stretch" h="100vh" spacing={0}>
      <Sidebar activeOption="Connect" />
      <Box flex={1} p={6} overflowY="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Connect Your Accounts</Text>
        <VStack spacing={4} align="stretch">
          {platforms.map(({ name, icon, color }) => (
            <HStack
              key={name}
              justify="space-between"
              p={4}
              borderRadius="md"
              borderWidth={1}
              borderColor="gray.200"
              bg={connections[name] ? "green.50" : "gray.50"}
            >
              <HStack>
                <Icon as={icon} boxSize={6} color={color} />
                <Text fontSize="lg" fontWeight="medium">{name}</Text>
                {connections[name] && <Text fontSize="sm" color="gray.600">({connections[name]})</Text>}
              </HStack>
              {connections[name] ? (
                <Button colorScheme="red" onClick={() => handleDisconnect(name)}>
                  Disconnect
                </Button>
              ) : (
                <Button colorScheme="green" onClick={() => handleConnect(name)}>
                  Connect
                </Button>
              )}
            </HStack>
          ))}
        </VStack>
      </Box>
    </HStack>
  );
}