"use client"

import { Table, Thead, Tbody, Tr, Th, Td, Button, Flex, TableContainer } from "@chakra-ui/react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import type { Incorporation } from "../variables/Incorporations"

interface DesktopTableProps {
  incorporations: Incorporation[]
  borderColor: string
  headerBg: string
  hoverBg: string
  tableSize: string | undefined
  onEdit: (incorporation: Incorporation) => void
  onDelete: (id: number) => void
}

export default function DesktopTable({
  incorporations,
  borderColor,
  headerBg,
  hoverBg,
  tableSize,
  onEdit,
  onDelete,
}: DesktopTableProps) {
  return (
    <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
      <Table variant="simple" size={tableSize}>
        <Thead bg={headerBg}>
          <Tr>
            <Th>ID</Th>
            <Th>N° Identificación</Th>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>Fecha</Th>
            <Th>Valor</Th>
            <Th>Cantidad</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {incorporations.map((item) => (
            <Tr key={item.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
              <Td>{item.id}</Td>
              <Td>{item.bien_id}</Td>
              <Td>{item.nombre}</Td>
              <Td>{item.descripcion}</Td>
              <Td>{item.fecha}</Td>
              <Td>{item.valor.toFixed(2)}</Td>
              <Td>{item.cantidad}</Td>
              <Td>
                <Flex justify="center" gap={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<FiEdit />}
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button size="sm" colorScheme="red" leftIcon={<FiTrash2 />} onClick={() => onDelete(item.id)}>
                    Eliminar
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
