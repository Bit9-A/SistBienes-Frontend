"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

// Datos de ejemplo para bienes faltantes
const sampleMissingAssets = [
  {
    id: 1,
    traslado_id: 101,
    mueble_id: 1001,
    unidad: "Recursos Humanos",
    valor: 500.0,
    funcionario_id: 1,
    jefe_id: 2,
    observaciones: "Escritorio no encontrado durante la auditoría.",
  },
    {
        id: 2,
        traslado_id: 102,
        mueble_id: 1002,
        unidad: "Finanzas",
        valor: 300.0,
        funcionario_id: 2,
        jefe_id: 3,
        observaciones: "Silla rota y no reparable.",
    },
    {
        id: 3,
        traslado_id: 103,
        mueble_id: 1003,
        unidad: "IT",
        valor: 1500.0,
        funcionario_id: 3,
        jefe_id: 1,
        observaciones: "Computadora portátil desaparecida.",
    },
];

// Datos de ejemplo para mapear IDs a nombres
const funcionarios: Record<number, string> = {
  1: "Juan Pérez",
  2: "María Gómez",
  3: "Carlos Rodríguez",
};

const MissingAssetsReport = () => {
  const [missingAssets, setMissingAssets] = useState(sampleMissingAssets);
  const [newAsset, setNewAsset] = useState({
    traslado_id: "",
    mueble_id: "",
    unidad: "",
    valor: "",
    funcionario_id: "",
    jefe_id: "",
    observaciones: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Colores para el tema
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("type.title", "white");

  // Manejar el envío del formulario
  const handleAddAsset = () => {
    if (
      !newAsset.traslado_id ||
      !newAsset.mueble_id ||
      !newAsset.unidad ||
      !newAsset.valor ||
      !newAsset.funcionario_id ||
      !newAsset.jefe_id ||
      !newAsset.observaciones
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newEntry = {
      id: missingAssets.length + 1,
      traslado_id: parseInt(newAsset.traslado_id),
      mueble_id: parseInt(newAsset.mueble_id),
      unidad: newAsset.unidad,
      valor: parseFloat(newAsset.valor),
      funcionario_id: parseInt(newAsset.funcionario_id),
      jefe_id: parseInt(newAsset.jefe_id),
      observaciones: newAsset.observaciones,
    };

    setMissingAssets([...missingAssets, newEntry]);
    setNewAsset({
      traslado_id: "",
      mueble_id: "",
      unidad: "",
      valor: "",
      funcionario_id: "",
      jefe_id: "",
      observaciones: "",
    });
    onClose();
  };

  // Manejar la eliminación de un bien
  const handleDeleteAsset = (id: number): void => {
    setMissingAssets(missingAssets.filter((asset) => asset.id !== id));
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Contenedor principal */}
      <Card
        bg={cardBg}
        boxShadow="sm"
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        mb={6}
      >
        {/* Encabezado del card */}
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Reportar Bienes Faltantes
            </Heading>
            <Button
              colorScheme="blue"
              leftIcon={<FiPlus />}
              onClick={onOpen}
            >
              Nuevo Reporte
            </Button>
          </Flex>
        </CardHeader>

        {/* Cuerpo del card */}
        <CardBody>
          {/* Tabla de bienes faltantes */}
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
                  <Th>ID del Reporte</Th>
                  <Th>Traslado ID</Th>
                  <Th>ID del Mueble</Th>
                  <Th>Unidad</Th>
                  <Th>Valor</Th>
                  <Th>Funcionario</Th>
                  <Th>Jefe</Th>
                  <Th>Observaciones</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {missingAssets.map((asset) => (
                  <Tr
                    key={asset.id}
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {asset.id}
                      </Badge>
                    </Td>
                    <Td>{asset.traslado_id}</Td>
                    <Td>{asset.mueble_id}</Td>
                    <Td>{asset.unidad}</Td>
                    <Td>{asset.valor.toFixed(2)}</Td>
                    <Td>{funcionarios[asset.funcionario_id] || "Desconocido"}</Td>
                    <Td>{funcionarios[asset.jefe_id] || "Desconocido"}</Td>
                    <Td>{asset.observaciones}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        Eliminar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* Modal para agregar un nuevo bien faltante */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Reporte de Bien Faltante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>ID del Traslado</FormLabel>
              <Input
                placeholder="Ejemplo: 101"
                value={newAsset.traslado_id}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, traslado_id: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ID del Mueble</FormLabel>
              <Input
                placeholder="Ejemplo: 1001"
                value={newAsset.mueble_id}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, mueble_id: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Unidad (Departamento)</FormLabel>
              <Input
                placeholder="Ejemplo: Recursos Humanos"
                value={newAsset.unidad}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, unidad: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Valor</FormLabel>
              <Input
                placeholder="Ejemplo: 500.00"
                value={newAsset.valor}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, valor: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ID del Funcionario</FormLabel>
              <Input
                placeholder="Ejemplo: 1"
                value={newAsset.funcionario_id}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, funcionario_id: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ID del Jefe</FormLabel>
              <Input
                placeholder="Ejemplo: 2"
                value={newAsset.jefe_id}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, jefe_id: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Observaciones</FormLabel>
              <Textarea
                placeholder="Ejemplo: Escritorio no encontrado durante la auditoría."
                value={newAsset.observaciones}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, observaciones: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddAsset}>
              Guardar
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

export default MissingAssetsReport;