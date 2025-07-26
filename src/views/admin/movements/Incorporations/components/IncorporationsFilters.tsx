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
  onFilterDate: (month: string, year: string) => void
  onAddClick: () => void
  selectedMonth: string
  selectedYear: string
  departments: Department[]
  canFilterByDept?: boolean
  canNewButton?: boolean
}

export default function IncorporationsFilters({
  onFilterDepartment,
  onFilterDate,
  onAddClick,
  selectedMonth,
  selectedYear,
  departments,
  canFilterByDept = false,
  canNewButton = false,
}: IncorporationsFiltersProps) {
  // Theme colors for better visual consistency
  const cardBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Generate months and years for selects
  const months = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i) // Last 10 years

  // Count active filters
  const activeFiltersCount = [selectedMonth, selectedYear].filter(Boolean).length

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
          {(selectedMonth || selectedYear) && (
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
          {canNewButton && (
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
          )
          }
        </Flex>
      </Flex>

      <Divider mb={4} />

      {/* Filter Controls */}
      <Stack direction={{ base: "column", md: "row" }} spacing={4} align={{ base: "stretch", md: "flex-end" }}>
        <FormControl>
          <FormLabel htmlFor="month-select" fontSize="sm" fontWeight="medium" mb={1}>
            Mes
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Select
              id="month-select"
              size="md"
              value={selectedMonth}
              onChange={(e) => onFilterDate(e.target.value, selectedYear)}
              pl={10}
              borderRadius="md"
            >
              <option value="">Todos los meses</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="year-select" fontSize="sm" fontWeight="medium" mb={1}>
            Año
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Select
              id="year-select"
              size="md"
              value={selectedYear}
              onChange={(e) => onFilterDate(selectedMonth, e.target.value)}
              pl={10}
              borderRadius="md"
            >
              <option value="">Todos los años</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </Select>
          </InputGroup>
        </FormControl>

         {canFilterByDept && (
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
                placeholder="Selecciona un departamento"
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
        )}
      </Stack>
    </Box>
  )
}
