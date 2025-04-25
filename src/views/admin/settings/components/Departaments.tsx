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
import { FiEdit, FiTrash2, FiHome} from 'react-icons/fi';

interface Department {
  id: number;
  nombre: string;
}

const Departaments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Simulación de datos iniciales
  useEffect(() => {
    setDepartments([
      { id: 1, nombre: 'Recursos Humanos' },
      { id: 2, nombre: 'Finanzas' },
    ]);
  }, []);

  const handleAdd = () => {
    if (newDepartmentName.trim() === '') return;
    const newDepartment = {
      id: departments.length + 1,
      nombre: newDepartmentName,
    };
    setDepartments([...departments, newDepartment]);
    setNewDepartmentName('');
    onClose();
  };

  const handleEdit = () => {
    if (selectedDepartment && newDepartmentName.trim() !== '') {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === selectedDepartment.id ? { ...dept, nombre: newDepartmentName } : dept
        )
      );
      setSelectedDepartment(null);
      setNewDepartmentName('');
      onClose();
    }
  };

  const handleDelete = (id: number) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setNewDepartmentName(department.nombre);
    onOpen();
  };

  return (
    <Box>
      <Button bgColor={'type.bgbutton'} leftIcon={<Icon as={FiHome as React.ElementType} />} colorScheme="purple"  onClick={onOpen} mb={4}>
              Agregar Departamento
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
            {departments.map((department) => (
              <Tr key={department.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{department.id}</Td>
                <Td>
                  <Text fontWeight="medium">{department.nombre}</Text>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      aria-label="Editar departamento"
                      leftIcon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => openEditModal(department)}
                    >Editar</Button>
                    <Button
                      aria-label="Eliminar departamento"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(department.id)}
                    >Eliminar</Button>
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
            {selectedDepartment ? 'Editar Departamento' : 'Agregar Departamento'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre del Departamento"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" bgColor={'type.bgbutton'} mr={3} onClick={selectedDepartment ? handleEdit : handleAdd}>
              {selectedDepartment ? 'Guardar Cambios' : 'Agregar'}
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

export default Departaments;