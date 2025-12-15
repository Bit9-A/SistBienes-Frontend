import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  TableContainer,
  IconButton,
  Icon,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useMemo } from "react";
import type { Desincorp } from "api/IncorpApi";
import type { Department, ConceptoMovimiento } from "api/SettingsApi";

interface DesktopTableProps {
  disposals: Desincorp[];
  borderColor: string;
  headerBg: string;
  hoverBg: string;
  tableSize: string | undefined;
  onEdit: (disposal: Desincorp) => void;
  onDelete: (id: number) => void;
  departments: Department[];
  concepts: ConceptoMovimiento[];
}

const ITEMS_PER_PAGE = 10;

export default function DesktopTable({
  disposals,
  borderColor,
  headerBg,
  hoverBg,
  tableSize,
  onEdit,
  onDelete,
  departments,
  concepts,
}: DesktopTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(disposals.length / ITEMS_PER_PAGE);

  const paginatedDisposals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return disposals.slice(start, start + ITEMS_PER_PAGE);
  }, [disposals, currentPage]);

  // Si cambian los datos y la página actual queda fuera de rango, vuelve a la primera página
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Para mostrar el rango de filas
  const startRow = disposals.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, disposals.length);

  // Helpers para mostrar nombres
  const getDeptName = (id?: number) =>
    departments.find((d) => d.id === id)?.nombre || "-";
  const getConceptName = (id?: number) =>
    concepts.find((c) => c.id === id)?.nombre || "-";

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
              <Th>Valor</Th>
              <Th>Cantidad</Th>
              <Th>Concepto</Th>
              <Th>Departamento</Th>
              <Th>Observaciones</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedDisposals
              .filter((item) => item && typeof item.id !== "undefined")
              .map((item, index) => (
                <Tr key={item.id} _hover={{ bg: hoverBg }}>
                  <Td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Td>
                  <Td>{item.numero_identificacion || "-"}</Td>
                  <Td>
                    {item.fecha
                      ? new Date(item.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </Td>
                  <Td>{Number(item.valor).toFixed(2)}</Td>
                  <Td>{item.cantidad}</Td>
                  <Td>{getConceptName(item.concepto_id)}</Td>
                  <Td>{getDeptName(item.dept_id)}</Td>
                  <Td>{item.observaciones || ""}</Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <IconButton
                        aria-label="Editar Desincorporación"
                        icon={<Icon as={FiEdit} />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(item)}
                      />
                      <IconButton
                        aria-label="Eliminar Desincorporación"
                        icon={<Icon as={FiTrash2} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(item.id)}
                      />
                    </Flex>
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
            Mostrando {startRow}-{endRow} de {disposals.length} desincorporaciones
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
                bgColor={currentPage === i + 1 ? "type.primary" : undefined}
                color={currentPage === i + 1 ? "type.cbutton" : undefined}
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
  );
}