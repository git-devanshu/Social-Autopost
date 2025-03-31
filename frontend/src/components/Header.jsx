import { Flex, Box, HStack, Text, IconButton, Badge, Tooltip, Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaInfoCircle, FaCog, FaBell, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header({ 
  username, 
  profileImage, 
  notificationsCount, 
  clearNotifications, 
  profileModal, 
  settingsModal, 
  infoModal 
}) {
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
        
        <Tooltip label="Notifications" hasArrow>
          <Box position="relative">
            <IconButton
              icon={<FaBell />}
              aria-label="Notifications"
              variant="ghost"
              onClick={clearNotifications}
            />
            {notificationsCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-2px"
                right="-2px"
                fontSize="0.6em"
              >
                {notificationsCount}
              </Badge>
            )}
          </Box>
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
            <MenuItem icon={<FaSignOutAlt />} color="red.500">
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}