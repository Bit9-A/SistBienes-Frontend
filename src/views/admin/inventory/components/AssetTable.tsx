'use client';

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  Badge,
  Tooltip,
  Spinner,
  useBreakpointValue,
  VStack,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import {
  getComponentsByBienId,
  Component as ComponentApi,
} from 'api/ComponentsApi';

interface AssetTableProps {
  assets: any[];
  onEdit: (asset: any) => void;
  onDelete: (asset: any) => void;
  isLoading?: boolean;
  userProfile?: any; // <-- agrega esto
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onEdit,
  onDelete,
  isLoading = false,
  userProfile = null, // <-- agrega esto
}) => {
  // Colores del tema
  const isAdminOrBienes =
    userProfile?.tipo_usuario === 1 || userProfile?.dept_nombre === 'Bienes';
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const rowDividerColor = useColorModeValue('gray.300', 'gray.600');

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(assets.length / itemsPerPage);

  // Calcular los elementos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);
  const [canFilterByDept, setCanFilterByDept] = useState(false);

  // Cambiar de página
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Formatear valores monetarios
  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return 'N/A';

    const numValue =
      typeof value === 'string' ? Number.parseFloat(value) : value;

    if (isNaN(numValue)) return 'N/A';

    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
    }).format(numValue);
  };

  // Formatear fechas
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return 'N/A';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    return new Intl.DateTimeFormat('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  // Obtener el nombre del estado según su ID
  const getStatusName = (
    statusId: string | number | undefined,
  ): { name: string; className: string } => {
    if (!statusId) return { name: 'Sin estado', className: '' };

    switch (statusId.toString()) {
      case '1':
        return { name: 'Nuevo', className: 'new' };
      case '2':
        return { name: 'Usado', className: 'used' };
      case '3':
        return { name: 'Dañado', className: 'damaged' };
      default:
        return { name: 'Sin estado', className: '' };
    }
  };

  // Determinar si mostrar vista móvil o de escritorio
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Estado para los componentes de cada bien
  const [componentsByAsset, setComponentsByAsset] = useState<{
    [key: number]: ComponentApi[];
  }>({});

  // Cargar componentes solo para los bienes que son computadoras
  useEffect(() => {
    const fetchComponents = async () => {
      const computers = assets.filter((a) => a.isComputer === 1 && a.id);
      const promises = computers.map(async (asset) => {
        try {
          const comps = await getComponentsByBienId(asset.id);
          return { id: asset.id, comps };
        } catch {
          return { id: asset.id, comps: [] };
        }
      });
      const results = await Promise.all(promises);
      const map: { [key: number]: ComponentApi[] } = {};
      results.forEach(({ id, comps }) => {
        map[id] = comps;
      });
      setComponentsByAsset(map);
    };
    if (assets && assets.length > 0) {
      fetchComponents();
    }
  }, [assets]);

  // Renderizar componente de carga
  if (isLoading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="xl" color="type.primary" />
        <Text mt={4}>Cargando bienes...</Text>
      </Box>
    );
  }

  // Renderizar mensaje cuando no hay datos
  if (!assets || assets.length === 0) {
    return (
      <Box py={12} textAlign="center">
        <Box mb={2}>
          <FiDatabase size={40} />
        </Box>
        <Text fontWeight="bold">No hay bienes registrados</Text>
        <Text color="gray.500">Agregue nuevos bienes para verlos aquí</Text>
      </Box>
    );
  }

  // Renderizar vista móvil
  if (isMobile) {
    return (
      <Box>
        <VStack spacing={4}>
          {currentItems.map((asset) => (
            <Card key={uuidv4()} width="100%">
              <CardHeader pb={2}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>{asset.numero_identificacion}</Text>
                  <HStack spacing={2}>
                    {isAdminOrBienes && (
                      <>
                        <Tooltip label="Editar" placement="top" hasArrow>
                          <IconButton
                            aria-label="Editar bien"
                            colorScheme="blue"
                            icon={<FiEdit />}
                            size="sm"
                            onClick={() => onEdit(asset)}
                          />
                        </Tooltip>
                        <Tooltip label="Eliminar" placement="top" hasArrow>
                          <IconButton
                            colorScheme="red"
                            aria-label="Eliminar bien"
                            icon={<FiTrash2 />}
                            size="sm"
                            onClick={() => onDelete(asset)}
                          />
                        </Tooltip>
                      </>
                    )}
                  </HStack>
                </Flex>
                {asset.id_estado && (
                  <Badge mt={2}>{getStatusName(asset.id_estado).name}</Badge>
                )}
              </CardHeader>
              <CardBody pt={0}>
                <SimpleGrid columns={2} spacing={3}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Descripción
                    </Text>
                    <Text>
                      {asset.nombre_descripcion}
                      {asset.isComputer === 1 &&
                        componentsByAsset[asset.id] &&
                        componentsByAsset[asset.id].length > 0 && (
                          <>
                            {' ('}
                            {componentsByAsset[asset.id]
                              .map(
                                (comp) =>
                                  `${comp.nombre} SN: ${
                                    comp.numero_serial
                                      ? comp.numero_serial
                                      : 'Sin serial'
                                  }`,
                              )
                              .join(', ')}
                            {')'}
                          </>
                        )}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Serial
                    </Text>
                    <Text>{asset.numero_serial || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Departamento
                    </Text>
                    <Text>{asset.dept_nombre || 'Sin Departamento'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Marca
                    </Text>
                    <Text>{asset.marca_id || 'Sin Marca'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Modelo
                    </Text>
                    <Text>{asset.modelo_id || 'Sin Modelo'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Cantidad
                    </Text>
                    <Text>{asset.cantidad || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Valor Total
                    </Text>
                    <Text>{formatCurrency(asset.valor_total)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Fecha
                    </Text>
                    <Text>{formatDate(asset.fecha)}</Text>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* Paginación para móvil */}
        <Flex mt={4} justify="space-between" align="center">
          <Text fontSize="sm">
            Mostrando {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, assets.length)} de {assets.length}
          </Text>
          <HStack spacing={2}>
            <IconButton
              aria-label="Página anterior"
              icon={<FiChevronLeft />}
              onClick={goToPreviousPage}
              isDisabled={currentPage === 1}
            />
            <IconButton
              aria-label="Página siguiente"
              icon={<FiChevronRight />}
              onClick={goToNextPage}
              isDisabled={currentPage === totalPages}
            />
          </HStack>
        </Flex>
      </Box>
    );
  }

  // Renderizar vista de escritorio (tabla)
  return (
    <Box>
      <TableContainer
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        overflowX="auto"
        sx={{
          scrollbarHeight: '8px',
          scrollbarColor: '#888 #e0e0e0',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#e0e0e0',
          },
        }}
      >
        <Table variant="simple" size="md" style={{ minWidth: '1400px' }}>
          <Thead bg={headerBg}>
            <Tr>
              <Th>N°</Th>
              <Th>Identificación</Th>
              <Th>Descripción</Th>
              <Th>Departamento</Th>
              <Th>Serial</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Estado</Th>
              <Th>Cantidad</Th>
              <Th>Valor Unitario</Th>
              <Th>Valor Total</Th>
              <Th>Fecha</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((asset, index) => (
              <Tooltip
                key={uuidv4()}
                label={`Identificación: ${asset.numero_identificacion}`}
                placement="top"
                hasArrow
                openDelay={200}
              >
                <Tr
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                  borderBottom="2px solid"
                  borderColor={rowDividerColor}
                  style={{ cursor: 'pointer' }}
                >
                  <Td>{indexOfFirstItem + index + 1}</Td>
                  <Td>
                    <Tooltip
                      label={asset.numero_identificacion}
                      placement="top"
                      hasArrow
                    >
                      <Text>{asset.numero_identificacion}</Text>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip
                      label={asset.nombre_descripcion}
                      placement="top"
                      hasArrow
                    >
                      <Box>
                        <Text
                          mb={
                            asset.isComputer === 1 &&
                            componentsByAsset[asset.id] &&
                            componentsByAsset[asset.id].length > 0
                              ? 1
                              : 0
                          }
                        >
                          {asset.nombre_descripcion}
                        </Text>
                        {asset.isComputer === 1 &&
                          componentsByAsset[asset.id] &&
                          componentsByAsset[asset.id].length > 0 &&
                          componentsByAsset[asset.id].map((comp, idx) => (
                            <Text
                              key={idx}
                              fontSize="sm"
                              color="inherit"
                              display="block"
                              pl={2}
                            >
                              * {comp.nombre} SN:{' '}
                              {comp.numero_serial
                                ? comp.numero_serial
                                : 'Sin serial'}
                            </Text>
                          ))}
                      </Box>
                    </Tooltip>
                  </Td>
                  <Td>{asset.dept_nombre || 'Sin Departamento'}</Td>
                  <Td>{asset.numero_serial || 'Sin Numero Serial'}</Td>
                  <Td>{asset.marca_id || 'Sin Marca'}</Td>
                  <Td>{asset.modelo_id || 'Sin Modelo'}</Td>
                  <Td>{asset.estado_nombre || 'Sin estado'}</Td>
                  <Td>{asset.cantidad}</Td>
                  <Td>{formatCurrency(asset.valor_unitario)}</Td>
                  <Td>{formatCurrency(asset.valor_total)}</Td>
                  <Td>{formatDate(asset.fecha)}</Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <Tooltip label="Editar" placement="top" hasArrow>
                        <IconButton
                          aria-label="Editar bien"
                          colorScheme="blue"
                          icon={<FiEdit />}
                          size="sm"
                          onClick={() => onEdit(asset)}
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar" placement="top" hasArrow>
                        <IconButton
                          colorScheme="red"
                          aria-label="Eliminar bien"
                          icon={<FiTrash2 />}
                          size="sm"
                          onClick={() => onDelete(asset)}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              </Tooltip>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Flex mt={4} align="center" justify="space-between">
        <Text fontSize="sm">
          Mostrando {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, assets.length)} de {assets.length}
        </Text>
        <HStack spacing={2}>
          <IconButton
            aria-label="Página anterior"
            icon={<FiChevronLeft />}
            onClick={goToPreviousPage}
            isDisabled={currentPage === 1}
          />
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = currentPage - 2 + i;
            }
            if (pageToShow > 0 && pageToShow <= totalPages) {
              return (
                <Button
                  key={pageToShow}
                  onClick={() => goToPage(pageToShow)}
                  variant={currentPage === pageToShow ? 'solid' : 'outline'}
                  colorScheme={currentPage === pageToShow ? 'purple' : 'gray'}
                  size="sm"
                >
                  {pageToShow}
                </Button>
              );
            }
            return null;
          })}
          <IconButton
            aria-label="Página siguiente"
            icon={<FiChevronRight />}
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
