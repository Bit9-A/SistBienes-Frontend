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
  useToast,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiHome } from 'react-icons/fi';
import {
  handleAddParroquia,
  handleEditParroquia,
  handleDeleteParroquia,
  openEditParroquiaModal,
} from '../utils/ParishUtils';
import { getParroquias } from 'api/SettingsApi';
import { v4 as uuidv4 } from 'uuid';

interface Parish {
  id: number;
  nombre: string;
}

const Parish = () => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [selectedParish, setSelectedParish] = useState<Parish | null>(null);
  const [newParishName, setNewParishName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [parishToDelete, setParishToDelete] = useState<Parish | null>(null);
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const fetchParishes = async () => {
    try {
      const data = await getParroquias();
      setParishes(data);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    }
  };

  useEffect(() => {
    fetchParishes();
  }, []);

  return (
    <Box>
      <Button
        bgColor={'type.primary'}
        leftIcon={<Icon as={FiHome as React.ElementType} />}
        colorScheme="purple"
        onClick={() => {
          setSelectedParish(null);
          setNewParishName('');
          onOpen();
        }}
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
              <Th>N°</Th>
              <Th>Nombre</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {parishes.map((parish, index) => (
              <Tr
                key={uuidv4()}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Td>{index + 1}</Td>
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
                      onClick={() =>
                        openEditParroquiaModal(
                          parish,
                          setSelectedParish,
                          setNewParishName,
                          onOpen
                        )
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar parroquia"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setParishToDelete(parish);
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
              onClick={async () => {
                selectedParish
                  ? await(handleEditParroquia(
                      selectedParish,
                      newParishName,
                      setParishes,
                      onClose
                    ),
                    toast({
                      title: 'Parroquia editada con éxito',
                      description: 'La parroquia ha sido editada exitosamente.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    })
              
                  ): await (handleAddParroquia(
                      newParishName,
                      setParishes,
                      onClose
                    ),
                    toast({
                      title: 'Parroquia creada con éxito',
                      description: 'La parroquia ha sido creada exitosamente.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    })); 
                fetchParishes();
              }}
            >
              {selectedParish ? 'Guardar Cambios' : 'Agregar'}
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
              ¿Estás seguro de que deseas eliminar la parroquia{' '}
              <strong>{parishToDelete?.nombre}</strong>? Esta acción no se puede
              deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteDialogClose}>Cancelar</Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  if (parishToDelete) {
                    await handleDeleteParroquia(
                      parishToDelete.id,
                      setParishes
                    );
                    fetchParishes();
                  }
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

export default Parish;