"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Container,
  useColorModeValue,
  Center,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  useToast,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react"
import { FiDownload, FiShield, FiActivity, FiUsers } from "react-icons/fi"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { fetchAudits, fetchLogs } from "./utils/AuditUtils"
import type { Audit, Log } from "api/AuditApi"
import LoginAudit from "./components/LoginAudit"
import ActionAudit from "./components/ActionsAudit"
import { useThemeColors } from "../../../theme/useThemeColors"

export default function AuditModule() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("login")

  const { cardBg, borderColor, headerBg, hoverBg } = useThemeColors()
  const toast = useToast()
    const textColor = useColorModeValue("gray.800", "white")
  

  // Theme colors
  const tabBorderColor = useColorModeValue("gray.200", "gray.700")
  const bg = useColorModeValue("gray.50", "gray.900")

  // Responsive values
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })

  // Load audits and logs on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [auditsData, logsData] = await Promise.all([fetchAudits(), fetchLogs()])
        setAudits(auditsData || [])
        setLogs(logsData || [])
      } catch (error) {
        console.error("Error fetching audit data:", error)
        setError("Error al cargar los datos de auditoría. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Export to PDF based on active tab
  const exportToPDF = () => {
    try {
      const doc = new jsPDF()

      if (activeTab === "login") {
        // Export login/logout data
        doc.text("Registro de Entradas y Salidas", 14, 10)
        autoTable(doc, {
          head: [["#", "Usuario", "Departamento", "Entrada", "Salida", "IP", "Estado"]],
          body: audits.map((audit, index) => [
            index + 1,
            audit.nombre,
            audit.departamento,
            formatDate(audit.entrada),
            formatDate(audit.salida),
            audit.ip,
            audit.salida ? "Finalizada" : "Activa",
          ]),
          startY: 20,
        })
        doc.save("login_audit.pdf")
      } else {
        // Export actions data
        doc.text("Registro de Acciones", 14, 10)
        autoTable(doc, {
          head: [["#", "Usuario", "Acción", "Fecha", "Detalles", "Departamento"]],
          body: logs.map((log, index) => [
            index + 1,
            log.usuario_nombre || log.usuario_id,
            log.accion,
            formatDate(log.fecha),
            log.detalles,
            log.departamento,
          ]),
          startY: 20,
        })
        doc.save("action_audit.pdf")
      }

      toast({
        title: "Exportación exitosa",
        description: "El archivo PDF se ha descargado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error en la exportación",
        description: "No se pudo generar el archivo PDF",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Format date for PDF export
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin salida"
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Center py={20}>
            <Stack align="center" spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Heading size="md" color={textColor}>
                Cargando datos de auditoría...
              </Heading>
            </Stack>
          </Center>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Alert status="error" borderRadius="lg" mt={8}>
            <AlertIcon />
            <Box>
              <AlertTitle>Error al cargar datos</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    )
  }

  const activeSessionsCount = audits.filter((audit) => !audit.salida).length
  const totalActionsCount = logs.length

  // Tabs configuration
  const tabs = [
    {
      id: "login",
      label: "Entradas y Salidas",
      icon: FiUsers,
      color: "blue",
      description: "Sesiones de usuario",
    },
    {
      id: "actions",
      label: "Registro de Acciones",
      icon: FiActivity,
      color: "purple",
      description: "Actividades del sistema",
    },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="100vw" px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }} w="full">
        {/* Main Header */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardHeader p={{ base: 4, md: 6 }}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={{ base: 3, md: 4 }}
            >
              <Box>
                <Flex align="center" gap={{ base: 2, md: 3 }} mb={2}>
                  <Box p={{ base: 1.5, md: 2 }} bg="blue.100" borderRadius="lg">
                    <FiShield size={24} color="#0059ae" />
                  </Box>
                  <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color={textColor}>
                    Auditoría del Sistema
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
                  Monitoreo y seguimiento de actividades de usuarios en el sistema
                </Box>
              </Box>
              {activeTabData && (
                <Badge
                  colorScheme={activeTabData.color}
                  variant="subtle"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  borderRadius="full"
                  fontSize={{ base: "xs", md: "sm" }}
                  mt={{ base: 2, lg: 0 }}
                >
                  {activeTabData.label}
                </Badge>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card
          bg={cardBg}
          shadow="md"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardBody p={{ base: 3, md: 4 }}>
            <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 2, md: 2 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "solid" : "ghost"}
                  colorScheme="purple" /* Usar colorScheme purple para todos los botones */
                  bg={activeTab === tab.id ? "type.primary" : "transparent"} /* Color de fondo personalizado para la pestaña activa */
                  color={activeTab === tab.id ? "white" : textColor}
                  borderRadius="lg"
                  _hover={{
                    bg: activeTab === tab.id ? "type.primary" : hoverBg, /* Hover para la pestaña activa */
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={tab.icon} />}
                  size={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  flex={{ base: "1", md: "auto" }}
                  minW={{ base: "auto", md: "200px" }}
                  boxShadow={activeTab === tab.id ? "md" : "none"}
                  isActive={activeTab === tab.id}
                  w={{ base: "full", md: "auto" }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Box textAlign="left">
                    <Box fontSize={{ base: "sm", md: "md" }}>{tab.label}</Box>
                    <Box
                      fontSize={{ base: "2xs", md: "xs" }}
                      opacity={0.8}
                      fontWeight="normal"
                      display={{ base: "none", md: "block" }}
                    >
                      {tab.description}
                    </Box>
                  </Box>
                </Button>
              ))}
            </Stack>
          </CardBody>
        </Card>

        {/* Export Button */}
        <Flex justifyContent="flex-end" mb={4}>
          <Button
            bgColor="type.primary"
            colorScheme="purple"
            leftIcon={<FiDownload />}
            onClick={exportToPDF}
            size={buttonSize}
            boxShadow="lg"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
            }}
            transition="all 0.2s"
          >
            Exportar PDF
          </Button>
        </Flex>

        {/* Tab Content */}
        <Box>
          {activeTab === "login" && (
            <LoginAudit
              audits={audits}
              loading={loading}
              headerBg={headerBg}
              hoverBg={hoverBg}
              borderColor={borderColor}
            />
          )}
          {activeTab === "actions" && (
            <ActionAudit
              logs={logs}
              loading={loading}
              headerBg={headerBg}
              hoverBg={hoverBg}
              borderColor={borderColor}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}
