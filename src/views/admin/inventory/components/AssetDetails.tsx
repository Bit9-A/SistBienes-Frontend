"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Button,
  Spinner,
  Card,
  CardBody,
  Icon,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import {
  FiBox,
  FiCalendar,
  FiDollarSign,
  FiHash,
  FiTag,
  FiMapPin,
  FiCpu,
  FiMonitor,
  FiHardDrive,
  FiEdit,
  FiPlus,
  FiServer,
  FiMinusCircle, // Importar FiMinusCircle para el historial
  FiChevronDown, // Import FiChevronDown
} from "react-icons/fi"
import {
  Menu, // Import Menu
  MenuButton, // Import MenuButton
  MenuList, // Import MenuList
  MenuItem, // Import MenuItem
} from "@chakra-ui/react"
import { getComponentsByBienId, createComponent, deleteComponent, type Component } from "../../../../api/ComponentsApi"
import { getAssetHistory } from "../../../../api/AssetsApi" // Importar la función para obtener el historial
import AssetComponents, { type ComponentData } from "components/AssetComponents/AssetComponents"
import { AssetHistory } from "components/AssetHistory/AssetHistory" // Importar el nuevo componente AssetHistory
import { TransferComponentModal } from "./TransferComponentModal" // Importar el nuevo modal de transferencia
import { ReplaceComponentModal } from "./ReplaceComponentModal" // Importar el nuevo modal de reemplazo

interface AssetDetailsModalProps {
  asset: any
  isOpen: boolean
  onClose: () => void
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ asset, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"details" | "components" | "history">("details") // Añadir "history" al estado
  const [components, setComponents] = useState<Component[]>([])
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [isEditingComponents, setIsEditingComponents] = useState(false)
  const [componentFormData, setComponentFormData] = useState<ComponentData[]>([])
  const [assetHistory, setAssetHistory] = useState<any[]>([]) // Estado para el historial
  const [loadingHistory, setLoadingHistory] = useState(false) // Estado para la carga del historial
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false) // Estado para el modal de transferencia
  const [selectedComponentToTransfer, setSelectedComponentToTransfer] = useState<Component | null>(null) // Componente seleccionado para transferir
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false) // Estado para el modal de reemplazo
  const [selectedComponentToReplace, setSelectedComponentToReplace] = useState<Component | null>(null) // Componente seleccionado para reemplazar

  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const tabActiveBg = useColorModeValue("type.primary", "type.primary")
  const tabInactiveBg = useColorModeValue("gray.100", "gray.600")

  const toast = useToast()

  // Verificar si es computadora
  const isComputer = asset?.isComputer === 1
console.log("Asset: ", asset)
  // Cargar componentes cuando se abre el modal y es una computadora
