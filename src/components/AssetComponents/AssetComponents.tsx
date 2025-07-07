"use client"

import React from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  IconButton,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Icon,
} from "@chakra-ui/react"
import { FiPlus, FiTrash2, FiCpu, FiHardDrive, FiBox } from "react-icons/fi"

export interface ComponentData {
  tipo: string // Ej: "TM", "CPU", "RAM", "HDD", "SSD", "PS"
  nombre: string
  numero_serial: string
}

interface AssetComponentsProps {
  components: ComponentData[]
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>
}

const AssetComponents: React.FC<AssetComponentsProps> = ({ components, setComponents }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const cardBg = useColorModeValue("white", "gray.700")

  // Inicializar componentes fijos si el array está vacío
  React.useEffect(() => {
    if (components.length === 0) {
      setComponents([
        { tipo: "TM", nombre: "", numero_serial: "" },
        { tipo: "CPU", nombre: "", numero_serial: "" },
        { tipo: "RAM", nombre: "", numero_serial: "" },
        { tipo: "HDD", nombre: "", numero_serial: "" },
        { tipo: "SSD", nombre: "", numero_serial: "" },
        { tipo: "PS", nombre: "", numero_serial: "" },
      ])
    }
    // eslint-disable-next-line
  }, [])

  // Agregar RAM adicional
  const handleAddRam = () => {
    const lastRamIdx = components.map((c) => c.tipo).lastIndexOf("RAM")
    const newArr = [...components]
    newArr.splice(lastRamIdx + 1, 0, { tipo: "RAM", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar HDD adicional
  const handleAddHDD = () => {
    const lastHddIdx = components.map((c) => c.tipo).lastIndexOf("HDD")
    const newArr = [...components]
    newArr.splice(lastHddIdx + 1, 0, { tipo: "HDD", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar SSD adicional
  const handleAddSSD = () => {
    const lastSsdIdx = components.map((c) => c.tipo).lastIndexOf("SSD")
    const newArr = [...components]
    newArr.splice(lastSsdIdx + 1, 0, { tipo: "SSD", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Eliminar componente extra
  const handleRemove = (idx: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== idx))
  }

  // Cambiar descripción o serial de un componente
  const handleChange = (idx: number, field: "nombre" | "numero_serial", value: string) => {
    setComponents((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
  }

  // Para mostrar el label correcto y numerar RAM y discos
  const getLabel = (comp: ComponentData, idx: number) => {
    if (comp.tipo === "RAM") {
      const ramIndexes = components.map((c, i) => (c.tipo === "RAM" ? i : -1)).filter((i) => i !== -1)
      if (ramIndexes.length === 1) return "Memoria RAM"
      const ramIndex = ramIndexes.indexOf(idx) + 1
      return `Memoria RAM ${ramIndex}`
    }
    if (comp.tipo === "HDD") {
      const hddIndexes = components.map((c, i) => (c.tipo === "HDD" ? i : -1)).filter((i) => i !== -1)
      if (hddIndexes.length === 1) return "Disco Duro (HDD)"
      const hddIndex = hddIndexes.indexOf(idx) + 1
      return `Disco Duro ${hddIndex} (HDD)`
    }
    if (comp.tipo === "SSD") {
      const ssdIndexes = components.map((c, i) => (c.tipo === "SSD" ? i : -1)).filter((i) => i !== -1)
      if (ssdIndexes.length === 1) return "Disco Sólido (SSD)"
      const ssdIndex = ssdIndexes.indexOf(idx) + 1
      return `Disco Sólido ${ssdIndex} (SSD)`
    }
    if (comp.tipo === "TM") return "Tarjeta Madre"
    if (comp.tipo === "CPU") return "Procesador (CPU)"
    if (comp.tipo === "PS") return "Fuente de Poder"
    return comp.tipo
  }

  // Obtener icono para cada tipo de componente
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "CPU":
        return FiCpu
      case "HDD":
      case "SSD":
        return FiHardDrive
      default:
        return FiBox
    }
  }

  // Obtener color para cada tipo de componente
  const getColor = (tipo: string) => {
    switch (tipo) {
      case "TM":
        return "blue.500"
      case "CPU":
        return "green.500"
      case "RAM":
        return "orange.500"
      case "HDD":
        return "purple.500"
      case "SSD":
        return "cyan.500"
      case "PS":
        return "red.500"
      default:
        return "gray.500"
    }
  }

  // Verificar si un componente es requerido individualmente
  const isIndividuallyRequired = (tipo: string) => {
    return ["TM", "CPU", "RAM", "PS"].includes(tipo)
  }

  // Verificar si al menos uno de los discos está completo
  const hasAtLeastOneDisk = () => {
    const hddComponents = components.filter((c) => c.tipo === "HDD")
    const ssdComponents = components.filter((c) => c.tipo === "SSD")

    const hasCompleteHDD = hddComponents.some((comp) => comp.nombre.trim() && comp.numero_serial.trim())
    const hasCompleteSSD = ssdComponents.some((comp) => comp.nombre.trim() && comp.numero_serial.trim())

    return hasCompleteHDD || hasCompleteSSD
  }

  // Verificar si un disco específico debe mostrar error
  const shouldShowDiskError = (comp: ComponentData, idx: number) => {
    if (!["HDD", "SSD"].includes(comp.tipo)) return false

    // Si ya hay al menos un disco completo, no mostrar error
    if (hasAtLeastOneDisk()) return false

    // Si este disco no está completo y no hay otros discos completos, mostrar error
    const isThisDiskComplete = comp.nombre.trim() && comp.numero_serial.trim()
    return !isThisDiskComplete
  }

  // Solo permite eliminar RAM, HDD o SSD agregados extra
  const isRemovable = (comp: ComponentData, idx: number) => {
    if (comp.tipo === "RAM") {
      const ramIndexes = components.map((c, i) => (c.tipo === "RAM" ? i : -1)).filter((i) => i !== -1)
      return ramIndexes.indexOf(idx) > 0
    }
    if (comp.tipo === "HDD") {
      const hddIndexes = components.map((c, i) => (c.tipo === "HDD" ? i : -1)).filter((i) => i !== -1)
      return hddIndexes.indexOf(idx) > 0
    }
    if (comp.tipo === "SSD") {
      const ssdIndexes = components.map((c, i) => (c.tipo === "SSD" ? i : -1)).filter((i) => i !== -1)
      return ssdIndexes.indexOf(idx) > 0
    }
    return false
  }

  // Orden visual: TM, CPU, todas las RAM, todos los HDD, todos los SSD, PS
  const orderedComponents = [
    ...components.filter((c) => c.tipo === "TM"),
    ...components.filter((c) => c.tipo === "CPU"),
    ...components.filter((c) => c.tipo === "RAM"),
    ...components.filter((c) => c.tipo === "HDD"),
    ...components.filter((c) => c.tipo === "SSD"),
    ...components.filter((c) => c.tipo === "PS"),
  ]

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            Componentes de la Computadora
          </Text>
          <Text fontSize="sm" color="gray.600">
            Complete la información de cada componente. Los campos marcados con * son obligatorios.
          </Text>
          <Text fontSize="xs" color="orange.600" mt={1}>
            Debe completar al menos un disco de almacenamiento (HDD o SSD)
          </Text>
        </Box>

        <Divider />

        <VStack spacing={3} align="stretch">
          {orderedComponents.map((comp, idx) => {
            const isRequired = isIndividuallyRequired(comp.tipo)
            const isDisk = ["HDD", "SSD"].includes(comp.tipo)
            const showDiskError = shouldShowDiskError(comp, idx)
            const isFieldRequired = isRequired || (isDisk && !hasAtLeastOneDisk())

            return (
              <Box key={idx} p={4} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" shadow="sm">
                <HStack mb={3} justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Icon as={getIcon(comp.tipo)} color={getColor(comp.tipo)} boxSize={4} />
                    <Text fontWeight="medium" fontSize="sm">
                      {getLabel(comp, idx)}
                      {isRequired && (
                        <Text as="span" color="red.500" ml={1}>
                          *
                        </Text>
                      )}
                      {isDisk && !isRequired && (
                        <Text as="span" color="orange.500" fontSize="xs" ml={1}>
                          (Al menos uno requerido)
                        </Text>
                      )}
                    </Text>
                  </HStack>
                  {isRemovable(comp, idx) && (
                    <IconButton
                      aria-label="Eliminar componente"
                      icon={<FiTrash2 />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemove(idx)}
                    />
                  )}
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <FormControl isRequired={isFieldRequired} isInvalid={!comp.nombre && (isRequired || showDiskError)}>
                    <FormLabel fontSize="xs" mb={1} color="gray.600">
                      Descripción{" "}
                      {(isRequired || (isDisk && !hasAtLeastOneDisk())) && (
                        <Text as="span" color="red.500">
                          *
                        </Text>
                      )}
                    </FormLabel>
                    <Input
                      placeholder={`Descripción del ${getLabel(comp, idx).toLowerCase()}`}
                      value={comp.nombre}
                      onChange={(e) => handleChange(idx, "nombre", e.target.value)}
                      size="sm"
                    />
                    {!comp.nombre && (isRequired || showDiskError) && (
                      <FormErrorMessage fontSize="xs">
                        {isRequired ? "Este campo es obligatorio" : "Complete al menos un disco de almacenamiento"}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isRequired={isFieldRequired}
                    isInvalid={!comp.numero_serial && (isRequired || showDiskError)}
                  >
                    <FormLabel fontSize="xs" mb={1} color="gray.600">
                      Número Serial{" "}
                      {(isRequired || (isDisk && !hasAtLeastOneDisk())) && (
                        <Text as="span" color="red.500">
                          *
                        </Text>
                      )}
                    </FormLabel>
                    <Input
                      placeholder="Número serial"
                      value={comp.numero_serial}
                      onChange={(e) => handleChange(idx, "numero_serial", e.target.value)}
                      size="sm"
                    />
                    {!comp.numero_serial && (isRequired || showDiskError) && (
                      <FormErrorMessage fontSize="xs">
                        {isRequired ? "Este campo es obligatorio" : "Complete al menos un disco de almacenamiento"}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </SimpleGrid>
              </Box>
            )
          })}
        </VStack>

        <HStack justify="center" spacing={2} pt={2} wrap="wrap">
          <Button leftIcon={<FiPlus />} size="sm" variant="outline" colorScheme="orange" onClick={handleAddRam}>
            Agregar RAM
          </Button>
          <Button leftIcon={<FiPlus />} size="sm" variant="outline" colorScheme="purple" onClick={handleAddHDD}>
            Agregar HDD
          </Button>
          <Button leftIcon={<FiPlus />} size="sm" variant="outline" colorScheme="cyan" onClick={handleAddSSD}>
            Agregar SSD
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AssetComponents
