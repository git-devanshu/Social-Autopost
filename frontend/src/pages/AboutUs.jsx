import {
  Box,
  Heading,
  Text,
  VStack,
  Avatar,
  HStack,
  useColorModeValue,
  Flex,
  IconButton,
  Grid,
  Button,
  Link,
  Divider
} from "@chakra-ui/react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function AboutUs() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = "#5EBD81";
  const textColor = useColorModeValue("gray.700", "gray.200");

  const navigate = useNavigate();

  const navigateToHome = () =>{
    navigate('/');
}

  return (
    <Grid templateColumns={{ base: "1fr", md: "2fr 7fr" }} minH="100vh">
      <Box bg="green.400" color="white" p={6}>
          <Heading fontSize='70px' textAlign="left">
              ABOUT
          </Heading>
          <Heading size='2xl' mb={5}>US</Heading>
          <Text fontSize='18px'>Discover how AutoPost streamlines your social media workflow, the technology behind it, and meet the developers who built this platform for creators like you.</Text><br/>
          <Button onClick={navigateToHome} colorScheme="gray" width='100px' size="md">Home</Button>
      </Box>

      <Flex
        flex="1"
        bg={bgColor}
        p={10}
        justify="center"
        align="center"
        overflowY="auto"
      >
        <MotionBox
          bg={cardBg}
          borderRadius="2xl"
          p={10}
          maxW="4xl"
          w="100%"
          boxShadow="lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <MotionVStack spacing={10} textAlign="center">
            <Heading size="2xl" color={headingColor}>
              About AutoPost
            </Heading>

            <VStack spacing={4}>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                <b>AutoPost</b> is your all-in-one social media management platform. It helps users create, schedule,
                and manage posts seamlessly across Instagram, Twitter, LinkedIn, and Facebook.
              </Text>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                Whether you're a business, influencer, or marketing manager — we simplify your content planning,
                boost productivity, and streamline <b>Multi-Platform Sharing</b>.
              </Text>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                Built using the <b>MERN stack</b> with Chakra UI and modern backend integrations, AutoPost offers a smooth,
                responsive experience tailored for modern digital creators.
              </Text>
            </VStack>

            {/* Developer Info */}
            <Box pt={2} w="100%">
              <HStack w="100%" align="center" mb={4}>
              <Divider />
              <Text fontWeight="semibold" color="gray.500" px={4}>
                Meet the Makers
              </Text>
              <Divider />
            </HStack>

              <HStack spacing={12} justify="center" flexWrap="wrap">
                {/* Developer 1 */}
                <VStack spacing={3}>
                  <Avatar size="xl" name="Devanshu Lanjudkar" src="/varad.jpg" />
                  <Text fontWeight="bold" color={textColor}>Devanshu Lanjudkar</Text>
                  <Text fontSize="sm" color="gray.500">Backend Developer</Text>
                  <HStack spacing={4}>
                    <Link href="https://github.com/git-devanshu" isExternal>
                      <IconButton icon={<FaGithub size="24px" color="#000"/>} variant="ghost" color={headingColor} aria-label="GitHub" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/devanshu-lanjudkar-b3220a289/" isExternal>
                      <IconButton icon={<FaLinkedin size="24px" color="#0A66C2"/>} variant="ghost" color={headingColor} aria-label="LinkedIn" />
                    </Link>
                  </HStack>
                </VStack>

                {/* Developer 2 */}
                <VStack spacing={3}>
                  <Avatar size="xl" name="Chetan Mahajan" src="/dhananjay.jpg" />
                  <Text fontWeight="bold" color={textColor}>Chetan Mahajan</Text>
                  <Text fontSize="sm" color="gray.500">Frontend Developer</Text>
                  <HStack spacing={4}>
                    <Link href="https://github.com/CSM3108" isExternal>
                      <IconButton icon={<FaGithub size="24px" color="#000"/>} variant="ghost" color={headingColor} aria-label="GitHub" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/csmahajan31/" isExternal>
                      <IconButton icon={<FaLinkedin size="24px" color="#0A66C2"/>}  variant="ghost" color={headingColor} aria-label="LinkedIn" />
                    </Link>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          </MotionVStack>
        </MotionBox>
      </Flex>
    </Grid>
  );
}
