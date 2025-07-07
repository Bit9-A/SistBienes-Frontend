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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  const [activeTab, setActiveTab] = useState(0)

  const { cardBg, textColor, borderColor, headerBg, hoverBg } = useThemeColors()
  const toast = useToast()

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900")

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

      if (activeTab === 0) {
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
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
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

  return (
    <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container   maxW="100vw"
  px={{ base: 2, md: 4 }}
  py={{ base: 2, md: 4 }}
  w="full">
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
                    <FiShield size={24} color="#0059ae" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Auditoría del Sistema
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Monitoreo y seguimiento de actividades de usuarios en el sistema
                </Box>
              </Box>

              <Flex gap={3} align="center">
                <Stack direction="row" spacing={2}>
                  <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="full">
                    {activeSessionsCount} sesiones activas
                  </Badge>
                  <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                    {totalActionsCount} acciones registradas
                  </Badge>
                </Stack>

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
            </Flex>
          </CardHeader>
        </Card>

        {/* Content Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)} colorScheme="blue" size="lg">
              <TabList mb={6}>
                <Tab fontWeight="medium">
                  <Flex align="center" gap={2}>
                    <FiUsers />
                    <Box textAlign="left">
                      <Box>Entradas y Salidas</Box>
                      <Box fontSize="xs" opacity={0.7} fontWeight="normal">
                        Sesiones de usuario
                      </Box>
                    </Box>
                  </Flex>
                </Tab>
                <Tab fontWeight="medium">
                  <Flex align="center" gap={2}>
                    <FiActivity />
                    <Box textAlign="left">
                      <Box>Registro de Acciones</Box>
                      <Box fontSize="xs" opacity={0.7} fontWeight="normal">
                        Actividades del sistema
                      </Box>
                    </Box>
                  </Flex>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <LoginAudit
                    audits={audits}
                    loading={loading}
                    headerBg={headerBg}
                    hoverBg={hoverBg}
                    borderColor={borderColor}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <ActionAudit
                    logs={logs}
                    loading={loading}
                    headerBg={headerBg}
                    hoverBg={hoverBg}
                    borderColor={borderColor}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}
