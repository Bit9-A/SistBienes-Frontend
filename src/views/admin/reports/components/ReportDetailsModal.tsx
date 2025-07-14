import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Stack,
  Text,
  Badge,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { MissingGoods } from "api/ReportApi";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingGood: MissingGoods | null;
  onRecover: (missingGood: MissingGoods) => void; // Nueva prop para la función de recuperar
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  missingGood,
  onRecover, // Recibir la nueva prop
}: ReportDetailsModalProps) {
  if (!missingGood) {
    return null; // No renderizar si no hay datos
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Bien Faltante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">N° Identificación</Text>
                <Text fontWeight="bold">{missingGood.numero_identificacion || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Fecha</Text>
                <Text fontWeight="bold">{missingGood.fecha ? new Date(missingGood.fecha).toLocaleDateString() : "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Unidad</Text>
                <Text fontWeight="bold">{missingGood.unidad || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Departamento</Text>
                <Text fontWeight="bold">{missingGood.departamento || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Funcionario</Text>
                <Text fontWeight="bold">{missingGood.funcionario_nombre || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Jefe de Departamento</Text>
                <Text fontWeight="bold">{missingGood.jefe_nombre || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Existencias</Text>
                <Text fontWeight="bold">{missingGood.existencias}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Diferencia Cantidad</Text>
                <Text fontWeight="bold">{missingGood.diferencia_cantidad}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Diferencia Valor</Text>
                <Text fontWeight="bold">{(missingGood.diferencia_valor || 0)}</Text>
              </Box>
            </SimpleGrid>

            {missingGood.observaciones && (
              <Box>
                <Text fontSize="sm" color="gray.500">Observaciones</Text>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  {missingGood.observaciones}
                </Badge>
              </Box>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <Button
            colorScheme="green"
            onClick={() => onRecover(missingGood)}
            isDisabled={!missingGood.id} // Deshabilitar si no hay ID
          >
            Recuperar Bien
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
