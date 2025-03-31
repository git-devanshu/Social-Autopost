import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Avatar,
    Button,
    VStack,
    HStack,
    Select,
    useToast,
    Box,
    Text,
    Badge
  } from "@chakra-ui/react";
  import { useState, useRef, useEffect } from "react";
  import { FaCamera, FaSave, FaTimes, FaPlus } from "react-icons/fa";
  
  const EditUser = ({ 
    isOpen = false, 
    onClose = () => {},
    user = {
      name: '',
      email: '',
      avatar: '',
      platforms: []
    },
    platforms = [],
    onSave = () => {}
  }) => {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const firstFieldRef = useRef(null);
  
    // Initialize state with safe defaults
    const [editedUser, setEditedUser] = useState({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      platforms: user?.platforms || []
    });
  
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState("");
  
    // Reset form when user prop changes
    useEffect(() => {
      setEditedUser({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        platforms: user?.platforms || []
      });
    }, [user]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedUser(prev => ({ ...prev, [name]: value }));
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          status: "error",
          duration: 3000,
        });
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    };
  
    const handleAddPlatform = () => {
      if (!selectedPlatform) return;
      
      setEditedUser(prev => ({
        ...prev,
        platforms: prev.platforms.includes(selectedPlatform)
          ? prev.platforms
          : [...prev.platforms, selectedPlatform]
      }));
      setSelectedPlatform("");
    };
  
    const handleRemovePlatform = (platformToRemove) => {
      setEditedUser(prev => ({
        ...prev,
        platforms: prev.platforms.filter(platform => platform !== platformToRemove)
      }));
    };
  
    const handleSubmit = async () => {
      if (!editedUser.name.trim()) {
        toast({
          title: "Name is required",
          status: "warning",
          duration: 2000,
        });
        return;
      }
  
      setIsLoading(true);
      try {
        await onSave(editedUser);
        toast({
          title: "Profile updated",
          status: "success",
          duration: 2000,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="xl"
        initialFocusRef={firstFieldRef}
        closeOnOverlayClick={!isLoading}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Box textAlign="center">
                <Avatar
                  size="xl"
                  name={editedUser.name}
                  src={editedUser.avatar || undefined}
                  mb={3}
                  cursor="pointer"
                  onClick={() => fileInputRef.current?.click()}
                  _hover={{ opacity: 0.8 }}
                />
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  display="none"
                />
                <Button
                  leftIcon={<FaCamera />}
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
              </Box>
  
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  ref={firstFieldRef}
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormControl>
  
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </FormControl>
  
              {platforms.length > 0 && (
                <FormControl>
                  <FormLabel>Platform Access</FormLabel>
                  <HStack>
                    <Select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      placeholder="Select platform"
                    >
                      {platforms.map(platform => (
                        <option 
                          key={platform.id} 
                          value={platform.id}
                          disabled={editedUser.platforms.includes(platform.id)}
                        >
                          {platform.name}
                        </option>
                      ))}
                    </Select>
                    <Button
                      leftIcon={<FaPlus />}
                      onClick={handleAddPlatform}
                      isDisabled={!selectedPlatform}
                    >
                      Add
                    </Button>
                  </HStack>
                  
                  {editedUser.platforms.length > 0 ? (
                    <Box mt={2}>
                      <Text fontSize="sm" mb={1}>Selected Platforms:</Text>
                      <HStack spacing={2} wrap="wrap">
                        {editedUser.platforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId);
                          return (
                            <Badge 
                              key={platformId}
                              colorScheme="blue"
                              px={3}
                              py={1}
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                            >
                              {platform?.name || platformId}
                              <Button
                                size="xs"
                                ml={2}
                                variant="ghost"
                                color="white"
                                onClick={() => handleRemovePlatform(platformId)}
                                _hover={{ bg: 'blue.600' }}
                              >
                                <FaTimes />
                              </Button>
                            </Badge>
                          );
                        })}
                      </HStack>
                    </Box>
                  ) : (
                    <Text color="gray.500" fontSize="sm" mt={2}>
                      No platforms selected
                    </Text>
                  )}
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FaSave />}
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default EditUser;