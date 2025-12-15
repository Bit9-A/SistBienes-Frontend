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
  VStack,
  useToast,
  Text,
  Spinner,
  Flex,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  FormControl, // Import FormControl
  FormLabel, // Import FormLabel
  Select, // Import Select
} from "@chakra-ui/react";
import { FiSearch, FiBox } from "react-icons/fi";
import { getComponents, updateComponent, createComponent, type Component } from "../../../../api/ComponentsApi";

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any; // El bien (computadora) al que se le añadirán componentes
  currentComponents: Component[]; // Componentes que ya tiene la computadora
  onAddComponentSuccess: () => void;
}

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
  asset,
  currentComponents,
  onAddComponentSuccess,
}) => {
  const [availableComponents, setAvailableComponents] = useState<Component[]>([]);
  const [loadingAvailableComponents, setLoadingAvailableComponents] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingNewComponent, setIsCreatingNewComponent] = useState(false); // New state for toggling new component form
  const [newComponentName, setNewComponentName] = useState<string>(""); // State for new component name
  const [newComponentSerial, setNewComponentSerial] = useState<string>(""); // State for new component serial
  const [newComponentType, setNewComponentType] = useState<string>(""); // New state for new component type
  const toast = useToast();

  const primaryColor = useColorModeValue("type.primary", "type.primary");

  useEffect(() => {
    if (isOpen) {
      loadAvailableComponents();
      setSelectedComponentId(null);
      setSearchTerm("");
    }
  }, [isOpen]);

  const loadAvailableComponents = async () => {
    setLoadingAvailableComponents(true);
    try {
      const allComps = await getComponents();
      // Filtrar componentes que no están asignados a ningún bien (bien_id es null)
      const unassignedComps = allComps.filter((comp) => comp.bien_id === null);
      setAvailableComponents(unassignedComps);
    } catch (error) {
      console.error("Error al cargar componentes disponibles:", error);
      setAvailableComponents([]);
      toast({
        title: "Error",
        description: "Error al cargar componentes disponibles.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingAvailableComponents(false);
    }
  };

  // Función auxiliar para determinar el tipo de componente
  const getComponentType = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("tm") || lowerName.includes("tarjeta madre")) return "TM";
    if (lowerName.includes("cpu") || lowerName.includes("procesador")) return "CPU";
    if (lowerName.includes("ram") || lowerName.includes("memoria ram")) return "RAM";
    if (lowerName.includes("hdd") || lowerName.includes("disco duro hdd")) return "HDD";
    if (lowerName.includes("ssd") || lowerName.includes("disco duro ssd")) return "SSD";
    if (lowerName.includes("ps") || lowerName.includes("fuente de poder")) return "PS";
    return "OTHER";
  };

  // Función para validar si un componente puede ser añadido
  const canAddComponent = (component: Component): boolean => {
    const type = getComponentType(component.nombre);
    const existingCount = currentComponents.filter(
      (comp) => getComponentType(comp.nombre) === type,
    ).length;

    switch (type) {
      case "TM":
      case "CPU":
      case "PS":
        return existingCount === 0; // Solo puede haber uno de estos
      case "RAM":
      case "HDD":
      case "SSD":
        return true; // Puede haber múltiples
      default:
        return true; // Otros tipos no tienen restricciones específicas
    }
  };

  const handleAddComponent = async () => {
    if (!selectedComponentId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un componente para añadir.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const componentToAdd = availableComponents.find((comp) => comp.id === selectedComponentId);

    if (!componentToAdd) {
      toast({
        title: "Error",
        description: "Componente seleccionado no encontrado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!canAddComponent(componentToAdd)) {
      const type = getComponentType(componentToAdd.nombre);
      let errorMessage = `Ya existe un componente de tipo '${type}' en esta computadora.`;
      if (type === "RAM" || type === "HDD" || type === "SSD") {
        errorMessage = `No se puede añadir más de un componente de tipo '${type}' si ya existe uno.`; // Esto es un fallback, en realidad RAM/HDD/SSD pueden tener múltiples
      }
      toast({
        title: "Validación",
        description: errorMessage,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateComponent(selectedComponentId, { bien_id: asset.id });
      toast({
        title: "Éxito",
        description: `Componente ${componentToAdd.nombre} añadido correctamente a ${asset.numero_identificacion}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onAddComponentSuccess();
      onClose();
    } catch (error) {
      console.error("Error al añadir el componente:", error);
      toast({
        title: "Error",
        description: "Error al añadir el componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewComponent = async () => {
    if (!newComponentType) {
      toast({
        title: "Error",
        description: "Debe seleccionar un tipo de componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newComponentName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del componente no puede estar vacío.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate if a component of this type can be added
    const tempComponent: Component = {
      id: 0, // Dummy ID, not used for validation logic
      bien_id: asset.id,
      nombre: `${newComponentType}: ${newComponentName.trim()}`, // Prepend type for validation
      numero_serial: newComponentSerial.trim() || null,
    };

    if (!canAddComponent(tempComponent)) {
      const type = getComponentType(tempComponent.nombre);
      toast({
        title: "Validación",
        description: `Ya existe un componente de tipo '${type}' en esta computadora. Solo se permite uno de este tipo.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalComponentName = `${newComponentType}: ${newComponentName.trim()}`;
      const newComp = await createComponent({
        bien_id: asset.id,
        nombre: finalComponentName,
        numero_serial: newComponentSerial.trim() || null,
      });

      toast({
        title: "Éxito",
        description: `Nuevo componente "${newComp.nombre}" creado y añadido correctamente.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onAddComponentSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear y añadir nuevo componente:", error);
      toast({
        title: "Error",
        description: "Error al crear y añadir el nuevo componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComponents = availableComponents.filter(
    (comp) =>
      comp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.numero_serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(comp.id).includes(searchTerm),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Añadir Componente a {asset?.numero_identificacion}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" mb={4}>
              <Button
                onClick={() => setIsCreatingNewComponent(false)}
                colorScheme={!isCreatingNewComponent ? "purple" : "gray"}
                variant={!isCreatingNewComponent ? "solid" : "outline"}
                flex="1"
                mr={2}
              >
                Añadir Existente
              </Button>
              <Button
                onClick={() => setIsCreatingNewComponent(true)}
                colorScheme={isCreatingNewComponent ? "purple" : "gray"}
                variant={isCreatingNewComponent ? "solid" : "outline"}
                flex="1"
                ml={2}
              >
                Crear Nuevo
              </Button>
            </Flex>

            {isCreatingNewComponent ? (
              <VStack spacing={3} align="stretch">
                <Text fontSize="md" color="gray.700">
                  Ingrese los detalles del nuevo componente.
                </Text>
                <FormControl isRequired>
                  <FormLabel>Tipo de Componente</FormLabel>
                  <Select
                    placeholder="Seleccione un tipo"
                    value={newComponentType}
                    onChange={(e) => setNewComponentType(e.target.value)}
                  >
                    <option value="TM">Tarjeta Madre (TM)</option>
                    <option value="CPU">Procesador (CPU)</option>
                    <option value="RAM">Memoria RAM (RAM)</option>
                    <option value="HDD">Disco Duro (HDD)</option>
                    <option value="SSD">Disco Sólido (SSD)</option>
                    <option value="PS">Fuente de Poder (PS)</option>
                    <option value="OTHER">Otro</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nombre del Componente</FormLabel>
                  <Input
                    placeholder="Ej: ASUS Prime B450M-A, Intel Core i7-10700K"
                    value={newComponentName}
                    onChange={(e) => setNewComponentName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Número Serial (Opcional)</FormLabel>
                  <Input
                    placeholder="Número serial del nuevo componente"
                    value={newComponentSerial}
                    onChange={(e) => setNewComponentSerial(e.target.value)}
                  />
                </FormControl>
              </VStack>
            ) : (
              <>
                <Text fontSize="md" color="gray.700">
                  Seleccione un componente disponible para añadir a esta computadora.
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por nombre, serial o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                {loadingAvailableComponents ? (
                  <Flex justify="center" align="center" py={10}>
                    <Spinner size="xl" color={primaryColor} />
                    <Text ml={4}>Cargando componentes disponibles...</Text>
                  </Flex>
                ) : filteredComponents.length === 0 ? (
                  <VStack spacing={4} align="center" py={10}>
                    <Icon as={FiBox} size="48px" color="gray.400" />
                    <Text fontSize="lg" fontWeight="medium" color="gray.500">
                      No se encontraron componentes disponibles
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      Asegúrese de que los componentes no estén asignados a otro bien.
                    </Text>
                  </VStack>
                ) : (
                  <Box overflowY="auto" maxHeight="400px" border="1px" borderColor="gray.200" borderRadius="md">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th></Th>
                          <Th>ID</Th>
                          <Th>Nombre</Th>
                          <Th>Serial</Th>
                          <Th>Tipo</Th>
                          <Th>Estado</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredComponents.map((comp) => {
                          const isSelectable = canAddComponent(comp);
                          return (
                            <Tr
                              key={comp.id}
                              _hover={{ bg: isSelectable ? "gray.50" : "red.50" }}
                              cursor={isSelectable ? "pointer" : "not-allowed"}
                              onClick={() => isSelectable && setSelectedComponentId(comp.id)}
                              bg={selectedComponentId === comp.id ? "blue.50" : ""}
                            >
                              <Td>
                                <Checkbox
                                  isChecked={selectedComponentId === comp.id}
                                  onChange={() => isSelectable && setSelectedComponentId(comp.id)}
                                  isDisabled={!isSelectable}
                                />
                              </Td>
                              <Td>{comp.id}</Td>
                              <Td>{comp.nombre}</Td>
                              <Td>{comp.numero_serial || "N/A"}</Td>
                              <Td>{getComponentType(comp.nombre)}</Td>
                              <Td>
                                <Text color={isSelectable ? "green.500" : "red.500"}>
                                  {isSelectable ? "Compatible" : "No Compatible"}
                                </Text>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          {isCreatingNewComponent ? (
            <Button
              colorScheme="purple"
              bg={primaryColor}
              color="white"
              _hover={{ bg: primaryColor }}
              onClick={handleCreateNewComponent}
              isLoading={isSubmitting}
              isDisabled={!newComponentName.trim() || !newComponentType || isSubmitting}
            >
              Crear y Añadir
            </Button>
          ) : (
            <Button
              colorScheme="purple"
              bg={primaryColor}
              color="white"
              _hover={{ bg: primaryColor }}
              onClick={handleAddComponent}
              isLoading={isSubmitting}
              isDisabled={!selectedComponentId || isSubmitting}
            >
              Añadir Componente
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
