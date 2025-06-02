'use client';

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
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import type { Incorp } from 'api/IncorpApi';
import { v4 as uuidv4 } from 'uuid';

interface DesktopTableProps {
  incorporations: Incorp[];
  borderColor: string;
  headerBg: string;
  hoverBg: string;
  tableSize: string | undefined;
  onEdit: (incorporation: Incorp) => void;
  onDelete: (id: number) => void;
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
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {incorporations
            .filter((item) => item && typeof item.id !== 'undefined')
            .map((item,index) => (
              <Tr key={uuidv4()} _hover={{ bg: hoverBg }}>
                <Td>{index +1}</Td>
                <Td>{item.numero_identificacion}</Td>
                <Td>
                  {item.fecha
                    ? new Date(item.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : ''}
                </Td>
                <Td>{Number(item.valor).toFixed(2)}</Td>
                <Td>{item.cantidad}</Td>
                <Td>{item.concepto_nombre}</Td>
                <Td>{item.dept_nombre}</Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <IconButton
                      aria-label="Editar Incorporación"
                      icon={<Icon as={FiEdit} />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => onEdit(item)}
                    />
                    <IconButton
                      aria-label="Eliminar Incorporación"
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
  );
}
