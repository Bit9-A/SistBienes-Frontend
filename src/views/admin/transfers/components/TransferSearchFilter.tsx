"use client"

import type React from "react"
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Divider,
  Icon,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Select,
} from "@chakra-ui/react"
import { FiCalendar, FiX, FiFilter, FiSearch } from "react-icons/fi"
import { Department } from "../../../../api/SettingsApi"; // Importar la interfaz Department

interface TransferSearchFilterProps {
  searchQuery: string
  selectedMonth: string
  selectedYear: string
  selectedDepartmentId: string // Nueva prop
  onSearch: (query: string) => void
  onDateFilter: (month: string, year: string) => void
  onDepartmentFilter: (departmentId: string) => void // Nueva prop
  departments: Department[] // Nueva prop
  canFilterByDept: boolean // Nueva prop
}

export const TransferSearchFilter: React.FC<TransferSearchFilterProps> = ({
  searchQuery,
  selectedMonth,
  selectedYear,
  selectedDepartmentId, // Desestructurar nueva prop
  onSearch,
  onDateFilter,
  onDepartmentFilter, // Desestructurar nueva prop
  departments, // Desestructurar nueva prop
  canFilterByDept, // Desestructurar nueva prop
}) => {
  const badgeBg = useColorModeValue("blue.50", "blue.900");
  const badgeColor = useColorModeValue("blue.600", "blue.200");

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

  // Contar filtros activos
  const activeFiltersCount = [
    !!searchQuery,
    !!selectedMonth,
    !!selectedYear,
    !!selectedDepartmentId, // Incluir el nuevo filtro
  ].filter(Boolean).length;

  const handleClear = () => {
    onSearch("");
    onDateFilter("", "");
    onDepartmentFilter(""); // Limpiar también el filtro de departamento
  };

  return (
    <Box w="100%">
      {/* Header with Filters Title and Clear Button */}
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
          {activeFiltersCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={handleClear}
              leftIcon={<FiX />}
            >
              Limpiar filtros
            </Button>
          )}
        </Flex>
      </Flex>

      <Divider mb={4} />

      {/* Filter Controls */}
      <Stack direction={{ base: "column", md: "row" }} spacing={4} align={{ base: "stretch", md: "flex-end" }}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Buscar
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por ID, nombre o descripción"
              variant="outline"
              value={searchQuery ?? ''}
              onChange={(e) => onSearch(e.target.value)}
              borderRadius="md"
              pl={10}
            />
          </InputGroup>
        </FormControl>
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
              onChange={(e) => onDateFilter(e.target.value, selectedYear)}
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
              onChange={(e) => onDateFilter(selectedMonth, e.target.value)}
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
        {canFilterByDept && ( // Renderizar condicionalmente el filtro de departamento
          <FormControl>
            <FormLabel htmlFor="department-select" fontSize="sm" fontWeight="medium" mb={1}>
              Departamento
            </FormLabel>
            <InputGroup>
              <Select
                id="department-select"
                size="md"
                value={selectedDepartmentId}
                onChange={(e) => onDepartmentFilter(e.target.value)}
                borderRadius="md"
              >
                <option value="">Todos los departamentos</option>
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
  );
};
