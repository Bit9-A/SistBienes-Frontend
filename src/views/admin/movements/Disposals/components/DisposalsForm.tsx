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
import AssetsTableCustom from 'views/admin/inventory/components/AssetsTableCustom';
import type { Desincorp } from 'api/IncorpApi';
import type { Department, ConceptoMovimiento, SubGroup } from 'api/SettingsApi';
import type { MovableAsset } from 'api/AssetsApi';

interface DisposalsFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDisposal: Desincorp | null;
  newDisposal: Partial<Desincorp>;
  setNewDisposal: (disposal: Partial<Desincorp>) => void;
  handleAdd: (
    disposalData?: Partial<Desincorp>,
    deptDestinoId?: number,
    allConcepts?: ConceptoMovimiento[],
  ) => void;
  handleEdit: () => void;
  handleMultipleAdd: (
    disposalDataArray: Partial<Desincorp>[],
    deptDestinoId: number,
    allConcepts: ConceptoMovimiento[],
    selectedAssetIds: number[],
  ) => void;
  isMobile: boolean;
  departments: Department[];
  concepts: ConceptoMovimiento[];
  assets: MovableAsset[];
  subgroups: SubGroup[];
  disposals: Desincorp[];
  onCreated?: (nuevos: Desincorp[]) => void;
  userProfile?: any; // Perfil del usuario, si es necesario
}

