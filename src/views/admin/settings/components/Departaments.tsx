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
  Text,
  useColorModeValue,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiHome } from 'react-icons/fi';
import { getDepartments } from '../../../../api/SettingsApi';
import {
  handleAddDepartment,
  handleEditDepartment,
  handleDeleteDepartment,
} from '../utils/DeptsUtils';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes

interface Department {
  id: number;
  nombre: string;
  codigo: string;
}

const Departaments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

 const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Box>
      <Button
        bgColor={'type.primary'}
        leftIcon={<Icon as={FiHome as React.ElementType} />}
        colorScheme="purple"
        onClick={() => {
          setSelectedDepartment(null);
          setNewDepartmentName('');
          onOpen();
        }}
        mb={4}
      >
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
              <Th>N°</Th>
              <Th>Codigo</Th>
              <Th>Nombre</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {departments.map((department, index) => (
              <Tr
                key={uuidv4()}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Td>{index + 1}</Td>
                <Td>{department.codigo}</Td>
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
                      onClick={() => {
                        setSelectedDepartment(department);
                        setNewDepartmentName(department.nombre);
                        onOpen();
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar departamento"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setDepartmentToDelete(department);
                        onDeleteDialogOpen();
                      }}
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
      {selectedDepartment ? 'Editar Departamento' : 'Agregar Departamento'}
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Input
        placeholder="Nombre del Departamento"
        value={newDepartmentName}
        onChange={(e) => setNewDepartmentName(e.target.value)}
      />
      <Input
        mt={4}
        placeholder="Código del Departamento"
        value={newDepartmentCode}
        onChange={(e) => setNewDepartmentCode(e.target.value)}
      />
    </ModalBody>
    <ModalFooter>
      <Button
        colorScheme="purple"
        bgColor={'type.primary'}
        mr={3}
        onClick={async () => {
          selectedDepartment
            ? await handleEditDepartment(
                selectedDepartment,
                newDepartmentName,
                newDepartmentCode,
                setDepartments,
                onClose
              )
            : await handleAddDepartment(
                newDepartmentName,
                newDepartmentCode,
                setDepartments,
                onClose
              );
          fetchDepartments();
        }}
      >
        {selectedDepartment ? 'Guardar Cambios' : 'Agregar'}
      </Button>
      <Button variant="ghost" onClick={onClose}>
        Cancelar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={undefined}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el departamento{' '}
              <strong>{departmentToDelete?.nombre}</strong>? Esta acción no se
              puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteDialogClose}>Cancelar</Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeleteDepartment(
                    departmentToDelete!.id,
                    setDepartments,
                  );
                  onDeleteDialogClose();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Departaments;
