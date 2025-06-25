"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  Heading,
  Card,
  CardBody,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react"
import { FiPackage } from "react-icons/fi"
import { type Incorp, getIncorps, updateIncorp, deleteIncorp } from "api/IncorpApi"
import { filterIncorporations } from "./utils/IncorporationsLogic"
import IncorporationsFilters from "./components/IncorporationsFilters"
import IncorporationsForm from "./components/IncorporationsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"
import { type Department, getDepartments } from "api/SettingsApi"
import { type ConceptoMovimiento, getConceptosMovimientoIncorporacion } from "api/SettingsApi"
import { type MovableAsset, getAssets } from "api/AssetsApi"
import { type SubGroup, getSubGroupsM } from "api/SettingsApi"
import { handleCreateIncorp } from "./utils/IncorporationsLogic"

export default function IncorporationsTable() {
  const today = new Date().toISOString().slice(0, 10)
  const [incorporations, setIncorporations] = useState<Incorp[]>([])
  const [selectedIncorporation, setSelectedIncorporation] = useState<Incorp | null>(null)
  const [newIncorporation, setNewIncorporation] = useState<Partial<Incorp>>({})
  const [filterDept, setFilterDept] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])
  const [assets, setAssets] = useState<MovableAsset[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])
  const toast = useToast()

  // UI theme values
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [data, deptData, conceptData, assetData, subGroupData] = await Promise.all([
          getIncorps(),
          getDepartments(),
          getConceptosMovimientoIncorporacion(),
          getAssets(),
          getSubGroupsM(),
        ])
        setAssets(assetData)
        setSubgroups(subGroupData)
        setDepartments(deptData)
        setConcepts(conceptData)
        setIncorporations(data)
      } catch (error) {
        setError("Error al cargar los datos. Por favor, intenta nuevamente.")
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAdd = async (incorpData?: Partial<Incorp>) => {
    const data = incorpData || newIncorporation
    const bien_id = Number(data.bien_id)
    const fecha = data.fecha ? data.fecha : ""
    const valor = Number(data.valor)
    const cantidad = Number(data.cantidad)
    const concepto_id = Number(data.concepto_id)
    const dept_id = Number(data.dept_id)

    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id || !dept_id) {
      toast({
        title: "Campos requeridos",
        description: "Todos los campos son obligatorios",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const dataToSend = {
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
    }

    try {
      const created = await handleCreateIncorp(dataToSend, setIncorporations)
      setIncorporations((prev) => [...prev, created])
      toast({
        title: "Incorporación creada",
        description: "La incorporación se ha creado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear incorporación",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      console.error("Error al crear incorporación:", error)
    }
  }

  const handleEdit = async () => {
    if (selectedIncorporation && newIncorporation) {
      try {
        const { fecha, bien_id, ...updates } = newIncorporation
        const updated = await updateIncorp(selectedIncorporation.id, updates)

        if (!updated || typeof updated.id === "undefined") {
          toast({
            title: "Error",
            description: "No se pudo actualizar la incorporación",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          return
        }

        setIncorporations((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
        setSelectedIncorporation(null)
        setNewIncorporation({})
        onClose()
        toast({
          title: "Incorporación actualizada",
          description: "La incorporación se ha actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al actualizar incorporación",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteIncorp(id)
      setIncorporations((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Incorporación eliminada",
        description: "La incorporación se ha eliminado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar incorporación",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleFilterDepartment = (deptId: string) => {
    setFilterDept(deptId)
  }

  const handleFilterDate = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end || today)
  }

  // Filtro igual que transfers: useMemo y compara fechas con new Date()
  const filteredIncorporations = useMemo(() => {
    return filterIncorporations(
      incorporations,
      "",
      filterDept,
      startDate,
      endDate
    )
  }, [incorporations, filterDept, startDate, endDate])

  const openEditDialog = (inc: Incorp) => {
    setSelectedIncorporation(inc)
    setNewIncorporation(inc)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedIncorporation(null)
    setNewIncorporation({})
    onOpen()
  }


  return (
  <Stack spacing={4}>
    {/* Loading/Error overlays */}
    {(loading || error) && (
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          {loading ? (
            <Center py={20}>
              <Stack align="center" spacing={4}>
                <Spinner size="xl" color="purple.500" thickness="4px" />
                <Heading size="md" color={textColor}>
                  Cargando incorporaciones...
                </Heading>
              </Stack>
            </Center>
          ) : (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Error al cargar datos</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}
        </CardBody>
      </Card>
    )}

    {/* Filters and Add Button Section */}
    <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
      <CardBody p={6}>
        <IncorporationsFilters
          onFilterDepartment={handleFilterDepartment}
          onFilterDate={handleFilterDate}
          onAddClick={openAddDialog}
          startDate={startDate}
          endDate={endDate}
          departments={departments}
        />
      </CardBody>
    </Card>

    {/* Content Section */}
    <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
      <CardBody p={6}>
        {/* Results Summary */}
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="md" color={textColor} mb={1}>
              Incorporaciones
            </Heading>
            <Box color="gray.600" fontSize="sm">
              {filteredIncorporations.length} registro{filteredIncorporations.length !== 1 ? "s" : ""} encontrado
              {filteredIncorporations.length !== 1 ? "s" : ""}
            </Box>
          </Box>
        </Flex>

        {/* Table/Cards Content */}
        {filteredIncorporations.length === 0 ? (
          <Center py={12}>
            <Stack align="center" spacing={4}>
              <Box p={4} bg="gray.100" borderRadius="full">
                <FiPackage size={32} color="gray" />
              </Box>
              <Box textAlign="center">
                <Heading size="md" color="gray.500" mb={2}>
                  No hay incorporaciones
                </Heading>
                <Box color="gray.400" fontSize="sm">
                  No se encontraron incorporaciones que coincidan con los filtros aplicados
                </Box>
              </Box>
            </Stack>
          </Center>
        ) : !isMobile ? (
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
            departments={departments}
            concepts={concepts}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        )}
      </CardBody>
    </Card>

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
      assets={assets}
      departments={departments}
      subgroups={subgroups}
      concepts={concepts}
      incorporations={incorporations}
      onCreated={(nuevos) => {
        setIncorporations((prev) => [...prev, ...nuevos])
      }}
    />
  </Stack>
)
}