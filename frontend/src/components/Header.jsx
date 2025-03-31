import { Flex, Box, HStack, Text, IconButton, Badge, Tooltip, Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaInfoCircle, FaCog, FaBell, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header({username, profileImage, profileModal, settingsModal, infoModal }){
  const navigate = useNavigate();

  const logout = () =>{
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <Flex justifyContent="space-between" alignItems="center" mb={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Create and Share Your Thoughts
      </Text>
      
      <HStack spacing={4}>
        <Tooltip label="App Information" hasArrow>
          <IconButton
            icon={<FaInfoCircle />}
            aria-label="App Information"
            variant="ghost"
            onClick={infoModal.onOpen}
          />
        </Tooltip>
        
        <Tooltip label="Settings" hasArrow>
          <IconButton
            icon={<FaCog />}
            aria-label="Settings"
            variant="ghost"
            onClick={settingsModal.onOpen}
          />
        </Tooltip>
        
        <Menu>
          <MenuButton>
            <Avatar 
              name={username} 
              src={profileImage} 
              size="md"
              cursor="pointer"
              border="2px solid"
              borderColor="blue.500"
            />
          </MenuButton>
          <MenuList>
            <Link to="/profile">
            <MenuItem icon={<FaUserEdit />} onClick={profileModal.onOpen}>
              Edit Profile
            </MenuItem>
            </Link>
            <MenuItem icon={<FaSignOutAlt />} color="red.500" onClick={logout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}