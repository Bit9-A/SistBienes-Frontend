"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react"
import { FiDownload } from "react-icons/fi"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { fetchAudits, fetchLogs } from "./utils/AuditUtils"
import { Audit, Log } from "api/AuditApi"
import LoginAudit from "./components/LoginAudit"
import ActionAudit from "./components/ActionsAudit"
import { useThemeColors } from "../../../theme/useThemeColors"

export default function AuditModule() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const { cardBg, textColor, borderColor, headerBg, hoverBg } = useThemeColors()

  // Load audits and logs on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAudits(), fetchLogs()])
      .then(([auditsData, logsData]) => {
        setAudits(auditsData || [])
        setLogs(logsData || [])
      })
      .finally(() => setLoading(false))
  }, [])

  // Export to PDF based on active tab
  const exportToPDF = () => {
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
        head: [["#", "Usuario", "Acción", "Fecha", "Detalles", "Tipo", "Departamento"]],
        body: logs.map((log, index) => [
          index + 1,
          log.usuario_id,
          log.accion,
          formatDate(log.fecha),
          log.detalles,
          log.departamento,
        ]),
        startY: 20,
      })
      doc.save("action_audit.pdf")
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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Auditoría de Usuarios
            </Heading>
            <HStack spacing={4}>
              <Button bgColor="type.primary" colorScheme="purple" leftIcon={<FiDownload />} onClick={exportToPDF}>
                Exportar a PDF
              </Button>
            </HStack>
          </Flex>
        </CardHeader>

        <CardBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)}>
              <TabList mb="1em">
                <Tab>Entradas y Salidas</Tab>
                <Tab>Acciones</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <LoginAudit
                    audits={audits}
                    loading={loading}
                    headerBg={headerBg}
                    hoverBg={hoverBg}
                    borderColor={borderColor}
                  />
                </TabPanel>
                <TabPanel>
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
          )}
        </CardBody>
      </Card>
    </Box>
  )
}
