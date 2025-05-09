import React from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid"; // Asegúrate de instalar uuid si no lo tienes

interface AssetTableProps {
  assets: any[]; // Cambia `any` por la interfaz de bienes si está definida
  onEdit: (asset: any) => void;
  onDelete: (asset: any) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "Fecha no disponible"; // Manejar fechas no definidas
    }
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida"; // Manejar fechas inválidas
    }
  
    return date.toISOString().split("T")[0]; // Formatear la fecha al formato 'YYYY-MM-DD'
  }; 


  return (
    <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto">
      <Table variant="simple" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th>N°</Th>
            <Th>Identificación</Th>
            <Th>Descripción</Th>
            <Th>Serial</Th>
            <Th>Marca</Th>
            <Th>Modelo</Th>
            <Th>Cantidad</Th>
            <Th>Valor Unitario</Th>
            <Th>Valor Total</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {assets.map((asset, index) => (
            <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
              <Td>{index + 1}</Td>
              <Td>{asset.numero_identificacion}</Td>
              <Td>{asset.nombre_descripcion}</Td>
              <Td>{asset.numero_serial}</Td>
              <Td>{asset.marca_id || "Sin Marca"}</Td>
              <Td>{asset.modelo_id || "Sin Modelo"}</Td>
              <Td>{asset.cantidad}</Td>
              <Td>{asset.valor_unitario}</Td>
              <Td>{asset.valor_total}</Td>
              <Td>{formatDate(asset.fecha)}</Td> 
              <Td>
                <Flex justify="center" gap={2}>
                  <IconButton
                    aria-label="Editar bien"
                    icon={<FiEdit />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => onEdit(asset)}
                  />
                  <IconButton
                    aria-label="Eliminar bien"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDelete(asset)}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};