"use client"

import { useState } from "react"
import { useThemeColors } from "../../../theme/useThemeColors"
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
  Container,
  Badge,
  Icon,
} from "@chakra-ui/react"
import { FiPackage, FiArchive } from "react-icons/fi"
import IncorporationsTable from "./Incorporations/IncorporationsTable"
import DisposalsTable from "./Disposals/DisposalsTable"

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState("incorporations")
  const { cardBg, headerBg, textColor } = useThemeColors()

  const bg = useColorModeValue("gray.50", "gray.900")
  const borderBottomColor = useColorModeValue("gray.200", "gray.600")
  const bgActive = useColorModeValue("blue.50", "blue.900")
  const borderColor = useColorModeValue("blue.500", "blue.300")
  const hoverBg = useColorModeValue("gray.100", "gray.700")
  const tabBorderColor = useColorModeValue("gray.200", "gray.700")

  const tabs = [
    {
      id: "incorporations",
      label: "Incorporaciones",
      icon: FiPackage,
      color: "purple",
      description: "Gestión de incorporaciones de bienes",
    },
    {
      id: "disposals",
      label: "Desincorporaciones",
      icon: FiArchive,
      color: "red",
      description: "Gestión de desincorporaciones de bienes",
    },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container   maxW="100vw"
  px={{ base: 2, md: 4 }}
  py={{ base: 2, md: 4 }}
  w="full">
        {/* Main Header */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={tabBorderColor} mb={6}>
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
                    <FiPackage size={24} color="#0059ae" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Gestión de Activos
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Sistema integral para la administración de bienes muebles
                </Box>
              </Box>

              {activeTabData && (
                <Badge
                  colorScheme={activeTabData.color}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {activeTabData.label}
                </Badge>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={tabBorderColor} mb={6}>
          <CardBody p={4}>
            <Stack direction={{ base: "column", md: "row" }} spacing={2}>
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
                  size="lg"
                  fontWeight="medium"
                  flex={{ base: "1", md: "auto" }}
                  minW="200px"
                  boxShadow={activeTab === tab.id ? "md" : "none"}
                >
                  <Box textAlign="left">
                    <Box>{tab.label}</Box>
                    <Box fontSize="xs" opacity={0.8} fontWeight="normal">
                      {tab.description}
                    </Box>
                  </Box>
                </Button>
              ))}
            </Stack>
          </CardBody>
        </Card>

        {/* Tab Content */}
        <Box>
          {activeTab === "incorporations" && <IncorporationsTable />}
          {activeTab === "disposals" && <DisposalsTable />}
        </Box>
      </Container>
    </Box>
  )
}
