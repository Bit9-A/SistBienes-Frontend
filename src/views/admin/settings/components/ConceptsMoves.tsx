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

interface Concept {
  id: number;
  nombre: string;
}

const ConceptsMoves = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [newConceptName, setNewConceptName] = useState('');
  const [activeType, setActiveType] = useState<'incorporacion' | 'desincorporacion'>('incorporacion');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Simulación de datos iniciales
  useEffect(() => {
    if (activeType === 'incorporacion') {
      setConcepts([
        { id: 1, nombre: 'Compra' },
        { id: 2, nombre: 'Donación' },
      ]);
    } else {
      setConcepts([
        { id: 1, nombre: 'Venta' },
        { id: 2, nombre: 'Destrucción' },
      ]);
    }
  }, [activeType]);

  const handleAdd = () => {
    if (newConceptName.trim() === '') return;
    const newConcept = {
      id: concepts.length + 1,
      nombre: newConceptName,
    };
    setConcepts([...concepts, newConcept]);
    setNewConceptName('');
    onClose();
  };

  const handleEdit = () => {
    if (selectedConcept && newConceptName.trim() !== '') {
      setConcepts((prev) =>
        prev.map((concept) =>
          concept.id === selectedConcept.id ? { ...concept, nombre: newConceptName } : concept
        )
      );
      setSelectedConcept(null);
      setNewConceptName('');
      onClose();
    }
  };

  const handleDelete = (id: number) => {
    setConcepts((prev) => prev.filter((concept) => concept.id !== id));
  };

  const openEditModal = (concept: Concept) => {
    setSelectedConcept(concept);
    setNewConceptName(concept.nombre);
    onOpen();
  };

  return (
    <Box>
      {/* Botones para alternar entre Incorporación y Desincorporación */}
      <HStack spacing={4} mb={4}>
        <Button
          colorScheme={activeType === 'incorporacion' ? 'purple' : 'gray'}
          onClick={() => setActiveType('incorporacion')}
        >
          Incorporación
        </Button>
        <Button
          colorScheme={activeType === 'desincorporacion' ? 'purple' : 'gray'}
          onClick={() => setActiveType('desincorporacion')}
        >
          Desincorporación
        </Button>
      </HStack>

      <Button colorScheme="purple" bgColor={'type.primary'} onClick={onOpen} mb={4}>
        Agregar Concepto
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
            {concepts.map((concept) => (
              <Tr key={concept.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{concept.id}</Td>
                <Td>
                  <Text fontWeight="medium">{concept.nombre}</Text>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      aria-label="Editar concepto"
                      leftIcon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => openEditModal(concept)}
                    >
                      Editar
                    </Button>
                    <Button
                      aria-label="Eliminar concepto"
                      leftIcon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(concept.id)}
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
            {selectedConcept ? 'Editar Concepto' : 'Agregar Concepto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre del Concepto"
              value={newConceptName}
              onChange={(e) => setNewConceptName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              bgColor={'type.primary'}
              mr={3}
              onClick={selectedConcept ? handleEdit : handleAdd}
            >
              {selectedConcept ? 'Guardar Cambios' : 'Agregar'}
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

export default ConceptsMoves;