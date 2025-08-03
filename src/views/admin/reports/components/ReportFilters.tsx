import {
  Stack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react"
import { type Department } from "api/SettingsApi"
import { FiPlus } from "react-icons/fi"
import { useState } from "react"

interface ReportFiltersProps {
  onFilterDepartment: (deptId: string) => void
  onFilterDate: (start: string, end: string) => void
  onAddClick: () => void
  startDate: string
  endDate?: string
  departments: Department[]
}

export default function ReportFilters({
  onFilterDepartment,
  onFilterDate,
  onAddClick,
  startDate,
  endDate,
  departments,
}: ReportFiltersProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all")
  const [start, setStart] = useState<string>(startDate)
  const [end, setEnd] = useState<string>(endDate || "")

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value)
    onFilterDepartment(e.target.value)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value)
    onFilterDate(e.target.value, end)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value)
    onFilterDate(start, e.target.value)
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={4} align="flex-end">
      <FormControl maxW="220px">
        <FormLabel fontSize="sm">Departamento</FormLabel>
        <Select value={selectedDept} onChange={handleDeptChange}>
          <option value="all">Todos</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.nombre}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl maxW="180px">
        <FormLabel fontSize="sm">Desde</FormLabel>
        <Input type="date" value={start} onChange={handleStartDateChange} />
      </FormControl>
      <FormControl maxW="180px">
        <FormLabel fontSize="sm">Hasta</FormLabel>
        <Input type="date" value={end} onChange={handleEndDateChange} />
      </FormControl>
      <Button
        leftIcon={<FiPlus />}
        colorScheme="purple"
        onClick={onAddClick}
        ml={{ md: 4 }}
        mt={{ base: 2, md: 0 }}
      >
        Agregar bien faltante
      </Button>
    </Flex>
  )
}