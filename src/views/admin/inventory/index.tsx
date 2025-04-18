import React, { useState, useEffect } from 'react';
import {
  Box,
  Icon,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Text,
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
  Heading,
  Card,
  CardHeader,
  CardBody,
  HStack,
  InputGroup,
  InputLeftElement,
  Badge,
  IconButton,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
} from '@chakra-ui/react';


import { HSeparator } from "components/separator/Separator";

import { BsBox2, BsBoxSeam } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons"
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiUserPlus,
  FiFilter,
  FiDownload,
  FiUser,
  FiMail,
  FiHash,
} from "react-icons/fi"

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
  const [searchQuery, setSearchQuery] = useState("")
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
  const cardBg = useColorModeValue("white", "gray.700")
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Inventario de Bienes
            </Heading>
            <Button variant="outline" size="sm" leftIcon={<Icon as={BsBox2 as React.ElementType} />} onClick={onOpen}>
              Nuevo Bien
            </Button>
          </Flex>
        </CardHeader>
        {/* Tabla de bienes */}
        <CardBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={6}
            gap={4}
          >
            <HStack spacing={4} flex={{ md: 2 }}>
              <InputGroup maxW={{ md: "320px" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar Bienes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                />
              </InputGroup>
            </HStack>

            <Button leftIcon={<Icon as={FiDownload as React.ElementType} />} variant="outline" colorScheme="blue" size="md">
              Exportar
            </Button>
          </Flex>
          {/* Tabla de bienes */}
          <TableContainer
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
            mb={4}
          >
            <Table variant="simple" size="md">
              <Thead bg={headerBg}>
                <Tr>
                  <Th display={{ base: "none", md: "table-cell" }}>Nombre</Th>
                  <Th display={{ base: "none", lg: "table-cell" }}>Descripción</Th>
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
                    <Td>
                      <Flex align="center">
                        <Box
                          bg="blue.100"
                          color="blue.700"
                          borderRadius="full"
                          p={2}
                          mr={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={BsBoxSeam as React.ElementType} />

                        </Box>
                        <Box>
                          <Text fontWeight="medium">{`${bien.nombre}`}</Text>
                          <Text fontSize="sm" color="gray.500" display={{ base: "block", md: "none" }}>
                            {bien.descripcion}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={"gray"}
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {"Desconocido"}
                      </Badge>
                    </Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{bien.descripcion}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{bien.marca}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{bien.modelo}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{bien.cantidad}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{bien.valor_unitario}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{bien.valor_total}</Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{bien.fecha}</Td>
                    <Td>
                      <Flex justify="center" gap={2}>
                        <IconButton
                          aria-label="Editar usuario"
                          icon={<Icon as={FiEdit as React.ElementType} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => { }}
                        />
                        <IconButton
                          aria-label="Eliminar usuario"
                          icon={<Icon as={FiTrash2 as React.ElementType} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => { }}
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Más opciones"
                            icon={<Icon as={FiMoreVertical as React.ElementType} />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<Icon as={FiUser as React.ElementType} />}>Ver perfil</MenuItem>
                            <MenuItem icon={<Icon as={FiMail as React.ElementType} />}>Enviar correo</MenuItem>
                            <MenuItem icon={<Icon as={FiHash as React.ElementType} />}>Restablecer contraseña</MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ TableContainer>
          {/* Pagination */}
          <Flex justify="space-between" align="center" mt={4}>
            <Text color="gray.600">Mostrando Bienes</Text>
            <HStack spacing={2}>
              <Button size="sm" isDisabled={true} colorScheme={textColor} variant="outline">
                Anterior
              </Button>
              <Button size="sm" colorScheme={textColor} variant="solid">
                1
              </Button>
              <Button size="sm" isDisabled={true} colorScheme={textColor} variant="outline">
                Siguiente
              </Button>
            </HStack>
          </Flex>
        </CardBody>

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