import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    HStack
} from '@chakra-ui/react';
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaXTwitter
} from 'react-icons/fa6';
  
const PlatformSupportTable = () => {
    return (
      <TableContainer>
        <Table variant="simple" colorScheme="green" size="md">
          <Thead>
            <Tr>
              <Th>Platform</Th>
              <Th>Post Type</Th>
              <Th>Media Support</Th>
              <Th>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <HStack spacing={2}>
                  <FaFacebook color="#1877F2" />
                  <Text>Facebook</Text>
                </HStack>
              </Td>
              <Td>To Page</Td>
              <Td>Text/Image/Video</Td>
              <Td>Captions supported</Td>
            </Tr>
            <Tr>
              <Td>
                <HStack spacing={2}>
                  <FaInstagram color="#E1306C" />
                  <Text>Instagram</Text>
                </HStack>
              </Td>
              <Td>To Business Account</Td>
              <Td>Text + Image/Video</Td>
              <Td>No carousel, captions supported</Td>
            </Tr>
            <Tr>
              <Td>
                <HStack spacing={2}>
                  <FaLinkedin color="#0077B5" />
                  <Text>LinkedIn</Text>
                </HStack>
              </Td>
              <Td>To User Account</Td>
              <Td>Text/Image/Video</Td>
              <Td>Captions supported</Td>
            </Tr>
            <Tr>
              <Td>
                <HStack spacing={2}>
                  <FaXTwitter color="#000000" />
                  <Text>Twitter</Text>
                </HStack>
              </Td>
              <Td>To User Account</Td>
              <Td>Text/Image</Td>
              <Td>Video not supported</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
};
  
export default PlatformSupportTable;
  