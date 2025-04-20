"use client"

import { useState } from "react"
import { Box, Card, CardBody } from "@chakra-ui/react"
import NavSettings, { type SettingsTab } from "./components/NavSettings"
import GeneralSettings from "./components/General"
import Departaments from "./components/Departaments"
import SubGroup from "./components/SubGroup"
import Parish from "./components/Parish"

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")

  // Función para renderizar el componente activo según la pestaña seleccionada
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />
      case "departaments":
        return <Departaments />
      case "subgroups":
        return <SubGroup />
      case "parroquias":
        return <Parish />
      default:
        return //<GeneralSettings />
    }
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card>
        <CardBody>
          {/* Barra de navegación horizontal */}
          <NavSettings activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Contenedor para el componente de configuración activo */}
          <Box mt={4}>{renderActiveComponent()}</Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Settings
