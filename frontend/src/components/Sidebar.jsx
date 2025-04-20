import { VStack, Text, Button, Spacer, HStack } from "@chakra-ui/react";
import { FaSignOutAlt, FaEdit, FaCalendarAlt, FaUserFriends, FaHistory, FaInfoCircle, FaQuestionCircle, FaAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeOption, handleSidebarClick }) {
  const navigate = useNavigate();

  const logout = () =>{
    localStorage.removeItem('token');
    navigate('/');
  }

  const navigateToHelp = () =>{
    navigate('/help');
  }

  const navigateToFAQs = () =>{
    navigate('/questions');
  }

  const navigateToAbout = () =>{
    navigate('/about-us');
  }

  return (
    <VStack w="250px" bg="#5EBD81" color="white" p={4} spacing={2} align="stretch">
      {/* Logo and Name Side by Side */}
      <HStack spacing={2} align="center">
        <svg width="30" height="30" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="4" fill="none" />
          <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="4" fill="none" />
        </svg>
        <Text fontSize="2xl" fontWeight="bold">AutoPost</Text>
      </HStack>
      
      <Button leftIcon={<FaEdit />} 
        variant="solid" justifyContent="flex-start"
        bg={activeOption === "Post" ? "white" : "transparent"} 
        color={activeOption === "Post" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => {handleSidebarClick("Post"); navigate('/dashboard')}}
      >Post</Button>

      <Button leftIcon={<FaUserFriends />} 
        variant="solid" justifyContent="flex-start" 
        bg={activeOption === "Connect" ? "white" : "transparent"} 
        color={activeOption === "Connect" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => {handleSidebarClick("Connect"); navigate('/connect-profiles')}}
      >Connect</Button>

      <Button leftIcon={<FaCalendarAlt />} 
        variant="solid" justifyContent="flex-start"
        bg={activeOption === "Schedule" ? "white" : "transparent"} 
        color={activeOption === "Schedule" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => {handleSidebarClick("Schedule"); navigate('/schedule-posts');}}
        disabled={true}
      >Schedule</Button>

      <Button leftIcon={<FaHistory />} 
        variant="solid" justifyContent="flex-start"
        bg={activeOption === "History" ? "white" : "transparent"} 
        color={activeOption === "History" ? "#5EBD81" : "white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={() => {handleSidebarClick("History"); navigate('/history');}}
      >History</Button>

      <Button leftIcon={<FaInfoCircle />} 
        variant="solid" justifyContent="flex-start"
        bg={"transparent"} 
        color={"white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={navigateToHelp}
      >Help & Support</Button>

      <Button leftIcon={<FaAddressCard />} 
        variant="solid" justifyContent="flex-start"
        bg={"transparent"} 
        color={"white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={navigateToAbout}
      >About Us</Button>

      <Button leftIcon={<FaQuestionCircle />} 
        variant="solid" justifyContent="flex-start"
        bg={"transparent"} 
        color={"white"}
        _hover={{ bg: "white", color: "#5EBD81" }}
        onClick={navigateToFAQs}
      >FAQs</Button>

      

      <Spacer />
      <Button onClick={logout} leftIcon={<FaSignOutAlt />} variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "white", color: "#5EBD81" }}>Log Out</Button>
    </VStack>
  );
}
