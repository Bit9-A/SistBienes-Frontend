"use client"

import { useState, useEffect } from "react"
import { Box, Button, useDisclosure, useColorModeValue, useBreakpointValue, Stack } from "@chakra-ui/react"
import { FiEdit } from "react-icons/fi"
import type { Disposal } from "./variables/Disposals"
import DisposalsFilters from "./components/DisposalsFilters"
import DisposalsForm from "./components/DisposalsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"

// Mock data for initial load
const initialData: Disposal[] = [
  {
    id: 1,
    bien_id: 12345,
    nombre: "Monitor",
    descripcion: "Monitor dañado",
    fecha: "2025-04-15",
    valor: 120.0,
    cantidad: 5,
    concepto_id: 2,
    dept_id: 3,
  },
  {
    id: 2,
    bien_id: 54321,
    nombre: "Impresora",
    descripcion: "Impresora obsoleta",
    fecha: "2025-04-10",
    valor: 200.0,
    cantidad: 2,
    concepto_id: 1,
    dept_id: 1,
  },
]

export default function DisposalsTable() {
  const [disposals, setDisposals] = useState<Disposal[]>([])
  const [filteredDisposals, setFilteredDisposals] = useState<Disposal[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Disposal>>({})
  const [filterDept, setFilterDept] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  // UI theme values
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const cardBg = useColorModeValue("white", "gray.800")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Load initial data
  useEffect(() => {
    setDisposals(initialData)
    setFilteredDisposals(initialData)
  }, [])

  const handleAdd = () => {
    if (!newDisposal.bien_id || !newDisposal.nombre || !newDisposal.fecha) return

    const newEntry: Disposal = {
      id: disposals.length + 1,
      bien_id: newDisposal.bien_id,
      nombre: newDisposal.nombre,
      descripcion: newDisposal.descripcion || "",
      fecha: newDisposal.fecha,
      valor: newDisposal.valor || 0,
      cantidad: newDisposal.cantidad || 0,
      concepto_id: newDisposal.concepto_id || 1,
      dept_id: newDisposal.dept_id || 1,
    }

    setDisposals([...disposals, newEntry])
    setFilteredDisposals([...filteredDisposals, newEntry])
    setNewDisposal({})
    onClose()
  }

  const handleEdit = () => {
    if (selectedDisposal) {
      const updatedDisposals = disposals.map((item) =>
        item.id === selectedDisposal.id ? { ...item, ...newDisposal } : item,
      )

      setDisposals(updatedDisposals)
      setFilteredDisposals(
        filterDept ? updatedDisposals.filter((item) => item.dept_id === Number.parseInt(filterDept)) : updatedDisposals,
      )

      setSelectedDisposal(null)
      setNewDisposal({})
      onClose()
    }
  }

  const handleDelete = (id: number) => {
    const updatedDisposals = disposals.filter((item) => item.id !== id)
    setDisposals(updatedDisposals)
    setFilteredDisposals(
      filterDept ? updatedDisposals.filter((item) => item.dept_id === Number.parseInt(filterDept)) : updatedDisposals,
    )
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

  const applyFilters = (deptId: string | null, start: string, end: string) => {
    let filtered = [...disposals]

    // Filtrar por departamento
    if (deptId) {
      filtered = filtered.filter((item) => item.dept_id === Number.parseInt(deptId))
    }

    // Filtrar por fecha
    if (start) {
      filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(start))
    }

    if (end) {
      filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(end))
    }

    setFilteredDisposals(filtered)
  }

  const openEditDialog = (disposal: Disposal) => {
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
        />
      </Stack>

      {/* Desktop or Mobile view based on screen size */}
      {!isMobile ? (
        <DesktopTable
          disposals={filteredDisposals}
          borderColor={borderColor}
          headerBg={headerBg}
          hoverBg={hoverBg}
          tableSize={tableSize}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      ) : (
        <MobileCards
          disposals={filteredDisposals}
          borderColor={borderColor}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      <DisposalsForm
        isOpen={isOpen}
        onClose={onClose}
        selectedDisposal={selectedDisposal}
        newDisposal={newDisposal}
        setNewDisposal={setNewDisposal}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        isMobile={isMobile || false}
      />
    </Box>
  )
}
