import { Table, Thead, Tbody, Tr, Th, Td, Flex, TableContainer, IconButton, Icon } from "@chakra-ui/react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import type { Desincorp } from "../../../../../api/IncorpApi"
import type { Department, ConceptoMovimiento } from "api/SettingsApi"

interface DesktopTableProps {
  disposals: Desincorp[]
  borderColor: string
  headerBg: string
  hoverBg: string
  tableSize: string | undefined
  onEdit: (disposal: Desincorp) => void
  onDelete: (id: number) => void
  departments: Department[]
  concepts: ConceptoMovimiento[]
}

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
  const getConceptName = (conceptId: number) => {
    const concept = concepts.find((c) => c.id === conceptId)
    return concept ? concept.nombre : conceptId
  }

  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId)
    return dept ? dept.nombre : deptId
  }

  return (
    <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
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
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {disposals.map((item, index) => (
            <Tr key={item.id} _hover={{ bg: hoverBg }}>
              <Td>{index + 1}</Td>
              <Td>{item.numero_identificacion}</Td>
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
              <Td>{getDepartmentName(item.dept_id)}</Td>
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
  )
}