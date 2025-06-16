import React, { useEffect, useMemo, useState } from 'react';
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
} from '@chakra-ui/react';
import type { Incorp } from 'api/IncorpApi';
import type { Department, ConceptoMovimiento, SubGroup } from 'api/SettingsApi';
import type { MovableAsset } from 'api/AssetsApi';
import AssetsTableCustom from 'views/admin/inventory/components/AssetsTableCustom';

interface IncorporationsFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIncorporation: Incorp | null;
  newIncorporation: Partial<Incorp>;
  setNewIncorporation: (incorporation: Partial<Incorp>) => void;
  handleAdd: (incorpData?: Partial<Incorp>) => void;
  handleEdit: () => void;
  isMobile: boolean;
  departments: Department[];
  concepts: ConceptoMovimiento[];
  assets: MovableAsset[];
  subgroups: SubGroup[];
  incorporations: Incorp[];
  onCreated?: (nuevos: Incorp[]) => void;
}

export default function IncorporationsForm({
  isOpen,
  onClose,
  selectedIncorporation,
  newIncorporation,
  setNewIncorporation,
  handleAdd,
  handleEdit,
  isMobile,
  departments,
  concepts,
  assets,
  subgroups,
  incorporations,
  onCreated,
}: IncorporationsFormProps) {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(
    undefined,
  );
  const toast = useToast();

  // Cuando seleccionas para editar, carga el bien seleccionado en el array para mostrarlo en el input
  useEffect(() => {
    if (selectedIncorporation) {
      setSelectedDeptId(selectedIncorporation.dept_id);
      setSelectedAssets(
        assets.filter((a) => a.id === selectedIncorporation.bien_id),
      );
      setNewIncorporation(selectedIncorporation);
    } else {
      setSelectedDeptId(undefined);
      setSelectedAssets([]);
      setNewIncorporation({});
    }
    // eslint-disable-next-line
  }, [selectedIncorporation, assets]);

  // Bienes ya incorporados en el departamento seleccionado
  const bienesIncorporadosEnDept = useMemo(() => {
    if (!selectedDeptId) return [];
    return incorporations
      .filter((i) => i.dept_id === selectedDeptId && i.isActive)
      .map((i) => i.bien_id);
  }, [incorporations, selectedDeptId]);

  // Bienes disponibles para incorporar en el departamento seleccionado
  const bienesDisponibles = useMemo(() => {
    if (!selectedDeptId) return [];
    return assets.filter(
      (a) =>
        a.dept_id === selectedDeptId &&
        !bienesIncorporadosEnDept.includes(a.id),
    );
  }, [assets, bienesIncorporadosEnDept, selectedDeptId]);

  // Cuando seleccionas bienes, guarda los bienes y cierra el modal de selección
  const handleSelectAssets = (assetsSeleccionados: MovableAsset[]) => {
    setSelectedAssets(assetsSeleccionados);
    setShowAssetSelector(false);
    if (assetsSeleccionados.length === 1) {
      setNewIncorporation({
        ...newIncorporation,
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
    setNewIncorporation({
      ...newIncorporation,
      dept_id: deptId,
      bien_id: undefined,
      valor: undefined,
    });
  };

  // Guardar varias incorporaciones
  const handleAddMultiple = async () => {
    if (!selectedDeptId || selectedAssets.length === 0) {
      toast({
        title: 'Campos requeridos',
        description: 'Seleccione un departamento y al menos un bien.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const nuevos: Incorp[] = [];
    for (const asset of selectedAssets) {
      const dataToSend: Partial<Incorp> = {
        bien_id: asset.id,
        fecha: newIncorporation.fecha ?? '',
        valor: asset.valor_total,
        cantidad: 1,
        concepto_id: Number(newIncorporation.concepto_id),
        dept_id: selectedDeptId,
      };
      await handleAdd(dataToSend);
      nuevos.push(dataToSend as Incorp);
    }
    setSelectedAssets([]);
    setShowAssetSelector(false);
    setNewIncorporation({});
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

      <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedIncorporation
              ? 'Editar Incorporación'
              : 'Nueva Incorporación'}
          </ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedAssets.length > 1) {
                handleAddMultiple();
              } else if (selectedAssets.length === 1) {
                handleAdd({
                  ...newIncorporation,
                  bien_id: selectedAssets[0].id,
                  valor: selectedAssets[0].valor_total,
                  dept_id: selectedDeptId,
                  cantidad: 1,
                });
                setSelectedAssets([]);
                setShowAssetSelector(false);
                setNewIncorporation({});
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
                    value={selectedDeptId ?? ''}
                    onChange={handleDeptChange}
                    disabled={!!selectedIncorporation} // Deshabilita si estás editando
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
                    value={selectedAssets
                      .map((a) => a.numero_identificacion)
                      .join(', ')}
                    isReadOnly
                    placeholder="Seleccione bienes"
                    onClick={() =>
                      selectedDeptId &&
                      !selectedIncorporation &&
                      setShowAssetSelector(true)
                    }
                    cursor={
                      selectedDeptId && !selectedIncorporation
                        ? 'pointer'
                        : 'not-allowed'
                    }
                  />
                  <Button
                    mt={2}
                    size="sm"
                    onClick={() =>
                      selectedDeptId &&
                      !selectedIncorporation &&
                      setShowAssetSelector(true)
                    }
                    isDisabled={!selectedDeptId || !!selectedIncorporation}
                  >
                    Buscar bienes
                  </Button>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    name="fecha"
                    type="date"
                    value={newIncorporation.fecha ?? ''}
                    onChange={(e) =>
                      setNewIncorporation({
                        ...newIncorporation,
                        fecha: e.target.value,
                      })
                    }
                    disabled={!!selectedIncorporation} // Deshabilita si estás editando
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Concepto</FormLabel>
                  <Select
                    name="concepto_id"
                    value={newIncorporation.concepto_id ?? ''}
                    onChange={(e) =>
                      setNewIncorporation({
                        ...newIncorporation,
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
                    value={newIncorporation.observaciones ?? ''}
                    onChange={(e) =>
                      setNewIncorporation({
                        ...newIncorporation,
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
                  !newIncorporation.fecha ||
                  !newIncorporation.concepto_id
                }
              >
                {selectedIncorporation ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
