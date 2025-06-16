"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Card,
  CardBody,
  Heading,
  Stack,
  Center,
  Divider,
  useColorModeValue,
  Icon,
  Button,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react"
import { FiUser, FiSearch, FiFilter, FiX, FiActivity, FiCalendar } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import type { Log } from "api/AuditApi"
// import { ACTION_TYPES } from "api/AuditApi" // Removed ACTION_TYPES import

interface ActionAuditProps {
  logs: Log[]
  loading: boolean
  headerBg: string
  hoverBg: string
  borderColor: string
}

const ITEMS_PER_PAGE = 10

export default function ActionAudit({ logs, loading, headerBg, hoverBg, borderColor }: ActionAuditProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Get unique departments and actions for filter
  const departmentOptions = [...new Set(logs.map((log) => log.departamento).filter(Boolean))]
  const actionOptions = [...new Set(logs.map((log) => log.accion).filter(Boolean))].sort()

  // Filter logs by type, department and search query
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.usuario_id?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.detalles || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.accion || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.usuario_nombre || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || log.accion === filterType

    const matchesDepartment = filterDepartment === "all" || log.departamento === filterDepartment

    // Date filter
    const logDate = new Date(log.fecha)
    const fromOk = !dateFrom || logDate >= new Date(dateFrom)
    const toOk = !dateTo || logDate <= new Date(dateTo)

    return matchesSearch && matchesType && matchesDepartment && fromOk && toOk
  })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLogs, currentPage])

  // Reset page if out of range
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Count active filters
  const activeFiltersCount = [
    searchQuery,
    filterType !== "all" ? filterType : "",
    filterDepartment !== "all" ? filterDepartment : "",
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterDepartment("all")
    setDateFrom("")
    setDateTo("")
    setCurrentPage(1)
  }

  // Pagination info
  const startRow = filteredLogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)

  return (
    <Stack spacing={6}>
      {/* Filters Section */}
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Flex align="center" gap={2}>
              <Icon as={FiFilter} color="blue.500" />
              <Text fontWeight="medium">Filtros de Acciones</Text>
              {activeFiltersCount > 0 && (
                <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Flex>

            {activeFiltersCount > 0 && (
              <Button size="sm" variant="ghost" colorScheme="blue" leftIcon={<FiX />} onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            )}
          </Flex>

          <Divider mb={4} />

          <Stack spacing={4}>
            {/* Search and Type Filter */}
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <InputGroup flex="2">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por acción, usuario o detalles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  borderRadius="md"
                />
              </InputGroup>

              <Select
                flex="1"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value)
                  setCurrentPage(1)
                }}
                borderRadius="md"
              >
                <option value="all">Todas las acciones</option>
                {actionOptions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </Select>

              <Select
                flex="1"
                value={filterDepartment}
                onChange={(e) => {
                  setFilterDepartment(e.target.value)
                  setCurrentPage(1)
                }}
                borderRadius="md"
              >
                <option value="all">Todos los departamentos</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </Stack>

            {/* Date Filters */}
            <Stack direction={{ base: "column", md: "row" }} spacing={4} align="flex-end">
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Fecha desde
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiCalendar} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value)
                      setCurrentPage(1)
                    }}
                    borderRadius="md"
                    pl={10}
                  />
                </InputGroup>
              </Box>

              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Fecha hasta
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiCalendar} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value)
                      setCurrentPage(1)
                    }}
                    borderRadius="md"
                    pl={10}
                  />
                </InputGroup>
              </Box>
            </Stack>
          </Stack>
        </CardBody>
      </Card>

      {/* Results Section */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          {/* Results Summary */}
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color={textColor} mb={1}>
                Registro de Acciones
              </Heading>
              <Box color="gray.600" fontSize="sm">
                {filteredLogs.length} acción{filteredLogs.length !== 1 ? "es" : ""} encontrada
                {filteredLogs.length !== 1 ? "s" : ""}
              </Box>
            </Box>
          </Flex>

          {/* Table Content */}
          {filteredLogs.length === 0 ? (
            <Center py={12}>
              <Stack align="center" spacing={4}>
                <Box p={4} bg="gray.100" borderRadius="full">
                  <FiActivity size={32} color="gray" />
                </Box>
                <Box textAlign="center">
                  <Heading size="md" color="gray.500" mb={2}>
                    No hay acciones
                  </Heading>
                  <Box color="gray.400" fontSize="sm">
                    {activeFiltersCount > 0
                      ? "No se encontraron acciones que coincidan con los filtros"
                      : "No hay acciones registradas"}
                  </Box>
                </Box>
              </Stack>
            </Center>
          ) : (
            <>
              <TableContainer
                border="1px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="sm"
                overflow="auto"
                mb={4}
              >
                <Table variant="simple" size={tableSize}>
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>N°</Th>
                      <Th>Usuario</Th>
                      <Th>Acción</Th>
                      <Th>Fecha</Th>
                      <Th>Detalles</Th>
                      <Th>Departamento</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedLogs
                      .filter((item) => item && typeof item.id !== "undefined")
                      .map((log, index) => (
                        <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
                          <Td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Td>
                          <Td>
                            <Flex align="center" gap={2}>
                              <Icon as={FiUser} color="gray.500" />
                              <Text fontWeight="medium">{log.usuario_nombre || `Usuario ${log.usuario_id}`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                log.accion.toLowerCase().includes("crear")
                                  ? "green"
                                  : log.accion.toLowerCase().includes("eliminar")
                                    ? "red"
                                    : log.accion.toLowerCase().includes("actualizar")
                                      ? "yellow"
                                      : "blue"
                              }
                              variant="subtle"
                              borderRadius="full"
                              px={2}
                            >
                              {log.accion}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {formatDate(log.fecha)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" noOfLines={2} maxW="auto">
                              {log.detalles}
                            </Text>
                          </Td>
                          <Td>
                            <Badge variant="outline" colorScheme="purple">
                              {log.departamento || "Sin departamento"}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Flex justify="space-between" align="center" mt={4}>
                  <Text color="gray.600" fontSize="sm">
                    Mostrando {startRow}-{endRow} de {filteredLogs.length} acciones
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      isDisabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        size="sm"
                        bgColor={currentPage === i + 1 ? "blue.500" : undefined}
                        color={currentPage === i + 1 ? "white" : undefined}
                        variant={currentPage === i + 1 ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      isDisabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Siguiente
                    </Button>
                  </HStack>
                </Flex>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
