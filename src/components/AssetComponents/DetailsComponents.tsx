import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Box,
  Text,
  Stack,
  Icon,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { FiCpu, FiBox } from "react-icons/fi";
import { getComponentsByBienId, Component } from "api/ComponentsApi";

interface DetailsComponentsModalProps {
  bienId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailsComponentsModal: React.FC<DetailsComponentsModalProps> = ({
  bienId,
  isOpen,
  onClose,
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bienId) {
      setLoading(true);
      getComponentsByBienId(bienId)
        .then(setComponents)
        .finally(() => setLoading(false));
    } else {
      setComponents([]);
    }
  }, [isOpen, bienId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Componentes del Bien</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
            </Box>
          ) : components.length === 0 ? (
            <Text color="gray.500" textAlign="center">
              No se encontraron componentes para este bien.
            </Text>
          ) : (
            <Stack spacing={4}>
              {components.map((comp) => (
                <Box
                  key={comp.id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  bg="gray.50"
                  _dark={{ bg: "gray.800" }}
                >
                  <Stack direction="row" align="center" spacing={3}>
                    <Icon as={FiBox} color="blue.500" />
                    <Box>
                      <Text fontWeight="bold">{comp.nombre}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Serial: {comp.numero_serial || "N/A"}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};