"use client"

import {
  Box,
  Input,
  Select,
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
  Divider,
  useColorModeValue,
  Icon,
  Text,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react"
import { FiCalendar, FiX, FiFilter, FiUsers, FiPlus } from "react-icons/fi"
import type { Department } from "api/SettingsApi"

interface IncorporationsFiltersProps {
  onFilterDepartment: (deptId: string) => void
  onFilterDate: (startDate: string, endDate: string) => void
  onAddClick: () => void
  startDate: string
  endDate: string
  departments: Department[]
}

export default function IncorporationsFilters({
  onFilterDepartment,
  onFilterDate,
  onAddClick,
  startDate,
  endDate,
  departments,
}: IncorporationsFiltersProps) {
  // Theme colors for better visual consistency
  const cardBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Count active filters
  const activeFiltersCount = [startDate, endDate].filter(Boolean).length

  return (
    <Box>
      {/* Header with Filters Title and Add Button */}
      <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Flex align="center" gap={2}>
          <Icon as={FiFilter} color="blue.500" />
          <Text fontWeight="medium">Filtros</Text>
          {activeFiltersCount > 0 && (
            <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
              {activeFiltersCount}
            </Badge>
          )}
        </Flex>

        <Flex gap={2} align="center">
          {(startDate || endDate) && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => onFilterDate("", "")}
              leftIcon={<FiX />}
            >
              Limpiar filtros
            </Button>
          )}

          <Button
            colorScheme="purple"
            bgColor="type.primary"
            onClick={onAddClick}
            size={buttonSize}
            leftIcon={<FiPlus />}
            boxShadow="lg"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
            }}
            transition="all 0.2s"
            w={{ base: "full", md: "auto" }}
            minW={{ base: "full", md: "200px" }}
          >
            {isMobile ? "Agregar" : "Nueva Incorporación"}
          </Button>
        </Flex>
      </Flex>

      <Divider mb={4} />

      {/* Filter Controls */}
      <Stack direction={{ base: "column", md: "row" }} spacing={4} align={{ base: "stretch", md: "flex-end" }}>
        <FormControl>
          <FormLabel htmlFor="fecha-inicial" fontSize="sm" fontWeight="medium" mb={1}>
            Fecha inicial
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              id="fecha-inicial"
              type="date"
              size="md"
              value={startDate}
              onChange={(e) => onFilterDate(e.target.value, endDate)}
              pl={10}
              borderRadius="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="fecha-final" fontSize="sm" fontWeight="medium" mb={1}>
            Fecha final
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              id="fecha-final"
              type="date"
              size="md"
              value={endDate}
              onChange={(e) => onFilterDate(startDate, e.target.value)}
              pl={10}
              borderRadius="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="departamento" fontSize="sm" fontWeight="medium" mb={1}>
            Departamento
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiUsers} color="gray.400" />
            </InputLeftElement>
            <Select
              id="departamento"
              size="md"
              value={undefined}
              placeholder="Todos los departamentos"
              onChange={(e) => onFilterDepartment(e.target.value)}
              pl={10}
              borderRadius="md"
            >
              <option value="all">Todos los departamentos</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.nombre}
                </option>
              ))}
            </Select>
          </InputGroup>
        </FormControl>
      </Stack>
    </Box>
  )
}
