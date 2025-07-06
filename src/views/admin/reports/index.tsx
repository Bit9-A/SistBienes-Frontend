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
import MobileCard from './components/MobileCard';
import { getAssets, type MovableAsset } from 'api/AssetsApi';

const ITEMS_PER_PAGE = 10;

export default function MissingGoodsTable() {
  const [missingGoods, setMissingGoods] = useState<MissingGoods[]>([]);
  const [filteredMissingGoods, setFilteredMissingGoods] = useState<
    MissingGoods[]
  >([]);
  const [selectedMissingGood, setSelectedMissingGood] =
    useState<MissingGoods | null>(null);
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  // Get unique departments for filter
  const departmentOptions = [
    ...new Set(missingGoods.map((good) => good.departamento).filter(Boolean)),
  ].sort();

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
    fetchData();
  }, []);

  const openEditDialog = (mg: MissingGoods) => {
    setSelectedMissingGood(mg);
    setNewMissingGood(mg);
    onOpen();
  };

  const openAddDialog = () => {
    setSelectedMissingGood(null);
    setNewMissingGood({});
    onOpen();
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
      toast({
        title: 'Bien faltante agregado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el bien faltante',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar registro',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
                <Text fontWeight="medium">Filtros de Búsqueda</Text>
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
                  <Box>
                    <Box
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      boxShadow="sm"
                      overflow="auto"
                      mb={4}
                    >
                      <Box as="table" w="100%">
                        <Box as="thead" bg={headerBg}>
                          <Box as="tr">
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              N°
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Bien
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Departamento
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Existencias
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Diferencia Cantidad
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Diferencia Valor
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Funcionario
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="left"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Fecha
                            </Box>
                            <Box
                              as="th"
                              p={3}
                              textAlign="center"
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              Acciones
                            </Box>
                          </Box>
                        </Box>
                        <Box as="tbody">
                          {paginatedGoods
                            .filter(
                              (item) => item && typeof item.id !== 'undefined',
                            )
                            .map((good, index) => (
                              <Box
                                key={uuidv4()}
                                as="tr"
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                              >
                                <Box as="td" p={3}>
                                  <Text fontSize="sm" color={textColor}>
                                    {(currentPage - 1) * ITEMS_PER_PAGE +
                                      index +
                                      1}
                                  </Text>
                                </Box>
                                <Box as="td" p={3}>
                                  <Text fontSize="sm" color={textColor}>
                                    {good.numero_identificacion}
                                  </Text>
                                </Box>
                                <Box as="td" p={3}>
                                  <Badge variant="outline" colorScheme="blue">
                                    {good.departamento}
                                  </Badge>
                                </Box>
                                <Box as="td" p={3}>
                                  <Text fontSize="sm" color={textColor}>
                                    {good.existencias}
                                  </Text>
                                </Box>
                                <Box as="td" p={3}>
                                  <Badge
                                    colorScheme={
                                      good.diferencia_cantidad > 0
                                        ? 'red'
                                        : 'green'
                                    }
                                    variant="subtle"
                                  >
                                    {good.diferencia_cantidad}
                                  </Badge>
                                </Box>
                                <Box as="td" p={3}>
                                  <Text fontSize="sm" color={textColor}>
                                    {Number(good.diferencia_valor).toFixed(2)}
                                  </Text>
                                </Box>
                                <Box as="td" p={3}>
                                  <Flex align="center" gap={2}>
                                    <Icon as={FiUsers} color="gray.500" />
                                    <Text fontSize="sm" color={textColor}>
                                      {good.funcionario_nombre}
                                    </Text>
                                  </Flex>
                                </Box>
                                <Box as="td" p={3}>
                                  <Text fontSize="sm" color={textColor}>
                                    {new Date(good.fecha).toLocaleDateString(
                                      'es-ES',
                                    )}
                                  </Text>
                                </Box>
                                <Box as="td" p={3}>
                                  <Flex justify="center" gap={2}>
                                    <IconButton
                                      aria-label="Editar Reporte"
                                      size="sm"
                                      icon={<FiEdit />}
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() => openEditDialog(good)}
                                    />
                                    <IconButton
                                      aria-label="Eliminar Reporte"
                                      size="sm"
                                      icon={<FiTrash2 />}
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => handleDelete(good.id)}
                                    />
                                  </Flex>
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <MobileCard
                    missingGoods={paginatedGoods}
                    borderColor={borderColor}
                    departments={departments}
                    onEdit={openEditDialog}
                    onDelete={handleDelete}
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

        {/* Form Modal */}
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
      </Container>
    </Box>
  );
}
