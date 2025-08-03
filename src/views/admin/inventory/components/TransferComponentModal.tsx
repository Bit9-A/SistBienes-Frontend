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
  Select,
  VStack,
  useToast,
  Text,
  Spinner,
  Flex,
  useColorModeValue, // Importar useColorModeValue
  useBreakpointValue, // Importar useBreakpointValue
} from "@chakra-ui/react";
import { createTransferComponent, updateComponent, getComponentsByBienId, type Component } from "../../../../api/ComponentsApi"; // Importar getComponentsByBienId
import { getAssets, type MovableAsset } from "../../../../api/AssetsApi";
import { getDepartments, getSubGroupsM, type Department, type SubGroup } from "../../../../api/SettingsApi"; // Importar tipos Department y SubGroup y funciones de obtención
import { AssetsTableCustom } from "./AssetsTableCustom"; // Importar AssetsTableCustom

interface TransferComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: Component | null;
  currentAssetId: number;
  onTransferSuccess: () => void;
}

export const TransferComponentModal: React.FC<TransferComponentModalProps> = ({
  isOpen,
  onClose,
  component,
  currentAssetId,
  onTransferSuccess,
}) => {
  const [destinationAssetId, setDestinationAssetId] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [allAssets, setAllAssets] = useState<MovableAsset[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]); // Estado para departamentos
  const [subgroups, setSubgroups] = useState<SubGroup[]>([]); // Estado para subgrupos
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssetsTableOpen, setIsAssetsTableOpen] = useState(false);
  const [selectedDestinationAsset, setSelectedDestinationAsset] = useState<MovableAsset | null>(null);
  const [destinationComponents, setDestinationComponents] = useState<Component[]>([]); // Componentes del bien de destino
  const [loadingDestinationComponents, setLoadingDestinationComponents] = useState(false);
  const [selectedComponentToReplace, setSelectedComponentToReplace] = useState<string | null>(null); // Componente a reemplazar en el destino
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = useColorModeValue("type.primary", "type.primary");
  const isMobile = useBreakpointValue({ base: true, lg: false }); // Valor responsivo

  useEffect(() => {
    if (isOpen) {
      loadAllAssets();
      loadDepartmentsAndSubgroups(); // Cargar departamentos y subgrupos
      setDestinationAssetId("");
      setObservation("");
      setSelectedDestinationAsset(null);
      setDestinationComponents([]); // Reiniciar componentes de destino
      setSelectedComponentToReplace(null); // Reiniciar componente seleccionado para reemplazar
    }
  }, [isOpen]);

  const loadAllAssets = async () => {
    setLoadingAssets(true);
    try {
      const fetchedAssets = await getAssets();
      setAllAssets(fetchedAssets);
    } catch (error) {
      console.error("Error al cargar todos los bienes:", error);
      toast({
        title: "Error",
        description: "Error al cargar todos los bienes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingAssets(false);
    }
  };

  const loadDepartmentsAndSubgroups = async () => {
    try {
      const fetchedDepartments = await getDepartments();
      setDepartments(fetchedDepartments);
      const fetchedSubgroups = await getSubGroupsM();
      setSubgroups(fetchedSubgroups);
    } catch (error) {
      console.error("Error al cargar departamentos o subgrupos:", error);
      toast({
        title: "Error",
        description: "Error al cargar datos de configuración.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectDestinationAsset = (selected: MovableAsset[]) => {
    if (selected.length > 0) {
      setSelectedDestinationAsset(selected[0]);
      setDestinationAssetId(String(selected[0].id));
      // Cargar componentes del bien de destino seleccionado
      loadDestinationComponents(selected[0].id);
    } else {
      setSelectedDestinationAsset(null);
      setDestinationAssetId("");
      setDestinationComponents([]); // Limpiar componentes si no se selecciona ningún bien
      setSelectedComponentToReplace(null);
    }
    setIsAssetsTableOpen(false);
  };

  const loadDestinationComponents = async (assetId: number) => {
    setLoadingDestinationComponents(true);
    try {
      const comps = await getComponentsByBienId(assetId);
      // Filtrar componentes por tipo basándose en el componente que se está transfiriendo
      const componentType = getComponentType(component?.nombre || "");
      const filteredComps = comps.filter(c => getComponentType(c.nombre) === componentType);
      setDestinationComponents(filteredComps);
    } catch (error) {
      console.error("Error al cargar componentes de destino:", error);
      setDestinationComponents([]);
    } finally {
      setLoadingDestinationComponents(false);
    }
  };

  // Función auxiliar para determinar el tipo de componente (similar a AssetDetails.tsx)
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

  const handleTransfer = async () => {
    if (!component || (!selectedDestinationAsset && destinationAssetId !== "null")) {
      toast({
        title: "Error",
        description: "Debe seleccionar un bien de destino o el inventario general.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newBienId = destinationAssetId === "null" ? null : parseInt(destinationAssetId);
      const oldComponentId = component.id;
      const replacedComponentId = selectedComponentToReplace ? parseInt(selectedComponentToReplace) : null;

      // Si se está reemplazando un componente en el destino
      if (newBienId !== null && replacedComponentId !== null) {
        // 1. Desasignar el componente reemplazado (establecer su bien_id en null)
        await updateComponent(replacedComponentId, { bien_id: null });

        // 2. Asignar el componente transferido al nuevo bien
        await updateComponent(oldComponentId, { bien_id: newBienId });

        // 3. Registrar la transferencia en ComponentesTraslado
        await createTransferComponent({
          componente_id: oldComponentId,
          bien_origen_id: currentAssetId,
          bien_destino_id: newBienId,
          fecha: new Date().toISOString().slice(0, 10),
          observaciones: `Transferencia y reemplazo: ${observation || 'N/A'}. Componente original desasignado: ID ${replacedComponentId}.`,
        });

        toast({
          title: "Éxito",
          description: `Componente ${component.nombre} transferido y reemplazado correctamente.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

      } else {
        // Transferencia estándar (a un nuevo bien o al inventario)
        // 1. Actualizar el bien_id del componente
        await updateComponent(oldComponentId, { bien_id: newBienId });

        // 2. Registrar la transferencia en ComponentesTraslado
        await createTransferComponent({
          componente_id: oldComponentId,
          bien_origen_id: currentAssetId,
          bien_destino_id: newBienId || 0, // Usar 0 o un ID específico para "inventario" si aplica
          fecha: new Date().toISOString().slice(0, 10),
          observaciones: observation,
        });

        toast({
          title: "Éxito",
          description: `Componente ${component.nombre} transferido correctamente.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      onTransferSuccess();
      onClose();
    } catch (error) {
      console.error("Error al transferir el componente:", error);
      toast({
        title: "Error",
        description: "Error al transferir el componente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!component) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'lg'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Transferir Componente: {component.nombre}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              ID del Componente: <Text as="span" fontWeight="normal">{component.id}</Text>
            </Text>
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              Serial: <Text as="span" fontWeight="normal">{component.numero_serial || "N/A"}</Text>
            </Text>
            <FormControl id="destinationAsset">
              <FormLabel>Transferir a:</FormLabel>
              <Button
                onClick={() => setIsAssetsTableOpen(true)}
                variant="outline"
                colorScheme="blue"
                width="full"
                isLoading={loadingAssets}
                isDisabled={loadingAssets}
              >
                {selectedDestinationAsset
                  ? `${selectedDestinationAsset.numero_identificacion} - ${selectedDestinationAsset.nombre_descripcion}`
                  : "Seleccionar Bien de Destino"}
              </Button>
            </FormControl>

            {selectedDestinationAsset && destinationAssetId !== "null" && (
              <FormControl id="replaceComponent">
                <FormLabel>Reemplazar componente en el bien de destino (Opcional):</FormLabel>
                {loadingDestinationComponents ? (
                  <Flex justify="center" align="center" py={2}>
                    <Spinner size="sm" color={primaryColor} />
                    <Text ml={2} color="gray.600">Cargando componentes del destino...</Text>
                  </Flex>
                ) : destinationComponents.length > 0 ? (
                  <Select
                    placeholder={`No reemplazar (añadir ${component?.nombre} al bien)`}
                    value={selectedComponentToReplace || ""}
                    onChange={(e) => setSelectedComponentToReplace(e.target.value)}
                  >
                    {destinationComponents.map((destComp) => (
                      <option key={destComp.id} value={destComp.id}>
                        {destComp.nombre} (ID: {destComp.id}, Serial: {destComp.numero_serial || "N/A"})
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No hay componentes del mismo tipo para reemplazar en este bien.
                  </Text>
                )}
              </FormControl>
            )}

            <FormControl id="observation">
              <FormLabel>Observaciones (Opcional):</FormLabel>
              <Input
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Motivo del traslado, estado del componente, etc."
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
            onClick={handleTransfer}
            isLoading={isSubmitting}
            isDisabled={(!destinationAssetId && !selectedDestinationAsset) || isSubmitting}
          >
            Confirmar Transferencia
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* AssetsTableCustom Modal */}
      <AssetsTableCustom
        isOpen={isAssetsTableOpen}
        onClose={() => setIsAssetsTableOpen(false)}
        assets={allAssets.filter(asset => asset.isComputer === 1)}
        departments={departments}
        subgroups={subgroups}
        mode="all"
        onSelect={handleSelectDestinationAsset}
        excludedAssetIds={[currentAssetId]}
      />
    </Modal>
  );
};
