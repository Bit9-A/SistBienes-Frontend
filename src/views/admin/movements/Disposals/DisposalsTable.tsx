import { useState, useEffect } from "react"
import { Box, Button, useDisclosure, useColorModeValue, useBreakpointValue, Stack } from "@chakra-ui/react"
import { FiEdit } from "react-icons/fi"
import { getDesincorps, createDesincorp, updateDesincorp, deleteDesincorp } from "api/IncorpApi"
import type { Department, ConceptoMovimiento } from "api/SettingsApi"
import { getDepartments, getConceptosMovimientoIncorporacion } from "api/SettingsApi"
import type { Desincorp } from "api/IncorpApi"
import DisposalsFilters from "./components/DisposalsFilters"
import DisposalsForm from "./components/DisposalsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"

export default function DisposalsTable() {
  const [disposals, setDisposals] = useState<Desincorp[]>([])
  const [filteredDisposals, setFilteredDisposals] = useState<Desincorp[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Desincorp | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Desincorp>>({})
  const [filterDept, setFilterDept] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])

  // UI theme values
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const cardBg = useColorModeValue("white", "gray.800")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Cargar datos reales al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDesincorps()
        const deptData = await getDepartments()
        const conceptData = await getConceptosMovimientoIncorporacion()
        setDepartments(deptData)
        setConcepts(conceptData)
        setDisposals(data)
        setFilteredDisposals(data)
      } catch (error) {
        // Manejo de error
      }
    }
    fetchData()
  }, [])

  const handleAdd = async () => {
    // Validar y limpiar datos
    const bien_id = Number(newDisposal.bien_id)
    const fecha = newDisposal.fecha ? newDisposal.fecha : ""
    const valor = Number(newDisposal.valor)
    const cantidad = Number(newDisposal.cantidad)
    const concepto_id = Number(newDisposal.concepto_id)
    const dept_id = Number(newDisposal.dept_id)

    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id || !dept_id) {
      // Muestra un toast de error: "Todos los campos son obligatorios"
      return
    }

    const dataToSend = { bien_id, fecha, valor, cantidad, concepto_id, dept_id }

    try {
      const created = await createDesincorp(dataToSend)
      setDisposals((prev) => [...prev, created])
      setFilteredDisposals((prev) => [...prev, created])
      setNewDisposal({})
      onClose()
    } catch (error) {
      // Manejo de error
    }
  }

  const handleEdit = async () => {
    if (selectedDisposal && newDisposal) {
      try {
        const { fecha, bien_id, ...updates } = newDisposal
        const updated = await updateDesincorp(selectedDisposal.id, updates)

        if (!updated || typeof updated.id === "undefined") {
          // Manejo de error: no se recibió el objeto actualizado
          return
        }

        setDisposals((prev) =>
          prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
        )
        setFilteredDisposals((prev) =>
          prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
        )
        setSelectedDisposal(null)
        setNewDisposal({})
        onClose()
      } catch (error) {
        // Manejo de error
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteDesincorp(id)
      setDisposals((prev) => prev.filter((item) => item.id !== id))
      setFilteredDisposals((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      // Manejo de error
    }
  }

  const handleFilterDepartment = (deptId: string) => {
    setFilterDept(deptId)
    applyFilters(deptId, startDate, endDate)
  }

  const handleFilterDate = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    applyFilters(filterDept, start, end)
  }

  const applyFilters = (deptId: string, start: string, end: string) => {
    let filtered = [...disposals]
    if (deptId) {
      filtered = filtered.filter((item) => item.dept_id === Number(deptId))
    }
    if (start) {
      filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(start))
    }
    if (end) {
      filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(end))
    }
    setFilteredDisposals(filtered)
  }

  const openEditDialog = (disposal: Desincorp) => {
    setSelectedDisposal(disposal)
    setNewDisposal(disposal)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedDisposal(null)
    setNewDisposal({})
    onOpen()
  }

  const toggleFilters = () => setShowFilters(!showFilters)

  return (
    <Box pt={{ base: "100px", md: "80px", xl: "80px" }}>
      <Stack
        spacing={4}
        mb={4}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
      >
        <Button
          colorScheme="red"
          onClick={openAddDialog}
          size={buttonSize}
          leftIcon={isMobile ? undefined : <FiEdit />}
          w={{ base: "full", md: "auto" }}
        >
          {isMobile ? "Agregar" : "Agregar Desincorporación"}
        </Button>

        <DisposalsFilters
          onFilterDepartment={handleFilterDepartment}
          onFilterDate={handleFilterDate}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          startDate={startDate}
          endDate={endDate}
          buttonSize={buttonSize || "md"}
          borderColor={borderColor}
          cardBg={cardBg}
          departments={departments}
        />
      </Stack>

      {!isMobile ? (
        <DesktopTable
          disposals={filteredDisposals}
          borderColor={borderColor}
          headerBg={headerBg}
          hoverBg={hoverBg}
          tableSize={tableSize}
          onEdit={openEditDialog}
          onDelete={handleDelete}
          departments={departments}
          concepts={concepts}
        />
      ) : (
        <MobileCards
          disposals={filteredDisposals}
          borderColor={borderColor}
          onEdit={openEditDialog}
          onDelete={handleDelete}
          departments={departments}
          concepts={concepts}
        />
      )}

      <DisposalsForm
        isOpen={isOpen}
        onClose={onClose}
        selectedDisposal={selectedDisposal}
        newDisposal={newDisposal}
        setNewDisposal={setNewDisposal}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        isMobile={isMobile || false}
        departments={departments}
        concepts={concepts}
      />
    </Box>
  )
}