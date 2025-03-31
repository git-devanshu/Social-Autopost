import { VStack, Text, Button, Spacer, HStack } from "@chakra-ui/react";
import { FaSignOutAlt, FaEdit, FaCalendarAlt, FaUserFriends, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar({ activeOption, handleSidebarClick }) {
  return (
    <VStack w="250px" bg="#5EBD81" color="white" p={4} spacing={4} align="stretch">
      {/* Logo and Name Side by Side */}
      <HStack spacing={2} align="center">
        <svg width="30" height="30" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="4" fill="none" />
          <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="4" fill="none" />
        </svg>
        <Text fontSize="2xl" fontWeight="bold">AutoPost</Text>
      </HStack>
      
      <Link to="/dashboard">
        <Button leftIcon={<FaEdit />} 
          variant="solid" justifyContent="flex-start"
          bg={activeOption === "Post" ? "white" : "transparent"} 
          color={activeOption === "Post" ? "#5EBD81" : "white"}
          _hover={{ bg: "white", color: "#5EBD81" }}
          onClick={() => handleSidebarClick("Post")}
        >Post</Button>
      </Link>
      <Link to="/connect">
        <Button leftIcon={<FaUserFriends />} 
          variant="solid" justifyContent="flex-start" 
          bg={activeOption === "Connect" ? "white" : "transparent"} 
          color={activeOption === "Connect" ? "#5EBD81" : "white"}
          _hover={{ bg: "white", color: "#5EBD81" }}
          onClick={() => handleSidebarClick("Connect")}
        >Connect</Button>
      </Link>
      <Button leftIcon={<FaCalendarAlt />} 
        variant="solid" justifyContent="flex-start"
        bg={activeOption === "Schedule" ? "white" : "transparent"} 
        color={activeOption === "Schedule" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => handleSidebarClick("Schedule")}
      >Schedule</Button>
      <Button leftIcon={<FaHistory />} 
        variant="solid" justifyContent="flex-start"
        bg={activeOption === "History" ? "white" : "transparent"} 
        color={activeOption === "History" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => handleSidebarClick("History")}
      >History</Button>

      <Spacer />
      <Button leftIcon={<FaSignOutAlt />} variant="ghost" justifyContent="flex-start" alignSelf="flex-start" color="white">Log Out</Button>
    </VStack>
  );
}