useEffect(() => {
  if (isOpen && asset && isComputer) {
    loadComponents()
  }
}, [isOpen, asset, isComputer])

  // Cargar historial cuando se abre el modal y la pestaña de historial está activa
  useEffect(() => {
    if (isOpen && asset && activeTab === "history") {
      loadAssetHistory()
    }
  }, [isOpen, asset, activeTab])

  // Resetear tab cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab("details")
      setIsEditingComponents(false)
    }
  }, [isOpen])

  const loadComponents = async () => {
    setLoadingComponents(true)
    try {
      const comps = await getComponentsByBienId(asset.id)
      setComponents(comps)
    } catch (error) {
      console.error("Error loading components:", error)
      setComponents([])
    } finally {
      setLoadingComponents(false)
    }
  }

  const loadAssetHistory = async () => {
    setLoadingHistory(true)
    try {
      const history = await getAssetHistory(asset.id)
      setAssetHistory(history)
    } catch (error) {
      console.error("Error loading asset history:", error)
      setAssetHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleEditComponents = () => {
    // Convertir componentes existentes al formato del formulario
    const formData: ComponentData[] = components.map((comp) => {
      let tipoDeterminado: string = "OTHER"
      if (comp.nombre.includes("TM") || comp.nombre.includes("Tarjeta Madre")) {
        tipoDeterminado = "TM"
      } else if (comp.nombre.includes("CPU") || comp.nombre.includes("Procesador")) {
        tipoDeterminado = "CPU"
      } else if (comp.nombre.includes("RAM") || comp.nombre.includes("Memoria RAM")) {
        tipoDeterminado = "RAM"
      } else if (comp.nombre.includes("HDD") || comp.nombre.includes("Disco Duro HDD")) {
        tipoDeterminado = "HDD"
      } else if (comp.nombre.includes("SSD") || comp.nombre.includes("Disco Duro SSD")) {
        tipoDeterminado = "SSD"
      } else if (comp.nombre.includes("PS") || comp.nombre.includes("Fuente de Poder")) {
        tipoDeterminado = "PS"
      }

      return {
        id: comp.id,
        tipo: tipoDeterminado,
        nombre: comp.nombre,
        numero_serial: comp.numero_serial || "",
      }
    })

    setComponentFormData(formData)
    setIsEditingComponents(true)
  }

  const handleSaveComponents = async () => {
    try {
      // Eliminar todos los componentes existentes asociados a este bien
      await Promise.all(components.map((comp) => deleteComponent(comp.id)))

      // Crear los nuevos componentes basados en el formulario
      const validComponents = componentFormData.filter((comp) => comp.nombre.trim())

      await Promise.all(
        validComponents.map((comp) =>
          createComponent({
            bien_id: asset.id,
            nombre: comp.nombre,
            numero_serial: comp.numero_serial || "N/A", // Asegurar que el serial no sea vacío
          }),
        ),
      )

      toast({
        title: "Éxito",
        description: "Componentes actualizados correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      setIsEditingComponents(false)
      await loadComponents()
    } catch (error) {
      console.error("Error saving components:", error)
      toast({
        title: "Error",
        description: "Error al actualizar los componentes",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleCancelEdit = () => {
    setIsEditingComponents(false)
    setComponentFormData([])
  }

  if (!asset) return null

  // Formatear valores monetarios
  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return "N/A"
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    if (isNaN(numValue)) return "N/A"
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    }).format(numValue)
  }

  // Formatear fechas
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "N/A"
    return new Intl.DateTimeFormat("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Obtener el nombre del estado
  const getStatusName = (statusId: string | number | undefined): string => {
    if (!statusId) return "Sin estado"
    switch (statusId.toString()) {
      case "1":
        return "Nuevo"
      case "2":
        return "Usado"
      case "3":
        return "Dañado"
      default:
        return "Sin estado"
    }
  }

  // Obtener color del badge según el estado
  const getStatusColor = (statusId: string | number | undefined): string => {
    switch (statusId?.toString()) {
      case "1":
        return "green"
      case "2":
        return "yellow"
      case "3":
        return "red"
      default:
        return "gray"
    }
  }

  // Obtener icono para componentes
  const getComponentIcon = (componentName: string) => {
    const name = componentName.toLowerCase()
    if (name.includes("monitor") || name.includes("tm")) return FiMonitor
    if (name.includes("cpu")) return FiCpu
    if (name.includes("disco") || name.includes("hard") || name.includes("hdd") || name.includes("ssd"))
      return FiHardDrive
    return FiBox
  }

  // Función para formatear la descripción con componentes
  const formatDescriptionWithComponents = () => {
    let description = asset.nombre_descripcion

    if (isComputer && components.length > 0) {
      const componentsText = components
        .map((comp) => `${comp.nombre}${comp.numero_serial ? ` (SN: ${comp.numero_serial})` : ""}`)
        .join(", ")
      description += ` - Componentes: ${componentsText}`
    }

    return description
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              Detalles del Bien
            </Text>
            <Text fontSize="md" color="gray.500">
              {asset.numero_identificacion}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* Navegación tipo tabs */}
          <HStack spacing={0} mb={6}>
            <Button
              onClick={() => setActiveTab("details")}
              bg={activeTab === "details" ? tabActiveBg : tabInactiveBg}
              color={activeTab === "details" ? "white" : "gray.600"}
              borderRadius={isComputer ? "md 0 0 md" : "md"}
              _hover={{
                bg: activeTab === "details" ? "type.primary" : "gray.200",
              }}
              size="md"
              flex={1}
            >
              Detalles del Bien
            </Button>
            {isComputer && (
              <Button
                onClick={() => setActiveTab("components")}
                bg={activeTab === "components" ? tabActiveBg : tabInactiveBg}
                color={activeTab === "components" ? "white" : "gray.600"}
                borderRadius="0 md md 0"
                _hover={{
                  bg: activeTab === "components" ? "type.primary" : "gray.200",
                }}
                size="md"
                flex={1}
              >
                Componentes
              </Button>
            )}
            <Button
              onClick={() => setActiveTab("history")}
              bg={activeTab === "history" ? tabActiveBg : tabInactiveBg}
              color={activeTab === "history" ? "white" : "gray.600"}
              borderRadius={isComputer ? "0 0 md md" : "0 md md 0"} // Ajustar border-radius si es el último tab
              _hover={{
                bg: activeTab === "history" ? "type.primary" : "gray.200",
              }}
              size="md"
              flex={1}
            >
              Historial
            </Button>
          </HStack>

          {/* Contenido según el tab activo */}
          {activeTab === "details" ? (
            <VStack spacing={6} align="stretch">
              {/* Información básica */}
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="bold" color="type.primary">
                      Información Básica
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiHash} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Identificación
                          </Text>
                        </HStack>
                        <Text fontWeight="bold">{asset.numero_identificacion}</Text>
                      </Box>

                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiTag} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Estado
                          </Text>
                        </HStack>
                        <Badge colorScheme={getStatusColor(asset.id_estado)}>{getStatusName(asset.id_estado)}</Badge>
                      </Box>

                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={isComputer ? FiServer : FiBox} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Tipo de Bien
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Badge colorScheme={isComputer ? "blue" : "gray"} variant="subtle">
                            {isComputer ? "Computadora" : "Bien General"}
                          </Badge>
                          {isComputer && <Icon as={FiCpu} color="type.primary" boxSize={4} />}
                        </HStack>
                      </Box>

                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiMapPin} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Departamento
                          </Text>
                        </HStack>
                        <Text>{asset.dept_nombre || "Sin Departamento"}</Text>
                      </Box>

                      <Box gridColumn={{ base: "1", md: "1 / -1" }}>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiBox} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Descripción
                          </Text>
                        </HStack>
                        <Text>{formatDescriptionWithComponents()}</Text>
                      </Box>

                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiCalendar} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Fecha de Registro
                          </Text>
                        </HStack>
                        <Text>{formatDate(asset.fecha)}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>

              {/* Especificaciones técnicas */}
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="bold" color="type.primary">
                      Especificaciones Técnicas
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Número Serial
                        </Text>
                        <Text>{asset.numero_serial || "Sin número serial"}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Marca
                        </Text>
                        <Text>{asset.marca_nombre || "Sin marca"}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Modelo
                        </Text>
                        <Text>{asset.modelo_nombre || "Sin modelo"}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Subgrupo
                        </Text>
                        <Text>{asset.subgrupo_nombre || "Sin subgrupo"}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Parroquia
                        </Text>
                        <Text>{asset.parroquia_nombre || "Sin parroquia"}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                          Cantidad
                        </Text>
                        <Text>{asset.cantidad}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>

              {/* Información financiera */}
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="bold" color="type.primary">
                      Información Financiera
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiDollarSign} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Valor Unitario
                          </Text>
                        </HStack>
                        <Text fontWeight="bold" color="green.500">
                          {formatCurrency(asset.valor_unitario)}
                        </Text>
                      </Box>

                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiDollarSign} color="gray.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Valor Total
                          </Text>
                        </HStack>
                        <Text fontWeight="bold" color="green.600" fontSize="lg">
                          {formatCurrency(asset.valor_total)}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          ) : activeTab === "components" ? (
            /* Tab de Componentes - Solo se muestra si es computadora */
            <Box>
              {loadingComponents ? (
                <Flex justify="center" align="center" py={10}>
                  <Spinner size="xl" color="type.primary" />
                  <Text ml={4}>Cargando componentes...</Text>
                </Flex>
              ) : isEditingComponents ? (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold" color="type.primary">
                      Editar Componentes
                    </Text>
                    <HStack spacing={2}>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                      <Button size="sm" color="white" colorScheme="purple" bg={"type.primary"} onClick={handleSaveComponents}>
                        Guardar
                      </Button>
                    </HStack>
                  </HStack>
                  <AssetComponents components={componentFormData} setComponents={setComponentFormData} />
                </VStack>
              ) : components.length === 0 ? (
                <VStack spacing={4} align="center" py={10}>
                  <Icon as={FiBox} size="48px" color="gray.400" />
                  <Text fontSize="lg" fontWeight="medium" color="gray.500">
                    No se encontraron componentes
                  </Text>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
                    Esta computadora no tiene componentes registrados
                  </Text>
                  <Button leftIcon={<FiPlus />} color="type.title" onClick={handleEditComponents}>
                    Agregar Componentes
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold" color="type.primary">
                      Componentes de la Computadora ({components.length})
                    </Text>
                    <Button leftIcon={<FiEdit />} size="sm" color="type.title" colorScheme="white" onClick={handleEditComponents}>
                      Editar
                    </Button>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {components.map((component) => (
                      <Card
                        key={component.id}
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        _hover={{ borderColor: "blue.300", shadow: "md" }}
                        transition="all 0.2s"
                      >
                        <CardBody>
                          <HStack spacing={3} align="start">
                            <Icon as={getComponentIcon(component.nombre)} color="type.primary" boxSize={5} mt={1} />
                            <VStack align="start" spacing={1} flex={1}>
                              <Text fontWeight="bold" fontSize="md">
                                {component.nombre}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                ID: {component.id}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Serial: {component.numero_serial || "Sin serial"}
                              </Text>
                            </VStack>
                            <HStack spacing={2}> {/* Added HStack for buttons */}
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  colorScheme="blue"
                                  rightIcon={<FiChevronDown />}
                                >
                                  Acciones
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedComponentToTransfer(component)
                                      setIsTransferModalOpen(true)
                                    }}
                                  >
                                    Transferir a otro bien
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedComponentToReplace(component)
                                      setIsReplaceModalOpen(true)
                                    }}
                                  >
                                    Reemplazar con nuevo componente
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </VStack>
              )}
            </Box>
          ) : (
            /* Tab de Historial */
            <AssetHistory
              assetHistory={assetHistory}
              loadingHistory={loadingHistory}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}
        </ModalBody>
      </ModalContent>

      {/* Modal de Transferencia de Componentes */}
      <TransferComponentModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        component={selectedComponentToTransfer}
        currentAssetId={asset.id}
        onTransferSuccess={() => {
          loadComponents() // Recargar componentes después de una transferencia exitosa
          loadAssetHistory() // Recargar historial también
        }}
      />

      {/* Modal de Reemplazo de Componentes */}
      <ReplaceComponentModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        oldComponent={selectedComponentToReplace}
        currentAssetId={asset.id}
        onReplaceSuccess={() => {
          loadComponents() // Recargar componentes después de un reemplazo exitoso
          loadAssetHistory() // Recargar historial también
        }}
      />
    </Modal>
  )
}
