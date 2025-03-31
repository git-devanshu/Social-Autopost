import { VStack, Text, Button, Menu, MenuButton, MenuList, MenuItem, Spacer } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaSignOutAlt, FaEdit, FaCalendarAlt, FaShareAlt, FaUserFriends, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar({ activeOption, handleSidebarClick }) {
  return (
    <VStack w="250px" bg="#5EBD81" color="white" p={4} spacing={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">AutoPost</Text>
      <Link to="/connect">
        <Button leftIcon={<FaUserFriends />} 
          variant="ghost" justifyContent="flex-start" 
          bg={activeOption === "Connect" ? "white" : "transparent"} 
          color={activeOption === "Connect" ? "#5EBD81" : "white"}
          onClick={() => handleSidebarClick("Connect")}
        >Connect</Button>
      </Link>
      <Button leftIcon={<FaCalendarAlt />} 
        variant="ghost" justifyContent="flex-start"
        bg={activeOption === "Schedule" ? "white" : "transparent"} 
        color={activeOption === "Schedule" ? "#5EBD81" : "white"}
        onClick={() => handleSidebarClick("Schedule")}
      >Schedule</Button>
      <Link to="/dashboard">
        <Button leftIcon={<FaEdit />} 
          variant="ghost" justifyContent="flex-start"
          bg={activeOption === "Post" ? "white" : "transparent"} 
          color={activeOption === "Post" ? "#5EBD81" : "white"}
          onClick={() => handleSidebarClick("Post")}
        >Post</Button>
      </Link>

      {/* Accounts Dropdown Styled Like Other Options */}
      <Menu>
        <MenuButton as={Button} leftIcon={<FaShareAlt />} variant="ghost" justifyContent="flex-start" 
          bg={activeOption === "Accounts" ? "white" : "transparent"} 
          color={activeOption === "Accounts" ? "#5EBD81" : "white"}
          onClick={() => handleSidebarClick("Accounts")}>Accounts
        </MenuButton>
        <MenuList bg="white" color="black">
          <MenuItem icon={<FaInstagram />}>Instagram</MenuItem>
          <MenuItem icon={<FaFacebook />}>Facebook</MenuItem>
          <MenuItem icon={<FaTwitter />}>Twitter</MenuItem>
          <MenuItem icon={<FaLinkedin />}>LinkedIn</MenuItem>
        </MenuList>
      </Menu>

      <Button leftIcon={<FaHistory />} 
        variant="ghost" justifyContent="flex-start"
        bg={activeOption === "History" ? "white" : "transparent"} 
        color={activeOption === "History" ? "#5EBD81" : "white"}
        onClick={() => handleSidebarClick("History")}
      >History</Button>

      <Spacer />
      <Button leftIcon={<FaSignOutAlt />} variant="ghost" justifyContent="flex-start" alignSelf="flex-start" color="white">Log Out</Button>
    </VStack>
  );
}
