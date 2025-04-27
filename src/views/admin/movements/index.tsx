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
  Stack,
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
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 8 }} w="100%">
      <Card>
        <CardBody>
          {/* Custom Tab Navigation */}
          <Flex
            direction="row"
            wrap="wrap" // Permite que los botones se ajusten en varias filas en pantallas pequeñas
            w="100%"
            bg={bg}
            borderBottom="1px solid"
            borderColor={borderBottomColor}
            p={2}
            mb={4}
            borderRadius="md"
            overflowX="auto" // Permite desplazamiento horizontal si hay demasiados botones
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
                mb={2} // Espaciado vertical para botones en filas adicionales
                onClick={() => setActiveTab(tab.id)}
                _hover={{ bg: hoverBg }}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>

          {/* Tab Content */}
          <Box mt={4} overflowX="auto">
            {activeTab === "incorporations" && <IncorporationsTable />}
            {activeTab === "disposals" && <DisposalsTable />}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}