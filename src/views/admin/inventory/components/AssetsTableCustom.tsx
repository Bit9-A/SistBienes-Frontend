"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Box,
  Text,
  Checkbox,
  Flex,
  HStack,
  VStack,
  IconButton,
  Badge,
  Card,
  CardBody,
  useBreakpointValue,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Divider,
  Tooltip,
} from "@chakra-ui/react"
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiCheck, FiX, FiPackage } from "react-icons/fi"
import type { MovableAsset } from "api/AssetsApi"
import type { Department, SubGroup } from "api/SettingsApi"

interface AssetsTableCustomProps {
  isOpen: boolean
  onClose: () => void
  assets: MovableAsset[]
  departments: Department[]
  subgroups: SubGroup[]
  mode: "all" | "department"
  onSelect: (selectedAssets: MovableAsset[]) => void
  departmentId?: number
  excludedAssetIds?: number[]
}

export const AssetsTableCustom: React.FC<AssetsTableCustomProps> = ({
  isOpen,
  onClose,
  assets = [],
  departments = [],
  subgroups = [],
  mode,
  onSelect,
  departmentId,
  excludedAssetIds = [],
  showActiveOnly = true, // Por defecto, mostrar solo activos
}) => {
  const [searchId, setSearchId] = useState("")
  const [searchDept, setSearchDept] = useState("all")
  const [searchSubgroup, setSearchSubgroup] = useState("all")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const modalSize = useBreakpointValue({ base: "full", md: "6xl" })

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.600")
  const selectedBg = useColorModeValue("blue.50", "blue.900")

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (excludedAssetIds.includes(asset.id)) return false

      const matchesId =
        searchId.trim() === "" || asset.numero_identificacion?.toLowerCase().includes(searchId.toLowerCase())

      const matchesDept =
        mode === "department"
          ? String(asset.dept_id) === String(departmentId)
          : searchDept === "all" || String(asset.dept_id) === String(searchDept)

      const matchesSubgroup = searchSubgroup === "all" || String(asset.subgrupo_id) === String(searchSubgroup)

      return matchesId && matchesDept && matchesSubgroup
    })
  }, [assets, mode, departmentId, searchId, searchDept, searchSubgroup, excludedAssetIds])

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAssets = filteredAssets.slice(startIndex, endIndex)

  const handleCheck = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (currentAssets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentAssets.some((a) => a.id === id)))
    } else {
      setSelectedIds((prev) => [...prev, ...currentAssets.filter((a) => !prev.includes(a.id)).map((a) => a.id)])
    }
  }

  const handleSelectAllFiltered = () => {
    if (filteredAssets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds((prev) => prev.filter((id) => !filteredAssets.some((a) => a.id === id)))
    } else {
      setSelectedIds((prev) => [...prev, ...filteredAssets.filter((a) => !prev.includes(a.id)).map((a) => a.id)])
    }
  }

  const handleDone = () => {
    const selectedAssets = assets.filter((a) => selectedIds.includes(a.id))
    onSelect(selectedAssets)
    onClose()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const clearFilters = () => {
    setSearchId("")
    setSearchDept("all")
    setSearchSubgroup("all")
    setCurrentPage(1)
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  // Mobile card component
  const MobileAssetCard = ({ asset }: { asset: MovableAsset }) => {
    const isSelected = selectedIds.includes(asset.id)

    return (
      <Card
        variant="outline"
        bg={isSelected ? selectedBg : cardBg}
        borderColor={isSelected ? "blue.300" : borderColor}
        borderWidth={isSelected ? "2px" : "1px"}
        _hover={{ bg: isSelected ? selectedBg : hoverBg }}
        cursor="pointer"
        onClick={() => handleCheck(asset.id)}
        transition="all 0.2s"
      >
        <CardBody p={4}>
          <Flex justify="space-between" align="start" mb={3}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => handleCheck(asset.id)}
              colorScheme="blue"
              size="lg"
              onClick={(e) => e.stopPropagation()}
            />
            {isSelected && (
              <Badge colorScheme="blue" variant="solid">
                Seleccionado
              </Badge>
            )}
          </Flex>

          <VStack align="start" spacing={2}>
            <Box>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                N° IDENTIFICACIÓN
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {asset.numero_identificacion}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                DESCRIPCIÓN
              </Text>
              <Text fontSize="sm" noOfLines={2}>
                {asset.nombre_descripcion}
              </Text>
            </Box>

            <Flex justify="space-between" w="full">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  DEPARTAMENTO
                </Text>
                <Text fontSize="sm">{asset.dept_nombre || "N/A"}</Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  SUBGRUPO
                </Text>
                <Text fontSize="sm">{asset.subgrupo_nombre || "N/A"}</Text>
              </Box>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" mx={isMobile ? 2 : 4}>
        <ModalHeader pb={2}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack spacing={2}>
              <FiPackage />
              <Text>Seleccionar Bienes</Text>
            </HStack>
            <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
              {selectedIds.length} seleccionados
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* Filtros */}
          <Card variant="outline" mb={4}>
            <CardBody p={4}>
              <Flex align="center" justify="space-between" mb={3}>
                <HStack spacing={2}>
                  <FiFilter />
                  <Text fontWeight="medium" fontSize="sm">
                    Filtros de Búsqueda
                  </Text>
                </HStack>
                <Button size="xs" variant="ghost" onClick={clearFilters} leftIcon={<FiX />}>
                  Limpiar
                </Button>
              </Flex>

              <VStack spacing={3} align="stretch">
                <InputGroup size="sm">
                  <InputLeftElement>
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por número de identificación..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </InputGroup>

                <Flex direction={{ base: "column", md: "row" }} gap={3}>
                  {mode === "all" && (
                    <Select size="sm" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} flex="1">
                      <option value="all">Todos los departamentos</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={String(dept.id)}>
                          {dept.nombre}
                        </option>
                      ))}
                    </Select>
                  )}

                  <Select size="sm" value={searchSubgroup} onChange={(e) => setSearchSubgroup(e.target.value)} flex="1">
                    <option value="all">Todos los subgrupos</option>
                    {subgroups.map((sg) => (
                      <option key={sg.id} value={String(sg.id)}>
                        {sg.nombre}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Controles de selección */}
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600">
                {filteredAssets.length} bienes encontrados
              </Text>
              {filteredAssets.length > 0 && (
                <>
                  <Divider orientation="vertical" h="20px" />
                  <Button size="xs" variant="outline" onClick={handleSelectAllFiltered} leftIcon={<FiCheck />}>
                    {filteredAssets.every((a) => selectedIds.includes(a.id))
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </Button>
                </>
              )}
            </HStack>

            {selectedIds.length > 0 && (
              <Button size="xs" variant="ghost" colorScheme="red" onClick={clearSelection} leftIcon={<FiX />}>
                Limpiar selección
              </Button>
            )}
          </Flex>

          {/* Contenido principal */}
          <Box>
            {filteredAssets.length === 0 ? (
              <Card variant="outline">
                <CardBody py={12} textAlign="center">
                  <VStack spacing={3}>
                    <FiPackage size={40} color="gray.400" />
                    <Text color="gray.500" fontWeight="medium">
                      No hay bienes que coincidan con los filtros
                    </Text>
                    <Button size="sm" variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Vista móvil */}
                {isMobile ? (
                  <VStack spacing={3} align="stretch">
                    {currentAssets.map((asset) => (
                      <MobileAssetCard key={asset.id} asset={asset} />
                    ))}
                  </VStack>
                ) : (
                  /* Vista de escritorio */
                  <Card variant="outline">
                    <Box overflowX="auto">
                      <Table variant="simple" size="sm">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th w="50px">
                              <Checkbox
                                isChecked={
                                  currentAssets.length > 0 && currentAssets.every((a) => selectedIds.includes(a.id))
                                }
                                isIndeterminate={
                                  currentAssets.some((a) => selectedIds.includes(a.id)) &&
                                  !currentAssets.every((a) => selectedIds.includes(a.id))
                                }
                                onChange={handleSelectAll}
                                colorScheme="blue"
                              />
                            </Th>
                            <Th>N° Identificación</Th>
                            <Th>Descripción</Th>
                            <Th>Departamento</Th>
                            <Th>Subgrupo</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentAssets.map((asset) => {
                            const isSelected = selectedIds.includes(asset.id)
                            return (
                              <Tr
                                key={asset.id}
                                bg={isSelected ? selectedBg : "transparent"}
                                _hover={{ bg: isSelected ? selectedBg : hoverBg }}
                                cursor="pointer"
                                onClick={() => handleCheck(asset.id)}
                                transition="background 0.2s"
                              >
                                <Td>
                                  <Checkbox
                                    isChecked={isSelected}
                                    onChange={() => handleCheck(asset.id)}
                                    colorScheme="blue"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Td>
                                <Td fontWeight={isSelected ? "bold" : "normal"}>{asset.numero_identificacion}</Td>
                                <Td maxW="300px">
                                  <Text noOfLines={2} fontWeight={isSelected ? "medium" : "normal"}>
                                    {asset.nombre_descripcion}
                                  </Text>
                                </Td>
                                <Td>{asset.dept_nombre || "N/A"}</Td>
                                <Td>{asset.subgrupo_nombre || "N/A"}</Td>
                              </Tr>
                            )
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  </Card>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <Flex justify="space-between" align="center" mt={4} wrap="wrap" gap={2}>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">
                        Página {currentPage} de {totalPages}
                      </Text>
                      <Select
                        size="sm"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value))
                          setCurrentPage(1)
                        }}
                        w="auto"
                        minW="80px"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </Select>
                      <Text fontSize="sm" color="gray.600">
                        por página
                      </Text>
                    </HStack>

                    <HStack spacing={1}>
                      <Tooltip label="Página anterior">
                        <IconButton
                          aria-label="Página anterior"
                          icon={<FiChevronLeft />}
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          isDisabled={currentPage === 1}
                        />
                      </Tooltip>

                      {/* Números de página */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        if (pageNumber > 0 && pageNumber <= totalPages) {
                          return (
                            <Button
                              key={pageNumber}
                              size="sm"
                              variant={currentPage === pageNumber ? "solid" : "outline"}
                              colorScheme={currentPage === pageNumber ? "blue" : "gray"}
                              onClick={() => handlePageChange(pageNumber)}
                              minW="40px"
                            >
                              {pageNumber}
                            </Button>
                          )
                        }
                        return null
                      })}

                      <Tooltip label="Página siguiente">
                        <IconButton
                          aria-label="Página siguiente"
                          icon={<FiChevronRight />}
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          isDisabled={currentPage === totalPages}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                )}
              </>
            )}
          </Box>

          {/* Botones de acción */}
          <Flex justify="space-between" align="center" mt={6} pt={4} borderTop="1px" borderColor={borderColor}>
            <Text fontSize="sm" color="gray.600">
              {selectedIds.length} bienes seleccionados
            </Text>

            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleDone}
                isDisabled={selectedIds.length === 0}
                leftIcon={<FiCheck />}
              >
                Confirmar Selección
              </Button>
            </HStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AssetsTableCustom
