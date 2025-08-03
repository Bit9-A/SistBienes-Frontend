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
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { getSubGroupsM } from '../../../../api/SettingsApi';
import {
  handleAddSubGroup,
  handleEditSubGroup,
  handleDeleteSubGroup,
  openEditSubGroupModal,
} from '../utils/SubGroupUtils';

import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes
interface SubGroup {
  id: number;
  nombre: string;
  codigo: string; // Agregado para incluir el código
}

const SubGroup = () => {
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState<SubGroup | null>(
    null,
  );
  const [newSubGroupName, setNewSubGroupName] = useState('');
  const [subGroupToDelete, setSubGroupToDelete] = useState<SubGroup | null>(
    null,
  );
  const [activeType, setActiveType] = useState<'muebles' | 'inmuebles'>(
    'muebles',
  );
  const [newSubGroupCode, setNewSubGroupCode] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const fetchSubGroups = async () => {
    try {
      const data = await getSubGroupsM();
      setSubGroups(data);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    }
  };

  useEffect(() => {
    if (activeType === 'muebles') {
      fetchSubGroups();
    } else {
      setSubGroups([
        { id: 1, nombre: 'Edificios', codigo: 'ED' },
        { id: 2, nombre: 'Terrenos', codigo: 'TE' },
      ]);
    }
  }, [activeType]);

  return (
    <Box>
      {/* Botones para alternar entre Muebles e Inmuebles */}
      <HStack spacing={4} mb={4}>
        <Button
          colorScheme={activeType === 'muebles' ? 'purple' : 'gray'}
          onClick={() => setActiveType('muebles')}
        >
          Muebles
        </Button>
        <Button
          colorScheme={activeType === 'inmuebles' ? 'purple' : 'gray'}
          onClick={() => setActiveType('inmuebles')}
        >
          Inmuebles
        </Button>
      </HStack>

      <Button
        colorScheme="purple"
        bgColor={'type.primary'}
        onClick={() => {
          setSelectedSubGroup(null);
          setNewSubGroupName('');
          setNewSubGroupCode(''); // Limpia el código
          onOpen();
        }}
        mb={4}
      >
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
              <Th>N°</Th>
              <Th>Codigo</Th>
              <Th>Nombre</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subGroups.map((subGroup, index) => (
              <Tr
                key={uuidv4()}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Td>{index + 1}</Td>
                <Td>{subGroup.codigo}</Td>
                <Td>
                  <Text fontWeight="medium">{subGroup.nombre}</Text>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      aria-label="Editar subgrupo"
                      leftIcon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() =>
                        openEditSubGroupModal(
                          subGroup,
                          setSelectedSubGroup,
                          setNewSubGroupName,
                          setNewSubGroupCode,
                          onOpen,
                        )
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar subgrupo"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setSubGroupToDelete(subGroup);
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
            {selectedSubGroup ? 'Editar Subgrupo' : 'Agregar Subgrupo'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre del Subgrupo"
              value={newSubGroupName}
              onChange={(e) => setNewSubGroupName(e.target.value)}
            />
            <Input
              mt={4}
              placeholder="Código del Subgrupo"
              value={newSubGroupCode}
              onChange={(e) => setNewSubGroupCode(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              bgColor={'type.primary'}
              mr={3}
              onClick={async () => {
                selectedSubGroup
                  ? await handleEditSubGroup(
                      selectedSubGroup,
                      newSubGroupName,
                      newSubGroupCode,
                      setSubGroups,
                      onClose,
                    )
                  : await handleAddSubGroup(
                      newSubGroupName,
                      newSubGroupCode,
                      setSubGroups,
                      onClose,
                    );
                fetchSubGroups();
              }}
            >
              {selectedSubGroup ? 'Guardar Cambios' : 'Agregar'}
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
              ¿Estás seguro de que deseas eliminar el subgrupo{' '}
              <strong>{subGroupToDelete?.nombre}</strong>? Esta acción no se
              puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteDialogClose}>Cancelar</Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeleteSubGroup(
                    subGroupToDelete!.id,
                    setSubGroups,
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

export default SubGroup;
