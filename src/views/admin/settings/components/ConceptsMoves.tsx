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
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  handleAddConceptoMovimiento,
  handleEditConceptoMovimiento,
  handleDeleteConceptoMovimiento,
} from '../utils/ConceptsMovesUtils';
import { ConceptoMovimiento,getConceptosMovimientoDesincorporacion,getConceptosMovimientoIncorporacion } from 'api/SettingsApi';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes
const ConceptsMoves = () => {
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<ConceptoMovimiento | null>(null);
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptCode, setNewConceptCode] = useState('');
  const [activeType, setActiveType] = useState<'incorporacion' | 'desincorporacion'>('incorporacion');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  // Fetch inicial de conceptos de movimiento
  const fetchConcepts = async () => {
    try {
      const data =
        activeType === 'incorporacion'
          ? await getConceptosMovimientoIncorporacion()
          : await getConceptosMovimientoDesincorporacion();
          setConcepts(data);
    } catch (error) {
      console.error('Error fetching concepts:', error);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, [activeType]);

  const handleAdd = async () => {
    if (newConceptName.trim() === '' || newConceptCode.trim() === '') return;
    await handleAddConceptoMovimiento(activeType, newConceptName, newConceptCode, setConcepts, onClose);
    fetchConcepts();
  };

  const handleEdit = async () => {
    if (selectedConcept && newConceptName.trim() !== '' && newConceptCode.trim() !== '') {
      await handleEditConceptoMovimiento(
        activeType,
        selectedConcept,
        newConceptName,
        newConceptCode,
        setConcepts,
        onClose
      );
      fetchConcepts();
    }
  };

  const handleDelete = async (id: number) => {
    await handleDeleteConceptoMovimiento(activeType, id, setConcepts);
    fetchConcepts();
  };

  const openEditModal = (concept: ConceptoMovimiento) => {
    setSelectedConcept(concept);
    setNewConceptName(concept.nombre);
    setNewConceptCode(concept.codigo);
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

      <Button
        colorScheme="purple"
        bgColor={'type.primary'}
        onClick={() => {
          setSelectedConcept(null);
          setNewConceptName('');
          setNewConceptCode('');
          onOpen();
        }}
        mb={4}
      >
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
              <Th>N°</Th>
              <Th>Código</Th>
              <Th>Nombre</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {concepts.map((concept, index) => (
              <Tr key={uuidv4()} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{index + 1}</Td>
                <Td>{concept.codigo}</Td>
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
            <Input
              mt={4}
              placeholder="Código del Concepto"
              value={newConceptCode}
              onChange={(e) => setNewConceptCode(e.target.value)}
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