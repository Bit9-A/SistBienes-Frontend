"use client"

import { useState, useEffect } from "react"
import { Box, Button, useDisclosure, useColorModeValue, useBreakpointValue, Stack } from "@chakra-ui/react"
import { FiEdit } from "react-icons/fi"
import type { Incorporation } from "./variables/Incorporations"
import IncorporationsFilters from "./components/IncorporationsFilters"
import IncorporationsForm from "./components/IncorporationsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"

// Mock data for initial load
const initialData: Incorporation[] = [
  {
    id: 1,
    bien_id: 12345,
    nombre: "Escritorio",
    descripcion: "Escritorio de oficina",
    fecha: "2025-04-20",
    valor: 150.0,
    cantidad: 10,
    concepto_id: 1,
    dept_id: 1,
  },
  {
    id: 2,
    bien_id: 67890,
    nombre: "Silla",
    descripcion: "Silla ergonómica",
    fecha: "2025-04-19",
    valor: 75.0,
    cantidad: 20,
    concepto_id: 2,
    dept_id: 2,
  },
]

export default function IncorporationsTable() {
  const [incorporations, setIncorporations] = useState<Incorporation[]>([])
  const [filteredIncorporations, setFilteredIncorporations] = useState<Incorporation[]>([])
  const [selectedIncorporation, setSelectedIncorporation] = useState<Incorporation | null>(null)
  const [newIncorporation, setNewIncorporation] = useState<Partial<Incorporation>>({})
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
    setIncorporations(initialData)
    setFilteredIncorporations(initialData)
  }, [])

  const handleAdd = () => {
    if (!newIncorporation.bien_id || !newIncorporation.nombre || !newIncorporation.fecha) return

    const newEntry: Incorporation = {
      id: incorporations.length + 1,
      bien_id: newIncorporation.bien_id,
      nombre: newIncorporation.nombre,
      descripcion: newIncorporation.descripcion || "",
      fecha: newIncorporation.fecha,
      valor: newIncorporation.valor || 0,
      cantidad: newIncorporation.cantidad || 0,
      concepto_id: newIncorporation.concepto_id || 1,
      dept_id: newIncorporation.dept_id || 1,
    }

    setIncorporations([...incorporations, newEntry])
    setFilteredIncorporations([...filteredIncorporations, newEntry])
    setNewIncorporation({})
    onClose()
  }

  const handleEdit = () => {
    if (selectedIncorporation) {
      const updatedIncorporations = incorporations.map((item) =>
        item.id === selectedIncorporation.id ? { ...item, ...newIncorporation } : item,
      )

      setIncorporations(updatedIncorporations)
      setFilteredIncorporations(
        filterDept
          ? updatedIncorporations.filter((item) => item.dept_id === Number.parseInt(filterDept))
          : updatedIncorporations,
      )

      setSelectedIncorporation(null)
      setNewIncorporation({})
      onClose()
    }
  }

  const handleDelete = (id: number) => {
    const updatedIncorporations = incorporations.filter((item) => item.id !== id)
    setIncorporations(updatedIncorporations)
    setFilteredIncorporations(
      filterDept
        ? updatedIncorporations.filter((item) => item.dept_id === Number.parseInt(filterDept))
        : updatedIncorporations,
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
    let filtered = [...incorporations]

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

    setFilteredIncorporations(filtered)
  }

  const openEditDialog = (incorporation: Incorporation) => {
    setSelectedIncorporation(incorporation)
    setNewIncorporation(incorporation)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedIncorporation(null)
    setNewIncorporation({})
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
          colorScheme="purple"
          bgColor={'type.primary'}
          onClick={openAddDialog}
          size={buttonSize}
          leftIcon={isMobile ? undefined : <FiEdit />}
          w={{ base: "full", md: "auto" }}
        >
          {isMobile ? "Agregar" : "Agregar Incorporación"}
        </Button>

        <IncorporationsFilters
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
          incorporations={filteredIncorporations}
          borderColor={borderColor}
          headerBg={headerBg}
          hoverBg={hoverBg}
          tableSize={tableSize}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      ) : (
        <MobileCards
          incorporations={filteredIncorporations}
          borderColor={borderColor}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      <IncorporationsForm
        isOpen={isOpen}
        onClose={onClose}
        selectedIncorporation={selectedIncorporation}
        newIncorporation={newIncorporation}
        setNewIncorporation={setNewIncorporation}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        isMobile={isMobile || false}
      />
    </Box>
  )
}
