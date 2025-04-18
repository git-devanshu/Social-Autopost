import React from "react";
import {Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading, Container, Divider, Grid, Text, Button} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const FAQPage = () => {
    const navigate = useNavigate();

    const navigateToHome = () =>{
        navigate('/');
    }

    const navigateToHelp = () =>{
        navigate('/help');
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "2fr 7fr" }} minH="100vh">
            <Box bg="green.400" color="white" p={6}>
                <Heading fontSize='70px' textAlign="left">
                    FAQs
                </Heading>
                <Text fontSize='18px'>Got questions in mind? <br/> Read the most frequently asked questions with their answers</Text><br/>
                <Button onClick={navigateToHome} colorScheme="gray" width='100px' size="md">Home</Button>
            </Box>

            <Container maxW="3xl" py={10}>
                <Heading size='lg' mb={5}>Profile and Connections</Heading>
                <Accordion allowToggle>
                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I connect my social media profiles?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Go to the connect tab on your sidebar and you will see the status of your profile connections. You can click the connect button to connect to your social media accounts through OAuth. Check out the detailed profile connection process in help.<br/>
                        <Button colorScheme="gray" size='md' mt={5} width='100px' onClick={navigateToHelp}>Help</Button>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            What are various requirements for connecting my social media profiles?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        For connecting your social media accounts, you can connect any of your LinkedIn and X(Twitter) accounts directly through OAuth by clicking the connect button. For Facebook and Instagram, you can only connect your account having a Facebook page and Instagram Business account which must be linked with the Facebook Page. Check out the detailed profile connection process in help.<br/>
                        <Button colorScheme="gray" size='md' mt={5} width='100px' onClick={navigateToHelp}>Help</Button>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How long my profiles stay connected to AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Your social media profiles stay connected with AutoPost for <span style={{fontWeight: 600}}>60 days (2 months)</span> but you can disconnect them anytime you want from the connect tab in the sidebar.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Is it safe to connect my profiles directly to AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Yes, it is safe to connect your social media profiles to AutoPost because you are not directly connecting your profile to AutoPost, you are logging in to your respective accounts on the actual social media platforms through their OAuth and on successful login, AutoPost will have a limited access (with posting and read permissions) for a limited period of time. Your social media passwords are not exposed to AutoPost.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Can I disconnect my connected profiles?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Yes, you can disconnect your connected profiles anytime from the Connect tab on the sidebar.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            What happens when I disconnect my profile and reconnect them?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        When you disconnect any of your connected profiles and reconnect them through OAuth, you will get a renewed access for another 60 days.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I connect my another account of same social media to AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        When you connect any of your social media accounts to AutoPost through OAuth, you are also logged in to that account on your browser. After disconnecting your profile from AutoPost if you are trying to connect a new one, you should <span style={{fontWeight: 600}}>log out of your social media account from that browser</span> before clicking the connect button, otherwise it may connect the previous account automatically.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I know which of my accounts of specific platform are connected to AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        On the Connect tab on the sidebar, you can see the status of your profile connections. If your profiles are connected, it shows you the profile details for your social media accounts. If your accounts are connected, you will see your Instagram Business account <span style={{fontWeight: 600}}>username</span>, Facebook <span style={{fontWeight: 600}}>Page name</span>, X(Twitter) account <span style={{fontWeight: 600}}>username</span> and LinkedIn account <span style={{fontWeight: 600}}>name</span>.
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <Heading size='lg' mb={5}>Posting</Heading>
                <Accordion allowToggle>
                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I make posts to my social media handles?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Go to the Post tab on the sidebar and you can see a menu to draft your post. Select the media type if you want to upload media, select media and put your caption or text, click verify to check the character limit and if the text length is valid, you will see the button to post to the respective social media.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Can I make any post to any platform?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Yes, you can make post to any of your connected accounts whose character limit is valid for your uploaded text.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            What type of media can I upload on my social media handles using AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        You can upload jpg and png format images and mp4 and mkv format videos.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Where is my media stored after uploading?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Once you upload your media from the device, it is securely stored on a cloud.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Can I make simultaneous posting to all the connected platforms?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        You can make one by one posting to all your connected platforms for whom the text length is valid. Your post is not uploaded to all the platforms unless you click the post button for that respective platform.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I schedule posts?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        As of now, AutoPost doesn't provide any scheduling option, you can only get immediate posting feature.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            What if I encountered an error while posting?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        You should try the following troubleshooting techniques to fix any of the errors while posting:<br/>
                        <ol style={{marginLeft: '25px'}}>
                            <li>Ensure an uninterrupted internet connection while uploading media from device as well as at the time of posting.</li>
                            <li>Keep your text/caption length within the limits.</li>
                            <li>Ensure the supported media formats, try jpg, png for images and mp4 for videos.</li>
                            <li>If an error occurs while making a video post, the video encoding may be unsupported even if the video is of mp4 format, so try changing the video.</li>
                        </ol>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            What are various limits while making posts on various platforms?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        {/* Add content here if needed */}
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How do I know if my post was successfully uploaded or not?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        A record is added in the History section on the sidebar for successful post uploads. Also you will get alert feedback while uploading the posts and you can visit your social media profile to verify if the post was uploaded.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            How can I mention other users while posting through AutoPost?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        For X(Twitter) and Instagram, you can directly put the valid usernames of the users you want to mention in the text itself and it will automatically be added as mentions. For LinkedIn which has live time mentioning, you should edit the post from your LinkedIn handle as live time tagging is not supported from AutoPost.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="lg" mb={4} bg="white">
                        <h2>
                        <AccordionButton px={6} py={4}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                            Are hashtags supported while posting?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel px={6} pt={0} pb={4}>
                        <Divider mb={4} />
                        Yes, if you know the correct tags, you can directly put them into the text while drafting your post on AutoPost.
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

            </Container>
        </Grid>
    );
};

export default FAQPage;
