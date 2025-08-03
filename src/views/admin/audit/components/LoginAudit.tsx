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
  useBreakpointValue,
  Button,
  HStack,
} from "@chakra-ui/react"
import { FiUser, FiSearch, FiFilter, FiX, FiMonitor } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import type { Audit } from "api/AuditApi"

interface LoginAuditProps {
  audits: Audit[]
  loading: boolean
  headerBg: string
  hoverBg: string
  borderColor: string
}

const ITEMS_PER_PAGE = 10

export default function LoginAudit({ audits, loading, headerBg, hoverBg, borderColor }: LoginAuditProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Get unique departments for filter
  const departmentOptions = [...new Set(audits.map((audit) => audit.departamento).filter(Boolean))]

  // Filter audits by department and search query
  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audit.departamento || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.ip.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || audit.departamento === filterDepartment

    return matchesSearch && matchesDepartment
  })

  // Pagination
  const totalPages = Math.ceil(filteredAudits.length / ITEMS_PER_PAGE)

  const paginatedAudits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAudits.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAudits, currentPage])

  // Reset page if out of range
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin salida"
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Count active filters
  const activeFiltersCount = [searchQuery, filterDepartment !== "all" ? filterDepartment : ""].filter(Boolean).length

  // Pagination info
  const startRow = filteredAudits.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, filteredAudits.length)

  return (
    <Stack spacing={6}>
      {/* Filters Section */}
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={{ base: 3, md: 4 }}>
          <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
            <Flex align="center" gap={2}>
              <Icon as={FiFilter} color="blue.500" />
              <Text fontWeight="medium">Filtros de Sesiones</Text>
              {activeFiltersCount > 0 && (
                <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Flex>

            {(searchQuery || filterDepartment !== "all") && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="blue"
                leftIcon={<FiX />}
                onClick={() => {
                  setSearchQuery("")
                  setFilterDepartment("all")
                  setCurrentPage(1)
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </Flex>

          <Divider mb={4} />

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <InputGroup flex="2">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buscar por nombre, departamento o IP..."
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
        </CardBody>
      </Card>

      {/* Results Section */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={{ base: 3, md: 4 }}>
          {/* Results Summary */}
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color={textColor} mb={1}>
                Sesiones de Usuario
              </Heading>
              <Box color="gray.600" fontSize="sm">
                {filteredAudits.length} sesión{filteredAudits.length !== 1 ? "es" : ""} encontrada
                {filteredAudits.length !== 1 ? "s" : ""}
              </Box>
            </Box>
          </Flex>

          {/* Table Content */}
          {filteredAudits.length === 0 ? (
            <Center py={12}>
              <Stack align="center" spacing={4}>
                <Box p={4} bg="gray.100" borderRadius="full">
                  <FiMonitor size={32} color="gray" />
                </Box>
                <Box textAlign="center">
                  <Heading size="md" color="gray.500" mb={2}>
                    No hay sesiones
                  </Heading>
                  <Box color="gray.400" fontSize="sm">
                    {searchQuery || filterDepartment !== "all"
                      ? "No se encontraron sesiones que coincidan con los filtros"
                      : "No hay sesiones registradas"}
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
                overflowX="auto"
                overflowY="auto" /* Asegura el scroll vertical */
                maxH="500px" /* Altura máxima para activar el scroll vertical */
                mb={4}
              >
                <Table variant="simple" size={tableSize}>
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>N°</Th>
                      <Th>Usuario</Th>
                      <Th>Departamento</Th>
                      <Th>Entrada</Th>
                      <Th>Salida</Th>
                      <Th>IP</Th>
                      <Th>Estado</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedAudits
                      .filter((item) => item && typeof item.id !== "undefined")
                      .map((audit, index) => (
                        <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
                          <Td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Td>
                          <Td>
                            <Flex align="center" gap={2}>
                              <Icon as={FiUser} color="gray.500" />
                              <Text fontWeight="medium">{audit.nombre}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Badge variant="outline" colorScheme="purple">
                              {audit.departamento || 'Sin Departamento'}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(audit.entrada)}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color={audit.salida ? "gray.600" : "gray.400"}>
                              {formatDate(audit.salida)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" fontFamily="mono" color="gray.600">
                              {audit.ip}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={audit.salida ? "red" : "green"}
                              borderRadius="full"
                              px={2}
                              variant="subtle"
                            >
                              {audit.salida ? "Finalizada" : "Activa"}
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
                    Mostrando {startRow}-{endRow} de {filteredAudits.length} sesiones
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="purple"
                      variant="outline"
                      isDisabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        const PAGE_BUTTON_LIMIT = 4
                        const startPage = Math.max(1, currentPage - Math.floor(PAGE_BUTTON_LIMIT / 2))
                        const endPage = Math.min(totalPages, startPage + PAGE_BUTTON_LIMIT - 1)
                        return page >= startPage && page <= endPage
                      })
                      .map((page) => (
                        <Button
                          key={page}
                          size="sm"
                          bgColor={currentPage === page ? "type.primary" : undefined}
                          color={currentPage === page ? "white" : undefined}
                          variant={currentPage === page ? "solid" : "outline"}
                          colorScheme="purple"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    <Button
                      size="sm"
                      colorScheme="purple"
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
