import {HStack} from "@chakra-ui/react";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import MainContent from "../components/MainContent";

export default function AutoPost() {
    const [activeOption, setActiveOption] = useState("Post");
    
    const handleSidebarClick = (option) => {
      setActiveOption(option);
    };
    
    return (
        <HStack align="stretch" h="100vh" spacing={0}>
            {/* Sidebar */}
            <Sidebar activeOption={activeOption} handleSidebarClick={handleSidebarClick} />
            <MainContent />
        </HStack>
    );
}
  