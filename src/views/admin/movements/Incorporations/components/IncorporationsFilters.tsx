
import { Box, Button, Input, FormLabel, Stack, Text, Select, Collapse, Flex } from "@chakra-ui/react"
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { departments } from "../variables/Incorporations";

interface IncorporationsFiltersProps {
  onFilterDepartment: (deptId: string) => void
  onFilterDate: (startDate: string, endDate: string) => void
  showFilters: boolean
  toggleFilters: () => void
  startDate: string
  endDate: string
  buttonSize: string
  borderColor: string
  cardBg: string
}

export default function IncorporationsFilters({
  onFilterDepartment,
  onFilterDate,
  showFilters,
  toggleFilters,
  startDate,
  endDate,
  buttonSize,
  borderColor,
  cardBg,
}: IncorporationsFiltersProps) {
  return (
    <>
      <Button
        variant="outline"
        leftIcon={showFilters ? <FiChevronUp /> : <FiChevronDown />}
        onClick={toggleFilters}
        size={buttonSize}
        w={{ base: "full", md: "auto" }}
      >
        <Flex align="center" gap={2}>
          <FiFilter />
          <Text>Filtros</Text>
        </Flex>
      </Button>

      <Collapse in={showFilters} animateOpacity>
        <Box p={4} mb={4} border="1px" borderColor={borderColor} borderRadius="md" bg={cardBg}>
          <Stack spacing={4} direction={{ base: "column", md: "row" }}>
            <Box flex="1">
              <FormLabel htmlFor="date-filter" fontSize="sm" mb={1}>
                Filtrar por Fecha
              </FormLabel>
              <Stack direction={{ base: "column", sm: "row" }} spacing={2} align="center">
                <Input
                  type="date"
                  size="sm"
                  value={startDate}
                  onChange={(e) => onFilterDate(e.target.value, endDate)}
                  placeholder="Fecha inicial"
                />
                <Text display={{ base: "none", sm: "block" }}>a</Text>
                <Input
                  type="date"
                  size="sm"
                  value={endDate}
                  onChange={(e) => onFilterDate(startDate, e.target.value)}
                  placeholder="Fecha final"
                />
                {(startDate || endDate) && (
                  <Button size="sm" variant="ghost" onClick={() => onFilterDate("", "")}>
                    Limpiar
                  </Button>
                )}
              </Stack>
            </Box>

            <Box flex="1">
              <FormLabel htmlFor="dept-filter" fontSize="sm" mb={1}>
                Filtrar por Departamento
              </FormLabel>
              <Select
                id="dept-filter"
                placeholder="Todos los departamentos"
                size="sm"
                onChange={(e) => onFilterDepartment(e.target.value)}
              >
                <option value="">Todos los departamentos</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </>
  )
}
