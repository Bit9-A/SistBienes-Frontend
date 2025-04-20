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
  HStack,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface SubGroup {
  id: number;
  nombre: string;
}

const SubGroup = () => {
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState<SubGroup | null>(
    null,
  );
  const [newSubGroupName, setNewSubGroupName] = useState('');
  const [activeType, setActiveType] = useState<'muebles' | 'inmuebles'>(
    'muebles',
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Simulación de datos iniciales
  useEffect(() => {
    if (activeType === 'muebles') {
      setSubGroups([
        { id: 1, nombre: 'Sillas' },
        { id: 2, nombre: 'Mesas' },
      ]);
    } else {
      setSubGroups([
        { id: 1, nombre: 'Edificios' },
        { id: 2, nombre: 'Terrenos' },
      ]);
    }
  }, [activeType]);

  const handleAdd = () => {
    if (newSubGroupName.trim() === '') return;
    const newSubGroup = {
      id: subGroups.length + 1,
      nombre: newSubGroupName,
    };
    setSubGroups([...subGroups, newSubGroup]);
    setNewSubGroupName('');
    onClose();
  };

  const handleEdit = () => {
    if (selectedSubGroup && newSubGroupName.trim() !== '') {
      setSubGroups((prev) =>
        prev.map((group) =>
          group.id === selectedSubGroup.id
            ? { ...group, nombre: newSubGroupName }
            : group,
        ),
      );
      setSelectedSubGroup(null);
      setNewSubGroupName('');
      onClose();
    }
  };

  const handleDelete = (id: number) => {
    setSubGroups((prev) => prev.filter((group) => group.id !== id));
  };

  const openEditModal = (subGroup: SubGroup) => {
    setSelectedSubGroup(subGroup);
    setNewSubGroupName(subGroup.nombre);
    onOpen();
  };

  return (
    <Box>
      {/* Botones para alternar entre Muebles e Inmuebles */}
      <HStack spacing={4} mb={4}>
        <Button
          colorScheme={activeType === 'muebles' ? 'blue' : 'gray'}
          onClick={() => setActiveType('muebles')}
        >
          Muebles
        </Button>
        <Button
          colorScheme={activeType === 'inmuebles' ? 'blue' : 'gray'}
          onClick={() => setActiveType('inmuebles')}
        >
          Inmuebles
        </Button>
      </HStack>

      <Button colorScheme="purple" bgColor={'type.bgbutton'} onClick={onOpen} mb={4}>
        Agregar Subgrupo
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
            {subGroups.map((subGroup) => (
              <Tr
                key={subGroup.id}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Td>{subGroup.id}</Td>
                <Td>
                  <Text fontWeight="medium">{subGroup.nombre}</Text>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      aria-label="Editar departamento"
                      leftIcon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => openEditModal(subGroup)}
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar departamento"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(subGroup.id)}
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
            {selectedSubGroup ? 'Editar Subgrupo' : 'Agregar Subgrupo'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre del Subgrupo"
              value={newSubGroupName}
              onChange={(e) => setNewSubGroupName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              bgColor={'type.bgbutton'}
              mr={3}
              onClick={selectedSubGroup ? handleEdit : handleAdd}
            >
              {selectedSubGroup ? 'Guardar Cambios' : 'Agregar'}
            </Button>
            <Button variant="outline" colorScheme="red" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SubGroup;
