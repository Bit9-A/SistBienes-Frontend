import React, { useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  useColorModeValue,
  TableContainer, // Nueva importación
  Icon, // Ya estaba, pero para asegurar
  Badge, // Nueva importación
  Tooltip, // Nueva importación
  useBreakpointValue, // Nueva importación
  Card, // Nueva importación
  CardBody, // Nueva importación
  SimpleGrid, // Nueva importación
  VStack, // Nueva importación
  HStack, // Nueva importación
  Avatar, // Nueva importación
  Button, // Nueva importación
  Divider, // Nueva importación
  Skeleton, // Nueva importación
  Tag, // Nueva importación
  TagLeftIcon, // Nueva importación
  TagLabel, // Nueva importación
} from '@chakra-ui/react';
import { FiEye, FiCalendar, FiArrowRight, FiUser, FiPackage, FiFileText, FiHome, FiInfo } from "react-icons/fi"; // Nuevas importaciones de iconos
import { BsBoxes } from "react-icons/bs"; // Nueva importación de icono
import { TransferComponent } from 'api/ComponentsApi';
import { MovableAsset } from 'api/AssetsApi';
import { Department } from 'api/SettingsApi';

interface ComponentTransferHistoryProps {
  componentTransfers: TransferComponent[];
  assets: MovableAsset[];
  departments: Department[];
}

export default function ComponentTransferHistory({
  componentTransfers,
  assets,
  departments,
}: ComponentTransferHistoryProps) {
  // Colores y estilos
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const textMutedColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const badgeBg = useColorModeValue("blue.50", "blue.900");
  const badgeColor = useColorModeValue("blue.700", "blue.200");

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 4, md: 5 });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });

  const getAssetName = (assetId: number) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset ? asset.numero_identificacion : 'Desconocido';
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Truncar texto largo
  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return "—";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const sortedTransfers = useMemo(() => {
    return [...componentTransfers].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [componentTransfers]);

  // Renderizar mensaje cuando no hay datos
  if (!sortedTransfers || sortedTransfers.length === 0) {
    return (
      <Card borderRadius="lg" boxShadow="sm" mb={4}>
        <CardBody>
          <Flex direction="column" align="center" justify="center" py={10}>
            <Icon as={FiInfo} fontSize="3xl" mb={3} color={textMutedColor} />
            <Text color={textMutedColor} fontWeight="small">
              No hay traslados de componentes registrados
            </Text>
            <Text color={textMutedColor} fontSize="sm" mt={1}>
              Los traslados de componentes que registres aparecerán aquí
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  // Vista móvil: Cards
  if (isMobile) {
    return (
      <VStack spacing={4} width="100%">
        {sortedTransfers.map((item) => (
          <Card
            key={String(item.id)}
            width="100%"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <CardBody>
              <HStack spacing={3} mb={3}>
                <Box
                  bg={badgeBg}
                  color={badgeColor}
                  borderRadius="full"
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={BsBoxes} fontSize={iconSize} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize={fontSize}>
                    Traslado Componente #{item.id}
                  </Text>
                  <HStack spacing={1}>
                    <Icon as={FiCalendar} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" color={textMutedColor}>
                      {formatDate(item.fecha)}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <SimpleGrid columns={2} spacing={3} mb={3}>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiPackage} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Componente
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {truncateText(item.componente_nombre || '', 20)}
                  </Text>
                </Box>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiFileText} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Serial
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {truncateText(item.numero_serial || 'N/A', 20)}
                  </Text>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={3} mb={3}>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiHome} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Bien Origen
                    </Text>
                  </HStack>
                  <Text fontSize="sm">{truncateText(getAssetName(item.bien_origen_id), 20)}</Text>
                </Box>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiArrowRight} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Bien Destino
                    </Text>
                  </HStack>
                  <Text fontSize="sm">{truncateText(getAssetName(item.bien_destino_id), 20)}</Text>
                </Box>
              </SimpleGrid>

              <Divider my={3} />

              <Flex justify="flex-end">
                {/* No hay detalles específicos para traslados de componentes, solo la tabla */}
              </Flex>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  }

  // Vista desktop: Tabla
  return (
    <TableContainer
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      overflow="auto"
      mb={4}
      width="100%"
    >
      <Table variant="simple" size={tableSize}>
        <Thead bg={headerBg}>
          <Tr>
            <Th>ID</Th>
            <Th>Fecha</Th>
            <Th>Componente</Th>
            <Th>Serial</Th>
            <Th>Bien Origen</Th>
            <Th>Bien Destino</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedTransfers.map((item) => (
            <Tr
              key={item.id}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
              cursor="pointer"
            >
              <Td>
                <Flex align="center">
                  <Box
                    bg={badgeBg}
                    color={badgeColor}
                    borderRadius="full"
                    p={2}
                    mr={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={BsBoxes} />
                  </Box>
                  <Box>
                    <Text fontWeight="medium">{`${item.id}`}</Text>
                  </Box>
                </Flex>
              </Td>
              <Td>
                <Tag size={fontSize} variant="subtle" colorScheme="gray">
                  <TagLeftIcon as={FiCalendar} />
                  <TagLabel>{formatDate(item.fecha)}</TagLabel>
                </Tag>
              </Td>
              <Td>
                <Tooltip label={item.componente_nombre || ''} placement="top" hasArrow>
                  <Text>{truncateText(item.componente_nombre || '', 20)}</Text>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip label={item.numero_serial || ''} placement="top" hasArrow>
                  <Text>{truncateText(item.numero_serial || 'N/A', 20)}</Text>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip label={getAssetName(item.bien_origen_id)} placement="top" hasArrow>
                  <Text>{truncateText(getAssetName(item.bien_origen_id), 20)}</Text>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip label={getAssetName(item.bien_destino_id)} placement="top" hasArrow>
                  <Text>{truncateText(getAssetName(item.bien_destino_id), 20)}</Text>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
