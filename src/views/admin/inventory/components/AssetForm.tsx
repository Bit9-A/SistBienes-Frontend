"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  Checkbox,
  HStack,
  Icon,
  Box,
  FormErrorMessage,
  VStack,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useColorModeValue,
  Tooltip,
  IconButton,
} from "@chakra-ui/react"
import { FiMonitor, FiInfo, FiDollarSign, FiMapPin, FiTag, FiLock, FiUnlock } from "react-icons/fi"
import { type modelo, type marca, getModelosByMarca, type MovableAsset, createAsset } from "../../../../api/AssetsApi"
import { createComponent } from "../../../../api/ComponentsApi"
import AddMarcaModeloModal from "./BrandModal"
import AssetComponents, { type ComponentData } from "../../../../components/AssetComponents/AssetComponents"

interface AssetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (asset: any, logDetails?: string) => Promise<any> | any
  asset: MovableAsset | null
  departments: any[]
  subgroups: any[]
  marcas: marca[]
  modelos: modelo[]
  parroquias: any[]
  assetStates: any[]
}

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
  assetStates,
}) => {
  // Estados principales
  const [formData, setFormData] = useState<Partial<MovableAsset>>(asset || {})
  const [originalFormData, setOriginalFormData] = useState<Partial<MovableAsset>>({})
  const [filteredModelos, setFilteredModelos] = useState<modelo[]>([])
  const [localMarcas, setLocalMarcas] = useState<marca[]>([])
  const [localModelos, setLocalModelos] = useState<modelo[]>([])
  const [isComputer, setIsComputer] = useState(false)
  const [step, setStep] = useState(0)
  const [createdAssetId, setCreatedAssetId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({})
  const toast = useToast()

  // Modal de marca/modelo
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false)
  const [isModeloModalOpen, setIsModeloModalOpen] = useState(false)

  // Componentes de computadora
  const [computerComponents, setComputerComponents] = useState<ComponentData[]>([])

  // Colores del tema mejorados para modo edición
  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const sectionBg = useColorModeValue("gray.50", "gray.800")
  const readOnlyBg = useColorModeValue("gray.100", "gray.700")
  const editableBg = useColorModeValue("white", "gray.600")
  const readOnlyBorder = useColorModeValue("gray.300", "gray.600")
  const editableBorder = useColorModeValue("blue.300", "blue.500")
  const lockIconColor = useColorModeValue("red.500", "red.400")
  const unlockIconColor = useColorModeValue("green.500", "green.400")
  const editIconColor = useColorModeValue("blue.500", "blue.400")

  // Efectos de inicialización
  useEffect(() => {
    setLocalMarcas(marcas || [])
    setLocalModelos(modelos || [])
  }, [marcas, modelos])

  useEffect(() => {
    if (isOpen) {
      setFormData(asset || {})
      setOriginalFormData(asset || {}) // Store original data for comparison
      setIsComputer(asset?.isComputer === 1)
      setStep(0)
      setCreatedAssetId(null)
      setErrors({})

      // Initialize editable fields based on asset presence
      const initialEditableState: Record<string, boolean> = {}
      if (asset) {
        // In edit mode, all fields start as read-only
        const allFieldNames = [
          "numero_identificacion",
          "fecha",
          "nombre_descripcion",
          "dept_id",
          "subgrupo_id",
          "parroquia_id",
          "numero_serial",
          "valor_unitario",
          "marca_id",
          "modelo_id",
          "estado_id",
        ]
        allFieldNames.forEach((name) => {
          initialEditableState[name] = false
        })
      } else {
        // In create mode, all fields are editable
        const allFieldNames = [
          "numero_identificacion",
          "fecha",
          "nombre_descripcion",
          "dept_id",
          "subgrupo_id",
          "parroquia_id",
          "numero_serial",
          "valor_unitario",
          "marca_id",
          "modelo_id",
          "estado_id",
        ]
        allFieldNames.forEach((name) => {
          initialEditableState[name] = true
        })
      }
      setEditableFields(initialEditableState)

      // Inicializar componentes básicos
      setComputerComponents([
        { tipo: "TM", nombre: "", numero_serial: "" },
        { tipo: "CPU", nombre: "", numero_serial: "" },
        { tipo: "RAM", nombre: "", numero_serial: "" },
        { tipo: "HDD", nombre: "", numero_serial: "" },
        { tipo: "SSD", nombre: "", numero_serial: "" },
        { tipo: "PS", nombre: "", numero_serial: "" },
      ])

      if (asset?.marca_id) {
        getModelosByMarca(asset.marca_id)
          .then((modelosData) => setFilteredModelos(modelosData || []))
          .catch(() => setFilteredModelos([]))
      }
    }
  }, [asset, isOpen])

  // Validaciones
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!formData.numero_identificacion?.trim()) {
        newErrors.numero_identificacion = "El número de bien es obligatorio"
      }
      if (!formData.nombre_descripcion?.trim()) {
        newErrors.nombre_descripcion = "La descripción es obligatoria"
      }
      if (!formData.dept_id) {
        newErrors.dept_id = "El departamento es obligatorio"
      }
      if (!formData.fecha && !asset?.id) {
        newErrors.fecha = "La fecha es obligatoria"
      }
    }

    if (currentStep === 1) {
      if (!formData.subgrupo_id) {
        newErrors.subgrupo_id = "El subgrupo es obligatorio"
      }
      if (!formData.valor_unitario || Number(formData.valor_unitario) <= 0) {
        newErrors.valor_unitario = "El valor debe ser mayor a 0"
      }
      if (!formData.numero_serial?.trim()) {
        newErrors.numero_serial = "El número serial es obligatorio"
      }
      if (!formData.parroquia_id) {
        newErrors.parroquia_id = "La parroquia es obligatoria"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejo de cambios en campos con conversión de tipos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Convertir a número para campos específicos
    let processedValue: any = value

    if (["dept_id", "subgrupo_id", "parroquia_id", "marca_id", "modelo_id", "estado_id"].includes(name)) {
      // Convertir a número si el valor no está vacío
      processedValue = value === "" ? undefined : Number(value)
    } else if (name === "valor_unitario") {
      // Para valor_unitario, mantener como string para el input pero validar como número
      processedValue = value
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const toggleEdit = (fieldName: string) => {
    setEditableFields((prev) => {
      const newState = { ...prev, [fieldName]: !prev[fieldName] }
      if (newState[fieldName]) {
        toast({
          title: "Campo desbloqueado",
          description: `El campo "${getFieldLabel(fieldName)}" ahora se puede editar.`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        })
      } else {
        toast({
          title: "Campo bloqueado",
          description: `El campo "${getFieldLabel(fieldName)}" está protegido contra edición.`,
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        })
      }
      return newState
    })
  }

  // Función para obtener el label del campo
  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      numero_identificacion: "Número de Bien",
      fecha: "Fecha de Registro",
      nombre_descripcion: "Descripción del Bien",
      dept_id: "Departamento",
      subgrupo_id: "Subgrupo",
      parroquia_id: "Parroquia",
      numero_serial: "Número Serial",
      valor_unitario: "Valor Unitario",
      marca_id: "Marca",
      modelo_id: "Modelo",
      estado_id: "Condición",
    }
    return labels[fieldName] || fieldName
  }

  // Componente mejorado para el botón de edición
  const EditToggleButton = ({ fieldName, isRequired = false }: { fieldName: string; isRequired?: boolean }) => {
    if (!asset?.id) return null

    const isEditable = editableFields[fieldName]
    const icon = isEditable ? FiUnlock : FiLock
    const colorScheme = isEditable ? "green" : "red"
    const tooltipLabel = isEditable ? `Bloquear "${getFieldLabel(fieldName)}"` : `Editar "${getFieldLabel(fieldName)}"`

    return (
      <Tooltip label={tooltipLabel} placement="top">
        <IconButton
          aria-label={tooltipLabel}
          icon={<Icon as={icon} />}
          size="sm"
          colorScheme={colorScheme}
          variant={isEditable ? "solid" : "outline"}
          onClick={() => toggleEdit(fieldName)}
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "md",
          }}
          transition="all 0.2s"
          borderWidth="2px"
        />
      </Tooltip>
    )
  }

  // Manejo de cambio de marca
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = e.target.value === "" ? undefined : Number(e.target.value)
    setFormData((prev) => ({
      ...prev,
      marca_id: selectedMarcaId,
      modelo_id: undefined,
    }))

    if (selectedMarcaId) {
      try {
        const modelosData = await getModelosByMarca(selectedMarcaId)
        setFilteredModelos(modelosData || [])
      } catch {
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

  // Manejo del checkbox de computadora
  const handleComputerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isComputerChecked = e.target.checked
    setIsComputer(isComputerChecked)

    // Si es computadora, seleccionar automáticamente el subgrupo con código 12
    if (isComputerChecked) {
      const otrosElementosSubgroup = subgroups.find((sg) => sg.codigo === "12")
      if (otrosElementosSubgroup) {
        setFormData((prev) => ({ ...prev, subgrupo_id: otrosElementosSubgroup.id }))
        // Limpiar error de subgrupo si existe
        if (errors.subgrupo_id) {
          setErrors((prev) => ({ ...prev, subgrupo_id: "" }))
        }
      }
    } else {
      // Si no es computadora, limpiar la selección de subgrupo
      setFormData((prev) => ({ ...prev, subgrupo_id: undefined }))
    }
  }

  // Función para preparar datos antes del envío
  const prepareAssetData = (data: Partial<MovableAsset>) => {
    const assetData = {
      ...data,
      cantidad: 1,
      isComputer: isComputer ? 1 : 0,
      valor_total: Number(data.valor_unitario) * 1,
      fecha: data.fecha ? new Date(data.fecha).toISOString().split("T")[0] : undefined,
      // Asegurar que los IDs sean números o undefined
      dept_id: data.dept_id ? Number(data.dept_id) : undefined,
      subgrupo_id: data.subgrupo_id ? Number(data.subgrupo_id) : undefined,
      parroquia_id: data.parroquia_id ? Number(data.parroquia_id) : undefined,
      marca_id: data.marca_id ? Number(data.marca_id) : undefined,
      modelo_id: data.modelo_id ? Number(data.modelo_id) : undefined,
      estado_id: data.estado_id ? Number(data.estado_id) : undefined,
      // Asegurar que valor_unitario sea número
      valor_unitario: data.valor_unitario ? Number(data.valor_unitario) : undefined,
    }

    // Remover campos undefined para evitar enviar null
    Object.keys(assetData).forEach((key) => {
      if (assetData[key as keyof typeof assetData] === undefined) {
        delete assetData[key as keyof typeof assetData]
      }
    })

    return assetData
  }

  // Guardar bien y pasar a componentes (si es computadora)
  const handleNextStep = async () => {
    if (!validateStep(step)) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (step === 1 && isComputer && !createdAssetId) {
      const assetData = prepareAssetData(formData)

      try {
        const result = await createAsset(assetData as MovableAsset)
        const assetId = result?.furniture?.id

        if (assetId) {
          setCreatedAssetId(assetId)
          setStep(2)
        } else {
          toast({
            title: "Error",
            description: "No se pudo guardar el bien.",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error) {
        console.error("Error creating asset:", error)
        toast({
          title: "Error",
          description: "No se pudo guardar el bien.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
      return
    }

    setStep((prev) => prev + 1)
  }

  // Validar componentes
  const validateComponents = () => {
    // Verificar que al menos los componentes obligatorios estén completos
    const requiredComponents = ["TM", "CPU", "RAM", "PS"]
    const completedRequired = requiredComponents.filter((type) => {
      const component = computerComponents.find((c) => c.tipo === type)
      return component && component.nombre.trim() && component.numero_serial.trim()
    })

    if (completedRequired.length < requiredComponents.length) {
      toast({
        title: "Componentes incompletos",
        description: "Complete todos los componentes obligatorios (TM, CPU, RAM, PS).",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return false
    }

    // Verificar que al menos un disco esté completo (HDD o SSD)
    const hdd = computerComponents.find((c) => c.tipo === "HDD")
    const ssd = computerComponents.find((c) => c.tipo === "SSD")
    const hasCompleteDisk =
      (hdd && hdd.nombre.trim() && hdd.numero_serial.trim()) || (ssd && ssd.nombre.trim() && ssd.numero_serial.trim())

    if (!hasCompleteDisk) {
      toast({
        title: "Disco de almacenamiento requerido",
        description: "Complete al menos un disco de almacenamiento (HDD o SSD).",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return false
    }

    return true
  }

  // Prefijos para la API
  const getPrefijo = (tipo: string) => {
    const prefijos: Record<string, string> = {
      TM: "TM",
      CPU: "CPU",
      RAM: "RAM",
      HDD: "HDD",
      SSD: "SSD",
      PS: "PS",
    }
    return prefijos[tipo] || tipo
  }

  // Guardar componentes
  const handleSaveComponents = async () => {
    if (!createdAssetId) return

    if (!validateComponents()) return

    try {
      // Filtrar solo los componentes que están completos
      const completeComponents = computerComponents.filter((comp) => comp.nombre.trim() && comp.numero_serial.trim())

      for (const comp of completeComponents) {
        await createComponent({
          bien_id: createdAssetId,
          nombre: `${getPrefijo(comp.tipo)}: ${comp.nombre}`,
          numero_serial: comp.numero_serial,
        })
      }

      toast({
        title: "Éxito",
        description: "Bien y componentes guardados correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      onClose()
    } catch (error) {
      console.error("Error saving components:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los componentes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Guardar bien normal (no computadora) o edición
  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const assetData = prepareAssetData(formData)

    // Prepare details for logCustomAction if in edit mode
    let logDetails = ""
    if (asset?.id) {
      const changes: string[] = []
      for (const key in formData) {
        if (
          Object.prototype.hasOwnProperty.call(formData, key) &&
          Object.prototype.hasOwnProperty.call(originalFormData, key)
        ) {
          const currentVal = formData[key as keyof MovableAsset]
          const originalVal = originalFormData[key as keyof MovableAsset]
          // Special handling for date to compare only the date part
          if (key === "fecha") {
            const currentFecha = formData.fecha ? new Date(formData.fecha).toISOString().split("T")[0] : undefined
            const originalFecha = originalFormData.fecha
              ? new Date(originalFormData.fecha).toISOString().split("T")[0]
              : undefined
            if (currentFecha !== originalFecha) {
              changes.push(`${key}: '${originalFecha || "N/A"}' -> '${currentFecha || "N/A"}'`)
            }
          } else if (currentVal !== originalVal) {
            changes.push(`${key}: '${originalVal}' -> '${currentVal}'`)
          }
        }
      }
      logDetails = changes.length > 0 ? `Campos editados: ${changes.join(", ")}` : "No se realizaron cambios."
    }

    try {
      if (asset?.id) {
        // Only show this toast in edit mode
        toast({
          title: "Guardando cambios",
          description: "Se están guardando las modificaciones del bien.",
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "top",
        })
      }

      console.log("Sending asset data:", assetData) // Debug log
      await onSubmit(assetData, logDetails) // Pass logDetails to onSubmit

      toast({
        title: "Éxito",
        description: "Bien guardado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      console.error("Error submitting asset:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el bien.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Paso y título
  const getTotalSteps = () => (isComputer && !formData.id ? 3 : 2)
  const getStepTitle = () => {
    if (step === 0) return "Información Básica"
    if (step === 1) return "Detalles y Especificaciones"
    if (step === 2) return "Componentes de Computadora"
    return ""
  }

  const getStepDescription = () => {
    if (step === 0) return "Complete la información básica del bien"
    if (step === 1) return "Agregue los detalles técnicos y de ubicación"
    if (step === 2) return "Configure los componentes de hardware"
    return ""
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader bg={sectionBg} borderBottom="1px" borderColor={borderColor}>
          <VStack align="start" spacing={2}>
            <Flex align="center" justify="space-between" w="full">
              <Heading size="lg">{formData.id ? "Editar Bien" : "Agregar Nuevo Bien"}</Heading>
              <HStack spacing={2}>
                {asset?.id && (
                  <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                    Modo Edición
                  </Badge>
                )}
                <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                  Paso {step + 1} de {getTotalSteps()}
                </Badge>
              </HStack>
            </Flex>
            <Text color="gray.600" fontSize="sm">
              {getStepDescription()}
            </Text>
            <Text fontWeight="semibold" color="purple.600">
              {getStepTitle()}
            </Text>
            {asset?.id && (
              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                💡 Haz clic en los iconos de candado para editar campos individuales
              </Text>
            )}
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={6}>
          {/* Paso 1: Información Básica */}
          {step === 0 && (
            <VStack spacing={6} align="stretch">
              {/* Sección de Identificación */}
              <Card bg={cardBg} shadow="sm" borderWidth="1px">
                <CardHeader pb={3}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiInfo} color="purple.500" />
                    <Heading size="md">Identificación del Bien</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.numero_identificacion} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Número de Bien
                          {asset?.id && !editableFields.numero_identificacion && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.numero_identificacion && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="numero_identificacion" isRequired />
                      </Flex>
                      <Input
                        name="numero_identificacion"
                        value={formData.numero_identificacion || ""}
                        onChange={handleChange}
                        placeholder="Ej: BM-001-2024"
                        size="lg"
                        isReadOnly={asset?.id ? !editableFields.numero_identificacion : false}
                        bg={asset?.id ? (editableFields.numero_identificacion ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id
                            ? editableFields.numero_identificacion
                              ? editableBorder
                              : readOnlyBorder
                            : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.numero_identificacion
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      />
                      <FormErrorMessage>{errors.numero_identificacion}</FormErrorMessage>
                    </FormControl>

                    {!formData.id && (
                      <FormControl isInvalid={!!errors.fecha} isRequired>
                        <Flex align="center" justify="space-between" mb={2}>
                          <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                            Fecha de Registro
                            {asset?.id && !editableFields.fecha && (
                              <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                            )}
                            {asset?.id && editableFields.fecha && (
                              <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                            )}
                          </FormLabel>
                          <EditToggleButton fieldName="fecha" isRequired />
                        </Flex>
                        <Input
                          name="fecha"
                          type="date"
                          value={formData.fecha || ""}
                          onChange={handleChange}
                          size="lg"
                          isReadOnly={asset?.id ? !editableFields.fecha : false}
                          bg={asset?.id ? (editableFields.fecha ? editableBg : readOnlyBg) : editableBg}
                          borderColor={
                            asset?.id ? (editableFields.fecha ? editableBorder : readOnlyBorder) : borderColor
                          }
                          borderWidth="2px"
                          _hover={{
                            borderColor: asset?.id ? (editableFields.fecha ? "blue.400" : readOnlyBorder) : "blue.300",
                          }}
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px blue.500",
                          }}
                          transition="all 0.2s"
                        />
                        <FormErrorMessage>{errors.fecha}</FormErrorMessage>
                      </FormControl>
                    )}
                  </SimpleGrid>

                  <FormControl isInvalid={!!errors.nombre_descripcion} isRequired mt={4}>
                    <Flex align="center" justify="space-between" mb={2}>
                      <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                        Descripción del Bien
                        {asset?.id && !editableFields.nombre_descripcion && (
                          <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                        )}
                        {asset?.id && editableFields.nombre_descripcion && (
                          <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                        )}
                      </FormLabel>
                      <EditToggleButton fieldName="nombre_descripcion" isRequired />
                    </Flex>
                    <Textarea
                      name="nombre_descripcion"
                      value={formData.nombre_descripcion || ""}
                      onChange={handleChange}
                      placeholder="Describa detalladamente el bien, incluyendo características principales..."
                      rows={4}
                      size="lg"
                      isReadOnly={asset?.id ? !editableFields.nombre_descripcion : false}
                      bg={asset?.id ? (editableFields.nombre_descripcion ? editableBg : readOnlyBg) : editableBg}
                      borderColor={
                        asset?.id ? (editableFields.nombre_descripcion ? editableBorder : readOnlyBorder) : borderColor
                      }
                      borderWidth="2px"
                      _hover={{
                        borderColor: asset?.id
                          ? editableFields.nombre_descripcion
                            ? "blue.400"
                            : readOnlyBorder
                          : "blue.300",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px blue.500",
                      }}
                      transition="all 0.2s"
                    />
                    <FormErrorMessage>{errors.nombre_descripcion}</FormErrorMessage>
                  </FormControl>
                </CardBody>
              </Card>

              {/* Sección de Ubicación */}
              <Card bg={cardBg} shadow="sm" borderWidth="1px">
                <CardHeader pb={3}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiMapPin} color="blue.500" />
                    <Heading size="md">Ubicación y Asignación</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.dept_id} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Departamento
                          {asset?.id && !editableFields.dept_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.dept_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="dept_id" isRequired />
                      </Flex>
                      <Select
                        name="dept_id"
                        value={formData.dept_id || ""}
                        onChange={handleChange}
                        placeholder="Seleccione un departamento"
                        size="lg"
                        isDisabled={asset?.id ? !editableFields.dept_id : false}
                        bg={asset?.id ? (editableFields.dept_id ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.dept_id ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id ? (editableFields.dept_id ? "blue.400" : readOnlyBorder) : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nombre}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.dept_id}</FormErrorMessage>
                    </FormControl>

                    {!formData.id && (
                      <FormControl>
                        <FormLabel fontWeight="semibold">Tipo de Bien</FormLabel>
                        <Box p={4} border="1px" borderColor={borderColor} borderRadius="md" bg={sectionBg}>
                          <Checkbox
                            isChecked={isComputer}
                            onChange={handleComputerChange}
                            colorScheme="purple"
                            size="lg"
                          >
                            <HStack spacing={3}>
                              <Icon as={FiMonitor} boxSize={5} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="semibold">Es una computadora</Text>
                                <Text fontSize="sm" color="gray.500">
                                  Incluye componentes de hardware
                                </Text>
                              </VStack>
                            </HStack>
                          </Checkbox>
                          {isComputer && (
                            <Text fontSize="sm" color="blue.600" mt={2} fontStyle="italic">
                              ✓ Se seleccionará automáticamente "Otros Elementos" como subgrupo
                            </Text>
                          )}
                        </Box>
                      </FormControl>
                    )}
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          )}

          {/* Paso 2: Detalles del Bien */}
          {step === 1 && (
            <VStack spacing={6} align="stretch">
              {/* Sección de Clasificación */}
              <Card bg={cardBg} shadow="sm" borderWidth="1px">
                <CardHeader pb={3}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiTag} color="green.500" />
                    <Heading size="md">Clasificación</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.subgrupo_id} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Subgrupo
                          {asset?.id && !editableFields.subgrupo_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.subgrupo_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="subgrupo_id" isRequired />
                      </Flex>
                      <Select
                        name="subgrupo_id"
                        value={formData.subgrupo_id || ""}
                        onChange={handleChange}
                        placeholder="Seleccione un subgrupo"
                        isDisabled={isComputer || (asset?.id ? !editableFields.subgrupo_id : false)}
                        size="lg"
                        bg={asset?.id ? (editableFields.subgrupo_id ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.subgrupo_id ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.subgrupo_id
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      >
                        {subgroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.codigo} - {g.nombre}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.subgrupo_id}</FormErrorMessage>
                      {isComputer && (
                        <Text fontSize="sm" color="blue.600" mt={1} fontStyle="italic">
                          ✓ Seleccionado automáticamente: Otros Elementos (Código 12)
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.parroquia_id} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Parroquia
                          {asset?.id && !editableFields.parroquia_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.parroquia_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="parroquia_id" isRequired />
                      </Flex>
                      <Select
                        name="parroquia_id"
                        value={formData.parroquia_id || ""}
                        onChange={handleChange}
                        placeholder="Seleccione una parroquia"
                        size="lg"
                        isDisabled={asset?.id ? !editableFields.parroquia_id : false}
                        bg={asset?.id ? (editableFields.parroquia_id ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.parroquia_id ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.parroquia_id
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      >
                        {parroquias.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.parroquia_id}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Sección de Especificaciones Técnicas */}
              <Card bg={cardBg} shadow="sm" borderWidth="1px">
                <CardHeader pb={3}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiInfo} color="orange.500" />
                    <Heading size="md">Especificaciones Técnicas</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.numero_serial} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Número Serial
                          {asset?.id && !editableFields.numero_serial && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.numero_serial && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="numero_serial" isRequired />
                      </Flex>
                      <Input
                        name="numero_serial"
                        value={formData.numero_serial || ""}
                        onChange={handleChange}
                        placeholder="Ingrese el número serial del fabricante"
                        size="lg"
                        isReadOnly={asset?.id ? !editableFields.numero_serial : false}
                        bg={asset?.id ? (editableFields.numero_serial ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.numero_serial ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.numero_serial
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      />
                      <FormErrorMessage>{errors.numero_serial}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.valor_unitario} isRequired>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Valor Unitario (Bs.)
                          {asset?.id && !editableFields.valor_unitario && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.valor_unitario && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="valor_unitario" isRequired />
                      </Flex>
                      <Input
                        name="valor_unitario"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.valor_unitario || ""}
                        onChange={handleChange}
                        placeholder="0.00"
                        size="lg"
                        isReadOnly={asset?.id ? !editableFields.valor_unitario : false}
                        bg={asset?.id ? (editableFields.valor_unitario ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.valor_unitario ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.valor_unitario
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      />
                      <FormErrorMessage>{errors.valor_unitario}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Sección de Información Adicional (Opcional) */}
              <Card bg={cardBg} shadow="sm" borderWidth="1px">
                <CardHeader pb={3}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiDollarSign} color="gray.500" />
                    <Heading size="md">Información Adicional</Heading>
                    <Badge variant="outline" colorScheme="gray">
                      Opcional
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Marca
                          {asset?.id && !editableFields.marca_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.marca_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="marca_id" />
                      </Flex>
                      <Flex gap={2}>
                        <Select
                          name="marca_id"
                          value={formData.marca_id || ""}
                          onChange={handleMarcaChange}
                          flex="1"
                          placeholder="Seleccione una marca"
                          size="lg"
                          isDisabled={asset?.id ? !editableFields.marca_id : false}
                          bg={asset?.id ? (editableFields.marca_id ? editableBg : readOnlyBg) : editableBg}
                          borderColor={
                            asset?.id ? (editableFields.marca_id ? editableBorder : readOnlyBorder) : borderColor
                          }
                          borderWidth="2px"
                          _hover={{
                            borderColor: asset?.id
                              ? editableFields.marca_id
                                ? "blue.400"
                                : readOnlyBorder
                              : "blue.300",
                          }}
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px blue.500",
                          }}
                          transition="all 0.2s"
                        >
                          {localMarcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                              {marca.nombre}
                            </option>
                          ))}
                        </Select>
                        <Button
                          bgColor="type.primary"
                          color="white"
                          colorScheme="purple"
                          onClick={() => setIsMarcaModalOpen(true)}
                          size="lg"
                          minW="120px"
                          isDisabled={asset?.id ? !editableFields.marca_id : false}
                        >
                          + Marca
                        </Button>
                      </Flex>
                    </FormControl>

                    <FormControl>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Modelo
                          {asset?.id && !editableFields.modelo_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.modelo_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="modelo_id" />
                      </Flex>
                      <Flex gap={2}>
                        <Select
                          name="modelo_id"
                          value={formData.modelo_id || ""}
                          onChange={handleChange}
                          isDisabled={!formData.marca_id || (asset?.id ? !editableFields.modelo_id : false)}
                          flex="1"
                          placeholder="Seleccione un modelo"
                          size="lg"
                          bg={asset?.id ? (editableFields.modelo_id ? editableBg : readOnlyBg) : editableBg}
                          borderColor={
                            asset?.id ? (editableFields.modelo_id ? editableBorder : readOnlyBorder) : borderColor
                          }
                          borderWidth="2px"
                          _hover={{
                            borderColor: asset?.id
                              ? editableFields.modelo_id
                                ? "blue.400"
                                : readOnlyBorder
                              : "blue.300",
                          }}
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px blue.500",
                          }}
                          transition="all 0.2s"
                        >
                          {filteredModelos.map((modelo) => (
                            <option key={modelo.id} value={modelo.id}>
                              {modelo.nombre}
                            </option>
                          ))}
                        </Select>
                        <Button
                          bgColor="type.primary"
                          color="white"
                          colorScheme="purple"
                          onClick={() => setIsModeloModalOpen(true)}
                          isDisabled={!formData.marca_id || (asset?.id ? !editableFields.modelo_id : false)}
                          size="lg"
                          minW="120px"
                        >
                          + Modelo
                        </Button>
                      </Flex>
                    </FormControl>

                    <FormControl>
                      <Flex align="center" justify="space-between" mb={2}>
                        <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                          Condición
                          {asset?.id && !editableFields.estado_id && (
                            <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                          )}
                          {asset?.id && editableFields.estado_id && (
                            <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                          )}
                        </FormLabel>
                        <EditToggleButton fieldName="estado_id" />
                      </Flex>
                      <Select
                        name="estado_id"
                        value={formData.estado_id || ""}
                        onChange={handleChange}
                        placeholder="Seleccione una condición"
                        size="lg"
                        isDisabled={asset?.id ? !editableFields.estado_id : false}
                        bg={asset?.id ? (editableFields.estado_id ? editableBg : readOnlyBg) : editableBg}
                        borderColor={
                          asset?.id ? (editableFields.estado_id ? editableBorder : readOnlyBorder) : borderColor
                        }
                        borderWidth="2px"
                        _hover={{
                          borderColor: asset?.id
                            ? editableFields.estado_id
                              ? "blue.400"
                              : readOnlyBorder
                            : "blue.300",
                        }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        transition="all 0.2s"
                      >
                        {assetStates
                          .filter((estado) => estado.id === 2 || estado.id === 3)
                          .map((estado) => (
                            <option key={estado.id} value={estado.id}>
                              {estado.nombre}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          )}

          {/* Paso 3: Componentes */}
          {step === 2 && isComputer && (
            <Card bg={cardBg} shadow="sm" borderWidth="1px">
              <CardHeader pb={3}>
                <Flex align="center" gap={2}>
                  <Icon as={FiMonitor} color="purple.500" />
                  <Heading size="md">Componentes de Hardware</Heading>
                </Flex>
                <Text color="gray.600" fontSize="sm" mt={2}>
                  Configure los componentes de hardware de la computadora. Los campos marcados con * son obligatorios.
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <AssetComponents components={computerComponents} setComponents={setComputerComponents} />
              </CardBody>
            </Card>
          )}
        </ModalBody>

        <ModalFooter bg={sectionBg} borderTop="1px" borderColor={borderColor}>
          <Flex justify="space-between" w="full" align="center">
            <Box>
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((prev) => prev - 1)} size="lg">
                  ← Atrás
                </Button>
              )}
            </Box>
            <Flex gap={3}>
              <Button variant="ghost" onClick={onClose} size="lg">
                Cancelar
              </Button>
              {/* Botón siguiente o guardar */}
              {step < getTotalSteps() - 1 ? (
                <Button
                  bgColor="type.primary"
                  color="white"
                  colorScheme="purple"
                  onClick={handleNextStep}
                  size="lg"
                  minW="120px"
                >
                  Siguiente →
                </Button>
              ) : isComputer && !formData.id ? (
                <Button
                  bgColor="type.primary"
                  color="white"
                  colorScheme="purple"
                  onClick={handleSaveComponents}
                  size="lg"
                  minW="180px"
                >
                  Guardar Bien y Componentes
                </Button>
              ) : (
                <Button
                  bgColor="type.primary"
                  color="white"
                  colorScheme="purple"
                  onClick={handleSubmit}
                  size="lg"
                  minW="120px"
                >
                  Guardar Bien
                </Button>
              )}
            </Flex>
          </Flex>
        </ModalFooter>

        {/* Modales de Marca y Modelo */}
        <AddMarcaModeloModal
          isOpen={isMarcaModalOpen}
          onClose={() => setIsMarcaModalOpen(false)}
          type="marca"
          onAddSuccess={(createdMarca) => {
            setLocalMarcas((prev) => [...prev, createdMarca])
            setFormData((prev) => ({ ...prev, marca_id: createdMarca.id }))
          }}
        />
        <AddMarcaModeloModal
          isOpen={isModeloModalOpen}
          onClose={() => setIsModeloModalOpen(false)}
          type="modelo"
          marcaId={formData.marca_id}
          onAddSuccess={(createdModelo) => {
            setFilteredModelos((prev) => [...prev, createdModelo])
            setLocalModelos((prev) => [...prev, createdModelo])
            setFormData((prev) => ({ ...prev, modelo_id: createdModelo.id }))
          }}
        />
      </ModalContent>
    </Modal>
  )
}
