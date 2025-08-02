import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Flex,
  useColorModeValue, // Importar useColorModeValue
} from "@chakra-ui/react";
import { createComponent, updateComponent, type Component } from "../../../../api/ComponentsApi";

interface ReplaceComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldComponent: Component | null;
  currentAssetId: number;
  onReplaceSuccess: () => void;
}

export const ReplaceComponentModal: React.FC<ReplaceComponentModalProps> = ({
  isOpen,
  onClose,
  oldComponent,
  currentAssetId,
  onReplaceSuccess,
}) => {
  const [newComponentName, setNewComponentName] = useState<string>("");
  const [newComponentSerial, setNewComponentSerial] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700"); // Definir cardBg
  const borderColor = useColorModeValue("gray.200", "gray.600"); // Definir borderColor
  const primaryColor = useColorModeValue("type.primary", "type.primary"); // Definir primaryColor

  useEffect(() => {
    if (isOpen) {
      setNewComponentName("");
      setNewComponentSerial("");
      setObservation("");
    }
  }, [isOpen]);

  const handleReplace = async () => {
    if (!oldComponent || !newComponentName.trim()) {
      toast({
        title: "Error",
        description: "Debe seleccionar un componente a reemplazar y proporcionar un nombre para el nuevo componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Desasignar el componente antiguo (establecer su bien_id en null)
      await updateComponent(oldComponent.id, { bien_id: null });
    
      // 2. Crear el nuevo componente y asignarlo al bien actual
      await createComponent({
        bien_id: currentAssetId,
        nombre: newComponentName.trim(),
        numero_serial: newComponentSerial.trim() || null,
      });

      toast({
        title: "Éxito",
        description: `Componente ${oldComponent.nombre} reemplazado exitosamente.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onReplaceSuccess();
      onClose();
    } catch (error) {
      console.error("Error al reemplazar el componente:", error);
      toast({
        title: "Error",
        description: "Error al reemplazar el componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!oldComponent) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Reemplazar Componente: {oldComponent.nombre}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              **Componente Actual:** <Text as="span" fontWeight="normal">{oldComponent.nombre}</Text> (ID: <Text as="span" fontWeight="normal">{oldComponent.id}</Text>, Serial: <Text as="span" fontWeight="normal">{oldComponent.numero_serial || "N/A"}</Text>)
            </Text>
            <FormControl id="newComponentName" isRequired>
              <FormLabel>Nombre del Nuevo Componente:</FormLabel>
              <Input
                value={newComponentName}
                onChange={(e) => setNewComponentName(e.target.value)}
                placeholder="Ej: RAM DDR4 8GB, SSD 500GB"
              />
            </FormControl>
            <FormControl id="newComponentSerial">
              <FormLabel>Número Serial del Nuevo Componente (Opcional):</FormLabel>
              <Input
                value={newComponentSerial}
                onChange={(e) => setNewComponentSerial(e.target.value)}
                placeholder="Ej: SN123456789"
              />
            </FormControl>
            <FormControl id="observation">
              <FormLabel>Observaciones (Opcional):</FormLabel>
              <Input
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Motivo del reemplazo, estado del componente anterior, etc."
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button
            colorScheme="purple"
            bg={primaryColor}
            color="white"
            _hover={{ bg: primaryColor }}
            onClick={handleReplace}
            isLoading={isSubmitting}
            isDisabled={!newComponentName.trim() || isSubmitting}
          >
            Confirmar Reemplazo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