export default function DisposalsForm({
  isOpen,
  onClose,
  selectedDisposal,
  newDisposal,
  setNewDisposal,
  handleAdd,
  handleEdit,
  handleMultipleAdd, // Add this prop
  isMobile,
  departments,
  concepts,
  assets,
  subgroups,
  disposals,
  onCreated,
  userProfile,
}: DisposalsFormProps) {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(
    undefined,
  );
  const [selectedDeptDestinoId, setSelectedDeptDestinoId] = useState<
    number | undefined
  >(undefined);

  const toast = useToast();

  const isAdminOrBienes =
    userProfile?.tipo_usuario === 1 || userProfile?.dept_nombre === 'Bienes';

  useEffect(() => {
    if (!isAdminOrBienes && userProfile?.dept_id) {
      setSelectedDeptId(userProfile.dept_id);
      setNewDisposal({
        ...newDisposal,
        dept_id: userProfile.dept_id,
      });
    }
    // eslint-disable-next-line
  }, [userProfile, isAdminOrBienes]);

  // Filtrar conceptos: excluir el concepto con código '60'
  const conceptosFiltrados = useMemo(() => {
    return concepts.filter((concept) => concept.codigo !== '60');
  }, [concepts]);

  useEffect(() => {
    // Si el concepto no es 51, limpia el destino
    if (
      newDisposal.concepto_id &&
      concepts.find((c) => c.id === Number(newDisposal.concepto_id))?.codigo !==
        '51'
    ) {
      setSelectedDeptDestinoId(undefined);
    }
  }, [newDisposal.concepto_id, concepts]);

  // Cuando seleccionas para editar, carga el bien seleccionado en el array para mostrarlo en el input
  useEffect(() => {
    if (selectedDisposal) {
      setSelectedDeptId(selectedDisposal.dept_id);
      setSelectedAssets(
        assets.filter((a) => a.id === selectedDisposal.bien_id),
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
    // Filtrar por departamento y solo bienes activos (isActive = 1)
    return assets.filter((a) => a.dept_id === selectedDeptId && a.isActive === 1);
  }, [assets, selectedDeptId]);

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
        title: 'Campos requeridos',
        description: 'Seleccione un departamento y al menos un bien.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const disposalDataArray: Partial<Desincorp>[] = selectedAssets.map((asset) => ({
      bien_id: asset.id,
      fecha: newDisposal.fecha ?? '',
      valor: asset.valor_total,
      cantidad: 1,
      concepto_id: Number(newDisposal.concepto_id),
      dept_id: selectedDeptId,
      observaciones: newDisposal.observaciones ?? '',
    }));

    //console.log("Calling handleMultipleAdd from DisposalsForm.tsx");
    //console.log("disposalDataArray:", disposalDataArray);
    //console.log("selectedDeptDestinoId:", selectedDeptDestinoId);
    //console.log("concepts:", concepts);
    //console.log("selectedAssets.map((a) => a.id):", selectedAssets.map((a) => a.id));

    handleMultipleAdd(
      disposalDataArray,
      selectedDeptDestinoId!, // Assumed to be present if concept is 51
      concepts,
      selectedAssets.map((a) => a.id),
    );

    setSelectedAssets([]);
    setShowAssetSelector(false);
    setNewDisposal({});
    onClose();
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
            {selectedDisposal
              ? 'Editar Desincorporación'
              : 'Nueva Desincorporación'}
          </ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              //console.log("Form submitted. selectedAssets.length:", selectedAssets.length);
              //console.log("selectedDisposal:", selectedDisposal);

              if (selectedAssets.length > 1) {
                //console.log("Executing handleAddMultiple branch.");
                handleAddMultiple();
              } else if (selectedDisposal) {
                //console.log("Executing handleEdit branch.");
                handleEdit();
              } else if (selectedAssets.length === 1) {
                //console.log("Executing handleAdd (single asset) branch.");
                handleAdd(
                  {
                    ...newDisposal,
                    bien_id: selectedAssets[0].id,
                    valor: selectedAssets[0].valor_total,
                    dept_id: selectedDeptId,
                    cantidad: 1,
                  },
                  selectedDeptDestinoId,
                  concepts,
                );
                setSelectedAssets([]);
                setShowAssetSelector(false);
                setNewDisposal({});
                onClose();
              } else {
                //console.log("No specific action taken (e.g., no assets selected for add, not editing).");
              }
            }}
          >
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Concepto</FormLabel>
                  <Select
                    name="concepto_id"
                    value={newDisposal.concepto_id ?? ''}
                    onChange={(e) =>
                      setNewDisposal({
                        ...newDisposal,
                        concepto_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccione</option>
                    {conceptosFiltrados.map((concept) => (
                      <option key={concept.id} value={concept.id}>
                        {concept.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    name="dept_id"
                    value={selectedDeptId ?? ''}
                    onChange={handleDeptChange}
                    disabled={!isAdminOrBienes || !!selectedDisposal}
                  >
                    <option value="">Seleccione</option>
                    {/* Se eliminó el filtro de departamentos para que siempre se muestren todos. */}
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    name="fecha"
                    type="date"
                    value={newDisposal.fecha ?? ''}
                    onChange={(e) =>
                      setNewDisposal({ ...newDisposal, fecha: e.target.value })
                    }
                    disabled={!!selectedDisposal} // Deshabilita si estás editando
                  />
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
                      newDisposal.concepto_id && // Agregado: Requiere concepto seleccionado
                      !selectedDisposal &&
                      setShowAssetSelector(true)
                    }
                    cursor={
                      selectedDeptId &&
                      newDisposal.concepto_id && // Agregado: Requiere concepto seleccionado
                      !selectedDisposal
                        ? 'pointer'
                        : 'not-allowed'
                    }
                  />
                  <Button
                    mt={2}
                    size="sm"
                    onClick={() =>
                      selectedDeptId &&
                      newDisposal.concepto_id && // Agregado: Requiere concepto seleccionado
                      !selectedDisposal &&
                      setShowAssetSelector(true)
                    }
                    isDisabled={
                      !selectedDeptId ||
                      !newDisposal.concepto_id || // Agregado: Requiere concepto seleccionado
                      !!selectedDisposal
                    }
                  >
                    Buscar bienes
                  </Button>
                </FormControl>
                {conceptosFiltrados.find(
                  (c) => c.id === Number(newDisposal.concepto_id),
                )?.codigo === '51' && (
                  <FormControl isRequired>
                    <FormLabel>Departamento destino</FormLabel>
                    <Select
                      name="dept_destino_id"
                      value={selectedDeptDestinoId ?? ''}
                      onChange={(e) =>
                        setSelectedDeptDestinoId(Number(e.target.value))
                      }
                      placeholder="Seleccione departamento destino"
                    >
                      {departments
                        .filter((dept) => dept.id !== selectedDeptId) // No mostrar el mismo dept
                        .map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.nombre}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Observaciones</FormLabel>
                  <Textarea
                    name="observaciones"
                    value={newDisposal.observaciones ?? ''}
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
                  !newDisposal.concepto_id ||
                  (conceptosFiltrados.find(
                    (c) => c.id === Number(newDisposal.concepto_id),
                  )?.codigo === '51' &&
                    !selectedDeptDestinoId)
                }
              >
                {selectedDisposal ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
