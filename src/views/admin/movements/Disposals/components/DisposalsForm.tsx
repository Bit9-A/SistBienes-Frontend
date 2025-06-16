import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import AssetsTableCustom from "views/admin/inventory/components/AssetsTableCustom";
import type { Desincorp } from "api/IncorpApi";
import type { Department, ConceptoMovimiento, SubGroup } from "api/SettingsApi";
import type { MovableAsset } from "api/AssetsApi";

interface DisposalsFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDisposal: Desincorp | null;
  newDisposal: Partial<Desincorp>;
  setNewDisposal: (disposal: Partial<Desincorp>) => void;
  handleAdd: (disposalData?: Partial<Desincorp>) => void;
  handleEdit: () => void;
  isMobile: boolean;
  departments: Department[];
  concepts: ConceptoMovimiento[];
  assets: MovableAsset[];
  subgroups: SubGroup[];
  disposals: Desincorp[];
  onCreated?: (nuevos: Desincorp[]) => void;
}

export default function DisposalsForm({
  isOpen,
  onClose,
  selectedDisposal,
  newDisposal,
  setNewDisposal,
  handleAdd,
  handleEdit,
  isMobile,
  departments,
  concepts,
  assets,
  subgroups,
  disposals,
  onCreated,
}: DisposalsFormProps) {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  const toast = useToast();

  // Cuando seleccionas para editar, carga el bien seleccionado en el array para mostrarlo en el input
  useEffect(() => {
    if (selectedDisposal) {
      setSelectedDeptId(selectedDisposal.dept_id);
      setSelectedAssets(
        assets.filter((a) => a.id === selectedDisposal.bien_id)
      );
      setNewDisposal(selectedDisposal);
    } else {
      setSelectedDeptId(undefined);
      setSelectedAssets([]);
      setNewDisposal({});
    }
    // eslint-disable-next-line
  }, [selectedDisposal, assets]);

  // Bienes ya desincorporados en el departamento seleccionado
  const bienesDesincorporadosEnDept = useMemo(() => {
    if (!selectedDeptId) return [];
    return disposals
      .filter((d) => d.dept_id === selectedDeptId)
      .map((d) => d.bien_id);
  }, [disposals, selectedDeptId]);

  // Bienes disponibles para desincorporar en el departamento seleccionado
  const bienesDisponibles = useMemo(() => {
    if (!selectedDeptId) return [];
    return assets.filter(
      (a) => a.dept_id === selectedDeptId && !bienesDesincorporadosEnDept.includes(a.id)
    );
  }, [assets, bienesDesincorporadosEnDept, selectedDeptId]);

  // Cuando seleccionas bienes, guarda los bienes y cierra el modal de selección
  const handleSelectAssets = (assetsSeleccionados: MovableAsset[]) => {
    setSelectedAssets(assetsSeleccionados);
    setShowAssetSelector(false);
    if (assetsSeleccionados.length === 1) {
      setNewDisposal({
        ...newDisposal,
        bien_id: assetsSeleccionados[0].id,
        valor: assetsSeleccionados[0].valor_total,
      });
    }
  };

  // Cambiar departamento
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = Number(e.target.value);
    setSelectedDeptId(deptId);
    setSelectedAssets([]);
    setNewDisposal({
      ...newDisposal,
      dept_id: deptId,
      bien_id: undefined,
      valor: undefined,
    });
  };

  // Guardar varias desincorporaciones
  const handleAddMultiple = async () => {
    if (!selectedDeptId || selectedAssets.length === 0) {
      toast({
        title: "Campos requeridos",
        description: "Seleccione un departamento y al menos un bien.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const nuevos: Desincorp[] = [];
    for (const asset of selectedAssets) {
      const dataToSend: Partial<Desincorp> = {
        bien_id: asset.id,
        fecha: newDisposal.fecha ?? "",
        valor: asset.valor_total,
        cantidad: 1,
        concepto_id: Number(newDisposal.concepto_id),
        dept_id: selectedDeptId,
      };
      await handleAdd(dataToSend);
      nuevos.push(dataToSend as Desincorp);
    }
    setSelectedAssets([]);
    setShowAssetSelector(false);
    setNewDisposal({});
    onClose();
    if (onCreated) onCreated(nuevos);
  };

  return (
    <>
      {/* Modal de selección de bienes */}
      {showAssetSelector && (
        <AssetsTableCustom
          isOpen={showAssetSelector}
          onClose={() => setShowAssetSelector(false)}
          assets={bienesDisponibles}
          departments={departments}
          subgroups={subgroups}
          mode="department"
          departmentId={selectedDeptId}
          onSelect={handleSelectAssets}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDisposal ? "Editar Desincorporación" : "Nueva Desincorporación"}
          </ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedAssets.length > 1) {
                handleAddMultiple();
              } else if (selectedAssets.length === 1) {
                handleAdd({
                  ...newDisposal,
                  bien_id: selectedAssets[0].id,
                  valor: selectedAssets[0].valor_total,
                  dept_id: selectedDeptId,
                  cantidad: 1,
                });
                setSelectedAssets([]);
                setShowAssetSelector(false);
                setNewDisposal({});
                onClose();
              } else {
                handleEdit();
              }
            }}
          >
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    name="dept_id"
                    value={selectedDeptId ?? ""}
                    onChange={handleDeptChange}
                    disabled={!!selectedDisposal} // Deshabilita si estás editando
                  >
                    <option value="">Seleccione</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Bien(es)</FormLabel>
                  <Input
                    value={selectedAssets.map((a) => a.numero_identificacion).join(", ")}
                    isReadOnly
                    placeholder="Seleccione bienes"
                    onClick={() =>
                      selectedDeptId &&
                      !selectedDisposal &&
                      setShowAssetSelector(true)
                    }
                    cursor={
                      selectedDeptId && !selectedDisposal
                        ? "pointer"
                        : "not-allowed"
                    }
                  />
                  <Button
                    mt={2}
                    size="sm"
                    onClick={() =>
                      selectedDeptId &&
                      !selectedDisposal &&
                      setShowAssetSelector(true)
                    }
                    isDisabled={!selectedDeptId || !!selectedDisposal}
                  >
                    Buscar bienes
                  </Button>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    name="fecha"
                    type="date"
                    value={newDisposal.fecha ?? ""}
                    onChange={(e) =>
                      setNewDisposal({ ...newDisposal, fecha: e.target.value })
                    }
                    disabled={!!selectedDisposal} // Deshabilita si estás editando
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Concepto</FormLabel>
                  <Select
                    name="concepto_id"
                    value={newDisposal.concepto_id ?? ""}
                    onChange={(e) =>
                      setNewDisposal({
                        ...newDisposal,
                        concepto_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccione</option>
                    {concepts.map((concept) => (
                      <option key={concept.id} value={concept.id}>
                        {concept.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Observaciones</FormLabel>
                  <Textarea
                    name="observaciones"
                    value={newDisposal.observaciones ?? ""}
                    onChange={(e) =>
                      setNewDisposal({
                        ...newDisposal,
                        observaciones: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                type="submit"
                isDisabled={
                  !selectedDeptId ||
                  selectedAssets.length === 0 ||
                  !newDisposal.fecha ||
                  !newDisposal.concepto_id
                }
              >
                {selectedDisposal ? "Guardar cambios" : "Agregar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}