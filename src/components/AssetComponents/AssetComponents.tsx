import React from "react"
import {
  Box,
  VStack,
  Heading,
  HStack,
  Icon,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  CloseButton,
  SimpleGrid,
} from "@chakra-ui/react"
import { FiCpu, FiHardDrive, FiBox, FiPlus } from "react-icons/fi"

export interface ComponentData {
  tipo: string // Ej: "TM", "CPU", "RAM", "HDD", "SSD", "PS"
  nombre: string
  numero_serial: string
}

interface AssetComponentsProps {
  components: ComponentData[]
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>
}

const BASE_COMPONENTS = [
  { tipo: "TM", label: "Tarjeta Madre", icon: FiBox, color: "blue.500" },
  { tipo: "CPU", label: "Procesador", icon: FiCpu, color: "green.500" },
  { tipo: "RAM", label: "RAM", icon: FiBox, color: "orange.500" },
  { tipo: "HDD", label: "Disco Duro (HDD)", icon: FiHardDrive, color: "purple.500" },
  { tipo: "PS", label: "Fuente de Poder", icon: FiBox, color: "purple.500" },
]

const AssetComponents: React.FC<AssetComponentsProps> = ({
  components,
  setComponents,
}) => {
  // Inicializar componentes fijos si el array está vacío
  React.useEffect(() => {
    if (components.length === 0) {
      setComponents([
        { tipo: "TM", nombre: "", numero_serial: "" },
        { tipo: "CPU", nombre: "", numero_serial: "" },
        { tipo: "RAM", nombre: "", numero_serial: "" },
        { tipo: "HDD", nombre: "", numero_serial: "" },
        { tipo: "PS", nombre: "", numero_serial: "" },
      ])
    }
    // eslint-disable-next-line
  }, [])

  // Agregar RAM
  const handleAddRam = () => {
    // Inserta después del último RAM
    const lastRamIdx = components.map(c => c.tipo).lastIndexOf("RAM")
    const newArr = [...components]
    newArr.splice(lastRamIdx + 1, 0, { tipo: "RAM", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar Disco Duro HDD
  const handleAddHDD = () => {
    // Inserta después del último HDD
    const lastHddIdx = components.map(c => c.tipo).lastIndexOf("HDD")
    const newArr = [...components]
    newArr.splice(lastHddIdx + 1, 0, { tipo: "HDD", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar Disco Duro SSD (al final de los discos)
  const handleAddSSD = () => {
    // Inserta después del último SSD o HDD
    const lastDiskIdx = Math.max(
      components.map(c => c.tipo).lastIndexOf("HDD"),
      components.map(c => c.tipo).lastIndexOf("SSD")
    )
    const insertIdx = lastDiskIdx >= 0 ? lastDiskIdx + 1 : components.length - 1
    const newArr = [...components]
    newArr.splice(insertIdx, 0, { tipo: "SSD", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Eliminar RAM o Disco Duro extra (no los fijos)
  const handleRemove = (idx: number) => {
    setComponents(prev => prev.filter((_, i) => i !== idx))
  }

  // Cambiar nombre o serial de un componente
  const handleChange = (idx: number, field: "nombre" | "numero_serial", value: string) => {
    setComponents(prev =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    )
  }

  // Para mostrar el label correcto y numerar RAM y discos
  const getLabel = (comp: ComponentData, idx: number) => {
    if (comp.tipo === "RAM") {
      const ramIndexes = components
        .map((c, i) => (c.tipo === "RAM" ? i : -1))
        .filter(i => i !== -1)
      if (ramIndexes.length === 1) return "RAM"
      const ramIndex = ramIndexes.indexOf(idx) + 1
      return `RAM ${ramIndex}`
    }
    if (comp.tipo === "HDD") {
      const hddIndexes = components
        .map((c, i) => (c.tipo === "HDD" ? i : -1))
        .filter(i => i !== -1)
      if (hddIndexes.length === 1) return "Disco Duro HDD"
      const hddIndex = hddIndexes.indexOf(idx) + 1
      return `Disco Duro HDD ${hddIndex}`
    }
    if (comp.tipo === "SSD") {
      const ssdIndexes = components
        .map((c, i) => (c.tipo === "SSD" ? i : -1))
        .filter(i => i !== -1)
      if (ssdIndexes.length === 1) return "Disco Duro SSD"
      const ssdIndex = ssdIndexes.indexOf(idx) + 1
      return `Disco Duro SSD ${ssdIndex}`
    }
    if (comp.tipo === "TM") return "Tarjeta Madre"
    if (comp.tipo === "CPU") return "Procesador"
    if (comp.tipo === "PS") return "Fuente de Poder"
    return comp.tipo
  }

  // Para mostrar el icono correcto
  const getIcon = (tipo: string) => {
    if (tipo === "CPU") return FiCpu
    if (tipo === "RAM") return FiBox
    if (tipo === "HDD" || tipo === "SSD") return FiHardDrive
    if (tipo === "TM" || tipo === "PS") return FiBox
    return FiBox
  }

  const getColor = (tipo: string) => {
    if (tipo === "CPU") return "green.500"
    if (tipo === "RAM") return "orange.500"
    if (tipo === "HDD" || tipo === "SSD") return "purple.500"
    if (tipo === "TM") return "blue.500"
    if (tipo === "PS") return "purple.500"
    return "gray.500"
  }

  // Solo permite eliminar RAM, HDD o SSD agregados extra (no los fijos)
  const isRemovable = (comp: ComponentData, idx: number) => {
    // Solo puedes eliminar si no es el primero de su tipo
    if (comp.tipo === "RAM") {
      const ramIndexes = components
        .map((c, i) => (c.tipo === "RAM" ? i : -1))
        .filter(i => i !== -1)
      return ramIndexes.indexOf(idx) > 0
    }
    if (comp.tipo === "HDD") {
      const hddIndexes = components
        .map((c, i) => (c.tipo === "HDD" ? i : -1))
        .filter(i => i !== -1)
      return hddIndexes.indexOf(idx) > 0
    }
    if (comp.tipo === "SSD") {
      // Todos los SSD pueden eliminarse
      return true
    }
    return false
  }

  // Orden visual: TM, CPU, todas las RAM, todos los HDD, todos los SSD, PS
  const orderedComponents = [
    ...components.filter(c => c.tipo === "TM"),
    ...components.filter(c => c.tipo === "CPU"),
    ...components.filter(c => c.tipo === "RAM"),
    ...components.filter(c => c.tipo === "HDD"),
    ...components.filter(c => c.tipo === "SSD"),
    ...components.filter(c => c.tipo === "PS"),
  ]

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="md" mb={2}>
            <HStack justify="center" spacing={2}>
              <Icon as={FiCpu} color="blue.500" />
              <Text>Componentes de la Computadora</Text>
            </HStack>
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Complete la información de cada componente. Todos los campos son obligatorios.
          </Text>
        </Box>

        <Divider />

        <VStack spacing={6} align="stretch">
          {orderedComponents.map((comp, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              position="relative"
            >
              <HStack mb={4}>
                <Icon as={getIcon(comp.tipo)} color={getColor(comp.tipo)} boxSize={5} />
                <Text fontWeight="bold" fontSize="lg">{getLabel(comp, components.indexOf(comp))}</Text>
                {isRemovable(comp, components.indexOf(comp)) && (
                  <CloseButton
                    size="sm"
                    color="red.500"
                    onClick={() => handleRemove(components.indexOf(comp))}
                    ml={2}
                  />
                )}
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired mb={2} isInvalid={!comp.nombre}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    placeholder={`Nombre del ${getLabel(comp, components.indexOf(comp))}`}
                    value={comp.nombre}
                    onChange={e => handleChange(components.indexOf(comp), "nombre", e.target.value)}
                    size="md"
                    isRequired
                  />
                  {!comp.nombre && (
                    <FormErrorMessage>El nombre es obligatorio</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!comp.numero_serial}>
                  <FormLabel>Serial</FormLabel>
                  <Input
                    placeholder={`Serial del ${getLabel(comp, components.indexOf(comp))}`}
                    value={comp.numero_serial}
                    onChange={e => handleChange(components.indexOf(comp), "numero_serial", e.target.value)}
                    size="md"
                    isRequired
                  />
                  {!comp.numero_serial && (
                    <FormErrorMessage>El serial es obligatorio</FormErrorMessage>
                  )}
                </FormControl>
              </SimpleGrid>
            </Box>
          ))}
        </VStack>

        <HStack w="100%" justify="flex-end" spacing={4}>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="orange"
            variant="outline"
            onClick={handleAddRam}
          >
            Agregar RAM
          </Button>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="purple"
            variant="outline"
            onClick={handleAddHDD}
          >
            Agregar HDD
          </Button>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            variant="outline"
            onClick={handleAddSSD}
          >
            Agregar SSD
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AssetComponents