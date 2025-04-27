import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import IncorporationsTable from "./Incorporations/IncorporationsTable";
import DisposalsTable from "./Disposals/DisposalsTable";

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState("incorporations");

  // Chakra UI color mode values
  const bg = useColorModeValue("white", "gray.800");
  const borderBottomColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const bgActive = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const tabs = [
    { id: "incorporations", label: "Incorporaciones" },
    { id: "disposals", label: "Desincorporaciones" },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mx="auto" py={10}>
      <Card>
        <CardHeader>
          <Heading size="lg" textAlign="center">
            Gestión de Activos
          </Heading>
        </CardHeader>
        <CardBody>
          {/* Custom Tab Navigation */}
          <Flex
            direction="row"
            w="100%"
            bg={bg}
            borderBottom="1px solid"
            borderColor={borderBottomColor}
            p={2}
            mb={4}
            borderRadius="md"
            overflowX="auto"
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                color={activeTab === tab.id ? borderColor : textColor}
                bg={activeTab === tab.id ? bgActive : "transparent"}
                borderBottom={activeTab === tab.id ? "2px solid" : "none"}
                borderColor={borderColor}
                borderRadius="md"
                mr={2}
                onClick={() => setActiveTab(tab.id)}
                _hover={{ bg: hoverBg }}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>

          {/* Tab Content */}
          {activeTab === "incorporations" && <IncorporationsTable />}
          {activeTab === "disposals" && <DisposalsTable />}
        </CardBody>
      </Card>
    </Box>
  );
}