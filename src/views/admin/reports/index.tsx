"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Stack,
  Center,
  Divider,
  Icon,
  useBreakpointValue,
  HStack,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react"
import { FiPlus, FiSearch, FiFilter, FiX, FiFileText, FiUsers } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import * as ReportUtils from "./utils/ReportUtils"
import type { MissingGood } from "api/ReportApi"
import ReportForm from "./components/ReportForm"
import { getProfile } from "api/UserApi"

const ITEMS_PER_PAGE = 10

const MissingAssetsReport = () => {
  const [missingAssets, setMissingAssets] = useState<MissingGood[]>([])
  const [filteredAssets, setFilteredAssets] = useState<MissingGood[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isBienes, setIsBienes] = useState(false)
  const [deptId, setDeptId] = useState<number | null>(null)
  const toast = useToast()

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })

  // Get unique departments for filter
  const departmentOptions = [...new Set(missingAssets.map((asset) => asset.departamento).filter(Boolean))].sort()

  // Apply filters
  useEffect(() => {
    let filtered = [...missingAssets]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.funcionario_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.jefe_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.departamento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.numero_identificacion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.observaciones?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter((asset) => asset.departamento === filterDepartment)
    }

    setFilteredAssets(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [missingAssets, searchQuery, filterDepartment])

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE)

  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAssets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAssets, currentPage])

  // Reset page if out of range
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchMissingAssets = async () => {
      try {
        setLoading(true)
        setError(null)

        const profile = await getProfile()
        let assets: MissingGood[] = []
        setIsAdmin(profile?.nombre_tipo_usuario === "Administrador")
        setIsBienes(profile?.dept_id === 1)
        setDeptId(profile?.dept_id)

        if (profile?.nombre_tipo_usuario === "Administrador" || profile?.dept_id === 1) {
          // Admins and Bienes see all
          assets = await ReportUtils.getMissingAssets()
        } else {
          // Others see only their department
          assets = (await ReportUtils.getMissingAssets()).filter((asset) => asset.unidad === profile?.dept_id)
        }
        setMissingAssets(assets)
      } catch (error) {
        console.error("Error al cargar los bienes faltantes:", error)
        setError("Error al cargar los datos. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchMissingAssets()
  }, [])

  const handleCreateReport = async (newMissingGood: Omit<MissingGood, "id">) => {
    try {
      const profile = await getProfile()

      const updatedMissingGood = {
        ...newMissingGood,
        funcionario_id: profile?.id || 0,
        fecha: new Date().toISOString(),
        funcionario_nombre: "",
        jefe_nombre: "",
        departamento: "",
        numero_identificacion: "",
      }

      await ReportUtils.createMissingAsset(updatedMissingGood)

      // Refresh the list after creating the reports
      const updatedAssets = await ReportUtils.getMissingAssets()
      setMissingAssets(updatedAssets)

      toast({
        title: "Reporte creado",
        description: "El reporte de bien faltante se ha creado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error creating missing asset report:", error)
      toast({
        title: "Error",
        description: "Error al crear el reporte",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      throw error
    }
  }

  // Count active filters
  const activeFiltersCount = [searchQuery, filterDepartment !== "all" ? filterDepartment : ""].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterDepartment("all")
    setCurrentPage(1)
  }

  // Pagination info
  const startRow = filteredAssets.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, filteredAssets.length)

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Center py={20}>
            <Stack align="center" spacing={4}>
              <Spinner size="xl" color="purple.500" thickness="4px" />
              <Heading size="md" color={textColor}>
                Cargando reportes...
              </Heading>
            </Stack>
          </Center>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Alert status="error" borderRadius="lg" mt={8}>
            <AlertIcon />
            <Box>
              <AlertTitle>Error al cargar reportes</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="7xl" py={6}>
        {/* Header Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardHeader>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={4}
            >
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Box p={2} bg="purple.100" borderRadius="lg">
                    <FiFileText size={24} color="purple" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Reportes de Bienes Faltantes
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Gestión y seguimiento de bienes reportados como faltantes
                </Box>
              </Box>

              <Button
                bgColor="type.primary"
                colorScheme="purple"
                leftIcon={<FiPlus />}
                onClick={onOpen}
                size={buttonSize}
                boxShadow="lg"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                transition="all 0.2s"
                w={{ base: "full", lg: "auto" }}
                minW="200px"
              >
                Nuevo Reporte
              </Button>
            </Flex>
          </CardHeader>
        </Card>

        {/* Filters Section */}
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardBody p={6}>
            <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
              <Flex align="center" gap={2}>
                <Icon as={FiFilter} color="purple.500" />
                <Text fontWeight="medium">Filtros de Reportes</Text>
                {activeFiltersCount > 0 && (
                  <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
                    {activeFiltersCount}
                  </Badge>
                )}
              </Flex>

              {activeFiltersCount > 0 && (
                <Button size="sm" variant="ghost" colorScheme="purple" leftIcon={<FiX />} onClick={clearAllFilters}>
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
                  placeholder="Buscar por funcionario, jefe, departamento, identificación u observaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                />
              </InputGroup>

              <Select
                flex="1"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
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

        {/* Content Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            {/* Results Summary */}
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="md" color={textColor} mb={1}>
                  Bienes Faltantes
                </Heading>
                <Box color="gray.600" fontSize="sm">
                  {filteredAssets.length} reporte{filteredAssets.length !== 1 ? "s" : ""} encontrado
                  {filteredAssets.length !== 1 ? "s" : ""}
                </Box>
              </Box>
            </Flex>

            {/* Table Content */}
            {filteredAssets.length === 0 ? (
              <Center py={12}>
                <Stack align="center" spacing={4}>
                  <Box p={4} bg="gray.100" borderRadius="full">
                    <FiFileText size={32} color="gray" />
                  </Box>
                  <Box textAlign="center">
                    <Heading size="md" color="gray.500" mb={2}>
                      No hay reportes
                    </Heading>
                    <Box color="gray.400" fontSize="sm">
                      {activeFiltersCount > 0
                        ? "No se encontraron reportes que coincidan con los filtros"
                        : "No hay reportes de bienes faltantes registrados"}
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
                        <Th>Unidad de Trabajo</Th>
                        <Th>Existencias</Th>
                        <Th>Diferencia Cantidad</Th>
                        <Th>Diferencia Valor</Th>
                        <Th>Funcionario</Th>
                        <Th>Jefe</Th>
                        <Th>Observaciones</Th>
                        <Th>N° Identificación</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedAssets
                        .filter((item) => item && typeof item.id !== "undefined")
                        .map((asset, index) => (
                          <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
                            <Td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Td>
                            <Td>
                              <Badge variant="outline" colorScheme="purple">
                                {asset.departamento}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontWeight="medium">{asset.existencias}</Text>
                            </Td>
                            <Td>
                              <Badge colorScheme={asset.diferencia_cantidad > 0 ? "red" : "green"} variant="subtle">
                                {asset.diferencia_cantidad}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {Number(asset.diferencia_valor).toFixed(2)}
                              </Text>
                            </Td>
                            <Td>
                              <Flex align="center" gap={2}>
                                <Icon as={FiUsers} color="gray.500" />
                                <Text fontWeight="medium">{asset.funcionario_nombre}</Text>
                              </Flex>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{asset.jefe_nombre}</Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" noOfLines={2} maxW="200px">
                                {asset.observaciones}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" fontFamily="mono" color="gray.600">
                                {asset.numero_identificacion}
                              </Text>
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
                      Mostrando {startRow}-{endRow} de {filteredAssets.length} reportes
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
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          size="sm"
                          bgColor={currentPage === i + 1 ? "purple.500" : undefined}
                          color={currentPage === i + 1 ? "white" : undefined}
                          variant={currentPage === i + 1 ? "solid" : "outline"}
                          colorScheme="purple"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
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

        {/* Report Form Modal */}
        <ReportForm isOpen={isOpen} onClose={onClose} onCreateReport={handleCreateReport} />
      </Container>
    </Box>
  )
}

export default MissingAssetsReport
