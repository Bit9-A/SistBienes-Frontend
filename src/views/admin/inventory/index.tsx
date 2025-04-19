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
  Select,
} from '@chakra-ui/react';


import { HSeparator } from "components/separator/Separator";

import { BsBox2, BsBoxSeam } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons"
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiDownload,
  FiArchive,
} from "react-icons/fi"

// Interfaz para los bienes
interface MovableAsset {
  id: number;
  grupo: number;
  subgrupo: string;
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
//Interfaz Subgrupo
interface MovableAssetGroup {
  id: string;
  name: string;
}
interface MovableAssetCondition {
  id: number;
  name: string;
}
interface MovableAssetLocation {
  id: number;
  name: string;
}
interface Department {
  id: number;
  name: string;
}

export default function Inventory() {
  const [assets, setAssets] = useState<MovableAsset[]>([]); // Estado para los bienes
  const [group, setGroup] = useState<MovableAssetGroup[]>([]); // Estado para el grupo
  const [conditionAsset, setConditionAsset] = useState<MovableAssetCondition[]>([]); // Estado para la condicion del bien
  const [locationAsset, setLocationAsset] = useState<MovableAssetLocation[]>([]); // Estado para la ubicacion del bien
  const [departments, setDepartments] = useState<Department[]>([]); // Estado para los departamentos
  const [newAssets, setNewAssets] = useState<Partial<MovableAsset>>({}); // Estado para el formulario
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset | null>(null); // Estado para el bien seleccionado
  const [deleteConfirmation, setDeleteConfirmation] = useState('') // Estado para la confirmación de eliminación
  const { isOpen, onOpen, onClose } = useDisclosure() // Estado para el modal
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure() // Estado para el modal de edit
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure() // Estado para el modal de delete
  const [searchQuery, setSearchQuery] = useState("")
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // Simulación de carga de datos desde la base de datos
  useEffect(() => {
    // Aquí puedes reemplazar con una llamada a tu API
    setAssets([
      {
        id: 1,
        grupo: 1,
        subgrupo: "2-01",
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

  // Map for Groups - for dropdown options
  useEffect(() => {
    setGroup([
      {
        id: "2-01",
        name: "Máquinas, muebles y demás equipos de oficina",
      },
      {
        id: "2-02",
        name: "Mobiliario y enseres de Alojamiento",
      },
      {
        id: "2-03",
        name: "Máquinaria y demás equipos de construcción,campo,industria y taller ",
      },
      {
        id: "2-04",
        name: "Equipos de transporte",
      },

      {
        id: "2-12",
        name: "Otros Elementos",
      },
    ]);
  }, []);

  useEffect(() => {
    setConditionAsset([
      {
        id: 1,
        name: "Excelente",
      },
      {
        id: 2,
        name: "Dañado",
      },
      {
        id: 3,
        name: "En Reparacion",
      },
    ]);
  }, []);

  useEffect(() => {
    setLocationAsset([
      {
        id: 1,
        name: "Parr.Amenodoro Rangel Lamús",
      },
      {
        id: 2,
        name: "Parr.La Florida",
      },
      {
        id: 3,
        name: "Táriba",
      },
    ]);
  }, []);

  useEffect(() => {
    setDepartments([
      {
        id: 1,
        name: "Bienes",
      },
      {
        id: 2,
        name: "Talento Humano",
      },
      {
        id: 3,
        name: "Sistemas",
      },
    ]);
  }, []);


  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAssets({ ...newAssets, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (newAssets.nombre && newAssets.cantidad) {
      const newId = assets.length + 1;
      const assetWithId = { ...newAssets, id: newId } as MovableAsset;
      setAssets([...assets, assetWithId]);
      setNewAssets({});
    }
  };

  // Manejar Asignacion de un bien
  const handleEditClick = (asset: MovableAsset) => {
    setSelectedAssets(asset);
    setNewAssets(asset); // Rellena el formulario con los datos actuales
    onOpenEdit();
  };

  //Manejar Cambios del Edit del Bien
  const handleEdit = () => {
    if (selectedAssets && newAssets.nombre && newAssets.cantidad) {
      setAssets(assets.map(asset =>
        asset.id === selectedAssets.id ? { ...selectedAssets, ...newAssets } : asset
      ));
      setSelectedAssets(null);
      setNewAssets({});
      onCloseEdit();
    }
  };
  //Asignacion Bien a Eliminar 
  const handleDeleteClick = (asset: MovableAsset) => {
    setSelectedAssets(asset);
    onOpenDelete();
  };
  //Manejar Cambios del Delete del Bien
  const handleDelete = () => {
    if (!selectedAssets || !selectedAssets.nombre) {
      console.error("No Client selected for deletion.");
      return;
    }
    if (
      deleteConfirmation.trim().toLowerCase() === selectedAssets.nombre.trim().toLowerCase()
    ) {
      const nuevosBienes = assets.filter(
        (asset) => asset.nombre !== selectedAssets.nombre
      );
      setAssets(nuevosBienes);
      setSelectedAssets(null);
      onCloseDelete();
    } else {
      console.error("Delete confirmation failed.");
    }
  }

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
            <Heading size="lg" fontWeight="bold" color={'type.title'}>
              Inventario de Bienes
            </Heading>
            <Button variant="outline"
              color="type.bgbutton"
              borderColor="type.bgbutton"
              _hover={{ bg: "type.bgbutton", color: "type.cbutton" }} size="md" leftIcon={<Icon as={BsBox2 as React.ElementType} />} onClick={() => { setNewAssets({}); onOpen() }}>
              Agregar Bien
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

            <Button leftIcon={<Icon as={FiDownload as React.ElementType} />}
              variant="outline"
              color="type.bgbutton"
              borderColor="type.bgbutton"
              _hover={{ bg: "type.bgbutton", color: "type.cbutton" }} >
              Exportar
            </Button>
          </Flex>
          {/* Tabla de bienes */}
          <TableContainer
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            overflow="auto"
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
                  <Th display={{ base: "none", lg: "table-cell" }}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {assets.map((asset) => (
                  <Tr key={asset.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
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
                          <Text fontWeight="medium">{`${asset.nombre}`}</Text>
                          <Text fontSize="sm" color="gray.500" display={{ base: "block", md: "none" }}>
                            {asset.descripcion}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{asset.descripcion}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{asset.marca}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{asset.modelo}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{asset.cantidad}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{asset.valor_unitario}</Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>{asset.valor_total}</Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{asset.fecha}</Td>
                    <Td>
                      <Flex justify="center" gap={2}>
                        <IconButton
                          aria-label="Editar usuario"
                          icon={<Icon as={FiEdit as React.ElementType} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => { handleEditClick(asset) }}
                        />
                        <IconButton
                          aria-label="Eliminar usuario"
                          icon={<Icon as={FiTrash2 as React.ElementType} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => { handleDeleteClick(asset) }}
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
                            <MenuItem icon={<Icon as={FiArchive as React.ElementType} />}>Más Detalles</MenuItem>
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
              <Button size="sm" variant="outline"
                color="type.bgbutton"
                borderColor="type.bgbutton"
                _hover={{ bg: "type.bgbutton", color: "type.cbutton" }}>
                Anterior
              </Button>
              <Button size="sm" variant="solid"
                color="type.bgbutton"
                borderColor="type.bgbutton"
                _hover={{ bg: "type.bgbutton", color: "type.cbutton" }}>
                1
              </Button>
              <Button size="sm" variant="outline"
                color="type.bgbutton"
                borderColor="type.bgbutton"
                _hover={{ bg: "type.bgbutton", color: "type.cbutton" }}>
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
          size="lg"
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
                  <FormLabel>Serial</FormLabel>
                  <Input
                    name="numero_serial"
                    value={newAssets.numero_serial || ''}
                    onChange={handleInputChange}
                    placeholder="Serial"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="nombre"
                    value={newAssets.nombre || ''}
                    onChange={handleInputChange}
                    placeholder="Nombre del bien"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Marca</FormLabel>
                  <Input
                    name="marca"
                    value={newAssets.marca || ''}
                    onChange={handleInputChange}
                    placeholder="Marca"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Modelo</FormLabel>
                  <Input
                    name="modelo"
                    value={newAssets.modelo || ''}
                    onChange={handleInputChange}
                    placeholder="Modelo"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    name="cantidad"
                    type="number"
                    value={newAssets.cantidad || ''}
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
                    value={newAssets.valor_unitario || ''}
                    onChange={handleInputChange}
                    placeholder="Valor Unitario"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    name="id_departamento"
                    value={newAssets.departamento || ""}
                    onChange={handleInputChange}
                    borderRadius="md"
                  >
                    <option value="">Departamento...</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Seleccione Un Subgrupo</FormLabel>
                  <Select
                    name="subgrupo"
                    value={newAssets.subgrupo || ""}
                    onChange={handleInputChange}
                    borderRadius="md"
                  >
                    <option value="">Subgrupos...</option>
                    {group.map((groups) => (
                      <option key={groups.id} value={groups.id}>
                        {groups.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Condición del Bien</FormLabel>
                  <Select
                    name="id_estado"
                    value={newAssets.id_estado || ""}
                    onChange={handleInputChange}
                    borderRadius="md"
                  >
                    <option value="">Condición...</option>
                    {conditionAsset.map((groups) => (
                      <option key={groups.id} value={groups.id}>
                        {groups.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Parroquia Perteneciente</FormLabel>
                  <Select
                    name='id_Parroquia'
                    value={newAssets.id_Parroquia || ""}
                    onChange={handleInputChange}
                    borderRadius="md"
                  >
                    <option value="">Parroquia...</option>
                    {locationAsset.map((Parish) => (
                      <option key={Parish.id} value={Parish.id}>
                        {Parish.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: "span 1", md: "span 2" }}>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    name="descripcion"
                    value={newAssets.descripcion || ''}
                    onChange={handleInputChange}
                    placeholder="Descripción del bien"
                  />
                </FormControl>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cerrar
              </Button>
              <Button variant="solid"
                bg={"type.bgbutton"}
                color="type.bgbutton"
                borderColor="type.bgbutton"
                textColor="type.cbutton"
                _hover={{
                  bg: "transparent",
                  color: "type.bgbutton",
                  border: "0.5px solid",
                  borderColor: "type.bgbutton",
                }}
                onClick={() => { handleSubmit(); onClose() }}>
                Agregar Bien
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
      {/*Modal Edit*/}

      <Modal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
            Editar Bien
            <HSeparator my="5px" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">

              <FormControl>
                <FormLabel>Serial</FormLabel>
                <Input
                  name="numero_serial"
                  value={newAssets.numero_serial || ''}
                  onChange={handleInputChange}
                  placeholder="Serial"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="nombre"
                  value={newAssets.nombre || ''}
                  onChange={handleInputChange}
                  placeholder="Nombre del bien"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Marca</FormLabel>
                <Input
                  name="marca"
                  value={newAssets.marca || ''}
                  onChange={handleInputChange}
                  placeholder="Marca"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Modelo</FormLabel>
                <Input
                  name="modelo"
                  value={newAssets.modelo || ''}
                  onChange={handleInputChange}
                  placeholder="Modelo"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Cantidad</FormLabel>
                <Input
                  name="cantidad"
                  type="number"
                  value={newAssets.cantidad || ''}
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
                  value={newAssets.valor_unitario || ''}
                  onChange={handleInputChange}
                  placeholder="Valor Unitario"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Select
                  name="id_departamento"
                  value={newAssets.departamento || ""}
                  onChange={handleInputChange}
                  borderRadius="md"
                >
                  <option value="">Departamento...</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Seleccione Un Subgrupo</FormLabel>
                <Select
                  name="subgrupo"
                  value={newAssets.subgrupo || ""}
                  onChange={handleInputChange}
                  borderRadius="md"
                >
                  <option value="">Subgrupos...</option>
                  {group.map((groups) => (
                    <option key={groups.id} value={groups.id}>
                      {groups.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Condición del Bien</FormLabel>
                <Select
                  name="id_estado"
                  value={newAssets.id_estado || ""}
                  onChange={handleInputChange}
                  borderRadius="md"
                >
                  <option value="">Condición...</option>
                  {conditionAsset.map((groups) => (
                    <option key={groups.id} value={groups.id}>
                      {groups.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Parroquia Perteneciente</FormLabel>
                <Select
                  name='id_Parroquia'
                  value={newAssets.id_Parroquia || ""}
                  onChange={handleInputChange}
                  borderRadius="md"
                >
                  <option value="">Parroquia...</option>
                  {locationAsset.map((Parish) => (
                    <option key={Parish.id} value={Parish.id}>
                      {Parish.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl gridColumn={{ base: "span 1", md: "span 2" }}>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  name="descripcion"
                  value={newAssets.descripcion || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción del bien"
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => { onCloseEdit() }}>
              Cerrar
            </Button>
            <Button variant="solid"
              bg={"type.bgbutton"}
              color="type.bgbutton"
              borderColor="type.bgbutton"
              textColor="type.cbutton"
              _hover={{
                bg: "transparent",
                color: "type.bgbutton",
                border: "0.5px solid",
                borderColor: "type.bgbutton",
              }} onClick={() => { onCloseEdit(); handleEdit() }}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/*Modal Delete*/}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
            Eliminar Bien
            <HSeparator my="5px" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mt={2}>
              ¿Deseas eliminar este bien? Escribe <Badge colorScheme="red">{selectedAssets?.nombre}</Badge> para confirmar la eliminación.
            </Text>
            <Input
              mt={2}
              placeholder="Escribe el nombre del bien para confirmar"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => { onCloseDelete() }}>
              Cerrar
            </Button>
            <Button variant="solid"
              bg={"type.bgbutton"}
              color="type.bgbutton"
              borderColor="type.bgbutton"
              textColor="type.cbutton"
              _hover={{
                bg: "transparent",
                color: "type.bgbutton",
                border: "0.5px solid",
                borderColor: "type.bgbutton",
              }} onClick={() => { handleDelete() }}>
              Eliminar Bien
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}