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
import DesktopTable from './components/DesktopTable'; // Importar DesktopTable
import MobileCard from './components/MobileCard';
import ReportDetailsModal from './components/ReportDetailsModal'; // Importar el nuevo componente de detalles
import { getAssets, type MovableAsset, updateAsset } from 'api/AssetsApi'; // Importar updateAsset
import { exportBM3ByMissingGoodsId } from './utils/ReportExcel'; // Importar la función de exportación BM3
import { createDisposalForMissingGood } from './utils/ReportUtils'; // Importar la función para crear desincorporación
import { logCustomAction } from 'views/admin/audit/utils/AuditUtils'; // Importar la función de auditoría

const ITEMS_PER_PAGE = 10;

export default function MissingGoodsTable() {
  const [missingGoods, setMissingGoods] = useState<MissingGoods[]>([]);
  const [filteredMissingGoods, setFilteredMissingGoods] = useState<
    MissingGoods[]
  >([]);
  const [selectedMissingGood, setSelectedMissingGood] =
    useState<MissingGoods | null>(null); // Para el formulario de edición/adición
  const [selectedMissingGoodForDetails, setSelectedMissingGoodForDetails] =
    useState<MissingGoods | null>(null); // Para el modal de detalles
  const [newMissingGood, setNewMissingGood] = useState<Partial<MissingGoods>>(
    {},
  );
  const [filterDept, setFilterDept] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Para el formulario de edición/adición
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure(); // Para el modal de detalles
  const [departments, setDepartments] = useState<Department[]>([]);
  const [assets, setAssets] = useState<MovableAsset[]>([]);
  const toast = useToast();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const badgeBg = useColorModeValue('blue.50', 'blue.900');
  const badgeColor = useColorModeValue('blue.600', 'blue.200');

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  // Función para cargar los datos de bienes faltantes
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, deptData, assetsData] = await Promise.all([
        getMissingGoods(),
        getDepartments(),
        getAssets(),
      ]);
      setDepartments(deptData);
      setMissingGoods(data);
      setAssets(assetsData);
    } catch (error) {
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments for filter
  const departmentOptions = useMemo(() => {
    return [...new Set(missingGoods.map((good) => good.departamento).filter(Boolean))].sort();
  }, [missingGoods]);

  // Apply filters
  useEffect(() => {
    let filtered = [...missingGoods];

    // Search filter
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

    // Department filter
    if (filterDept !== 'all') {
      filtered = filtered.filter((good) => good.departamento === filterDept);
    }

    // Date filter
    if (startDate) {
      filtered = filtered.filter(
        (good) => new Date(good.fecha) >= new Date(startDate),
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (good) => new Date(good.fecha) <= new Date(endDate),
      );
    }

    setFilteredMissingGoods(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [missingGoods, searchQuery, filterDept, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredMissingGoods.length / ITEMS_PER_PAGE);

  const paginatedGoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMissingGoods.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMissingGoods, currentPage]);

  // Reset page if out of range
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const openEditDialog = (mg: MissingGoods) => {
    setSelectedMissingGood(mg);
    setNewMissingGood(mg);
    onOpen(); // Abre el modal del formulario
  };

  const openAddDialog = () => {
    setSelectedMissingGood(null);
    setNewMissingGood({});
    onOpen(); // Abre el modal del formulario
  };

  const openDetailsDialog = (mg: MissingGoods) => {
    setSelectedMissingGoodForDetails(mg);
    onDetailsModalOpen(); // Abre el modal de detalles
  };

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

      // 1. Eliminar el registro de bien faltante
      await deleteMissingGood(missingGood.id);

      // 2. Actualizar el estado del bien a "Activo" y el isActive a 1
      // Solo actualizar el isActive a 1
      const updateData = {
        isActive: 1
      } as MovableAsset;
      await updateAsset(missingGood.bien_id, updateData);

      // 3. Actualizar el estado local de missingGoods
      setMissingGoods((prev) => prev.filter((item) => item.id !== missingGood.id));

      toast({
        title: 'Bien recuperado',
        description: `El bien ${missingGood.numero_identificacion} ha sido marcado como recuperado y el reporte eliminado.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDetailsModalClose(); // Cierra el modal de detalles
      await logCustomAction({
        accion: "Recuperar Bien Faltante",
        detalles: `Se recuperó el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}).`,
      });
    } catch (error: any) {
      console.error("Error al recuperar el bien faltante:", error);
      toast({
        title: 'Error',
        description: `No se pudo recuperar el bien faltante. Error: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      await logCustomAction({
        accion: "Error Recuperar Bien Faltante",
        detalles: `Fallo al recuperar el bien faltante con ID: ${missingGood.id}. Error: ${error.message}`,
      });
    }
  };

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

      await exportBM3ByMissingGoodsId(
        missingGood.id,
        missingGood.funcionario_id, // Usar funcionario_id
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
      await logCustomAction({
        accion: "Exportar Reporte BM3",
        detalles: `Se exportó el reporte BM3 para el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}).`,
      });
    } catch (error: any) { // Tipar error como any
      toast({
        title: "Error de exportación",
        description: `No se pudo generar el archivo BM3 para el bien ${missingGood.numero_identificacion}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error exporting BM3:", error);
      await logCustomAction({
        accion: "Error Exportar Reporte BM3",
        detalles: `Fallo al exportar el reporte BM3 para el bien faltante con ID: ${missingGood.id} (${missingGood.numero_identificacion}). Error: ${error.message}`,
      });
    }
  };

  // Crear bien faltante
  const handleAdd = async (mgData?: Partial<MissingGoods>) => {
    try {
      if (!mgData) return;
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
      };
      const created = await createMissingGood(payload as any);
      setMissingGoods((prev) => [created, ...prev]);

      // Actualizar el isActive del bien a 0 (inactivo)
      try {
        await updateAsset(Number(mgData.bien_id), { isActive: 0 } as MovableAsset);
        console.log(`Bien con ID ${mgData.bien_id} marcado como inactivo (isActive: 0)`);
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

      // Crear desincorporación automáticamente
      try {
        await createDisposalForMissingGood(created);
        toast({
          title: 'Desincorporación creada',
          description: 'Se ha creado una desincorporación para el bien faltante.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        await logCustomAction({
          accion: "Crear Bien Faltante y Desincorporación",
          detalles: `Se creó el bien faltante con ID: ${created.id} (${created.numero_identificacion}) y su desincorporación asociada.`,
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
        await logCustomAction({
          accion: "Error Crear Desincorporación por Bien Faltante",
          detalles: `El bien faltante con ID: ${created.id} (${created.numero_identificacion}) se agregó, pero falló la creación de la desincorporación. Error: ${disposalError.message}`,
        });
      }

      toast({
        title: 'Bien faltante agregado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) { // Tipar error como any
      toast({
        title: 'Error',
        description: 'No se pudo agregar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      await logCustomAction({
        accion: "Error Crear Bien Faltante",
        detalles: `Fallo al agregar el bien faltante. Error: ${error.message}`,
      });
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedMissingGood || !newMissingGood) return;
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
      const updated = await updateMissingGood(
        selectedMissingGood.id,
        payload as any,
      );
      setMissingGoods((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast({
        title: 'Bien faltante actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      await logCustomAction({
        accion: "Editar Bien Faltante",
        detalles: `Se editó el bien faltante con ID: ${updated.id} (${updated.numero_identificacion}).`,
      });
    } catch (error: any) { // Tipar error como any
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      await logCustomAction({
        accion: "Error Editar Bien Faltante",
        detalles: `Fallo al editar el bien faltante con ID: ${selectedMissingGood?.id}. Error: ${error.message}`,
      });
    }
  };

  // Eliminar bien faltante
  const handleDelete = async (id: number) => {
    try {
      await deleteMissingGood(id);
      setMissingGoods((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Bien faltante eliminado',
        description: 'El registro se ha eliminado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await logCustomAction({
        accion: "Eliminar Bien Faltante",
        detalles: `Se eliminó el bien faltante con ID: ${id}.`,
      });
    } catch (error: any) { // Tipar error como any
      toast({
        title: 'Error',
        description: 'Error al eliminar registro',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      await logCustomAction({
        accion: "Error Eliminar Bien Faltante",
        detalles: `Fallo al eliminar el bien faltante con ID: ${id}. Error: ${error.message}`,
      });
    }
  };

  // Count active filters
  const activeFiltersCount = [
    searchQuery,
    filterDept !== 'all' ? filterDept : '',
    startDate,
    endDate,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterDept('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Pagination info
  const startRow =
    filteredMissingGoods.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRow = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredMissingGoods.length,
  );

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
        {/* Header Section */}
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

        {/* Filters Section */}
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
                <Text fontWeight="medium">Filtros de Bรบsqueda</Text>
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
              {/* Search and Department Filter */}
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <InputGroup flex="2">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por funcionario, jefe, departamento, bien, identificaciรณn u observaciones..."
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

              {/* Date Filters */}
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

        {/* Content Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
        >
          <CardBody p={6}>
            {/* Results Summary */}
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

            {/* Table Content */}
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
                    onViewDetails={openDetailsDialog} // Usar la nueva función para ver detalles
                    onExportBM3={handleExportBM3}
                  />
                ) : (
                  <MobileCard
                    missingGoods={paginatedGoods}
                    borderColor={borderColor}
                    departments={departments}
                    onViewDetails={openDetailsDialog} // Usar la nueva función para ver detalles
                    onExportBM3={handleExportBM3}
                  />
                )}

                {/* Pagination */}
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

        {/* Form Modal (Add/Edit) */}
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

        {/* Details Modal */}
        <ReportDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={onDetailsModalClose}
          missingGood={selectedMissingGoodForDetails}
          onRecover={handleRecoverMissingGood} // Pasar la función de recuperar
        />
      </Container>
    </Box>
  );
}
