import React from 'react'
import {Box, Heading, Container, Divider, Grid, Text, Button, HStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {Step, StepDescription, StepIcon, StepIndicator, StepSeparator, StepStatus, StepTitle, Stepper} from '@chakra-ui/react';
import PlatformApiTables from '../components/PlatformAPITables';
import PlatformSupportTable from '../components/PlatformSupportTable';
import ReportIssueForm from '../components/ReportIssueForm';

export default function HelpPage() {
    const navigate = useNavigate();

    const navigateToHome = () =>{
        navigate('/');
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "2fr 7fr" }} minH="100vh">
            <Box bg="green.400" color="white" p={6}>
                <Heading fontSize='70px' textAlign="left">
                    HELP
                </Heading>
                <Heading size='lg' mb={5}>& Support</Heading>
                <Text fontSize='18px'>This guide will help you to connect your social media handles to AutoPost with other necessary details.</Text><br/>
                <Button onClick={navigateToHome} colorScheme="gray" width='100px' size="md">Home</Button>
            </Box>

            <Container maxW="4xl" py={10}>
                {/* Connecting LinkedIn */}
                <Heading size='md' mb={2}>Connecting your LinkedIn account to AutoPost</Heading>
                <Text>Here's a step by step guide for connecting your LinkedIn account to AutoPost. This is an essential step for making posts to your LinkedIn account through AutoPost. Be clear with the fact that AutoPost allows you to make posts to your LinkedIn account and not the LinkedIn Page.</Text>
                <Box mx="auto" p={4}>
                    <Stepper index={5} orientation="vertical" size="lg" colorScheme="green">
                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 1</StepTitle>
                                <StepDescription>Go to the Connect tab on the sidebar of AutoPost.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 2</StepTitle>
                                <StepDescription>Click on the LinkedIn connect button.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 3</StepTitle>
                                <StepDescription>Complete the LinkedIn OAuth by entering your account credentials.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 4</StepTitle>
                                <StepDescription>Grant access to AutoPost and return to connection status page.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 5</StepTitle>
                                <StepDescription>You can now post from the Post tab to your LinkedIn account.</StepDescription>
                            </Box>
                        </Step>
                    </Stepper>
                </Box>

                {/* Connecting Twitter */}
                <Heading size='md' mt={10} mb={2}>Connecting your X(Twitter) account to AutoPost</Heading>
                <Text>Here's a step by step guide for connecting your X(Twitter) account to AutoPost. This is an essential step for making posts to your X(Twitter) account through AutoPost. You can make only text and/or image tweets using AutoPost, videos are not supported as of now.</Text>
                <Box mx="auto" p={4}>
                    <Stepper index={5} orientation="vertical" size="lg" colorScheme="green">
                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 1</StepTitle>
                                <StepDescription>Go to the Connect tab on the sidebar of AutoPost.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 2</StepTitle>
                                <StepDescription>Click on the Twitter connect button.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 3</StepTitle>
                                <StepDescription>Complete the X(Twitter) OAuth by entering your account credentials.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 4</StepTitle>
                                <StepDescription>Grant access/authorize to AutoPost and return to connection status page.</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>

                        <Step>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>Step 5</StepTitle>
                                <StepDescription>You can now post from the Post tab to your X(Twitter) account.</StepDescription>
                            </Box>
                        </Step>
                    </Stepper>
                </Box>

                {/* Connecting Facebook */}
                <Heading size='md' mt={10} mb={2}>Connecting your Facebook Page to AutoPost</Heading>
                <Text>Here's a step by step guide for connecting your Facebook Page to AutoPost. This is an essential step for making posts to your Facebook Page through AutoPost. Using AutoPost, you can make posts to your Facebook Page and not the Facebook account.</Text>

                {/* Connecting Instagram */}
                <Heading size='md' mt={10} mb={2}>Connecting your Instagram account to AutoPost</Heading>
                <Text>Here's a step by step guide for connecting your Instagram account to AutoPost. This is an essential step for making posts to your Instagram account through AutoPost. For making posts to your Instagram account using AutoPost, you need to convert your account to business account first.</Text>

                {/* Allowed uploads */}
                <Heading size='md' mt={10} mb={2}>Allowed uploads using AutoPost</Heading>
                <PlatformSupportTable />

                {/* Upload limits */}
                <Heading size='md' mt={10} mb={2}>Upload limits for posting</Heading>
                <PlatformApiTables />

                <Divider/>

                {/* Report Issue */}
                <ReportIssueForm/>
            </Container>
        </Grid>
    )
}
