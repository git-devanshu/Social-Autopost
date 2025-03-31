import { Box, Button, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { getBaseURL, decodeToken } from "../utils/helperFunctions";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "#E1306C", platformKey: "instagram" },
  { name: "Facebook", icon: FaFacebook, color: "#1877F2", platformKey: "facebook" },
  { name: "Twitter", icon: FaTwitter, color: "#1DA1F2", platformKey: "twitter" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0A66C2", platformKey: "linkedin" },
];

export default function Connect() {
  const [connections, setConnections] = useState({});
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Checking Profile Connections...");
    axios
      .get(getBaseURL() + "/oauth/profile-connection", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setConnections(res.data.profileConnection);
          toast.success(res.data.message, { id: toastId });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Error fetching connections", { id: toastId });
      });
  }, []);

  const handleConnect = (platformKey) => {
    toast(`Redirecting to ${platformKey} Authentication`);
    const token = localStorage.getItem("token");
    const tokenData = decodeToken(token);
    let oauthUrl = "";
    
    switch (platformKey) {
      case "linkedin":
        const REDIRECT_URI = getBaseURL() + "/oauth/linkedin/callback";
        oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=w_member_social%20openid%20profile%20email&state=${tokenData.id}`;
        break;
      case "twitter":
        axios.post(getBaseURL() + "/oauth/twitter/request-token", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.oauth_token) {
              window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.data.oauth_token}`;
            } else {
              toast.error("Failed to get Twitter request token");
            }
          })
          .catch((error) => {
            console.error("Error during Twitter OAuth:", error);
            toast.error("Error during Twitter OAuth");
          });
        return;
      case "instagram":
      case "facebook":
        toast.error("OAuth not configured for this platform yet");
        return;
      default:
        return;
    }
    
    window.location.href = oauthUrl;
  };

  const handleDisconnect = (platformKey) => {
    const toastId = toast.loading(`Removing ${platformKey} connection...`);
    const token = localStorage.getItem("token");
    axios.delete(getBaseURL() + `/oauth/logout/${platformKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message, { id: toastId });
        setConnections((prev) => ({ ...prev, [platformKey]: null }));
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response?.data?.message || "Error disconnecting", { id: toastId });
    });
  };

  return (
    <HStack align="stretch" h="100vh" spacing={0}>
      <Sidebar activeOption="Connect" />
      <Box flex={1} p={6} overflowY="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Connect Your Accounts</Text>
        <VStack spacing={4} align="stretch">
          {platforms.map(({ name, icon, color, platformKey }) => (
            <HStack
              key={platformKey}
              justify="space-between"
              p={4}
              borderRadius="md"
              borderWidth={1}
              borderColor="gray.200"
              bg={connections[platformKey] ? "green.50" : "gray.50"}
            >
              <HStack>
                <Icon as={icon} boxSize={6} color={color} />
                <Text fontSize="lg" fontWeight="medium">{name}</Text>
                {connections[platformKey] && <Text fontSize="sm" color="gray.600">({connections[platformKey]})</Text>}
              </HStack>
              {connections[platformKey] ? (
                <Button colorScheme="red" onClick={() => handleDisconnect(platformKey)}>
                  Disconnect
                </Button>
              ) : (
                <Button colorScheme="green" onClick={() => handleConnect(platformKey)}>
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
