"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Badge,
  TableContainer,
  Heading,
  Divider,
  useBreakpointValue,
  Card,
  CardBody,
  HStack,
  VStack,
  Avatar,
  AvatarBadge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import {
  FiInfo,
  FiPackage,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiHome,
  FiHash,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiBox,
  FiBarChart2,
} from "react-icons/fi"
import { Transfer, getByTransfersId, bienes, TransferResponse } from "../../../../api/TransferApi";
import { Department, getDepartments } from "../../../../api/SettingsApi";


interface TransferDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transferId?: number
  departments?: Department[]
  onEdit?: (transfer: Transfer) => void
}

export const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
  isOpen,
  onClose,
  transferId,
  departments = [],
  onEdit,

}) => {
  // Colores y estilos
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const bgTableHeader = useColorModeValue("gray.50", "navy.800")
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100")
  const bgHover = useColorModeValue("gray.50", "navy.800")
  const bgBadge = useColorModeValue("gray.100", "whiteAlpha.200")
  const subtitleColor = useColorModeValue("gray.600", "gray.400")
  const iconColor = useColorModeValue("brand.500", "white")

  // Estados
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Referencias
  const initialRef = useRef(null)

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const gridColumns = useBreakpointValue({ base: 1, md: 2 })
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })

  // Crear un mapa de departamentos para acceder a los nombres
  const departmentMap = departments.reduce((acc, department) => {
    acc[department.id] = department.nombre;
    return acc;
  }, {} as Record<number, string>);

  // Obtener el color del badge según el estado
  const getBadgeColor = (estado?: string) => {
    if (!estado) return "gray"

    switch (estado.toLowerCase()) {
      case "nuevo":
        return "green"
      case "usado":
        return "blue"
      case "dañado":
        return "red"
      case "en reparación":
        return "orange"
      default:
        return "gray"
    }
  }

  // Obtener el icono del badge según el estado
  const getBadgeIcon = (estado?: string) => {
    if (!estado) return FiInfo

    switch (estado.toLowerCase()) {
      case "nuevo":
        return FiCheckCircle
      case "usado":
        return FiBox
      case "dañado":
        return FiAlertCircle
      case "en reparación":
        return FiAlertTriangle
      default:
        return FiInfo
    }
  }

  useEffect(() => {
    if (isOpen && typeof transferId !== 'undefined') {
      setLoading(true);
      setError(null);
      getByTransfersId(transferId)
        .then((response: TransferResponse) => {
          if (!response.ok) {
            setError("No se encontró la transferencia.");
            return;
          }
          const transferData: Transfer = response.transfer; // Accede al objeto transfer
          setTransfer(transferData);
        })
        .catch((error) => {
          console.error("Error al cargar detalles de la transferencia:", error);
          setError("Error al cargar detalles de la transferencia");
        })
        .finally(() => {
          setLoading(false); // Asegúrate de que esto se ejecute
        });
    }
  }, [transferId, isOpen]);

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cargando detalles...</ModalHeader>
          <ModalBody>
            <Flex justify="center" align="center" minH="150px">
              <Text>Cargando...</Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
  if (!transfer) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTransfer((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

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


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
      size={isMobile ? "full" : "xl"}
      initialFocusRef={initialRef}
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" mx={{ base: 4, md: "auto" }}>
        <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} pt={6} pb={3} display="flex" alignItems="center">
          <Icon as={FiBarChart2} mr={3} color={iconColor} />
          Detalles del Traslado
          <Badge ml={3} colorScheme="purple" fontSize="xs" px={2} py={1} borderRadius="full">
            ID: {transfer.id}
          </Badge>
        </ModalHeader>
        <Divider />
        <ModalCloseButton size="lg" />

        <Tabs
          isFitted
          variant="soft-rounded"
          colorScheme="brand"
          mt={4}
          mx={6}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList>
            <Tab>
              <Icon as={FiFileText} mr={2} /> Información
            </Tab>
            <Tab>
              <Icon as={FiPackage} mr={2} /> Bienes ({transfer.bienes?.length || 0})
            </Tab>
          </TabList>

          <TabPanels>
            {/* Panel de Información */}
            <TabPanel px={0} pt={4}>
              <ModalBody p={0}>
                <Card variant="outline" borderColor={borderColor} mb={4}>
                  <CardBody>
                    <SimpleGrid columns={gridColumns} spacing={6} mb={4}>
                      <FormControl>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiCalendar} color={iconColor} />
                          <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                            Fecha
                          </FormLabel>
                        </HStack>
                        {isEditing ? (
                          <Input
                            type="date"
                            name="fecha"
                            value={transfer.fecha || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                            ref={initialRef}
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {formatDate(transfer.fecha)}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiUser} color={iconColor} />
                          <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                            Responsable
                          </FormLabel>
                        </HStack>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="responsable"
                            value={transfer.responsable || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <HStack pl={6}>
                            <Avatar size="xs" name={transfer.responsable.toString() || "Usuario"}>
                              <AvatarBadge boxSize="1em" bg="green.500" />
                            </Avatar>
                            <Text fontSize="md">{transfer.responsable || "N/A"}</Text>
                          </HStack>
                        )}
                      </FormControl>

                      <FormControl>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiHome} color={iconColor} />
                          <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                            Departamento Origen
                          </FormLabel>
                        </HStack>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="departamentoOrigen"
                            value={departmentMap[transfer.origen_id] || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {departmentMap[transfer.origen_id] || "N/A"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiArrowRight} color={iconColor} />
                          <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                            Departamento Destino
                          </FormLabel>
                        </HStack>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="departamentoDestino"
                            value={departmentMap[transfer.destino_id] || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {departmentMap[transfer.destino_id] || "N/A"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiHash} color={iconColor} />
                          <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                            Cantidad de Bienes
                          </FormLabel>
                        </HStack>
                        {isEditing ? (
                          <Input
                            type="number"
                            name="cantidadBienes"
                            value={transfer.cantidad?.toString() || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {transfer.cantidad || 0}
                          </Text>
                        )}
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <HStack spacing={2} mb={1}>
                        <Icon as={FiFileText} color={iconColor} />
                        <FormLabel fontSize="sm" fontWeight="bold" m={0}>
                          Observaciones
                        </FormLabel>
                      </HStack>
                      {isEditing ? (
                        <Textarea
                          name="observaciones"
                          value={transfer.observaciones || ""}
                          onChange={handleInputChange}
                          size="md"
                          borderRadius="md"
                          rows={3}
                        />
                      ) : (
                        <Text fontSize="md" pl={6} whiteSpace="pre-wrap">
                          {transfer.observaciones || "Sin observaciones"}
                        </Text>
                      )}
                    </FormControl>
                  </CardBody>
                </Card>
              </ModalBody>
            </TabPanel>

            {/* Panel de Bienes */}
            <TabPanel px={0} pt={4}>
              <ModalBody p={0}>
                {/* Lista de bienes */}
                {transfer.bienes && transfer.bienes.length > 0 ? (
                  <Box>
                    {/* Vista móvil: Cards */}
                    {isMobile ? (
                      <VStack spacing={4} align="stretch">
                        {transfer.bienes.map((bien, index) => (
                          <Card key={bien.id || index} variant="outline" borderColor={borderColor}>
                            <CardBody>
                              <Heading size="sm" mb={1}>
                                {bien?.nombre_descripcion || "N/A"}
                              </Heading>

                              {bien.id_mueble && (
                                <Text fontSize="sm" color={subtitleColor} mb={3} noOfLines={2}>
                                  {bien.id_mueble}
                                </Text>
                              )}


                              <SimpleGrid columns={3} spacing={2}>
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color={subtitleColor}>
                                    Serial
                                  </Text>
                                  <Text fontSize="sm">{bien.numero_identificacion || "—"}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color={subtitleColor}>
                                    N° Traslado
                                  </Text>
                                  <Text fontSize="sm">{bien.id_traslado || "—"}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color={subtitleColor}>
                                    Estado
                                  </Text>
                                  <Badge
                                    colorScheme={getBadgeColor(bien.estado)}
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                  >
                                    <Icon as={getBadgeIcon(bien.estado)} mr={1} />
                                    {bien.estado || "Sin estado"}
                                  </Badge>
                                </Box>
                              </SimpleGrid>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    ) : (
                      /* Vista desktop: Tabla */
                      <TableContainer
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        overflowX="auto"
                        boxShadow="sm"
                      >
                        <Table variant="simple" size={tableSize}>
                          <Thead bg={bgTableHeader}>
                            <Tr>
                              <Th>N°Traslado</Th>
                              <Th>Nombre/Descripción</Th>
                              <Th>Serial</Th>
                              <Th>Estado</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {transfer.bienes.map((bien, index) => (
                              <Tr key={bien.id || index} _hover={{ bg: bgHover }} transition="background 0.2s">
                                <Td>{bien.id_traslado || "—"}</Td>
                                <Td>
                                  <Text fontWeight="medium">{bien.nombre_descripcion}</Text>
                                  {bien.id_mueble && (
                                    <Text fontSize="xs" color={subtitleColor} noOfLines={1}>
                                      {bien.id_mueble}
                                    </Text>
                                  )}
                                </Td>
                                <Td>{bien.numero_identificacion || "—"}</Td>
                                <Td><HStack justify="space-between" mb={2}>
                                  <Badge
                                    colorScheme={getBadgeColor(bien.estado)}
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                  >
                                    <Icon as={getBadgeIcon(bien.estado)} mr={1} />
                                    {bien.estado || "Sin estado"}
                                  </Badge>
                                </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                ) : (
                  <Flex direction="column" align="center" justify="center" py={10} bg={bgBadge} borderRadius="lg">
                    <Icon as={FiInfo} fontSize="3xl" mb={3} color="gray.500" />
                    <Text color="gray.500" fontWeight="medium">
                      No hay bienes asociados a este traslado
                    </Text>
                  </Flex>
                )}
              </ModalBody>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <ModalFooter borderTop="1px" borderColor={borderColor} mt={4}>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
