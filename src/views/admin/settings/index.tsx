
import { useState } from "react";
import { Box, Card, CardBody, useBreakpointValue } from "@chakra-ui/react";
import NavSettings, { type SettingsTab } from "./components/NavSettings";
import GeneralSettings from "./components/General";
import Departaments from "./components/Departaments";
import SubGroup from "./components/SubGroup";
import Parish from "./components/Parish";
import ConceptsMoves from "./components/ConceptsMoves";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Función para renderizar el componente activo según la pestaña seleccionada
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "departaments":
        return <Departaments />;
      case "subgroups":
        return <SubGroup />;
      case "parroquias":
        return <Parish />;
      case "concepts":
        return <ConceptsMoves />;
      default:
        return <GeneralSettings />;
    }
  };

  // Responsividad para el padding superior
  const paddingTop = useBreakpointValue({ base: "100px", md: "80px", xl: "80px" });

  return (
    <Box pt={paddingTop} px={{ base: 4, md: 8 }} w="100%">
      <Card>
        <CardBody>
          {/* Barra de navegación horizontal */}
          <NavSettings activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Contenedor para el componente de configuración activo */}
          <Box mt={4} overflowX="auto">
            {renderActiveComponent()}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Settings;