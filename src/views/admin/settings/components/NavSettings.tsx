"use client"

import type React from "react"
import { Stack, Button, useColorModeValue, Icon, Box, Text, useBreakpointValue, Flex, Divider } from "@chakra-ui/react"
import { FiSettings, FiUsers, FiGrid, FiMapPin, FiMove, FiFilter } from "react-icons/fi"

export type SettingsTab = "general" | "departaments" | "subgroups" | "parroquias" | "concepts"

interface NavSettingsProps {
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
}

const NavSettings: React.FC<NavSettingsProps> = ({ activeTab, setActiveTab }) => {
  const textColor = useColorModeValue("gray.700", "white")
  const hoverBg = useColorModeValue("gray.100", "gray.700")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })

  const tabs: {
    id: SettingsTab
    label: string
    description: string
    icon: any
    color: string
  }[] = [
    {
      id: "general",
      label: "General",
      description: "Configuración básica",
      icon: FiSettings,
      color: "blue",
    },
    {
      id: "departaments",
      label: "Departamentos",
      description: "Gestión de departamentos",
      icon: FiUsers,
      color: "purple",
    },
    {
      id: "subgroups",
      label: "Subgrupos",
      description: "Categorías de bienes",
      icon: FiGrid,
      color: "green",
    },
    {
      id: "parroquias",
      label: "Parroquias",
      description: "Ubicaciones geográficas",
      icon: FiMapPin,
      color: "orange",
    },
    {
      id: "concepts",
      label: "Conceptos",
      description: "Tipos de movimientos",
      icon: FiMove,
      color: "red",
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <Flex align="center" gap={2}>
          <Icon as={FiFilter} color="blue.500" />
          <Text fontWeight="medium">Secciones de Configuración</Text>
        </Flex>
      </Flex>

      <Divider mb={4} />

      {/* Navigation Buttons */}
      <Stack direction={{ base: "column", md: "row" }} spacing={2} wrap="wrap">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "solid" : "ghost"}
            colorScheme={activeTab === tab.id ? tab.color : "gray"}
            bg={activeTab === tab.id ? `${tab.color}.500` : "transparent"}
            color={activeTab === tab.id ? "white" : textColor}
            borderRadius="lg"
            onClick={() => setActiveTab(tab.id)}
            _hover={{
              bg: activeTab === tab.id ? `${tab.color}.600` : hoverBg,
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={tab.icon} />}
            size={buttonSize}
            fontWeight="medium"
            flex={{ base: "1", md: "auto" }}
            minW={{ base: "full", md: "180px" }}
            boxShadow={activeTab === tab.id ? "md" : "none"}
            justifyContent="flex-start"
          >
            <Box textAlign="left">
              <Box>{tab.label}</Box>
              {!isMobile && (
                <Box fontSize="xs" opacity={0.8} fontWeight="normal">
                  {tab.description}
                </Box>
              )}
            </Box>
          </Button>
        ))}
      </Stack>
    </Box>
  )
}

export default NavSettings
