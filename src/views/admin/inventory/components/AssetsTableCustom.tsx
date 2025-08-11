'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Box,
  Text,
  Checkbox,
  Flex,
  HStack,
  VStack,
  IconButton,
  Badge,
  Card,
  CardBody,
  useBreakpointValue,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Divider,
  Tooltip,
  Wrap,
  WrapItem,
  Stack,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiCheck,
  FiX,
  FiPackage,
} from 'react-icons/fi';
import type { MovableAsset } from 'api/AssetsApi';
import type { Department, SubGroup } from 'api/SettingsApi';

interface AssetsTableCustomProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MovableAsset[];
  departments: Department[];
  subgroups: SubGroup[];
  mode: 'all' | 'department';
  onSelect: (selectedAssets: MovableAsset[]) => void;
  departmentId?: number;
  excludedAssetIds?: number[];
  selectedConceptId?: number; // Nuevo prop para el ID del concepto seleccionado
  incorporatedAssetIdsForInitialInventory?: number[]; // Nuevo prop para bienes ya incorporados con concepto 01
}

export const AssetsTableCustom: React.FC<AssetsTableCustomProps> = ({
  isOpen,
  onClose,
  assets = [],
  departments = [],
  subgroups = [],
  mode,
  onSelect,
  departmentId,
  excludedAssetIds = [],
  selectedConceptId, // Recibir el nuevo prop
  incorporatedAssetIdsForInitialInventory = [], // Recibir el nuevo prop
}) => {
  const [searchId, setSearchId] = useState('');
  const [searchDept, setSearchDept] = useState('all');
  const [searchSubgroup, setSearchSubgroup] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const modalSize = useBreakpointValue({
    base: 'full',
    sm: 'xl',
    md: '4xl',
    lg: '6xl',
    xl: '7xl',
  });

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const selectedBg = useColorModeValue('purple.50', 'purple.900');
  const headerBg = useColorModeValue('gray.50', 'gray.800');

  const filteredAssets = useMemo(() => {
    const filtered = assets.filter((asset) => {
      // Excluir bienes que ya están en la selección actual (si aplica)
      if (excludedAssetIds.includes(asset.id)) return false;

      // Si el concepto es "Inventario Inicial" (código 01) y el bien ya está incorporado con ese concepto, excluirlo
      // Asumo que el concepto "Inventario Inicial" tiene un ID específico, por ejemplo, 1.
      // Si el ID es diferente, se debe ajustar aquí.
      const INVENTARIO_INICIAL_CONCEPT_ID = 1; // Asume que el ID del concepto "Inventario Inicial" es 1
      if (
        selectedConceptId === INVENTARIO_INICIAL_CONCEPT_ID &&
        incorporatedAssetIdsForInitialInventory.includes(asset.id)
      ) {
        return false;
      }

      const matchesId =
        searchId.trim() === '' ||
        asset.numero_identificacion
          ?.toLowerCase()
          .includes(searchId.toLowerCase());

      const matchesDept =
        mode === 'department'
          ? String(asset.dept_id) === String(departmentId)
          : searchDept === 'all' ||
            String(asset.dept_id) === String(searchDept);

      const matchesSubgroup =
        searchSubgroup === 'all' ||
        String(asset.subgrupo_id) === String(searchSubgroup);

      return matchesId && matchesDept && matchesSubgroup;
    });

    // Ordenar por ID descendente (más recientes primero)
    return filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [
    assets,
    mode,
    departmentId,
    searchId,
    searchDept,
    searchSubgroup,
    excludedAssetIds,
    selectedConceptId, // Añadir al array de dependencias
    incorporatedAssetIdsForInitialInventory, // Añadir al array de dependencias
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  const handleCheck = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (currentAssets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentAssets.some((a) => a.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentAssets.filter((a) => !prev.includes(a.id)).map((a) => a.id),
      ]);
    }
  };

  const handleSelectAllFiltered = () => {
    if (filteredAssets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredAssets.some((a) => a.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...filteredAssets.filter((a) => !prev.includes(a.id)).map((a) => a.id),
      ]);
    }
  };

  const handleDone = () => {
    const selectedAssets = assets.filter((a) => selectedIds.includes(a.id));
    onSelect(selectedAssets);
    setSelectedIds([]);
    onClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchId('');
    setSearchDept('all');
    setSearchSubgroup('all');
    setCurrentPage(1);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleClose = () => {
    setSelectedIds([]);
    setCurrentPage(1);
    onClose();
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return 'N/A';
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Mobile card component
  const MobileAssetCard = ({ asset }: { asset: MovableAsset }) => {
    const isSelected = selectedIds.includes(asset.id);

    return (
      <Card
        variant="outline"
        bg={isSelected ? selectedBg : cardBg}
        borderColor={isSelected ? 'purple.300' : borderColor}
        borderWidth={isSelected ? '2px' : '1px'}
        _hover={{ bg: isSelected ? selectedBg : hoverBg }}
        cursor="pointer"
        onClick={() => handleCheck(asset.id)}
        transition="all 0.2s"
        w="full"
      >
        <CardBody p={3}>
          <Flex justify="space-between" align="start" mb={3}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => handleCheck(asset.id)}
              colorScheme="purple"
              size="md"
              onClick={(e) => e.stopPropagation()}
            />
            {isSelected && (
              <Badge colorScheme="purple" variant="solid" fontSize="xs">
                Seleccionado
              </Badge>
            )}
          </Flex>

          <VStack align="start" spacing={2} w="full">
            <Box w="full">
              <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                N° IDENTIFICACIÓN
              </Text>
              <Text fontSize="sm" fontWeight="bold" wordBreak="break-word">
                {asset.numero_identificacion}
              </Text>
            </Box>

            <Box w="full">
              <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                DESCRIPCIÓN
              </Text>
              <Text fontSize="sm" wordBreak="break-word" lineHeight="1.3">
                {truncateText(asset.nombre_descripcion, 100)}
              </Text>
              {asset.nombre_descripcion &&
                asset.nombre_descripcion.length > 100 && (
                  <Tooltip label={asset.nombre_descripcion} placement="top">
                    <Text fontSize="xs" color="purple.500" cursor="help" mt={1}>
                      Ver completo
                    </Text>
                  </Tooltip>
                )}
            </Box>

            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={3}
              w="full"
            >
              <Box flex="1" minW="0">
                <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                  DEPARTAMENTO
                </Text>
                <Text fontSize="sm" wordBreak="break-word">
                  {truncateText(asset.dept_nombre || 'N/A', 30)}
                </Text>
              </Box>

              <Box flex="1" minW="0">
                <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                  SUBGRUPO
                </Text>
                <Text fontSize="sm" wordBreak="break-word">
                  {truncateText(asset.subgrupo_nombre || 'N/A', 30)}
                </Text>
              </Box>
            </Stack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={modalSize}
      isCentered={!isMobile}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        maxH={isMobile ? '100vh' : '90vh'}
        mx={isMobile ? 0 : 4}
        my={isMobile ? 0 : 4}
        borderRadius={isMobile ? 0 : 'lg'}
      >
        <ModalHeader
          pb={2}
          position="sticky"
          top={0}
          bg={cardBg}
          zIndex={1}
          borderRadius={isMobile ? 0 : 'lg lg 0 0'}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack spacing={2} minW="0" flex="1">
              <FiPackage />
              <Text
                fontSize={isMobile ? 'lg' : 'xl'}
                fontWeight="bold"
                noOfLines={1}
              >
                Seleccionar Bienes
              </Text>
            </HStack>
            <Badge
              colorScheme="purple"
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              flexShrink={0}
            >
              {selectedIds.length} seleccionados
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6} px={isMobile ? 3 : 6}>
          {/* Filtros */}
          <Card variant="outline" mb={4}>
            <CardBody p={isMobile ? 3 : 4}>
              <Flex
                align="center"
                justify="space-between"
                mb={3}
                wrap="wrap"
                gap={2}
              >
                <HStack spacing={2}>
                  <FiFilter />
                  <Text fontWeight="medium" fontSize="sm">
                    Filtros de Búsqueda
                  </Text>
                </HStack>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={clearFilters}
                  leftIcon={<FiX />}
                >
                  Limpiar
                </Button>
              </Flex>

              <VStack spacing={3} align="stretch">
                <InputGroup size="sm">
                  <InputLeftElement>
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por número de identificación..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </InputGroup>

                <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                  {mode === 'all' && (
                    <Select
                      size="sm"
                      value={searchDept}
                      onChange={(e) => setSearchDept(e.target.value)}
                      flex="1"
                    >
                      <option value="all">Todos los departamentos</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={String(dept.id)}>
                          {dept.nombre}
                        </option>
                      ))}
                    </Select>
                  )}

                  <Select
                    size="sm"
                    value={searchSubgroup}
                    onChange={(e) => setSearchSubgroup(e.target.value)}
                    flex="1"
                  >
                    <option value="all">Todos los subgrupos</option>
                    {subgroups.map((sg) => (
                      <option key={sg.id} value={String(sg.id)}>
                        {sg.nombre}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </VStack>
            </CardBody>
          </Card>

          {/* Controles de selección */}
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            wrap="wrap"
            gap={2}
          >
            <HStack spacing={2} wrap="wrap">
              <Text fontSize="sm" color="gray.600">
                {filteredAssets.length} bienes encontrados
              </Text>
              {filteredAssets.length > 0 && (
                <>
                  <Divider
                    orientation="vertical"
                    h="20px"
                    display={{ base: 'none', sm: 'block' }}
                  />
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleSelectAllFiltered}
                    leftIcon={<FiCheck />}
                  >
                    {filteredAssets.every((a) => selectedIds.includes(a.id))
                      ? 'Deseleccionar todos'
                      : 'Seleccionar todos'}
                  </Button>
                </>
              )}
            </HStack>

            {selectedIds.length > 0 && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={clearSelection}
                leftIcon={<FiX />}
              >
                Limpiar selección
              </Button>
            )}
          </Flex>

          {/* Contenido principal */}
          <Box>
            {filteredAssets.length === 0 ? (
              <Card variant="outline">
                <CardBody py={12} textAlign="center">
                  <VStack spacing={3}>
                    <FiPackage size={40} color="gray.400" />
                    <Text color="gray.500" fontWeight="medium">
                      No hay bienes que coincidan con los filtros
                    </Text>
                    <Button size="sm" variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Vista móvil y tablet */}
                {isMobile || isTablet ? (
                  <VStack spacing={3} align="stretch">
                    {currentAssets.map((asset) => (
                      <MobileAssetCard key={asset.id} asset={asset} />
                    ))}
                  </VStack>
                ) : (
                  /* Vista de escritorio */
                  <Card variant="outline">
                    <Box overflowX="auto" maxW="100%">
                      <Table variant="simple" size="sm">
                        <Thead
                          bg={headerBg}
                          position="sticky"
                          top={0}
                          zIndex={1}
                        >
                          <Tr>
                            <Th w="50px" minW="50px">
                              <Checkbox
                                isChecked={
                                  currentAssets.length > 0 &&
                                  currentAssets.every((a) =>
                                    selectedIds.includes(a.id),
                                  )
                                }
                                isIndeterminate={
                                  currentAssets.some((a) =>
                                    selectedIds.includes(a.id),
                                  ) &&
                                  !currentAssets.every((a) =>
                                    selectedIds.includes(a.id),
                                  )
                                }
                                onChange={handleSelectAll}
                                colorScheme="purple"
                              />
                            </Th>
                            <Th minW="120px">N° Identificación</Th>
                            <Th minW="200px" maxW="300px">
                              Descripción
                            </Th>
                            <Th minW="120px" maxW="180px">
                              Departamento
                            </Th>
                            <Th minW="120px" maxW="180px">
                              Subgrupo
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentAssets.map((asset) => {
                            const isSelected = selectedIds.includes(asset.id);
                            return (
                              <Tr
                                key={asset.id}
                                bg={isSelected ? selectedBg : 'transparent'}
                                _hover={{
                                  bg: isSelected ? selectedBg : hoverBg,
                                }}
                                cursor="pointer"
                                onClick={() => handleCheck(asset.id)}
                                transition="background 0.2s"
                              >
                                <Td>
                                  <Checkbox
                                    isChecked={isSelected}
                                    onChange={() => handleCheck(asset.id)}
                                    colorScheme="purple"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Td>
                                <Td
                                  fontWeight={isSelected ? 'bold' : 'normal'}
                                  wordBreak="break-word"
                                >
                                  {asset.numero_identificacion}
                                </Td>
                                <Td maxW="300px">
                                  <Tooltip
                                    label={asset.nombre_descripcion}
                                    placement="top"
                                    isDisabled={
                                      !asset.nombre_descripcion ||
                                      asset.nombre_descripcion.length <= 80
                                    }
                                  >
                                    <Text
                                      fontWeight={
                                        isSelected ? 'medium' : 'normal'
                                      }
                                      wordBreak="break-word"
                                      lineHeight="1.3"
                                    >
                                      {truncateText(
                                        asset.nombre_descripcion,
                                        80,
                                      )}
                                    </Text>
                                  </Tooltip>
                                </Td>
                                <Td maxW="180px">
                                  <Tooltip
                                    label={asset.dept_nombre}
                                    placement="top"
                                    isDisabled={
                                      !asset.dept_nombre ||
                                      asset.dept_nombre.length <= 25
                                    }
                                  >
                                    <Text wordBreak="break-word">
                                      {truncateText(
                                        asset.dept_nombre || 'N/A',
                                        25,
                                      )}
                                    </Text>
                                  </Tooltip>
                                </Td>
                                <Td maxW="180px">
                                  <Tooltip
                                    label={asset.subgrupo_nombre}
                                    placement="top"
                                    isDisabled={
                                      !asset.subgrupo_nombre ||
                                      asset.subgrupo_nombre.length <= 25
                                    }
                                  >
                                    <Text wordBreak="break-word">
                                      {truncateText(
                                        asset.subgrupo_nombre || 'N/A',
                                        25,
                                      )}
                                    </Text>
                                  </Tooltip>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  </Card>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <Flex
                    justify="space-between"
                    align="center"
                    mt={4}
                    wrap="wrap"
                    gap={2}
                  >
                    <HStack spacing={2} wrap="wrap">
                      <Text fontSize="sm" color="gray.600">
                        Página {currentPage} de {totalPages}
                      </Text>
                      <Select
                        size="sm"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        w="auto"
                        minW="80px"
                      >
                        <option value={5}>5</option>
                      </Select>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        display={{ base: 'none', sm: 'block' }}
                      >
                        por página
                      </Text>
                    </HStack>

                    <Wrap spacing={1} justify="center">
                      <WrapItem>
                        <Tooltip label="Página anterior">
                          <IconButton
                            aria-label="Página anterior"
                            icon={<FiChevronLeft />}
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            onClick={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                          />
                        </Tooltip>
                      </WrapItem>

                      {/* Números de página */}
                      {Array.from(
                        { length: Math.min(isMobile ? 3 : 5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          const maxPages = isMobile ? 3 : 5;
                          if (totalPages <= maxPages) {
                            pageNumber = i + 1;
                          } else if (currentPage <= Math.ceil(maxPages / 2)) {
                            pageNumber = i + 1;
                          } else if (
                            currentPage >=
                            totalPages - Math.floor(maxPages / 2)
                          ) {
                            pageNumber = totalPages - maxPages + 1 + i;
                          } else {
                            pageNumber =
                              currentPage - Math.floor(maxPages / 2) + i;
                          }

                          if (pageNumber > 0 && pageNumber <= totalPages) {
                            return (
                              <WrapItem key={pageNumber}>
                                <Button
                                  size="sm"
                                  variant={
                                    currentPage === pageNumber
                                      ? 'solid'
                                      : 'outline'
                                  }
                                  colorScheme={
                                    currentPage === pageNumber
                                      ? 'purple'
                                      : 'gray'
                                  }
                                  onClick={() => handlePageChange(pageNumber)}
                                  minW="40px"
                                >
                                  {pageNumber}
                                </Button>
                              </WrapItem>
                            );
                          }
                          return null;
                        },
                      )}

                      <WrapItem>
                        <Tooltip label="Página siguiente">
                          <IconButton
                            aria-label="Página siguiente"
                            icon={<FiChevronRight />}
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            onClick={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                          />
                        </Tooltip>
                      </WrapItem>
                    </Wrap>
                  </Flex>
                )}
              </>
            )}
          </Box>

          {/* Botones de acción */}
          <Flex
            justify="space-between"
            align="center"
            mt={6}
            pt={4}
            borderTop="1px"
            borderColor={borderColor}
            position="sticky"
            bottom={0}
            bg={cardBg}
            mx={-6}
            px={6}
            wrap="wrap"
            gap={3}
          >
            <Text fontSize="sm" color="gray.600" minW="0">
              {selectedIds.length} bienes seleccionados
            </Text>

            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={handleClose}
                size={isMobile ? 'sm' : 'md'}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleDone}
                isDisabled={selectedIds.length === 0}
                leftIcon={<FiCheck />}
                size={isMobile ? 'sm' : 'md'}
              >
                Confirmar Selección
              </Button>
            </HStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssetsTableCustom;
