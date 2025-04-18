import React, { useState, useEffect } from 'react';
import {
  Box,
  Icon,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TableContainer,
  useDisclosure,
} from '@chakra-ui/react';

import Card from 'components/card/Card';
import { HSeparator } from "components/separator/Separator";
import { BsBox2 } from "react-icons/bs";
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
  const { isOpen, onOpen, onClose } = useDisclosure() // Estado para el modal
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


  //Colores 
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  return (
    <Box p="20px">
      <Card mt="8%">
        <Flex display="flex" justify="space-between" align="center">
          <Box fontSize="2xl" fontWeight="bold" color={textColor}>
            Inventario de Bienes
          </Box>
          <Button variant="outline" size="sm" leftIcon={<Icon as={BsBox2 as React.ElementType} />} onClick={onOpen}>
            Agregar Bien
          </Button>
        </Flex>
        {/* Tabla de bienes */}
        <HSeparator my="20px" />
        <Box overflowX="auto">
          <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="hidden" mb={4}>
            <Table variant="simple" size="md">
              <Thead bg={headerBg}>
                <Tr>
                  <Th display={{ base: "none", md: "table-cell" }}>Nombre</Th>
                  <Th display={{ base: "none", lg: "table-cell" }} >Descripción</Th>
                  <Th display={{ base: "none", md: "table-cell" }}>Marca</Th>
                  <Th display={{ base: "none", md: "table-cell" }}>Modelo</Th>
                  <Th display={{ base: "none", sm: "table-cell" }}>Cantidad</Th>
                  <Th display={{ base: "none", sm: "table-cell" }}>Valor Unitario</Th>
                  <Th display={{ base: "none", sm: "table-cell" }}>Valor Total</Th>
                  <Th display={{ base: "none", lg: "table-cell" }}>Fecha</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bienes.map((bien) => (
                  <Tr key={bien.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
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
          </ TableContainer>
        </Box>

        {/* Formulario para agregar bienes */}

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          scrollBehavior="inside"
          motionPreset="slideInBottom"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
              Agregar Nuevo Bien
              <HSeparator my="5px" />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cerrar
              </Button>
              <Button colorScheme="blue" onClick={() => { handleSubmit(); onClose() }}>
                Agregar Bien
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </Box >
  );
}