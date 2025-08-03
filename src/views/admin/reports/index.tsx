'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  useDisclosure,
  IconButton,
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
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Divider,
  Icon,
  Button,
  Badge,
  HStack,
  Container,
  CardHeader,
} from '@chakra-ui/react';
import {
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiX,
  FiCalendar,
  FiPlus,
  FiUsers,
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import {
  type MissingGoods,
  getMissingGoods,
  createMissingGood,
  updateMissingGood,
  deleteMissingGood,
} from 'api/ReportApi';
import { type Department, getDepartments } from 'api/SettingsApi';
import ReportForm from './components/ReportForm';
import DesktopTable from './components/DesktopTable'; // Importa el componente de tabla para escritorio
import MobileCard from './components/MobileCard'; // Importa el componente de tarjeta para móviles
import ReportDetailsModal from './components/ReportDetailsModal'; // Importa el modal de detalles del reporte
import { getAssets, type MovableAsset, updateAsset } from 'api/AssetsApi'; // Importa funciones para activos movibles
import { exportBM3ByMissingGoodsId } from './utils/ReportExcel'; // Importa la función para exportar reportes BM3
import { createDisposalForMissingGood } from './utils/ReportUtils'; // Importa la función para crear desincorporaciones
import { logCustomAction } from 'views/admin/audit/utils/AuditUtils'; // Importa la función para registrar acciones de auditoría
import { createNotificationAction } from 'views/admin/notifications/utils/NotificationsUtils'; // Importa la función para crear notificaciones

const ITEMS_PER_PAGE = 10; // Define la cantidad de elementos por página para la paginación

export default function MissingGoodsTable() {
  // Estados para almacenar los datos y el control de la UI
  const [missingGoods, setMissingGoods] = useState<MissingGoods[]>([]); // Lista completa de bienes faltantes
  const [filteredMissingGoods, setFilteredMissingGoods] = useState<
    MissingGoods[]
  >([]); // Lista de bienes faltantes después de aplicar filtros
  const [selectedMissingGood, setSelectedMissingGood] =
    useState<MissingGoods | null>(null); // Bien faltante seleccionado para edición/adición
  const [selectedMissingGoodForDetails, setSelectedMissingGoodForDetails] =
    useState<MissingGoods | null>(null); // Bien faltante seleccionado para ver detalles
  const [newMissingGood, setNewMissingGood] = useState<Partial<MissingGoods>>(
    {},
  ); // Nuevo bien faltante a agregar o editar
  const [filterDept, setFilterDept] = useState<string>('all'); // Filtro por departamento
  const [startDate, setStartDate] = useState<string>(''); // Fecha de inicio para el filtro
  const [endDate, setEndDate] = useState<string>(''); // Fecha de fin para el filtro
  const [searchQuery, setSearchQuery] = useState<string>(''); // Consulta de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la tabla
  const [loading, setLoading] = useState(true); // Estado de carga de datos
  const [error, setError] = useState<string | null>(null); // Estado de error
  // Hooks para el control de modales (formularios y detalles)
  const { isOpen, onOpen, onClose } = useDisclosure(); // Para el formulario de edición/adición
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure(); // Para el modal de detalles
  const [departments, setDepartments] = useState<Department[]>([]); // Lista de departamentos
  const [assets, setAssets] = useState<MovableAsset[]>([]); // Lista de activos movibles
  const toast = useToast(); // Hook para mostrar notificaciones tipo "toast"

  // Colores del tema para la interfaz de usuario
  const bgColor = useColorModeValue('gray.50', 'gray.900'); // Color de fondo
  const borderColor = useColorModeValue('gray.200', 'gray.700'); // Color del borde
  const headerBg = useColorModeValue('gray.100', 'gray.800'); // Color de fondo del encabezado
  const hoverBg = useColorModeValue('gray.50', 'gray.700'); // Color de fondo al pasar el ratón
  const cardBg = useColorModeValue('white', 'gray.800'); // Color de fondo de las tarjetas
  const textColor = useColorModeValue('gray.800', 'white'); // Color del texto
  const badgeBg = useColorModeValue('blue.50', 'blue.900'); // Color de fondo de las insignias
  const badgeColor = useColorModeValue('blue.600', 'blue.200'); // Color del texto de las insignias

  // Valores responsivos para diferentes tamaños de pantalla
  const isMobile = useBreakpointValue({ base: true, md: false }); // Determina si es una vista móvil
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' }); // Tamaño de la tabla
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  // Función asíncrona para cargar los datos iniciales de bienes faltantes, departamentos y activos
  const fetchData = async () => {
    try {
      setLoading(true); // Establece el estado de carga a true
      setError(null); // Limpia cualquier error previo
      // Realiza todas las llamadas a la API en paralelo
      const [data, deptData, assetsData] = await Promise.all([
        getMissingGoods(), // Obtiene bienes faltantes
        getDepartments(), // Obtiene departamentos
        getAssets(), // Obtiene activos
      ]);
      setDepartments(deptData); // Actualiza el estado de departamentos
      setMissingGoods(data); // Actualiza el estado de bienes faltantes
      setAssets(assetsData); // Actualiza el estado de activos
    } catch (error) {
      setError('Error al cargar los datos. Por favor, intenta nuevamente.'); // Establece un mensaje de error
      console.error('Error fetching data:', error); // Registra el error en la consola
    } finally {
      setLoading(false); // Establece el estado de carga a false, independientemente del resultado
    }
  };

  // Memoiza las opciones de departamento únicas para el filtro
  const departmentOptions = useMemo(() => {
    return [...new Set(missingGoods.map((good) => good.departamento).filter(Boolean))].sort();
  }, [missingGoods]); // Se recalcula solo cuando missingGoods cambia

  // Efecto para aplicar filtros y actualizar la lista de bienes faltantes filtrados
  useEffect(() => {
    let filtered = [...missingGoods]; // Copia la lista original para filtrar

    // Filtro de búsqueda por texto
    if (searchQuery) {
      filtered = filtered.filter(
        (good) =>
          good.funcionario_nombre
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          good.jefe_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          good.departamento
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          good.numero_identificacion
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          good.observaciones?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filtro por departamento
    if (filterDept !== 'all') {
      filtered = filtered.filter((good) => good.departamento === filterDept);
    }

    // Filtro por rango de fechas (desde)
    if (startDate) {
      filtered = filtered.filter(
        (good) => new Date(good.fecha) >= new Date(startDate),
      );
    }

    // Filtro por rango de fechas (hasta)
    if (endDate) {
      filtered = filtered.filter(
        (good) => new Date(good.fecha) <= new Date(endDate),
      );
    }

    setFilteredMissingGoods(filtered); // Actualiza la lista filtrada
    setCurrentPage(1); // Reinicia a la primera página cuando los filtros cambian
  }, [missingGoods, searchQuery, filterDept, startDate, endDate]); // Dependencias del efecto

  // Calcula el número total de páginas para la paginación
  const totalPages = Math.ceil(filteredMissingGoods.length / ITEMS_PER_PAGE);

  // Memoiza los bienes paginados para la tabla actual
  const paginatedGoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE; // Calcula el índice de inicio
    return filteredMissingGoods.slice(start, start + ITEMS_PER_PAGE); // Retorna los elementos de la página actual
  }, [filteredMissingGoods, currentPage]); // Se recalcula cuando la lista filtrada o la página actual cambian

  // Reinicia la página actual si está fuera de rango (ej. al aplicar filtros que reducen el número de páginas)
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []); // Se ejecuta una sola vez al montar

  // Abre el diálogo de edición con los datos del bien faltante seleccionado
  const openEditDialog = (mg: MissingGoods) => {
    setSelectedMissingGood(mg); // Establece el bien seleccionado para edición
    setNewMissingGood(mg); // Carga los datos en el formulario
    onOpen(); // Abre el modal del formulario
  };

  // Abre el diálogo para añadir un nuevo bien faltante
  const openAddDialog = () => {
    setSelectedMissingGood(null); // No hay bien seleccionado (modo adición)
    setNewMissingGood({}); // Limpia el formulario
    onOpen(); // Abre el modal del formulario
  };

  // Abre el diálogo de detalles del bien faltante seleccionado
  const openDetailsDialog = (mg: MissingGoods) => {
    setSelectedMissingGoodForDetails(mg); // Establece el bien para ver detalles
    onDetailsModalOpen(); // Abre el modal de detalles
  };

  // Maneja la recuperación de un bien faltante
  const handleRecoverMissingGood = async (missingGood: MissingGoods) => {
    try {
      if (!missingGood.id || !missingGood.bien_id) {
        toast({
          title: "Error al recuperar",
          description: "Datos incompletos para recuperar el bien.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // 1. Eliminar el registro de bien faltante de la base de datos
      await deleteMissingGood(missingGood.id);

      // 2. Actualizar el estado del bien a "Activo" (isActive: 1)
      const updateData = {
        isActive: 1
      } as MovableAsset;
      await updateAsset(missingGood.bien_id, updateData);

      toast({
        title: 'Bien recuperado',
        description: `El bien ${missingGood.numero_identificacion} ha sido marcado como recuperado y el reporte eliminado.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDetailsModalClose(); // Cierra el modal de detalles
      // Registra la acción de auditoría
      await logCustomAction({
        accion: "Recuperar Bien Faltante",
        detalles: `Se recuperó el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}).`,
      });
      await fetchData(); // Recarga los datos para reflejar los cambios
    } catch (error: any) {
      console.error("Error al recuperar el bien faltante:", error);
      toast({
        title: 'Error',
        description: `No se pudo recuperar el bien faltante. Error: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Registra el error en la auditoría
      await logCustomAction({
        accion: "Error Recuperar Bien Faltante",
        detalles: `Fallo al recuperar el bien faltante con ID: ${missingGood.id}. Error: ${error.message}`,
      });
    }
  };

  // Maneja la exportación del reporte BM3
  const handleExportBM3 = async (missingGood: MissingGoods) => {
    try {
      if (!missingGood.id || !missingGood.funcionario_id || !missingGood.departamento || !missingGood.funcionario_nombre) {
        toast({
          title: "Error de exportación",
          description: "Faltan datos para generar el reporte BM3.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Llama a la función de exportación con los datos necesarios
      await exportBM3ByMissingGoodsId(
        missingGood.id,
        missingGood.funcionario_id,
        missingGood.departamento,
        missingGood.funcionario_nombre
      );
      toast({
        title: "Exportación BM3 iniciada",
        description: `Se está generando el archivo BM3 para el bien ${missingGood.numero_identificacion}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      // Registra la acción de auditoría
      await logCustomAction({
        accion: "Exportar Reporte BM3",
        detalles: `Se exportó el reporte BM3 para el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}).`,
      });
    } catch (error: any) {
      toast({
        title: "Error de exportación",
        description: `No se pudo generar el archivo BM3 para el bien ${missingGood.numero_identificacion}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error exporting BM3:", error);
      // Registra el error en la auditoría
      await logCustomAction({
        accion: "Error Exportar Reporte BM3",
        detalles: `Fallo al exportar el reporte BM3 para el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}). Error: ${error.message}`,
      });
    }
  };

  // Función para añadir un nuevo bien faltante
  const handleAdd = async (mgData?: Partial<MissingGoods>) => {
    try {
      if (!mgData) return; // Si no hay datos, sale de la función
      // Prepara el payload con los datos del nuevo bien faltante
      const payload = {
        unidad: Number(mgData.unidad),
        existencias: Number(mgData.existencias),
        diferencia_cantidad: Number(mgData.diferencia_cantidad),
        diferencia_valor: Number(mgData.diferencia_valor),
        funcionario_id: Number(mgData.funcionario_id),
        jefe_id: Number(mgData.jefe_id),
        observaciones: mgData.observaciones ?? '',
        fecha: mgData.fecha ?? '',
        bien_id: Number(mgData.bien_id),
        numero_identificacion: mgData.numero_identificacion ?? '',
      };
      // Crea el registro de bien faltante en la base de datos
      const created = await createMissingGood(payload as any);

      // Actualizar el isActive del bien a 0 (inactivo)
      try {
        await updateAsset(Number(mgData.bien_id), { isActive: 0 } as MovableAsset);
       // console.log(`Bien con ID ${mgData.bien_id} marcado como inactivo (isActive: 0)`);
      } catch (assetUpdateError: any) {
        console.error("Error al actualizar isActive del bien:", assetUpdateError);
        toast({
          title: 'Advertencia',
          description: 'El bien faltante se agregó, pero hubo un error al actualizar el estado del bien.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }

      // Crear notificación al departamento del bien reportado
      try {
        const department = departments.find(d => d.nombre === mgData.departamento);
        if (department) {
          await createNotificationAction({
            dept_id: department.id,
            descripcion: `Se ha reportado un bien faltante: ${mgData.numero_identificacion || 'N/A'} - ${mgData.observaciones || 'Sin observaciones'}.`,
          });
          toast({
            title: 'Notificación creada',
            description: 'Se ha enviado una notificación al departamento correspondiente.',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.warn("Departamento no encontrado para la notificación:", mgData.departamento);
        }
      } catch (notificationError: any) {
        console.error("Error al crear la notificación:", notificationError);
        toast({
          title: 'Advertencia',
          description: 'El bien faltante se agregó, pero hubo un error al crear la notificación.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }

      // Crear desincorporación automáticamente
      try {
        await createDisposalForMissingGood(created); // Llama a la función para crear la desincorporación
        toast({
          title: 'Desincorporación creada',
          description: 'Se ha creado una desincorporación para el bien faltante.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        // Registra la acción de auditoría
        await logCustomAction({
          accion: "Crear Bien Faltante y Desincorporación",
          detalles: `Se creó el bien faltante con ID: ${created.id} (${mgData.numero_identificacion || 'N/A'}) y su desincorporación asociada.`,
        });
      } catch (disposalError: any) {
        console.error("Error al crear la desincorporación:", disposalError);
        toast({
          title: 'Advertencia',
          description: 'El bien faltante se agregó, pero hubo un error al crear la desincorporación.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        // Registra el error en la auditoría
        await logCustomAction({
          accion: "Error Crear Desincorporación por Bien Faltante",
          detalles: `El bien faltante con ID: ${created.id} (${mgData.numero_identificacion || 'N/A'}) se agregó, pero falló la creación de la desincorporación. Error: ${disposalError.message}`,
        });
      }

      toast({
        title: 'Bien faltante agregado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Cierra el modal del formulario
      await fetchData(); // Recarga los datos para actualizar la tabla
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Registra el error en la auditoría
      await logCustomAction({
        accion: "Error Crear Bien Faltante",
        detalles: `Fallo al agregar el bien faltante. Error: ${error.message}`,
      });
    }
  };

  // Función para editar un bien faltante existente
  const handleEdit = async () => {
    try {
      if (!selectedMissingGood || !newMissingGood) return; // Si no hay bien seleccionado o datos nuevos, sale
      // Prepara el payload con los datos actualizados
      const payload = {
        unidad: Number(newMissingGood.unidad),
        existencias: Number(newMissingGood.existencias),
        diferencia_cantidad: Number(newMissingGood.diferencia_cantidad),
        diferencia_valor: Number(newMissingGood.diferencia_valor),
        funcionario_id: Number(newMissingGood.funcionario_id),
        jefe_id: Number(newMissingGood.jefe_id),
        observaciones: newMissingGood.observaciones ?? '',
        fecha: newMissingGood.fecha ?? '',
        bien_id: Number(newMissingGood.bien_id),
      };
      // Actualiza el registro de bien faltante en la base de datos
      const updated = await updateMissingGood(
        selectedMissingGood.id,
        payload as any,
      );
      toast({
        title: 'Bien faltante actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Cierra el modal del formulario
      // Registra la acción de auditoría
      await logCustomAction({
        accion: "Editar Bien Faltante",
        detalles: `Se editó el bien faltante con ID: ${updated.id} (${newMissingGood.numero_identificacion || 'N/A'}).`,
      });
      await fetchData(); // Recarga los datos para actualizar la tabla
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Registra el error en la auditoría
      await logCustomAction({
        accion: "Error Editar Bien Faltante",
        detalles: `Fallo al editar el bien faltante con ID: ${selectedMissingGood?.id}. Error: ${error.message}`,
      });
    }
  };

  // Función para eliminar un bien faltante
  const handleDelete = async (id: number) => {
    try {
      await deleteMissingGood(id); // Elimina el registro de la base de datos
      toast({
        title: 'Bien faltante eliminado',
        description: 'El registro se ha eliminado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Registra la acción de auditoría
      await logCustomAction({
        accion: "Eliminar Bien Faltante",
        detalles: `Se eliminó el bien faltante con ID: ${id}.`,
      });
      await fetchData(); // Recarga los datos para actualizar la tabla
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al eliminar registro',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Registra el error en la auditoría
      await logCustomAction({
        accion: "Error Eliminar Bien Faltante",
        detalles: `Fallo al eliminar el bien faltante con ID: ${id}. Error: ${error.message}`,
      });
    }
  };

  // Cuenta el número de filtros activos
  const activeFiltersCount = [
    searchQuery,
    filterDept !== 'all' ? filterDept : '',
    startDate,
    endDate,
  ].filter(Boolean).length;

  // Limpia todos los filtros aplicados
  const clearAllFilters = () => {
    setSearchQuery(''); // Limpia la consulta de búsqueda
    setFilterDept('all'); // Restablece el filtro de departamento
    setStartDate(''); // Limpia la fecha de inicio
    setEndDate(''); // Limpia la fecha de fin
    setCurrentPage(1); // Vuelve a la primera página
  };

  // Información de paginación para mostrar en la UI
  const startRow =
    filteredMissingGoods.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1; // Calcula el número de fila inicial
  const endRow = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredMissingGoods.length,
  ); // Calcula el número de fila final

  // Renderizado condicional: Muestra un spinner de carga si los datos están cargando
  if (loading) {
    return (
      <Box
        minH="100vh"
        bg={bgColor}
        pt={{ base: '130px', md: '80px', xl: '80px' }}
      >
        <Container maxW="7xl">
          <Center py={20}>
            <Stack align="center" spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Heading size="md" color={textColor}>
                Cargando bienes faltantes...
              </Heading>
            </Stack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Renderizado condicional: Muestra un mensaje de error si hubo un problema al cargar los datos
  if (error) {
    return (
      <Box
        minH="100vh"
        bg={bgColor}
        pt={{ base: '130px', md: '80px', xl: '80px' }}
      >
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
    );
  }

  // Renderizado principal del componente
  return (
    <Box
      minH="100vh"
      bg={bgColor}
      pt={{ base: '130px', md: '80px', xl: '80px' }}
    >
      <Container
        maxW="100vw"
        px={{ base: 2, md: 4 }}
        py={{ base: 2, md: 4 }}
        w="full"
      >
        {/* Sección del encabezado */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          mb={6}
        >
          <CardHeader>
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              justify="space-between"
              align={{ base: 'start', lg: 'center' }}
              gap={4}
            >
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <FiAlertTriangle size={24} color="orange" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Gestión de Bienes Faltantes
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Control y seguimiento de bienes reportados como faltantes en
                  el inventario
                </Box>
              </Box>

              <Button
                bgColor="type.primary"
                color="white"
                leftIcon={<FiPlus />}
                onClick={openAddDialog}
                size={buttonSize}
                boxShadow="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.2s"
                w={{ base: 'full', lg: 'auto' }}
                minW="200px"
              >
                Reportar Bien Faltante
              </Button>
            </Flex>
          </CardHeader>
        </Card>

        {/* Sección de filtros */}
        <Card
          bg={cardBg}
          shadow="md"
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          mb={6}
        >
          <CardBody p={6}>
            <Flex
              mb={4}
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={2}
            >
              <Flex align="center" gap={2}>
                <Icon as={FiFilter} color="blue.500" />
                <Text fontWeight="medium">Filtros de Busqueda</Text>
                {activeFiltersCount > 0 && (
                  <Badge
                    borderRadius="full"
                    px={2}
                    bg={badgeBg}
                    color={badgeColor}
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Flex>

              {activeFiltersCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  leftIcon={<FiX />}
                  onClick={clearAllFilters}
                >
                  Limpiar filtros
                </Button>
              )}
            </Flex>

            <Divider mb={4} />

            <Stack spacing={4}>
              {/* Filtro de búsqueda y departamento */}
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <InputGroup flex="2">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por funcionario, jefe, departamento, bien, identificación u observaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="md"
                  />
                </InputGroup>

                <Select
                  flex="1"
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  borderRadius="md"
                >
                  <option value="all">Todos los departamentos</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </Stack>

              {/* Filtros de fecha */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                align="flex-end"
              >
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Fecha desde
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiCalendar} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      borderRadius="md"
                      pl={10}
                    />
                  </InputGroup>
                </Box>

                <Box flex="1">
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Fecha hasta
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiCalendar} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      borderRadius="md"
                      pl={10}
                    />
                  </InputGroup>
                </Box>
              </Stack>
            </Stack>
          </CardBody>
        </Card>

        {/* Sección de contenido (tabla o tarjetas) */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
        >
          <CardBody p={6}>
            {/* Resumen de resultados */}
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="md" color={textColor} mb={1}>
                  Bienes Faltantes
                </Heading>
                <Box color="gray.600" fontSize="sm">
                  {filteredMissingGoods.length} registro
                  {filteredMissingGoods.length !== 1 ? 's' : ''} encontrado
                  {filteredMissingGoods.length !== 1 ? 's' : ''}
                </Box>
              </Box>
            </Flex>

            {/* Contenido de la tabla */}
            {filteredMissingGoods.length === 0 ? (
              <Center py={12}>
                <Stack align="center" spacing={4}>
                  <Box p={4} bg="gray.100" borderRadius="full">
                    <FiAlertTriangle size={32} color="gray" />
                  </Box>
                  <Box textAlign="center">
                    <Heading size="md" color="gray.500" mb={2}>
                      No hay bienes faltantes
                    </Heading>
                    <Box color="gray.400" fontSize="sm">
                      {activeFiltersCount > 0
                        ? 'No se encontraron registros que coincidan con los filtros'
                        : 'No hay bienes faltantes registrados'}
                    </Box>
                  </Box>
                </Stack>
              </Center>
            ) : (
              <>
                {!isMobile ? (
                  <DesktopTable
                    missingGoods={paginatedGoods}
                    borderColor={borderColor}
                    headerBg={headerBg}
                    hoverBg={hoverBg}
                    tableSize={tableSize}
                    onViewDetails={openDetailsDialog} // Usa la función para ver detalles
                    onExportBM3={handleExportBM3}
                  />
                ) : (
                  <MobileCard
                    missingGoods={paginatedGoods}
                    borderColor={borderColor}
                    departments={departments}
                    onViewDetails={openDetailsDialog} // Usa la función para ver detalles
                    onExportBM3={handleExportBM3}
                  />
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <Flex justify="space-between" align="center" mt={4}>
                    <Text color="gray.600" fontSize="sm">
                      Mostrando {startRow}-{endRow} de{' '}
                      {filteredMissingGoods.length} registros
                    </Text>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        isDisabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Anterior
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          size="sm"
                          bgColor={
                            currentPage === i + 1 ? 'type.primary' : undefined
                          }
                          color={currentPage === i + 1 ? 'white' : undefined}
                          variant={currentPage === i + 1 ? 'solid' : 'outline'}
                          colorScheme="blue"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        isDisabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Siguiente
                      </Button>
                    </HStack>
                  </Flex>
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Modal del formulario (Agregar/Editar) */}
        <ReportForm
          assets={assets}
          isOpen={isOpen}
          onClose={onClose}
          selectedMissingGood={selectedMissingGood}
          newMissingGood={newMissingGood}
          setNewMissingGood={setNewMissingGood}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          isMobile={isMobile || false}
          departments={departments}
          missingGoods={missingGoods}
        />

        {/* Modal de detalles */}
        <ReportDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={onDetailsModalClose}
          missingGood={selectedMissingGoodForDetails}
          onRecover={handleRecoverMissingGood} // Pasa la función de recuperar
        />
      </Container>
    </Box>
  );
}
