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
} from "@chakra-ui/react"
import { FiPlus, FiTrash2 } from "react-icons/fi"

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
    const lastRamIdx = components.map((c) => c.tipo).lastIndexOf("RAM")
    const newArr = [...components]
    newArr.splice(lastRamIdx + 1, 0, { tipo: "RAM", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar Disco Duro HDD
  const handleAddHDD = () => {
    const lastHddIdx = components.map((c) => c.tipo).lastIndexOf("HDD")
    const newArr = [...components]
    newArr.splice(lastHddIdx + 1, 0, { tipo: "HDD", nombre: "", numero_serial: "" })
    setComponents(newArr)
  }

  // Agregar Disco Duro SSD
  const handleAddSSD = () => {
    const lastDiskIdx = Math.max(
      components.map((c) => c.tipo).lastIndexOf("HDD"),
      components.map((c) => c.tipo).lastIndexOf("SSD"),
    )
    const insertIdx = lastDiskIdx >= 0 ? lastDiskIdx + 1 : components.length - 1
    const newArr = [...components]
    newArr.splice(insertIdx, 0, { tipo: "SSD", nombre: "", numero_serial: "" })
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
      if (ramIndexes.length === 1) return "RAM"
      const ramIndex = ramIndexes.indexOf(idx) + 1
      return `RAM ${ramIndex}`
    }
    if (comp.tipo === "HDD") {
      const hddIndexes = components.map((c, i) => (c.tipo === "HDD" ? i : -1)).filter((i) => i !== -1)
      if (hddIndexes.length === 1) return "Disco Duro HDD"
      const hddIndex = hddIndexes.indexOf(idx) + 1
      return `Disco Duro HDD ${hddIndex}`
    }
    if (comp.tipo === "SSD") {
      const ssdIndexes = components.map((c, i) => (c.tipo === "SSD" ? i : -1)).filter((i) => i !== -1)
      if (ssdIndexes.length === 1) return "Disco Duro SSD"
      const ssdIndex = ssdIndexes.indexOf(idx) + 1
      return `Disco Duro SSD ${ssdIndex}`
    }
    if (comp.tipo === "TM") return "Tarjeta Madre"
    if (comp.tipo === "CPU") return "Procesador"
    if (comp.tipo === "PS") return "Fuente de Poder"
    return comp.tipo
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
      return true
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
            Complete la información de cada componente
          </Text>
        </Box>

        <Divider />

        <VStack spacing={4} align="stretch">
          {orderedComponents.map((comp, idx) => (
            <Box key={idx} p={3} border="1px" borderColor={borderColor} borderRadius="md">
              <HStack mb={2} justify="space-between" align="center">
                <Text fontWeight="medium" fontSize="sm" color="gray.700">
                  {getLabel(comp, components.indexOf(comp))}
                </Text>
                {isRemovable(comp, components.indexOf(comp)) && (
                  <IconButton
                    aria-label="Eliminar componente"
                    icon={<FiTrash2 />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemove(components.indexOf(comp))}
                  />
                )}
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <FormControl isRequired isInvalid={!comp.nombre}>
                  <FormLabel fontSize="xs" mb={1} color="gray.600">
                    Descripción
                  </FormLabel>
                  <Input
                    placeholder="Descripción del componente"
                    value={comp.nombre}
                    onChange={(e) => handleChange(components.indexOf(comp), "nombre", e.target.value)}
                    size="sm"
                  />
                  {!comp.nombre && <FormErrorMessage fontSize="xs">Requerido</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!comp.numero_serial}>
                  <FormLabel fontSize="xs" mb={1} color="gray.600">
                    Serial
                  </FormLabel>
                  <Input
                    placeholder="Número serial"
                    value={comp.numero_serial}
                    onChange={(e) => handleChange(components.indexOf(comp), "numero_serial", e.target.value)}
                    size="sm"
                  />
                  {!comp.numero_serial && <FormErrorMessage fontSize="xs">Requerido</FormErrorMessage>}
                </FormControl>
              </SimpleGrid>
            </Box>
          ))}
        </VStack>

        <HStack justify="center" spacing={2} pt={2}>
          <Button leftIcon={<FiPlus />} size="xs" variant="outline" onClick={handleAddRam}>
            RAM
          </Button>
          <Button leftIcon={<FiPlus />} size="xs" variant="outline" onClick={handleAddHDD}>
            HDD
          </Button>
          <Button leftIcon={<FiPlus />} size="xs" variant="outline" onClick={handleAddSSD}>
            SSD
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AssetComponents
