"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  useBreakpointValue,
  Container,
  Heading,
  Flex,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react"
import { FiSettings } from "react-icons/fi"
import NavSettings, { type SettingsTab } from "./components/NavSettings"
import GeneralSettings from "./components/General"
import Departaments from "./components/Departaments"
import SubGroup from "./components/SubGroup"
import Parish from "./components/Parish"
import ConceptsMoves from "./components/ConceptsMoves"

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  // Responsividad para el padding superior
  const paddingTop = useBreakpointValue({ base: "130px", md: "80px", xl: "80px" })

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
      case "concepts":
        return <ConceptsMoves />
      default:
        return <GeneralSettings />
    }
  }

  // Get tab info for display
  const getTabInfo = (tab: SettingsTab) => {
    const tabMap = {
      general: { label: "Configuración General", color: "blue" },
      departaments: { label: "Departamentos", color: "purple" },
      subgroups: { label: "Subgrupos", color: "green" },
      parroquias: { label: "Parroquias", color: "orange" },
      concepts: { label: "Conceptos de Movimiento", color: "red" },
    }
    return tabMap[tab]
  }

  const activeTabInfo = getTabInfo(activeTab)

  return (
    <Box minH="100vh" bg={bgColor} pt={paddingTop}>
      <Container maxW="7xl" py={6}>
        {/* Header Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardHeader>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={4}
            >
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <FiSettings size={24} color="#0059ae" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Configuración del Sistema
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Administra la configuración general y parámetros del sistema
                </Box>
              </Box>

              <Badge colorScheme={activeTabInfo.color} variant="subtle" px={3} py={1} borderRadius="full" fontSize="sm">
                {activeTabInfo.label}
              </Badge>
            </Flex>
          </CardHeader>
        </Card>

        {/* Navigation Section */}
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardBody p={4}>
            <NavSettings activeTab={activeTab} setActiveTab={setActiveTab} />
          </CardBody>
        </Card>

        {/* Content Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            {/* Content Header */}
            <Box mb={6}>
              <Heading size="md" color={textColor} mb={1}>
                {activeTabInfo.label}
              </Heading>
              <Box color="gray.600" fontSize="sm">
                Configura los parámetros de {activeTabInfo.label.toLowerCase()}
              </Box>
            </Box>

            {/* Active Component Content */}
            <Box>{renderActiveComponent()}</Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default Settings
