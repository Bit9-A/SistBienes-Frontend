"use client"

import type React from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
  Text,
  Icon,
  IconButton,
  useColorModeValue,
  Badge,
  Tooltip,
  useBreakpointValue,
  Card,
  CardBody,
  SimpleGrid,
  VStack,
  HStack,
  Avatar,
  Button,
  Divider,
  Skeleton,
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react"
import { FiEye, FiCalendar, FiArrowRight, FiUser, FiPackage, FiFileText, FiHome, FiInfo } from "react-icons/fi"
import { BsBoxes } from "react-icons/bs"
import type { Transfer } from "../variables/transferTypes"

interface TransferTableProps {
  transfers: Transfer[]
  onViewDetails: (transfer: Transfer) => void
  isLoading?: boolean
}

export const TransferTable: React.FC<TransferTableProps> = ({ transfers, onViewDetails, isLoading = false }) => {
  // Colores y estilos
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const cardBg = useColorModeValue("white", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const textColor = useColorModeValue("gray.800", "white")
  const textMutedColor = useColorModeValue("gray.600", "gray.400")
  const iconColor = useColorModeValue("blue.500", "blue.300")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.700", "blue.200")

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const iconSize = useBreakpointValue({ base: 4, md: 5 })
  const fontSize = useBreakpointValue({ base: "sm", md: "md" })

  // Formatear fecha para mostrar
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date)
    } catch (error) {
      return dateString
    }
  }

  // Truncar texto largo
  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return "—"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Renderizar esqueletos de carga
  if (isLoading) {
    return isMobile ? (
      <VStack spacing={4} width="100%">
        {[...Array(3)].map((_, index) => (
          <Card key={index} width="100%" borderRadius="lg" overflow="hidden" boxShadow="sm">
            <CardBody>
              <Skeleton height="20px" width="100px" mb={4} />
              <SimpleGrid columns={2} spacing={4} mb={3}>
                <Skeleton height="16px" />
                <Skeleton height="16px" />
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} mb={3}>
                <Skeleton height="16px" />
                <Skeleton height="16px" />
              </SimpleGrid>
              <Skeleton height="16px" width="70%" mb={4} />
              <Flex justify="flex-end">
                <Skeleton height="30px" width="100px" />
              </Flex>
            </CardBody>
          </Card>
        ))}
      </VStack>
    ) : (
      <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
        <Table variant="simple" size={tableSize}>
          <Thead bg={headerBg}>
            <Tr>
              <Th>ID</Th>
              <Th>Fecha</Th>
              <Th>Origen</Th>
              <Th>Destino</Th>
              <Th>Responsable</Th>
              <Th>Cantidad</Th>
              <Th>Observaciones</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...Array(5)].map((_, index) => (
              <Tr key={index}>
                <Td>
                  <Skeleton height="20px" width="100px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="80px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="120px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="120px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="100px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="40px" />
                </Td>
                <Td>
                  <Skeleton height="20px" width="150px" />
                </Td>
                <Td>
                  <Skeleton height="30px" width="40px" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }

  // Renderizar mensaje cuando no hay datos
  if (!transfers || transfers.length === 0) {
    return (
      <Card borderRadius="lg" boxShadow="sm" mb={4}>
        <CardBody>
          <Flex direction="column" align="center" justify="center" py={10}>
            <Icon as={FiInfo} fontSize="3xl" mb={3} color={textMutedColor} />
            <Text color={textMutedColor} fontWeight="medium">
              No hay traslados registrados
            </Text>
            <Text color={textMutedColor} fontSize="sm" mt={1}>
              Los traslados que registres aparecerán aquí
            </Text>
          </Flex>
        </CardBody>
      </Card>
    )
  }

  // Vista móvil: Cards
  if (isMobile) {
    return (
      <VStack spacing={4} width="100%">
        {transfers.map((item) => (
          <Card
            key={item.id}
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
                    Traslado #{item.id}
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
                    <Icon as={FiHome} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Origen
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {truncateText(item.departamentoOrigen, 20)}
                  </Text>
                </Box>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiArrowRight} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Destino
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {truncateText(item.departamentoDestino, 20)}
                  </Text>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={3} mb={3}>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiUser} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Responsable
                    </Text>
                  </HStack>
                  <Text fontSize="sm">{truncateText(item.responsable, 20)}</Text>
                </Box>
                <Box>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiPackage} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Cantidad
                    </Text>
                  </HStack>
                  <Badge colorScheme="blue" borderRadius="full" px={2}>
                    {item.cantidadBienes} bienes
                  </Badge>
                </Box>
              </SimpleGrid>

              {item.observaciones && (
                <Box mb={3}>
                  <HStack spacing={1} mb={1}>
                    <Icon as={FiFileText} fontSize="xs" color={textMutedColor} />
                    <Text fontSize="xs" fontWeight="medium" color={textMutedColor}>
                      Observaciones
                    </Text>
                  </HStack>
                  <Text fontSize="sm" noOfLines={2}>
                    {item.observaciones}
                  </Text>
                </Box>
              )}

              <Divider my={3} />

              <Flex justify="flex-end">
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<Icon as={FiEye} />}
                  onClick={() => onViewDetails(item)}
                >
                  Ver detalles
                </Button>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </VStack>
    )
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
            <Th>Origen</Th>
            <Th>Destino</Th>
            <Th>Responsable</Th>
            <Th>Cantidad</Th>
            <Th>Observaciones</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transfers.map((item) => (
            <Tr
              key={item.id}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
              cursor="pointer"
              onClick={() => onViewDetails(item)}
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
                <Tooltip label={item.departamentoOrigen} placement="top" hasArrow>
                  <Text>{truncateText(item.departamentoOrigen, 20)}</Text>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip label={item.departamentoDestino} placement="top" hasArrow>
                  <Text>{truncateText(item.departamentoDestino, 20)}</Text>
                </Tooltip>
              </Td>
              <Td>
                <HStack>
                  <Avatar size="xs" name={item.responsable} />
                  <Text>{truncateText(item.responsable, 15)}</Text>
                </HStack>
              </Td>
              <Td>
                <Badge colorScheme="blue" borderRadius="full" px={2}>
                  {item.cantidadBienes} bienes
                </Badge>
              </Td>
              <Td maxW="200px">
                <Tooltip label={item.observaciones} placement="top" hasArrow>
                  <Text noOfLines={1}>{item.observaciones || "—"}</Text>
                </Tooltip>
              </Td>
              <Td textAlign="center">
                <Flex justify="center">
                  <IconButton
                    aria-label="Ver detalles"
                    icon={<Icon as={FiEye} />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails(item)
                    }}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
