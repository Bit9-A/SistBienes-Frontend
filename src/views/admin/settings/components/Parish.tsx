import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiHome } from 'react-icons/fi';

interface Parish {
  id: number;
  nombre: string;
}

const Parish = () => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [selectedParish, setSelectedParish] = useState<Parish | null>(null);
  const [newParishName, setNewParishName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Simulación de datos iniciales
  useEffect(() => {
    setParishes([
      { id: 1, nombre: 'Tariba' },
      { id: 2, nombre: 'Amenodoro Rangel Lamús' },
      { id: 3, nombre: 'La Florida' },
    ]);
  }, []);

  const handleAdd = () => {
    if (newParishName.trim() === '') return;
    const newParish = {
      id: parishes.length + 1,
      nombre: newParishName,
    };
    setParishes([...parishes, newParish]);
    setNewParishName('');
    onClose();
  };

  const handleEdit = () => {
    if (selectedParish && newParishName.trim() !== '') {
      setParishes((prev) =>
        prev.map((parish) =>
          parish.id === selectedParish.id ? { ...parish, nombre: newParishName } : parish
        )
      );
      setSelectedParish(null);
      setNewParishName('');
      onClose();
    }
  };

  const handleDelete = (id: number) => {
    setParishes((prev) => prev.filter((parish) => parish.id !== id));
  };

  const openEditModal = (parish: Parish) => {
    setSelectedParish(parish);
    setNewParishName(parish.nombre);
    onOpen();
  };

  return (
    <Box>
      <Button
        bgColor={'type.primary'}
        leftIcon={<Icon as={FiHome as React.ElementType} />}
        colorScheme="purple"
        onClick={onOpen}
        mb={4}
      >
        Agregar Parroquia
      </Button>

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
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {parishes.map((parish) => (
              <Tr key={parish.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{parish.id}</Td>
                <Td>
                  <Text fontWeight="medium">{parish.nombre}</Text>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      aria-label="Editar parroquia"
                      leftIcon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => openEditModal(parish)}
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar parroquia"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(parish.id)}
                    >
                      Eliminar
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal para agregar/editar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedParish ? 'Editar Parroquia' : 'Agregar Parroquia'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre de la Parroquia"
              value={newParishName}
              onChange={(e) => setNewParishName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              bgColor={'type.primary'}
              mr={3}
              onClick={selectedParish ? handleEdit : handleAdd}
            >
              {selectedParish ? 'Guardar Cambios' : 'Agregar'}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Parish;