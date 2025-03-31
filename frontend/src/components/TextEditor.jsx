import { 
    Box, 
    Textarea, 
    HStack, 
    Text, 
    IconButton, 
    Popover, 
    PopoverTrigger, 
    PopoverContent, 
    Button, 
    PopoverBody
  } from "@chakra-ui/react";
  import { FaSmile, FaUpload } from "react-icons/fa";
  import { useRef } from "react";
  import EmojiPicker from 'emoji-picker-react';
  
  export default function TextEditor({ 
    text, 
    maxChars, 
    handleTextChange, 
    isEmojiPickerOpen, 
    setIsEmojiPickerOpen, 
    handleEmojiClick,  
    colorMode, 
    onOpen,
    isUploading,
    uploadError,
    handleVerifyClick
  }) {
    const textareaRef = useRef(null);
  
    return (
      <Box position="relative">
        <Textarea 
          ref={textareaRef}
          id="post-textarea"
          placeholder="What you want to share..." 
          value={text}
          onChange={handleTextChange}
          isInvalid={text.length > maxChars}
          mb={2}
          minH="150px"
          pr="40px"
        />
        
        {/* Character Count & Emoji Picker */}
        <HStack justify="space-between" mt={1}>
          <HStack>
            <Popover 
              isOpen={isEmojiPickerOpen}
              onClose={() => setIsEmojiPickerOpen(false)}
              closeOnBlur={false} 
              placement="top-start"
            >
              <PopoverTrigger>
                <IconButton
                  icon={<FaSmile />}
                  aria-label="Add emoji"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                />
              </PopoverTrigger>
              <PopoverContent width="auto" border="none">
                <PopoverBody p={0}> 
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}  
                    width={300}
                    height={350}
                    theme={colorMode === 'dark' ? 'dark' : 'light'}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
          <Text color={text.length > maxChars ? "red.500" : "gray.500"} fontSize="sm">
            {text.length}/{maxChars}
          </Text>
        </HStack>
        
        <HStack mt={2}>
          <Button colorScheme="yellow" onClick={handleVerifyClick}>Verify</Button>
          <Button 
            leftIcon={<FaUpload />} 
            onClick={onOpen}
            isLoading={isUploading}
            loadingText="Uploading..."
          >
            Upload Media
          </Button>
        </HStack>
  
        {uploadError && (
          <Text color="red.500" mt={2}>
            {uploadError}
          </Text>
        )}
      </Box>
    );
  }
  