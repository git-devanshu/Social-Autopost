import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text
} from '@chakra-ui/react';
  
export default function PlatformApiTables() {
    return (
      <>
        {/* Facebook */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>Facebook</Text>
        <TableContainer mb={6}>
          <Table variant="simple" colorScheme="green" size="md">
            <Thead>
              <Tr>
                <Th>Endpoint</Th>
                <Th>API Rate Limit</Th>
                <Th>Max Media Upload Size</Th>
                <Th>Max Text/Caption Length</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>/feed (Text-only posts)</Td>
                <Td>Not documented</Td>
                <Td>Not applicable</Td>
                <Td>63,206 characters</Td>
              </Tr>
              <Tr>
                <Td>/photos (Image posts)</Td>
                <Td>Not documented</Td>
                <Td>10 MB</Td>
                <Td>2200 characters</Td>
              </Tr>
              <Tr>
                <Td>/videos (Video posts)</Td>
                <Td>Not documented</Td>
                <Td>200 MB (max 30 minutes)</Td>
                <Td>2200 characters</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
  
        {/* Instagram */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>Instagram</Text>
        <TableContainer mb={2}>
          <Table variant="simple" colorScheme="green" size="md">
            <Thead>
              <Tr>
                <Th>Endpoint</Th>
                <Th>API Rate Limit</Th>
                <Th>Max Media Upload Size</Th>
                <Th>Max Caption Length</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>/media (Image + text)</Td>
                <Td>200 calls per user per hour</Td>
                <Td>8 MB</Td>
                <Td>2,200 characters</Td>
              </Tr>
              <Tr>
                <Td>/media (Video + text)</Td>
                <Td>200 calls per user per hour</Td>
                <Td>50 MB (max 30 minutes)</Td>
                <Td>2,200 characters</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Text fontSize="sm" color="gray.600" mb={6}>
          Note: Videos posted on Instagram through AutoPost will appear on your Instagram business account in both reels and feed.
        </Text>
  
        {/* LinkedIn */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>LinkedIn</Text>
        <TableContainer mb={6}>
          <Table variant="simple" colorScheme="green" size="md">
            <Thead>
              <Tr>
                <Th>Endpoint</Th>
                <Th>API Rate Limit</Th>
                <Th>Max Media Upload Size</Th>
                <Th>Max Caption Length</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>/ugcPosts (Text)</Td>
                <Td>100 calls per user per day</Td>
                <Td>Not applicable</Td>
                <Td>1,300 characters</Td>
              </Tr>
              <Tr>
                <Td>/ugcPosts (Image posts)</Td>
                <Td>100 calls per user per day</Td>
                <Td>5 MB</Td>
                <Td>1,300 characters</Td>
              </Tr>
              <Tr>
                <Td>/ugcPosts (Video posts)</Td>
                <Td>100 calls per user per day</Td>
                <Td>200 MB (max 10 minutes)</Td>
                <Td>1,300 characters</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
  
        {/* X (Twitter) */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>X (Twitter)</Text>
        <TableContainer>
          <Table variant="simple" colorScheme="green" size="md">
            <Thead>
              <Tr>
                <Th>Endpoint</Th>
                <Th>API Rate Limit</Th>
                <Th>Max Media Upload Size</Th>
                <Th>Max Caption Length</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>v2.tweet() (Text)</Td>
                <Td>300 Tweets per 3 hours per user</Td>
                <Td>Not applicable</Td>
                <Td>280 characters</Td>
              </Tr>
              <Tr>
                <Td>v2.tweet() (Image)</Td>
                <Td>300 Tweets per 3 hours per user</Td>
                <Td>5 MB</Td>
                <Td>280 characters</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  }
  