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
} from "@chakra-ui/react"
import { type modelo, type marca, getModelosByMarca } from "../../../../api/AssetsApi"
import { FiCheck } from "react-icons/fi"
import AddMarcaModeloModal from "./BrandModal"
import "../style/AssetForm.scss"

interface AssetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (asset: any) => void
  asset: any
  departments: any[]
  subgroups: any[]
  marcas: any[]
  modelos: any[]
  parroquias: any[]
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
}) => {
  // Estado para manejar el formulario
  const [formData, setFormData] = React.useState(asset || {})
  // Estado para manejar los modelos filtrados
  const [filteredModelos, setFilteredModelos] = useState<any[]>([])
  const [localMarcas, setLocalMarcas] = useState<marca[]>(marcas)
  const [localModelos, setLocalModelos] = useState<modelo[]>(modelos)
  const [isMultiple, setIsMultiple] = useState(false) // Estado para controlar la opción seleccionada
  const toast = useToast()
  // Estado para manejar el modal de agregar marca y modelo
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false)
  const [isModeloModalOpen, setIsModeloModalOpen] = useState(false)

  // Estado para controlar el paso actual del formulario
  const [step, setStep] = useState(formData.id ? 1 : 0) // Si es edición, comenzar en paso 1
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const [newMarca, setNewMarca] = useState("")
  const [newModelo, setNewModelo] = useState("")

  // Estilos personalizados
  const primaryColor = "type.primary"
  const primaryLightColor = "type.primary"
  const primaryDarkColor = "type.primary"

  // Definir variables CSS para los colores
  useEffect(() => {
    document.documentElement.style.setProperty("--type-primary", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-light", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-dark", "var(--chakra-colors-type-primary)")
  }, [])

  //filtar modelos según la marca seleccionada
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = Number.parseInt(e.target.value, 10)
    setFormData((prev: any) => ({ ...prev, marca_id: selectedMarcaId }))

    // Si hay una marca seleccionada, filtrar los modelos
    if (selectedMarcaId) {
      try {
        const modelos = await getModelosByMarca(selectedMarcaId) // Llama a la API para obtener los modelos
        setFilteredModelos(modelos) // Actualiza los modelos filtrados
      } catch (error) {
        console.error("Error al obtener los modelos por marca:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los modelos de la marca seleccionada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } else {
      setFilteredModelos([]) // Limpia los modelos si no hay marca seleccionada
    }
  }

  // Efecto para cargar marcas y modelos al abrir el modal
  useEffect(() => {
    setFormData(asset || {})
    // Si es edición, comenzar en paso 1 y no mostrar selección de tipo
    if (asset && asset.id) {
      setStep(1)
    } else {
      setStep(0)
    }
  }, [asset])

  // Efecto para cargar marcas y modelos al abrir el modal
  useEffect(() => {
    // Filtrar modelos según la marca seleccionada
    if (formData.marca_id) {
      setFilteredModelos(modelos.filter((modelo) => modelo.marca_id === formData.marca_id))
    } else {
      setFilteredModelos([])
    }
  }, [formData.marca_id, modelos])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  // Manejar el envío del formulario
  const handleSubmit = () => {
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

    if (!formData.cantidad || formData.cantidad <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a 0.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    // Validar campos obligatorios
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
    // Si estamos editando, asegurarnos de que la fecha original se mantenga
    if (formData.id && asset.fecha) {
      formData.fecha = asset.fecha // Mantener la fecha original al editar
    }
    if (!isMultiple) {
      formData.cantidad = 1
    }
    // Formatear la fecha al formato 'YYYY-MM-DD'
    const date = new Date(formData.fecha)
    formData.fecha = date.toISOString().split("T")[0] // Extraer solo la parte de la fecha

    onSubmit(formData)
  }

  // Manejar el éxito al agregar una nueva marca
  const handleAddMarcaSuccess = (createdMarca: any) => {
    setLocalMarcas((prev) => [...prev, createdMarca])
  }

  // Manejar el éxito al agregar un nuevo modelo
  const handleAddModeloSuccess = (createdModelo: any) => {
    setFilteredModelos((prev) => [...prev, createdModelo])
    setLocalModelos((prev) => [...prev, createdModelo])
  }

  // Componente de indicador de pasos
  const StepIndicator = () => {
    // Si es edición, solo mostrar 2 pasos
    const totalSteps = formData.id ? 2 : 3
    const stepsToShow = formData.id ? [1, 2] : [0, 1, 2]

    return (
      <Flex className="asset-form-step-indicator" mb={6}>
        {stepsToShow.map((idx, index) => (
          <React.Fragment key={idx}>
            <Box
              className={`asset-form-step-indicator-item ${idx === step ? "active" : idx < step ? "completed" : ""}`}
            >
              {idx < step ? <FiCheck /> : formData.id ? index + 1 : idx + 1}
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
      // Si es edición
      return step === 1 ? "Información Básica" : "Detalles Adicionales"
    } else {
      // Si es creación
      return step === 0 ? "Tipo de Registro" : step === 1 ? "Información Básica" : "Detalles Adicionales"
    }
  }

  // Calcular el número de paso actual para mostrar
  const getStepNumber = () => {
    if (formData.id) {
      // Si es edición, solo hay 2 pasos
      return `${step === 1 ? 1 : 2} de 2`
    } else {
      // Si es creación, hay 3 pasos
      return `${step + 1} de 3`
    }
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

          {step === 0 && !formData.id ? (
            <VStack spacing={6} align="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                ¿Cómo desea registrar este bien?
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%" maxW="600px">
                <Box
                  className={`asset-form-option-button ${!isMultiple ? "selected" : ""}`}
                  onClick={() => {
                    setIsMultiple(false)
                    setFormData((prev: any) => ({ ...prev, cantidad: 1 }))
                  }}
                >
                  <Text className="asset-form-option-button-title">Bien Individual</Text>
                  <Text className="asset-form-option-button-description">
                    Registrar un solo bien con detalles específicos
                  </Text>
                </Box>

                <Box
                  className={`asset-form-option-button ${isMultiple ? "selected" : ""}`}
                  onClick={() => {
                    setIsMultiple(true)
                  }}
                >
                  <Text className="asset-form-option-button-title">Múltiples Bienes</Text>
                  <Text className="asset-form-option-button-description">
                    Registrar varios bienes del mismo tipo a la vez
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              {step === 1 && (
                <>
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
                  {/* Mostrar cantidad solo si es creación y es múltiple */}
                  {!formData.id && isMultiple && (
                    <FormControl>
                      <FormLabel className="asset-form-label">Cantidad</FormLabel>
                      <Input
                        className="asset-form-input"
                        name="cantidad"
                        type="number"
                        value={formData.cantidad || ""}
                        onChange={handleChange}
                        placeholder="Cantidad"
                      />
                    </FormControl>
                  )}
                </>
              )}

              {step === 2 && (
                <>
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
                      name="parroquia_id"
                      value={formData.parroquia_id || ""}
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
                </>
              )}
            </SimpleGrid>
          )}
        </ModalBody>
        <ModalFooter className="asset-form-modal-footer">
          {step > (formData.id ? 1 : 0) && (
            <Button className="asset-form-action-button secondary" mr={3} onClick={prevStep}>
              Atrás
            </Button>
          )}
          {step < (formData.id ? 2 : 2) ? (
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
