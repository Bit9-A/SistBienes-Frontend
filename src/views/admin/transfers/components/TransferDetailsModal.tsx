"use client"

import React, { useState, useRef } from "react"
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
  InputGroup,
  InputLeftElement,
  Avatar,
  AvatarBadge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import {
  FiEdit,
  FiTrash2,
  FiInfo,
  FiPackage,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiHome,
  FiHash,
  FiFileText,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiBox,
  FiBarChart2,
} from "react-icons/fi"
import type { Transfer } from "../variables/transferTypes"

interface TransferDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transfer: Transfer | null
  onEdit?: (transfer: Transfer) => void
  onAskDelete?: (transfer: Transfer) => void
}

export const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
  isOpen,
  onClose,
  transfer,
  onEdit,
  onAskDelete,
}) => {
  // Colores y estilos
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const bgCard = useColorModeValue("white", "navy.700")
  const bgTable = useColorModeValue("white", "navy.700")
  const bgTableHeader = useColorModeValue("gray.50", "navy.800")
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100")
  const bgHover = useColorModeValue("gray.50", "navy.800")
  const bgBadge = useColorModeValue("gray.100", "whiteAlpha.200")
  const subtitleColor = useColorModeValue("gray.600", "gray.400")
  const iconColor = useColorModeValue("brand.500", "white")
  const primaryButtonBg = useColorModeValue("brand.500", "brand.400")

  // Estados
  const [isEditing, setIsEditing] = useState(false)
  const [editTransfer, setEditTransfer] = useState<Transfer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(0)

  // Referencias
  const initialRef = useRef(null)

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const gridColumns = useBreakpointValue({ base: 1, md: 2 })
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })

  React.useEffect(() => {
    if (transfer) {
      setEditTransfer(transfer)
      setIsEditing(false)
      setSearchTerm("")
    }
  }, [transfer, isOpen])

  if (!transfer || !editTransfer) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditTransfer((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleSave = () => {
    if (onEdit && editTransfer) {
      onEdit(editTransfer)
      setIsEditing(false)
    }
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

  // Filtrar bienes según término de búsqueda
  const filteredBienes = editTransfer.bienes?.filter((bien) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      bien.id?.toString().includes(searchLower) ||
      bien.nombre?.toLowerCase().includes(searchLower) ||
      bien.descripcion?.toLowerCase().includes(searchLower) ||
      bien.serial?.toLowerCase().includes(searchLower) ||
      bien.marca?.toLowerCase().includes(searchLower) ||
      bien.estado?.toLowerCase().includes(searchLower)
    )
  })

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
            ID: {editTransfer.id}
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
              <Icon as={FiPackage} mr={2} /> Bienes ({editTransfer.bienes?.length || 0})
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
                            value={editTransfer.fecha || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                            ref={initialRef}
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {formatDate(editTransfer.fecha)}
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
                            value={editTransfer.responsable || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <HStack pl={6}>
                            <Avatar size="xs" name={editTransfer.responsable || "Usuario"}>
                              <AvatarBadge boxSize="1em" bg="green.500" />
                            </Avatar>
                            <Text fontSize="md">{editTransfer.responsable || "N/A"}</Text>
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
                            value={editTransfer.departamentoOrigen || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {editTransfer.departamentoOrigen || "N/A"}
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
                            value={editTransfer.departamentoDestino || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {editTransfer.departamentoDestino || "N/A"}
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
                            value={editTransfer.cantidadBienes?.toString() || ""}
                            onChange={handleInputChange}
                            size="md"
                            borderRadius="md"
                          />
                        ) : (
                          <Text fontSize="md" pl={6}>
                            {editTransfer.cantidadBienes || 0}
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
                          value={editTransfer.observaciones || ""}
                          onChange={handleInputChange}
                          size="md"
                          borderRadius="md"
                          rows={3}
                        />
                      ) : (
                        <Text fontSize="md" pl={6} whiteSpace="pre-wrap">
                          {editTransfer.observaciones || "Sin observaciones"}
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
                {/* Buscador */}
                {editTransfer.bienes && editTransfer.bienes.length > 0 && (
                  <InputGroup mb={4} size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar bienes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="full"
                      bg={bgCard}
                    />
                  </InputGroup>
                )}

                {/* Lista de bienes */}
                {filteredBienes && filteredBienes.length > 0 ? (
                  <Box>
                    {/* Vista móvil: Cards */}
                    {isMobile ? (
                      <VStack spacing={4} align="stretch">
                        {filteredBienes.map((bien, index) => (
                          <Card key={bien.id || index} variant="outline" borderColor={borderColor}>
                            <CardBody>
                              <HStack justify="space-between" mb={2}>
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
                                <Text fontSize="xs" color={subtitleColor}>
                                  ID: {bien.id}
                                </Text>
                              </HStack>

                              <Heading size="sm" mb={1}>
                                {bien.nombre}
                              </Heading>

                              {bien.descripcion && (
                                <Text fontSize="sm" color={subtitleColor} mb={3} noOfLines={2}>
                                  {bien.descripcion}
                                </Text>
                              )}

                              <SimpleGrid columns={2} spacing={2}>
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color={subtitleColor}>
                                    Serial
                                  </Text>
                                  <Text fontSize="sm">{bien.serial || "—"}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color={subtitleColor}>
                                    Marca
                                  </Text>
                                  <Text fontSize="sm">{bien.marca || "—"}</Text>
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
                              <Th>ID</Th>
                              <Th>Nombre/Descripción</Th>
                              <Th>Serial</Th>
                              <Th>Marca</Th>
                              <Th>Estado</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredBienes.map((bien, index) => (
                              <Tr key={bien.id || index} _hover={{ bg: bgHover }} transition="background 0.2s">
                                <Td>{bien.id}</Td>
                                <Td>
                                  <Text fontWeight="medium">{bien.nombre}</Text>
                                  {bien.descripcion && (
                                    <Text fontSize="xs" color={subtitleColor} noOfLines={1}>
                                      {bien.descripcion}
                                    </Text>
                                  )}
                                </Td>
                                <Td>{bien.serial || "—"}</Td>
                                <Td>{bien.marca || "—"}</Td>
                                <Td>
                                  <Badge
                                    colorScheme={getBadgeColor(bien.estado)}
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    width="fit-content"
                                  >
                                    <Icon as={getBadgeIcon(bien.estado)} mr={1} />
                                    {bien.estado || "Sin estado"}
                                  </Badge>
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
                    {searchTerm && (
                      <Text color="gray.400" fontSize="sm" mt={1}>
                        Prueba con otros términos de búsqueda
                      </Text>
                    )}
                  </Flex>
                )}
              </ModalBody>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <ModalFooter borderTop="1px" borderColor={borderColor} mt={4}>
          <Flex justify="space-between" width="100%">
            {isEditing ? (
              <>
                <Button variant="ghost" size={buttonSize} onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" size={buttonSize} onClick={handleSave} leftIcon={<FiCheckCircle />}>
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  size={buttonSize}
                  leftIcon={<FiTrash2 />}
                  onClick={() => onAskDelete && transfer && onAskDelete(transfer)}
                >
                  Eliminar
                </Button>
                <Button colorScheme="brand" size={buttonSize} leftIcon={<FiEdit />} onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              </>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
