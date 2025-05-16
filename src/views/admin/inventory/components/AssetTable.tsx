"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  Badge,
  Tooltip,
  Spinner,
  useBreakpointValue,
  VStack,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiDatabase } from "react-icons/fi"
import { v4 as uuidv4 } from "uuid"
import "../style/AssetTable.scss"

interface AssetTableProps {
  assets: any[]
  onEdit: (asset: any) => void
  onDelete: (asset: any) => void
  isLoading?: boolean
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete, isLoading = false }) => {
  // Colores del tema
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  // Definir variables CSS para los colores
  useEffect(() => {
    document.documentElement.style.setProperty("--type-primary", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-dark", "var(--chakra-colors-type-primary)")
    document.documentElement.style.setProperty("--type-primary-rgb", "75, 85, 99") // Valor por defecto, se debería obtener del tema
  }, [])

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(assets.length / itemsPerPage)

  // Calcular los elementos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem)

  // Cambiar de página
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Formatear valores monetarios
  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return "N/A"

    const numValue = typeof value === "string" ? Number.parseFloat(value) : value

    if (isNaN(numValue)) return "N/A"

    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    }).format(numValue)
  }

  // Formatear fechas
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "N/A"
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "N/A"
    }

    return new Intl.DateTimeFormat("es-VE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  // Obtener el nombre del estado según su ID
  const getStatusName = (statusId: string | number | undefined): { name: string; className: string } => {
    if (!statusId) return { name: "Sin estado", className: "" }

    switch (statusId.toString()) {
      case "1":
        return { name: "Nuevo", className: "new" }
      case "2":
        return { name: "Usado", className: "used" }
      case "3":
        return { name: "Dañado", className: "damaged" }
      default:
        return { name: "Sin estado", className: "" }
    }
  }

  // Determinar si mostrar vista móvil o de escritorio
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Renderizar componente de carga
  if (isLoading) {
    return (
      <Box className="asset-table-loading">
        <Spinner size="xl" color="type.primary" className="asset-table-loading-spinner" />
        <Text className="asset-table-loading-text">Cargando bienes...</Text>
      </Box>
    )
  }

  // Renderizar mensaje cuando no hay datos
  if (!assets || assets.length === 0) {
    return (
      <Box className="asset-table-empty">
        <Box className="asset-table-empty-icon">
          <FiDatabase />
        </Box>
        <Text className="asset-table-empty-text">No hay bienes registrados</Text>
        <Text className="asset-table-empty-subtext">Agregue nuevos bienes para verlos aquí</Text>
      </Box>
    )
  }

  // Renderizar vista móvil
  if (isMobile) {
    return (
      <Box>
        <VStack spacing={4} className="asset-table-responsive">
          {currentItems.map((asset) => (
            <Card key={uuidv4()} width="100%" className="asset-table-responsive-card">
              <CardHeader pb={2} className="asset-table-responsive-card-header">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text className="asset-table-responsive-card-header-title">{asset.numero_identificacion}</Text>
                  <HStack spacing={2} className="asset-table-responsive-card-header-actions">
                    <IconButton
                      aria-label="Editar bien"
                      icon={<FiEdit />}
                      size="sm"
                      className="asset-table-action-button edit"
                      onClick={() => onEdit(asset)}
                    />
                    <IconButton
                      aria-label="Eliminar bien"
                      icon={<FiTrash2 />}
                      size="sm"
                      className="asset-table-action-button delete"
                      onClick={() => onDelete(asset)}
                    />
                  </HStack>
                </Flex>
                {asset.id_estado && (
                  <Badge className={`asset-table-status ${getStatusName(asset.id_estado).className}`} mt={2}>
                    {getStatusName(asset.id_estado).name}
                  </Badge>
                )}
              </CardHeader>
              <CardBody pt={0}>
                <SimpleGrid columns={2} spacing={3} className="asset-table-responsive-card-content">
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Descripción</Text>
                    <Text className="asset-table-responsive-card-content-item-value">
                      {asset.nombre_descripcion || "N/A"}
                    </Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Serial</Text>
                    <Text className="asset-table-responsive-card-content-item-value">
                      {asset.numero_serial || "N/A"}
                    </Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Marca</Text>
                    <Text className="asset-table-responsive-card-content-item-value">
                      {asset.marca_id || "Sin Marca"}
                    </Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Modelo</Text>
                    <Text className="asset-table-responsive-card-content-item-value">
                      {asset.modelo_id || "Sin Modelo"}
                    </Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Cantidad</Text>
                    <Text className="asset-table-responsive-card-content-item-value">{asset.cantidad || "N/A"}</Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Valor Total</Text>
                    <Text className="asset-table-responsive-card-content-item-value">
                      {formatCurrency(asset.valor_total)}
                    </Text>
                  </Box>
                  <Box className="asset-table-responsive-card-content-item">
                    <Text className="asset-table-responsive-card-content-item-label">Fecha</Text>
                    <Text className="asset-table-responsive-card-content-item-value">{formatDate(asset.fecha)}</Text>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* Paginación para móvil */}
        <Flex className="asset-table-pagination" mt={4}>
          <Text className="asset-table-pagination-info">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, assets.length)} de {assets.length}
          </Text>
          <HStack spacing={2} className="asset-table-pagination-controls">
            <IconButton
              aria-label="Página anterior"
              icon={<FiChevronLeft />}
              onClick={goToPreviousPage}
              isDisabled={currentPage === 1}
              className="asset-table-pagination-button"
            />
            <IconButton
              aria-label="Página siguiente"
              icon={<FiChevronRight />}
              onClick={goToNextPage}
              isDisabled={currentPage === totalPages}
              className="asset-table-pagination-button"
            />
          </HStack>
        </Flex>
      </Box>
    )
  }

  // Renderizar vista de escritorio (tabla)
  return (
    <Box>
      <TableContainer
        className="asset-table-container"
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        overflowX="auto"
      >
        <Table variant="simple" size="md" style={{ minWidth: "1200px" }}>
          <Thead bg={headerBg} className="asset-table-header">
            <Tr>
              <Th>N°</Th>
              <Th>Identificación</Th>
              <Th>Descripción</Th>
              <Th>Serial</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Estado</Th>
              <Th>Cantidad</Th>
              <Th>Valor Unitario</Th>
              <Th>Valor Total</Th>
              <Th>Fecha</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody className="asset-table-body">
            {currentItems.map((asset, index) => (
              <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{indexOfFirstItem + index + 1}</Td>
                <Td>
                  <Tooltip label={asset.numero_identificacion} placement="top" hasArrow>
                    <Text>{asset.numero_identificacion}</Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label={asset.nombre_descripcion} placement="top" hasArrow>
                    <Text>{asset.nombre_descripcion}</Text>
                  </Tooltip>
                </Td>
                <Td>{asset.numero_serial || "Sin Numero Serial"}</Td>
                <Td>{asset.marca_id || "Sin Marca"}</Td>
                <Td>{asset.modelo_id || "Sin Modelo"}</Td>
                <Td>
                  {asset.id_estado ? (
                    <Badge className={`asset-table-status ${getStatusName(asset.id_estado).className}`}>
                      {getStatusName(asset.id_estado).name}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>{asset.cantidad}</Td>
                <Td>{formatCurrency(asset.valor_unitario)}</Td>
                <Td>{formatCurrency(asset.valor_total)}</Td>
                <Td>{formatDate(asset.fecha)}</Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar" placement="top" hasArrow>
                      <IconButton
                        aria-label="Editar bien"
                        icon={<FiEdit />}
                        size="sm"
                        className="asset-table-action-button edit"
                        onClick={() => onEdit(asset)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar" placement="top" hasArrow>
                      <IconButton
                        aria-label="Eliminar bien"
                        icon={<FiTrash2 />}
                        size="sm"
                        className="asset-table-action-button delete"
                        onClick={() => onDelete(asset)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Flex className="asset-table-pagination" mt={4}>
        <Text className="asset-table-pagination-info">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, assets.length)} de {assets.length}
        </Text>
        <HStack spacing={2} className="asset-table-pagination-controls">
          <IconButton
            aria-label="Página anterior"
            icon={<FiChevronLeft />}
            onClick={goToPreviousPage}
            isDisabled={currentPage === 1}
            className="asset-table-pagination-button"
          />

          {/* Botones de página */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Lógica para mostrar las páginas correctas cuando hay muchas
            let pageToShow
            if (totalPages <= 5) {
              pageToShow = i + 1
            } else if (currentPage <= 3) {
              pageToShow = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + i
            } else {
              pageToShow = currentPage - 2 + i
            }

            // Solo mostrar si la página está en rango
            if (pageToShow > 0 && pageToShow <= totalPages) {
              return (
                <Button
                  key={pageToShow}
                  onClick={() => goToPage(pageToShow)}
                  className={`asset-table-pagination-button ${currentPage === pageToShow ? "active" : ""}`}
                >
                  {pageToShow}
                </Button>
              )
            }
            return null
          })}

          <IconButton
            aria-label="Página siguiente"
            icon={<FiChevronRight />}
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages}
            className="asset-table-pagination-button"
          />
        </HStack>
      </Flex>
    </Box>
  )
}
