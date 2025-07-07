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
} from "@chakra-ui/react"
import { FiMonitor } from "react-icons/fi"
import { type modelo, type marca, getModelosByMarca, type MovableAsset, createAsset } from "../../../../api/AssetsApi"
import { createComponent } from "../../../../api/ComponentsApi"
import AddMarcaModeloModal from "./BrandModal"
import AssetComponents, { type ComponentData } from "../../../../components/AssetComponents/AssetComponents"

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
  const [filteredModelos, setFilteredModelos] = useState<modelo[]>([])
  const [localMarcas, setLocalMarcas] = useState<marca[]>([])
  const [localModelos, setLocalModelos] = useState<modelo[]>([])
  const [isComputer, setIsComputer] = useState(false)
  const [step, setStep] = useState(0)
  const [createdAssetId, setCreatedAssetId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToast()

  // Modal de marca/modelo
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false)
  const [isModeloModalOpen, setIsModeloModalOpen] = useState(false)

  // Componentes de computadora
  const [computerComponents, setComputerComponents] = useState<ComponentData[]>([])

  // Efectos de inicialización
  useEffect(() => {
    setLocalMarcas(marcas || [])
    setLocalModelos(modelos || [])
  }, [marcas, modelos])

  useEffect(() => {
    if (isOpen) {
      setFormData(asset || {})
      setIsComputer(asset?.isComputer === 1)
      setStep(0)
      setCreatedAssetId(null)
      setErrors({})

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
      if (!formData.id_Parroquia) {
        newErrors.id_Parroquia = "La parroquia es obligatoria"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejo de cambios en campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Manejo de cambio de marca
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = Number.parseInt(e.target.value, 10)
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
      const assetData = {
        ...formData,
        cantidad: 1,
        isComputer: 1,
        valor_total: Number(formData.valor_unitario) * 1,
        fecha: new Date(formData.fecha!).toISOString().split("T")[0],
      }

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

    const assetData = {
      ...formData,
      cantidad: 1,
      isComputer: isComputer ? 1 : 0,
      valor_total: Number(formData.valor_unitario) * 1,
      fecha: formData.fecha ? new Date(formData.fecha).toISOString().split("T")[0] : undefined,
    }

    try {
      await onSubmit(assetData)
      toast({
        title: "Éxito",
        description: "Bien guardado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
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
    if (step === 1) return "Detalles del Bien"
    if (step === 2) return "Componentes de Computadora"
    return ""
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {formData.id ? "Editar Bien" : "Agregar Bien"} - Paso {step + 1} de {getTotalSteps()}: {getStepTitle()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Paso 1: Información Básica */}
          {step === 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl isInvalid={!!errors.numero_identificacion} isRequired>
                <FormLabel>Número de Bien</FormLabel>
                <Input
                  name="numero_identificacion"
                  value={formData.numero_identificacion || ""}
                  onChange={handleChange}
                  placeholder="Ingrese el número de identificación del bien"
                />
                <FormErrorMessage>{errors.numero_identificacion}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.nombre_descripcion} isRequired>
                <FormLabel>Descripción del Bien</FormLabel>
                <Textarea
                  name="nombre_descripcion"
                  value={formData.nombre_descripcion || ""}
                  onChange={handleChange}
                  placeholder="Describa detalladamente el bien"
                  rows={3}
                />
                <FormErrorMessage>{errors.nombre_descripcion}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dept_id} isRequired>
                <FormLabel>Departamento</FormLabel>
                <Select
                  name="dept_id"
                  value={formData.dept_id || ""}
                  onChange={handleChange}
                  placeholder="Seleccione un departamento"
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
                <FormControl isInvalid={!!errors.fecha} isRequired>
                  <FormLabel>Fecha de Registro</FormLabel>
                  <Input name="fecha" type="date" value={formData.fecha || ""} onChange={handleChange} />
                  <FormErrorMessage>{errors.fecha}</FormErrorMessage>
                </FormControl>
              )}

              {!formData.id && (
                <FormControl>
                  <FormLabel>Tipo de Bien</FormLabel>
                  <Checkbox isChecked={isComputer} onChange={handleComputerChange} colorScheme="purple">
                    <HStack spacing={2}>
                      <Icon as={FiMonitor} />
                      <Text>Es una computadora</Text>
                    </HStack>
                  </Checkbox>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Al marcar esta opción se seleccionará automáticamente "Otros Elementos" como subgrupo
                  </Text>
                </FormControl>
              )}
            </SimpleGrid>
          )}

          {/* Paso 2: Detalles del Bien */}
          {step === 1 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl isInvalid={!!errors.subgrupo_id} isRequired>
                <FormLabel>Subgrupo</FormLabel>
                <Select
                  name="subgrupo_id"
                  value={formData.subgrupo_id || ""}
                  onChange={handleChange}
                  placeholder="Seleccione un subgrupo"
                  isDisabled={isComputer} // Deshabilitado si es computadora
                >
                  {subgroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.codigo} - {g.nombre}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.subgrupo_id}</FormErrorMessage>
                {isComputer && (
                  <Text fontSize="sm" color="blue.500" mt={1}>
                    Seleccionado automáticamente: Otros Elementos (Código 12)
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.valor_unitario} isRequired>
                <FormLabel>Valor Unitario (Bs.)</FormLabel>
                <Input
                  name="valor_unitario"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_unitario || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                <FormErrorMessage>{errors.valor_unitario}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.numero_serial} isRequired>
                <FormLabel>Número Serial</FormLabel>
                <Input
                  name="numero_serial"
                  value={formData.numero_serial || ""}
                  onChange={handleChange}
                  placeholder="Ingrese el número serial del bien"
                />
                <FormErrorMessage>{errors.numero_serial}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.id_Parroquia} isRequired>
                <FormLabel>Parroquia</FormLabel>
                <Select
                  name="id_Parroquia"
                  value={formData.id_Parroquia || ""}
                  onChange={handleChange}
                  placeholder="Seleccione una parroquia"
                >
                  {parroquias.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.id_Parroquia}</FormErrorMessage>
              </FormControl>

              {/* Campos opcionales */}
              <FormControl>
                <FormLabel>Marca (Opcional)</FormLabel>
                <Flex>
                  <Select
                    name="marca_id"
                    value={formData.marca_id || ""}
                    onChange={handleMarcaChange}
                    flex="1"
                    placeholder="Seleccione una marca"
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
                    ml={2}
                    onClick={() => setIsMarcaModalOpen(true)}
                    size="sm"
                  >
                    + Marca
                  </Button>
                </Flex>
              </FormControl>

              <FormControl>
                <FormLabel>Modelo (Opcional)</FormLabel>
                <Flex>
                  <Select
                    name="modelo_id"
                    value={formData.modelo_id || ""}
                    onChange={handleChange}
                    isDisabled={!formData.marca_id}
                    flex="1"
                    placeholder="Seleccione un modelo"
                  >
                    {filteredModelos.map((modelo) => (
                      <option key={modelo.id} value={modelo.id}>
                        {modelo.nombre}
                      </option>
                    ))}
                  </Select>
                  <Button
                    ml={2}
                    bgColor="type.primary"
                    color="white"
                    colorScheme="purple"
                    onClick={() => setIsModeloModalOpen(true)}
                    isDisabled={!formData.marca_id}
                    size="sm"
                  >
                    + Modelo
                  </Button>
                </Flex>
              </FormControl>

              <FormControl>
                <FormLabel>Condición (Opcional)</FormLabel>
                <Select
                  name="id_estado"
                  value={formData.id_estado || ""}
                  onChange={handleChange}
                  placeholder="Seleccione una condición"
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
          )}

          {/* Paso 3: Componentes */}
          {step === 2 && isComputer && (
            <Box>
              <Text mb={4} fontSize="md" fontWeight="medium">
                Configure los componentes de la computadora:
              </Text>
              <AssetComponents components={computerComponents} setComponents={setComputerComponents} />
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          {step > 0 && (
            <Button mr={3} onClick={() => setStep((prev) => prev - 1)}>
              Atrás
            </Button>
          )}

          {/* Botón siguiente o guardar */}
          {step < getTotalSteps() - 1 ? (
            <Button bgColor="type.primary" color="white" colorScheme="purple" onClick={handleNextStep}>
              Siguiente
            </Button>
          ) : isComputer && !formData.id ? (
            <Button bgColor="type.primary" color="white" colorScheme="purple" onClick={handleSaveComponents}>
              Guardar Bien y Componentes
            </Button>
          ) : (
            <Button bgColor="type.primary" color="white" colorScheme="purple" onClick={handleSubmit}>
              Guardar Bien
            </Button>
          )}

          <Button variant="ghost" ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>

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
    </Modal>
  )
}
