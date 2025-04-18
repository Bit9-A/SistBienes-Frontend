import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';

// Interfaz para los bienes
interface BienMueble {
  id: number;
  grupo: number;
  subgrupo: number;
  cantidad: number;
  nombre: string;
  descripcion: string;
  marca: string;
  modelo: string;
  numero_serial: string;
  valor_unitario: number;
  valor_total: number;
  fecha: string;
  departamento: number;
  id_estado: number;
  id_Parroquia: number;
}

export default function Inventory() {
  const [bienes, setBienes] = useState<BienMueble[]>([]); // Estado para los bienes
  const [nuevoBien, setNuevoBien] = useState<Partial<BienMueble>>({}); // Estado para el formulario

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // Simulación de carga de datos desde la base de datos
  useEffect(() => {
    // Aquí puedes reemplazar con una llamada a tu API
    setBienes([
      {
        id: 1,
        grupo: 1,
        subgrupo: 1,
        cantidad: 10,
        nombre: 'Silla',
        descripcion: 'Silla de oficina ergonómica',
        marca: 'ErgoChair',
        modelo: 'X200',
        numero_serial: '12345ABC',
        valor_unitario: 150.0,
        valor_total: 1500.0,
        fecha: '2025-04-08',
        departamento: 1,
        id_estado: 1,
        id_Parroquia: 1,
      },
    ]);
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoBien({ ...nuevoBien, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (nuevoBien.nombre && nuevoBien.cantidad) {
      const nuevoId = bienes.length + 1;
      const bienConId = { ...nuevoBien, id: nuevoId } as BienMueble;
      setBienes([...bienes, bienConId]);
      setNuevoBien({});
    }
  };

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb="20px">
        <Box fontSize="2xl" fontWeight="bold" color={textColor}>
          Inventario de Bienes
        </Box>
      </Flex>

      {/* Tabla de bienes */}
      <Box overflowX="auto" mb="20px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Cantidad</Th>
              <Th>Valor Unitario</Th>
              <Th>Valor Total</Th>
              <Th>Fecha</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bienes.map((bien) => (
              <Tr key={bien.id}>
                <Td>{bien.nombre}</Td>
                <Td>{bien.descripcion}</Td>
                <Td>{bien.marca}</Td>
                <Td>{bien.modelo}</Td>
                <Td>{bien.cantidad}</Td>
                <Td>{bien.valor_unitario}</Td>
                <Td>{bien.valor_total}</Td>
                <Td>{bien.fecha}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Formulario para agregar bienes */}
      <Box>
        <Box fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
          Agregar Nuevo Bien
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              name="nombre"
              value={nuevoBien.nombre || ''}
              onChange={handleInputChange}
              placeholder="Nombre del bien"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              name="descripcion"
              value={nuevoBien.descripcion || ''}
              onChange={handleInputChange}
              placeholder="Descripción del bien"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Marca</FormLabel>
            <Input
              name="marca"
              value={nuevoBien.marca || ''}
              onChange={handleInputChange}
              placeholder="Marca"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Modelo</FormLabel>
            <Input
              name="modelo"
              value={nuevoBien.modelo || ''}
              onChange={handleInputChange}
              placeholder="Modelo"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Cantidad</FormLabel>
            <Input
              name="cantidad"
              type="number"
              value={nuevoBien.cantidad || ''}
              onChange={handleInputChange}
              placeholder="Cantidad"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Valor Unitario</FormLabel>
            <Input
              name="valor_unitario"
              type="number"
              step="0.01"
              value={nuevoBien.valor_unitario || ''}
              onChange={handleInputChange}
              placeholder="Valor Unitario"
            />
          </FormControl>
        </SimpleGrid>
        <Button mt="20px" colorScheme="blue" onClick={handleSubmit}>
          Agregar Bien
        </Button>
      </Box>
    </Box>
  );
}