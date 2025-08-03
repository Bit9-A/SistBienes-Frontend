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
  Button, // Añadir Button aquí
} from "@chakra-ui/react"
import { FiPackage } from "react-icons/fi"
import { type Incorp, getIncorps, updateIncorp, deleteIncorp } from "api/IncorpApi"
import { filterIncorporations } from "./utils/IncorporationsLogic"
import IncorporationsFilters from "./components/IncorporationsFilters"
import IncorporationsForm from "./components/IncorporationsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"
import { ExportBM2Modal } from "../Disposals/components/ExportBM2Modal" // Importar el modal BM2
import { type Department, getDepartments } from "api/SettingsApi"
import { type ConceptoMovimiento, getConceptosMovimientoIncorporacion } from "api/SettingsApi"
import { type MovableAsset, getAssets } from "api/AssetsApi"
import { type SubGroup, getSubGroupsM } from "api/SettingsApi"
import { handleCreateIncorp } from "./utils/IncorporationsLogic"
import { getProfile } from "api/UserApi";
import { filterByUserProfile } from "../../../../utils/filterByUserProfile";
import { exportBM2ByDepartment } from "views/admin/inventory/utils/inventoryExcel"; // Importar la función de exportación BM2

export default function IncorporationsTable() {
  const [incorporations, setIncorporations] = useState<Incorp[]>([])
  const [selectedIncorporation, setSelectedIncorporation] = useState<Incorp | null>(null)
  const [newIncorporation, setNewIncorporation] = useState<Partial<Incorp>>({})
  const [filterDept, setFilterDept] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("") // Nuevo estado para el mes
  const [selectedYear, setSelectedYear] = useState<string>("") // Nuevo estado para el año
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isBM2ModalOpen, onOpen: onBM2ModalOpen, onClose: onBM2ModalClose } = useDisclosure(); // Para el modal BM2
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])
  const [assets, setAssets] = useState<MovableAsset[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])
 
  const [userProfile, setUserProfile] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [canFilterByDept, setCanFilterByDept] = useState(false);
  const [canNewButton, setCanNewButton] = useState(false);
 
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

  // Función para cargar las incorporaciones
  const fetchIncorporations = async () => {
    try {
      setLoading(true);
      const data = await getIncorps();
      setIncorporations(data);
      setError(null); // Limpiar errores si la carga es exitosa
    } catch (error: any) {
      if (
        error?.response?.status === 404 &&
        error?.response?.data?.message === "No se encontraron incorporaciones"
      ) {
        setIncorporations([]); // No hay registros, pero no es un error
        setError(null); // Importante: limpiar cualquier error previo si es un 404
      } else {
        setError("Error al cargar los datos de incorporaciones. Por favor, intenta nuevamente.");
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileAndFilter = async () => {
      const profile = await getProfile();
      setUserProfile(profile);
      const { filtered, canFilterByDept} = filterByUserProfile(incorporations, profile);
      setCanNewButton(canFilterByDept);
      setFilteredData(filtered);
      setCanFilterByDept(canFilterByDept);
    };
    fetchProfileAndFilter();
  }, [incorporations]);


  // Hacer la llamada a la API para obtener los catálogos
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [deptData, conceptData, assetData, subGroupData] = await Promise.all([
          getDepartments(),
          getConceptosMovimientoIncorporacion(),
          getAssets(),
          getSubGroupsM(),
        ]);
        setDepartments(deptData);
        setConcepts(conceptData);
        setAssets(assetData);
        setSubgroups(subGroupData);
      } catch (error) {
        toast({
          title: "Error al cargar catálogos",
          description: "Algunos datos de selección (departamentos, conceptos, etc.) podrían no estar disponibles.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error fetching catalogs:", error);
      }
    };

    fetchCatalogs();
    fetchIncorporations(); // Llamar a la función de carga de incorporaciones
  }, []);


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
      await handleCreateIncorp(dataToSend, setIncorporations) // No necesitamos el 'created' aquí si recargamos
      toast({
        title: "Incorporación creada",
        description: "La incorporación se ha creado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      fetchIncorporations(); // Recargar datos después de añadir
      onClose(); // Cerrar el modal después de añadir
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
        await updateIncorp(selectedIncorporation.id, newIncorporation) // No necesitamos el 'updated' aquí si recargamos

        toast({
          title: "Incorporación actualizada",
          description: "La incorporación se ha actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchIncorporations(); // Recargar datos después de editar
        setSelectedIncorporation(null)
        setNewIncorporation({})
        onClose()
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

  const handleFilterDate = (month: string, year: string) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  // Filtro por mes y año
  const filteredIncorporations = useMemo(() => {
    let filtered = filteredData;

    if (filterDept !== "all") {
      filtered = filtered.filter((incorp) => String(incorp.dept_id) === filterDept);
    }

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((incorp) => {
        const incorpDate = new Date(incorp.fecha);
        return (
          incorpDate.getMonth() + 1 === Number(selectedMonth) &&
          incorpDate.getFullYear() === Number(selectedYear)
        );
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((incorp) => {
        const incorpDate = new Date(incorp.fecha);
        return incorpDate.getMonth() + 1 === Number(selectedMonth);
      });
    } else if (selectedYear) {
      filtered = filtered.filter((incorp) => {
        const incorpDate = new Date(incorp.fecha);
        return incorpDate.getFullYear() === Number(selectedYear);
      });
    }

    return filtered;
  }, [filteredData, filterDept, selectedMonth, selectedYear]);

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

  const handleExportBM2 = async (deptId: number, deptName: string, mes: number, año: number, tipo: 'incorporacion' | 'desincorporacion') => {
    try {
      await exportBM2ByDepartment(deptId, deptName, mes, año, tipo);
      toast({
        title: "Exportación BM2 iniciada",
        description: `Se está generando el archivo BM2 de ${tipo} para ${deptName}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error de exportación",
        description: `No se pudo generar el archivo BM2 de ${tipo}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error exporting BM2:", error);
    }
  };


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
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          departments={departments}
          canFilterByDept={canFilterByDept}
          canNewButton={canNewButton}
        />
        <Button
          colorScheme="purple"
          onClick={onBM2ModalOpen}
          mt={4} // Añadir margen superior para separar del filtro
        >
          Exportar BM-2
        </Button>
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

    {/* Modal para exportar BM2 */}
    <ExportBM2Modal
      isOpen={isBM2ModalOpen}
      onClose={onBM2ModalClose}
      departments={departments}
      onExport={handleExportBM2}
      tipoMovimiento="incorporacion" // Especificar el tipo de movimiento
    />
  </Stack>
)
}
