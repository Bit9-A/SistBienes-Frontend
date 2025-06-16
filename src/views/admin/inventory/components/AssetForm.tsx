"use client"

import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Flex,
  Text,
  Textarea,
  Box,
  VStack,
  Checkbox,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Divider,
  Badge,
  Stack,
} from "@chakra-ui/react"
import { type modelo, type marca, getModelosByMarca, type MovableAsset } from "../../../../api/AssetsApi"
import { createComponent } from "../../../../api/ComponentsApi"
import { FiCheck, FiMonitor, FiCpu, FiHardDrive, FiBox } from "react-icons/fi"
import AddMarcaModeloModal from "./BrandModal"
import "../style/AssetForm.scss"

interface AssetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (asset: any) => Promise<any> | any
  asset: MovableAsset | null
  departments: any[]
  subgroups: any[]
  marcas: marca[]
  modelos: modelo[]
  parroquias: any[]
}

interface ComponentData {
  nombre: string
  numero_serial: string
}

const COMPUTER_COMPONENTS = [
  { key: "TM", label: "Monitor (TM)", icon: FiMonitor, color: "blue" },
  { key: "CPU", label: "CPU", icon: FiCpu, color: "green" },
  { key: "DISCO DURO", label: "Disco Duro", icon: FiHardDrive, color: "purple" },
  { key: "RAMx1", label: "RAM Slot 1", icon: FiBox, color: "orange" },
  { key: "RAMx2", label: "RAM Slot 2", icon: FiBox, color: "orange" },
  { key: "RAMx3", label: "RAM Slot 3", icon: FiBox, color: "orange" },
  { key: "RAMx4", label: "RAM Slot 4", icon: FiBox, color: "orange" },
  { key: "CASE", label: "Case/Gabinete", icon: FiBox, color: "gray" },
]

