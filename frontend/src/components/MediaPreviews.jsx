import { Box, SimpleGrid, IconButton, Image, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export default function MediaPreview({ mediaFiles, removeMedia }) {
  return (
    <Box 
      border="1px solid" 
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      mb={6}
    >
      <SimpleGrid 
        columns={[2, 3, 4]} 
        spacing={4}
        templateRows="minmax(150px, auto)"
      >
        {mediaFiles.map((media) => (
          <Box 
            key={media.id}
            position="relative"
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
            w="150px"
            h="150px"
          >
            <IconButton
              icon={<FaTimes />}
              aria-label="Remove media"
              position="absolute"
              top={2}
              right={2}
              size="sm"
              onClick={() => removeMedia(media.id)}
              zIndex={1}
              colorScheme="red"
            />
            {media.type === 'image' ? (
              <Image 
                src={media.url} 
                alt="Uploaded content"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            ) : (
              <>
                <video 
                  controls 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                >
                  <source src={media.url} />
                </video>
                <Box 
                  position="absolute"
                  bottom={2}
                  left={2}
                  bg="blackAlpha.700"
                  color="white"
                  px={2}
                  borderRadius="md"
                  fontSize="sm"
                >
                  Video
                </Box>
              </>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}