import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Flex,
  HStack,
  Button,
  Text,
} from "@chakra-ui/react"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { useState, useMemo } from "react"
import { type MissingGoods } from "api/ReportApi"

interface DesktopTableProps {
  missingGoods: MissingGoods[]
  borderColor: string
  headerBg: string
  hoverBg: string
  tableSize: string | undefined
  onEdit: (mg: MissingGoods) => void
  onDelete: (id: number) => void
}

const ITEMS_PER_PAGE = 10

export default function DesktopTable({
  missingGoods,
  borderColor,
  headerBg,
  hoverBg,
  tableSize,
  onEdit,
  onDelete,
}: DesktopTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(missingGoods.length / ITEMS_PER_PAGE)

  const paginatedGoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return missingGoods.slice(start, start + ITEMS_PER_PAGE)
  }, [missingGoods, currentPage])

  // Si cambian los datos y la página actual queda fuera de rango, vuelve a la primera página
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  // Para mostrar el rango de filas
  const startRow = missingGoods.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, missingGoods.length)

  return (
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
              <Th>N° Identificación</Th>
              <Th>Fecha</Th>
              <Th>Unidad</Th>
              <Th>Funcionario</Th>
              <Th>Jefe</Th>
              <Th>Departamento</Th>
              <Th>Observaciones</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedGoods.map((mg, index) => (
              <Tr key={mg.id} _hover={{ bg: hoverBg }}>
                <Td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Td>
                <Td>{mg.numero_identificacion || ""}</Td>
                <Td>{mg.fecha ? new Date(mg.fecha).toLocaleDateString() : ""}</Td>
              
                <Td>{mg.unidad}</Td>
                <Td>{mg.funcionario_nombre}</Td>
                <Td>{mg.jefe_nombre}</Td>
                <Td>{mg.departamento}</Td>
                <Td>{mg.observaciones || ""}</Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Editar"
                      icon={<FiEdit2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                      onClick={() => onEdit(mg)}
                    />
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete(mg.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Paginación estilo notificaciones */}
      {totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text color="gray.600" fontSize="sm">
            Mostrando {startRow}-{endRow} de {missingGoods.length} bienes faltantes
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
                key={i}
                size="sm"
                colorScheme={currentPage === i + 1 ? "purple" : "gray"}
                variant={currentPage === i + 1 ? "solid" : "outline"}
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
  )
}