export const AssetForm: React.FC<AssetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  asset,
  departments,
  subgroups,
  marcas,
  modelos,
  parroquias,
}) => {
  // Estado para manejar el formulario
  const [formData, setFormData] = React.useState<Partial<MovableAsset>>(asset || {})
  // Estado para manejar los modelos filtrados
  const [filteredModelos, setFilteredModelos] = useState<modelo[]>([])
  const [localMarcas, setLocalMarcas] = useState<marca[]>([])
  const [localModelos, setLocalModelos] = useState<modelo[]>([])
  const [isComputer, setIsComputer] = useState(false)
  const toast = useToast()

  // Estado para manejar el modal de agregar marca y modelo
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false)
  const [isModeloModalOpen, setIsModeloModalOpen] = useState(false)

  // Estado para controlar el paso actual del formulario
  const [step, setStep] = useState(formData.id ? 0 : 0) // Simplificado sin paso de selección

  // Estado para componentes de computadora
  const [computerComponents, setComputerComponents] = useState<Record<string, ComponentData>>({
    TM: { nombre: "", numero_serial: "" },
    CPU: { nombre: "", numero_serial: "" },
    "DISCO DURO": { nombre: "", numero_serial: "" },
    RAMx1: { nombre: "", numero_serial: "" },
    RAMx2: { nombre: "", numero_serial: "" },
    RAMx3: { nombre: "", numero_serial: "" },
    RAMx4: { nombre: "", numero_serial: "" },
    CASE: { nombre: "", numero_serial: "" },
  })

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  // Definir variables CSS para los colores
  useEffect(() => {
    document.documentElement.style.setProperty("--type-primary", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-light", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-dark", "var(--chakra-colors-type-primary)")
  }, [])

  // Inicializar marcas y modelos locales
  useEffect(() => {
    setLocalMarcas(marcas || [])
    setLocalModelos(modelos || [])
  }, [marcas, modelos])

  // Filtrar modelos según la marca seleccionada
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = Number.parseInt(e.target.value, 10)
    setFormData((prev) => ({ ...prev, marca_id: selectedMarcaId, modelo_id: undefined }))

    if (selectedMarcaId) {
      try {
        const modelosData = await getModelosByMarca(selectedMarcaId)
        setFilteredModelos(modelosData || [])
      } catch (error) {
        console.error("Error al obtener los modelos por marca:", error)
        setFilteredModelos([])
        toast({
          title: "Error",
          description: "No se pudieron cargar los modelos de la marca seleccionada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } else {
      setFilteredModelos([])
    }
  }

  // Efecto para cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(asset || {})
      setIsComputer(asset?.isComputer === 1)

      // Resetear componentes si no es computadora
      if (asset?.isComputer !== 1) {
        setComputerComponents({
          TM: { nombre: "", numero_serial: "" },
          CPU: { nombre: "", numero_serial: "" },
          "DISCO DURO": { nombre: "", numero_serial: "" },
          RAMx1: { nombre: "", numero_serial: "" },
          RAMx2: { nombre: "", numero_serial: "" },
          RAMx3: { nombre: "", numero_serial: "" },
          RAMx4: { nombre: "", numero_serial: "" },
          CASE: { nombre: "", numero_serial: "" },
        })
      }

      if (asset && asset.id) {
        setStep(0) // Para edición, empezar en información básica
      } else {
        setStep(0) // Para creación, empezar en información básica
      }

      // Cargar modelos si hay marca seleccionada
      if (asset?.marca_id) {
        getModelosByMarca(asset.marca_id)
          .then((modelosData) => {
            setFilteredModelos(modelosData || [])
          })
          .catch((error) => {
            console.error("Error loading models:", error)
            setFilteredModelos([])
          })
      }
    }
  }, [asset, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en componentes de computadora
  const handleComponentChange = (componentType: string, field: "nombre" | "numero_serial", value: string) => {
    setComputerComponents((prev) => ({
      ...prev,
      [componentType]: {
        ...prev[componentType],
        [field]: value,
      },
    }))
  }

  // Crear componentes de computadora
  const createComputerComponents = async (bienId: number) => {
    const componentsToCreate = Object.entries(computerComponents)
      .filter(([_, data]) => data.nombre.trim() !== "")
      .map(([type, data]) => ({
        bien_id: bienId,
        nombre: `${type}: ${data.nombre}`,
        numero_serial: data.numero_serial || null,
      }))

    if (componentsToCreate.length === 0) {
      return // No hay componentes para crear
    }

    try {
      const promises = componentsToCreate.map((componentData) => createComponent(componentData))
      await Promise.all(promises)

      toast({
        title: "Éxito",
        description: `Se crearon ${componentsToCreate.length} componentes de la computadora.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error creating components:", error)
      toast({
        title: "Error",
        description: "Error al crear algunos componentes de la computadora.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!formData.numero_identificacion || formData.numero_identificacion.trim() === "") {
      toast({
        title: "Error",
        description: "El número de identificación es obligatorio.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.nombre_descripcion || formData.nombre_descripcion.trim() === "") {
      toast({
        title: "Error",
        description: "La descripción es obligatoria.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Siempre cantidad = 1 para bienes individuales
    formData.cantidad = 1

    if (!formData.fecha || isNaN(new Date(formData.fecha).getTime())) {
      toast({
        title: "Error",
        description: "La fecha es inválida o no está presente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Si estamos editando, mantener la fecha original
    if (formData.id && asset?.fecha) {
      formData.fecha = asset.fecha
    }

    // Establecer isComputer
    formData.isComputer = isComputer ? 1 : 0

    // Formatear la fecha
    const date = new Date(formData.fecha)
    formData.fecha = date.toISOString().split("T")[0]

    try {
      // Enviar el formulario principal
      const result = await Promise.resolve(onSubmit(formData))

      // Si es una computadora y no estamos editando, crear componentes
      if (isComputer && !formData.id && result && typeof result === "object" && "id" in result) {
        await createComputerComponents(result.id)
      }

      // Cerrar modal después del éxito
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Error al guardar el bien.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Manejar el éxito al agregar una nueva marca
  const handleAddMarcaSuccess = (createdMarca: marca) => {
    setLocalMarcas((prev) => [...prev, createdMarca])
    setFormData((prev) => ({ ...prev, marca_id: createdMarca.id }))
  }

  // Manejar el éxito al agregar un nuevo modelo
  const handleAddModeloSuccess = (createdModelo: modelo) => {
    setFilteredModelos((prev) => [...prev, createdModelo])
    setLocalModelos((prev) => [...prev, createdModelo])
    setFormData((prev) => ({ ...prev, modelo_id: createdModelo.id }))
  }

  // Calcular el número total de pasos
  const getTotalSteps = () => {
    if (formData.id) return 2 // Edición: info básica y detalles
    if (isComputer) return 3 // Creación con computadora: básica, detalles, componentes
    return 2 // Creación normal: básica, detalles
  }

  // Componente de indicador de pasos
  const StepIndicator = () => {
    const totalSteps = getTotalSteps()
    const stepsToShow = Array.from({ length: totalSteps }, (_, i) => i)

    return (
      <Flex className="asset-form-step-indicator" mb={6}>
        {stepsToShow.map((idx, index) => (
          <React.Fragment key={idx}>
            <Box
              className={`asset-form-step-indicator-item ${idx === step ? "active" : idx < step ? "completed" : ""}`}
            >
              {idx < step ? <FiCheck /> : idx + 1}
            </Box>
            {index < stepsToShow.length - 1 && (
              <Box className={`asset-form-step-indicator-line ${idx < step ? "active" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </Flex>
    )
  }

  // Calcular el título del paso actual
  const getStepTitle = () => {
    if (formData.id) {
      return step === 0 ? "Información Básica" : "Detalles Adicionales"
    } else {
      switch (step) {
        case 0:
          return "Información Básica"
        case 1:
          return "Detalles Adicionales"
        case 2:
          return "Componentes de Computadora"
        default:
          return ""
      }
    }
  }

  // Calcular el número de paso actual para mostrar
  const getStepNumber = () => {
    const totalSteps = getTotalSteps()
    return `${step + 1} de ${totalSteps}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent className="asset-form-modal">
        <ModalHeader className="asset-form-modal-header">
          {formData.id ? "Editar Bien" : "Agregar Nuevo Bien"} - Paso {getStepNumber()}: {getStepTitle()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="asset-form-modal-body">
          <StepIndicator />

          {step === 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl>
                <FormLabel className="asset-form-label">Identificación</FormLabel>
                <Input
                  className="asset-form-input"
                  name="numero_identificacion"
                  value={formData.numero_identificacion || ""}
                  isReadOnly={!!formData.id}
                  onChange={handleChange}
                  placeholder="Número de Identificación"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Descripción</FormLabel>
                <Textarea
                  className="asset-form-input"
                  name="nombre_descripcion"
                  value={formData.nombre_descripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción del Bien"
                  resize="none"
                  minH="100px"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Departamento</FormLabel>
                <Select
                  className="asset-form-select"
                  name="dept_id"
                  value={formData.dept_id || ""}
                  onChange={handleChange}
                  placeholder="Seleccione un departamento"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {/* Campo de Fecha (Solo se muestra al agregar) */}
              {!formData.id && (
                <FormControl>
                  <FormLabel className="asset-form-label">Fecha</FormLabel>
                  <Input
                    className="asset-form-input"
                    name="fecha"
                    type="date"
                    value={formData.fecha || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              )}
            </SimpleGrid>
          ) : step === 1 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl>
                <FormLabel className="asset-form-label">Subgrupo</FormLabel>
                <Select
                  className="asset-form-select"
                  name="subgrupo_id"
                  value={formData.subgrupo_id || ""}
                  onChange={handleChange}
                  placeholder="Seleccione un subgrupo"
                >
                  {subgroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Checkbox de computadora - solo para creación */}
              {!formData.id && (
                <FormControl>
                  <FormLabel className="asset-form-label">Tipo de Bien</FormLabel>
                  <Checkbox
                    isChecked={isComputer}
                    onChange={(e) => setIsComputer(e.target.checked)}
                    colorScheme="blue"
                    size="lg"
                  >
                    <HStack spacing={2}>
                      <Icon as={FiMonitor} />
                      <Text>Es una computadora</Text>
                    </HStack>
                  </Checkbox>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Marque esta opción si el bien es una computadora para registrar sus componentes
                  </Text>
                </FormControl>
              )}

              <FormControl>
                <FormLabel className="asset-form-label">Marca</FormLabel>
                <Flex>
                  <Select
                    className="asset-form-select"
                    name="marca_id"
                    value={formData.marca_id || ""}
                    onChange={handleMarcaChange}
                    placeholder="Seleccione una marca"
                    flex="1"
                  >
                    <option value="">Ninguna</option>
                    {localMarcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </Select>
                  <Button
                    className="asset-form-add-button"
                    aria-label="Agregar Marca"
                    ml={2}
                    onClick={() => setIsMarcaModalOpen(true)}
                  >
                    + Marca
                  </Button>
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Modelo</FormLabel>
                <Flex>
                  <Select
                    className="asset-form-select"
                    name="modelo_id"
                    value={formData.modelo_id || ""}
                    onChange={handleChange}
                    placeholder="Seleccione un modelo"
                    isDisabled={!formData.marca_id}
                    flex="1"
                  >
                    <option value="">Ninguno</option>
                    {filteredModelos.map((modelo) => (
                      <option key={modelo.id} value={modelo.id}>
                        {modelo.nombre}
                      </option>
                    ))}
                  </Select>
                  <Button
                    className="asset-form-add-button"
                    aria-label="Agregar Modelo"
                    isDisabled={!formData.marca_id}
                    ml={2}
                    onClick={() => setIsModeloModalOpen(true)}
                  >
                    + Modelo
                  </Button>
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Condición</FormLabel>
                <Select
                  className="asset-form-select"
                  name="id_estado"
                  value={formData.id_estado || ""}
                  onChange={handleChange}
                  placeholder="Seleccione una condición (opcional)"
                >
                  <option value="">Sin Condición</option>
                  <option value="1">Nuevo</option>
                  <option value="2">Usado</option>
                  <option value="3">Dañado</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Valor Unitario</FormLabel>
                <Input
                  className="asset-form-input"
                  name="valor_unitario"
                  type="number"
                  value={formData.valor_unitario || ""}
                  onChange={handleChange}
                  placeholder="Valor Unitario"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Valor Total</FormLabel>
                <Input
                  className="asset-form-input"
                  name="valor_total"
                  type="number"
                  value={formData.valor_total || ""}
                  onChange={handleChange}
                  placeholder="Valor Total"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Serial</FormLabel>
                <Input
                  className="asset-form-input"
                  name="numero_serial"
                  value={formData.numero_serial || ""}
                  onChange={handleChange}
                  placeholder="Número Serial"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="asset-form-label">Parroquia</FormLabel>
                <Select
                  className="asset-form-select"
                  name="id_Parroquia"
                  value={formData.id_Parroquia || ""}
                  onChange={handleChange}
                  placeholder="Ubicación del Bien"
                >
                  {parroquias.map((parroquia) => (
                    <option key={parroquia.id} value={parroquia.id}>
                      {parroquia.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          ) : step === 2 && isComputer ? (
            <Box>
              <VStack spacing={6}>
                <Box textAlign="center">
                  <Heading size="md" mb={2}>
                    <HStack justify="center" spacing={2}>
                      <Icon as={FiMonitor} color="blue.500" />
                      <Text>Componentes de la Computadora</Text>
                    </HStack>
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Complete la información de los componentes. Solo se guardarán los componentes con nombre.
                  </Text>
                  <Badge colorScheme="blue" mt={2}>
                    {Object.values(computerComponents).filter((c) => c.nombre.trim() !== "").length} componentes
                    configurados
                  </Badge>
                </Box>

                <Divider />

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} w="100%">
                  {COMPUTER_COMPONENTS.map(({ key, label, icon, color }) => {
                    const data = computerComponents[key]
                    const hasData = data.nombre.trim() !== ""

                    return (
                      <Card
                        key={key}
                        variant="outline"
                        borderColor={hasData ? `${color}.200` : "gray.200"}
                        bg={hasData ? `${color}.50` : "white"}
                        _dark={{
                          bg: hasData ? `${color}.900` : "gray.800",
                          borderColor: hasData ? `${color}.600` : "gray.600",
                        }}
                      >
                        <CardHeader pb={2}>
                          <HStack spacing={2}>
                            <Icon as={icon} color={`${color}.500`} />
                            <Heading size="sm">{label}</Heading>
                            {hasData && (
                              <Badge colorScheme={color} size="sm">
                                Configurado
                              </Badge>
                            )}
                          </HStack>
                        </CardHeader>
                        <CardBody pt={0}>
                          <Stack spacing={3}>
                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="medium">
                                Nombre del componente
                              </FormLabel>
                              <Input
                                placeholder={`Ej: ${key === "TM" ? "Monitor Samsung 24'" : key === "CPU" ? "Intel Core i5" : `Especificación del ${label}`}`}
                                value={data.nombre}
                                onChange={(e) => handleComponentChange(key, "nombre", e.target.value)}
                                size="sm"
                                focusBorderColor={`${color}.400`}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="medium">
                                Número Serial
                              </FormLabel>
                              <Input
                                placeholder="Serial del componente (opcional)"
                                value={data.numero_serial}
                                onChange={(e) => handleComponentChange(key, "numero_serial", e.target.value)}
                                size="sm"
                                focusBorderColor={`${color}.400`}
                              />
                            </FormControl>
                          </Stack>
                        </CardBody>
                      </Card>
                    )
                  })}
                </SimpleGrid>
              </VStack>
            </Box>
          ) : null}
        </ModalBody>
        <ModalFooter className="asset-form-modal-footer">
          {step > 0 && (
            <Button className="asset-form-action-button secondary" mr={3} onClick={prevStep}>
              Atrás
            </Button>
          )}
          {step < getTotalSteps() - 1 ? (
            <Button className="asset-form-action-button primary" onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button className="asset-form-action-button primary" mr={3} onClick={handleSubmit}>
              {formData.id ? "Guardar Cambios" : "Agregar Bien"}
            </Button>
          )}
          <Button className="asset-form-action-button ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
      {/* Modales de Marca y Modelo */}
      <AddMarcaModeloModal
        isOpen={isMarcaModalOpen}
        onClose={() => setIsMarcaModalOpen(false)}
        type="marca"
        onAddSuccess={handleAddMarcaSuccess}
      />
      <AddMarcaModeloModal
        isOpen={isModeloModalOpen}
        onClose={() => setIsModeloModalOpen(false)}
        type="modelo"
        marcaId={formData.marca_id}
        onAddSuccess={handleAddModeloSuccess}
      />
    </Modal>
  )
}
