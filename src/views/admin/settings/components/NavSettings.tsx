
import type React from "react";
import { Flex, Button, useColorModeValue } from "@chakra-ui/react";

export type SettingsTab = "general" | "departaments" | "subgroups" | "parroquias" | "concepts";

interface NavSettingsProps {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

const NavSettings: React.FC<NavSettingsProps> = ({ activeTab, setActiveTab }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgActive = useColorModeValue("blue.50", "blue.800");
  const borderColor = useColorModeValue("blue.500", "blue.400");
  const bg = useColorModeValue("white", "gray.800");
  const borderBottomColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "departaments", label: "Departamentos" },
    { id: "subgroups", label: "Subgrupos" },
    { id: "parroquias", label: "Parroquias" },
    { id: "concepts", label: "Conceptos de Movimiento" },
  ];

  return (
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
          color={activeTab === tab.id ? "type.primary" : textColor}
          bg={activeTab === tab.id ? bgActive : "transparent"}
          borderBottom={activeTab === tab.id ? "2px solid" : "none"}
          borderColor={"type.primary"}
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
  );
};

export default NavSettings;