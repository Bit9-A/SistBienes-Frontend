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
import { FiTrash2 } from "react-icons/fi"
import {
  getDesincorps,
  createDesincorp,
  updateDesincorp,
  deleteDesincorp,
  Desincorp,
} from "api/IncorpApi"
import { filterDisposals } from "./utils/DisposalsUtils"
import DisposalsFilters from "./components/DisposalsFilters"
import DisposalsForm from "./components/DisposalsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"
import { type Department, getDepartments } from "api/SettingsApi"
import { type ConceptoMovimiento, getConceptosMovimientoDesincorporacion } from "api/SettingsApi"
import { type MovableAsset, getAssets } from "api/AssetsApi"
import { type SubGroup, getSubGroupsM } from "api/SettingsApi"

import { getProfile } from "api/UserApi";
import { filterByUserProfile } from "../../../../utils/filterByUserProfile";

export default function DisposalsTable() {
  const today = new Date().toISOString().slice(0, 10)
  const [disposals, setDisposals] = useState<Desincorp[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Desincorp | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Desincorp>>({})
  const [filterDept, setFilterDept] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])
  const [assets, setAssets] = useState<MovableAsset[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])

  const [userProfile, setUserProfile] = useState<any>(null);
const [profileDisposals, setProfileDisposals] = useState<Desincorp[]>([]);
  
  const [canFilterByDept, setCanFilterByDept] = useState(false);
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


useEffect(() => {
  const fetchProfileAndFilter = async () => {
    const profile = await getProfile();
    setUserProfile(profile);
    const { filtered, canFilterByDept } = filterByUserProfile(disposals, profile);
    setProfileDisposals(filtered);
    setCanFilterByDept(canFilterByDept);
  };
  fetchProfileAndFilter();
}, [disposals]);




  // Load data on mount
 useEffect(() => {
  const fetchCatalogs = async () => {
    try {
      const [deptData, conceptData, assetData, subGroupData] = await Promise.all([
        getDepartments(),
        getConceptosMovimientoDesincorporacion(),
        getAssets(),
        getSubGroupsM(),
      ]);
      setDepartments(deptData);
      setConcepts(conceptData);
      setAssets(assetData);
      setSubgroups(subGroupData);
    } catch (error) {
      setError("Error al cargar catálogos.");
      console.error("Error fetching catalogs:", error);
    }
  };

  const fetchDisposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDesincorps();
      setDisposals(data);
    } catch (error: any) {
      if (
        error?.response?.status === 404 &&
        error?.response?.data?.message === "No se encontraron desincorporaciones"
      ) {
        setDisposals([]); // No hay registros, pero no es un error
        setError(null);
      } else {
        setError("Error al cargar los datos. Por favor, intenta nuevamente.");
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchCatalogs();
  fetchDisposals();
}, []);

  const handleAdd = async (disposalData?: Partial<Desincorp>) => {
    const data = disposalData || newDisposal
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
      const created = await createDesincorp(dataToSend as Omit<Desincorp, "id">)
      setDisposals((prev) => [...prev, created])
      toast({
        title: "Desincorporación creada",
        description: "La desincorporación se ha creado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear desincorporación",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      console.error("Error al crear desincorporación:", error)
    }
  }

  const handleEdit = async () => {
    if (selectedDisposal && newDisposal) {
      try {
        const { fecha, bien_id, ...updates } = newDisposal
        const updated = await updateDesincorp(selectedDisposal.id, updates)
        if (!updated || typeof updated.id === "undefined") {
          toast({
            title: "Error",
            description: "No se pudo actualizar la desincorporación",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          return
        }
        setDisposals((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
        setSelectedDisposal(null)
        setNewDisposal({})
        onClose()
        toast({
          title: "Desincorporación actualizada",
          description: "La desincorporación se ha actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al actualizar desincorporación",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteDesincorp(id)
      setDisposals((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Desincorporación eliminada",
        description: "La desincorporación se ha eliminado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar desincorporación",
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

  // Filtro igual que incorporations: useMemo y compara fechas con new Date()
 const filteredDisposals = useMemo(() => {
  return filterDisposals(
    profileDisposals,
    "",
    filterDept,
    startDate,
    endDate
  );
}, [profileDisposals, filterDept, startDate, endDate]);

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

  if (loading) {
    return (
      <Center py={20}>
        <Stack align="center" spacing={4}>
          <Spinner size="xl" color="red.500" thickness="4px" />
          <Heading size="md" color={textColor}>
            Cargando desincorporaciones...
          </Heading>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Error al cargar datos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
    )
  }

  return (
    <Stack spacing={4}>
      {/* Filters and Add Button Section */}
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          <DisposalsFilters
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
                Desincorporaciones
              </Heading>
              <Box color="gray.600" fontSize="sm">
                {filteredDisposals.length} registro{filteredDisposals.length !== 1 ? "s" : ""} encontrado
                {filteredDisposals.length !== 1 ? "s" : ""}
              </Box>
            </Box>
          </Flex>

          {/* Table/Cards Content */}
          {filteredDisposals.length === 0 ? (
            <Center py={12}>
              <Stack align="center" spacing={4}>
                <Box p={4} bg="gray.100" borderRadius="full">
                  <FiTrash2 size={32} color="gray" />
                </Box>
                <Box textAlign="center">
                  <Heading size="md" color="gray.500" mb={2}>
                    No hay desincorporaciones
                  </Heading>
                  <Box color="gray.400" fontSize="sm">
                    No se encontraron desincorporaciones que coincidan con los filtros aplicados
                  </Box>
                </Box>
              </Stack>
            </Center>
          ) : !isMobile ? (
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
        </CardBody>
      </Card>

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
        departments={departments}
        concepts={concepts}
        assets={assets}
        subgroups={subgroups}
        disposals={disposals}
        userProfile={userProfile} // Pasar el perfil del usuario si es necesario
      />
    </Stack>
  )
}