import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Grid,
  GridItem,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import type { Incorp } from 'api/IncorpApi';
import { handleCreateIncorp } from '../utils/IncorporationsLogic';
import type { Department, ConceptoMovimiento } from 'api/SettingsApi';
import { MovableAsset } from 'api/AssetsApi';
import AssetsTableCustom from 'views/admin/inventory/components/AssetsTableCustom';
import { SubGroup } from 'api/SettingsApi';

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
  userDepartmentId?: number;
  onCreated?: (nuevos: Incorp[]) => void;
  incorporations: Incorp[];
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
  subgroups,
  assets,
  userDepartmentId,
  onCreated,
  incorporations,
}: IncorporationsFormProps) {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);

  // Para editar, carga el bien seleccionado en el array para mostrarlo en el input
  useEffect(() => {
    if (selectedIncorporation) {
      const asset = assets.find((a) => a.id === selectedIncorporation.bien_id);
      setSelectedAssets(asset ? [asset] : []);
      setNewIncorporation({
        ...selectedIncorporation,
        concepto_id: selectedIncorporation.concepto_id,
        dept_id: selectedIncorporation.dept_id,
      });
      setSelectedDeptId(selectedIncorporation.dept_id);
    } else {
      setSelectedAssets([]);
      setNewIncorporation({});
      setSelectedDeptId(undefined);
    }
    // eslint-disable-next-line
  }, [selectedIncorporation, assets]);

  // Cuando seleccionas bienes, guarda los bienes y cierra el modal de selección
  const handleSelectAssets = (assetsSeleccionados: MovableAsset[]) => {
    setSelectedAssets(assetsSeleccionados);
    setShowAssetSelector(false);
    setNewIncorporation({
      ...newIncorporation,
      bien_id:
        assetsSeleccionados.length === 1
          ? assetsSeleccionados[0].id
          : undefined,
    });
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = Number(e.target.value);
    setSelectedDeptId(deptId);
    setNewIncorporation({ ...newIncorporation, dept_id: deptId });
    setSelectedAssets([]);
  };

  // Al agregar, crea un registro por cada bien seleccionado
  const handleAddMultiple = async () => {
    const nuevos: Incorp[] = [];
    for (const asset of selectedAssets) {
      try {
        const dataToSend = {
          ...newIncorporation,
          bien_id: asset.id,
          fecha:
            typeof newIncorporation.fecha === 'string'
              ? newIncorporation.fecha
              : new Date().toISOString().slice(0, 10),
          valor: asset.valor_total || 0,
          cantidad: asset.cantidad || 1,
        };
        const newIncorp = await handleCreateIncorp(dataToSend as any, () => {});
        nuevos.push(newIncorp);
      } catch (error) {
        // Manejo de error individual
      }
    }
    setSelectedAssets([]);
    onClose();
    onCreated?.(nuevos);
  };

  // Solo muestra bienes que NO están oficializados en el departamento seleccionado
  const bienesDisponibles = useMemo(() => {
    if (!selectedDeptId) return [];
    const bienesIncorporadosEnDept = incorporations
      .filter(i => i.dept_id === selectedDeptId && i.isActive)
      .map(i => i.bien_id);

    return assets.filter(a => !bienesIncorporadosEnDept.includes(a.id));
  }, [assets, incorporations, selectedDeptId]);

  // Solo habilita el botón en editar si ambos campos están llenos
  const editDisabled =
    !newIncorporation.concepto_id || !newIncorporation.dept_id;

  // Solo habilita el botón en agregar si hay bienes y ambos campos están llenos
  const addDisabled =
    selectedAssets.length === 0 ||
    !newIncorporation.concepto_id ||
    !newIncorporation.dept_id;

  return (
    <>
      {/* Modal de selección de bienes solo en modo agregar */}
      {!selectedIncorporation && showAssetSelector && (
        <AssetsTableCustom
          isOpen={showAssetSelector}
          onClose={() => setShowAssetSelector(false)}
          assets={bienesDisponibles}
          departments={departments}
          subgroups={subgroups}
          mode={userDepartmentId ? 'department' : 'all'}
          departmentId={userDepartmentId}
          onSelect={handleSelectAssets}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedIncorporation
              ? 'Editar Incorporación'
              : 'Agregar Incorporación'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              templateColumns={{ base: '1fr', md: '1fr 3fr' }}
              gap={4}
              mb={4}
            >
              {/* Departamento (editable, primero) */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <FormLabel htmlFor="departamento">Departamento</FormLabel>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Select
                  id="departamento"
                  value={selectedDeptId || ""}
                  onChange={handleDeptChange}
                  placeholder="Seleccionar departamento"
                  isDisabled={!!selectedIncorporation}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nombre}
                    </option>
                  ))}
                </Select>
              </GridItem>

              {/* N° Identificación */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <FormLabel
                  htmlFor="bienes"
                  textAlign={{ base: 'left', md: 'right' }}
                >
                  N° Identificación
                </FormLabel>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Input
                  id="bienes"
                  type="text"
                  value={
                    selectedIncorporation
                      ? assets.find(
                          (a) => a.id === selectedIncorporation.bien_id,
                        )?.numero_identificacion || ''
                      : selectedAssets
                          .map((a) => a.numero_identificacion)
                          .join(', ')
                  }
                  isReadOnly
                  placeholder="Seleccionar bienes"
                  onClick={
                    !selectedIncorporation && selectedDeptId
                      ? () => setShowAssetSelector(true)
                      : undefined
                  }
                  cursor={
                    !selectedIncorporation && selectedDeptId
                      ? 'pointer'
                      : 'not-allowed'
                  }
                  isDisabled={!selectedDeptId || !!selectedIncorporation}
                />
                {!selectedIncorporation && (
                  <Button
                    mt={2}
                    size="sm"
                    onClick={() => setShowAssetSelector(true)}
                    isDisabled={!selectedDeptId}
                  >
                    Buscar bienes
                  </Button>
                )}
              </GridItem>

              {/* Cantidad y Fecha SOLO en modo editar */}
              {selectedIncorporation && (
                <>
                  {/* Cantidad */}
                  <GridItem colSpan={{ base: 1, md: 1 }}>
                    <FormLabel textAlign={{ base: 'left', md: 'right' }}>
                      Cantidad
                    </FormLabel>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, md: 1 }}>
                    <Input
                      type="number"
                      value={selectedIncorporation.cantidad}
                      isReadOnly
                      placeholder="Cantidad"
                    />
                  </GridItem>

                  {/* Fecha */}
                  <GridItem colSpan={{ base: 1, md: 1 }}>
                    <FormLabel textAlign={{ base: 'left', md: 'right' }}>
                      Fecha
                    </FormLabel>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, md: 1 }}>
                    <Input
                      type="date"
                      value={selectedIncorporation.fecha?.slice(0, 10)}
                      isReadOnly
                      placeholder="Fecha"
                    />
                  </GridItem>
                </>
              )}

              {/* Concepto (editable) */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <FormLabel
                  htmlFor="concepto"
                  textAlign={{ base: 'left', md: 'right' }}
                >
                  Concepto
                </FormLabel>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Select
                  id="concepto"
                  value={
                    selectedIncorporation
                      ? newIncorporation.concepto_id?.toString() ||
                        selectedIncorporation.concepto_id?.toString() ||
                        ''
                      : newIncorporation.concepto_id?.toString() || ''
                  }
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
                      concepto_id: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Seleccionar concepto"
                  isDisabled={false}
                >
                  {concepts.map((concept) => (
                    <option key={concept.id} value={concept.id.toString()}>
                      {concept.nombre}
                    </option>
                  ))}
                </Select>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="purple"
              onClick={selectedIncorporation ? handleEdit : handleAddMultiple}
              isDisabled={selectedIncorporation ? editDisabled : addDisabled}
            >
              {selectedIncorporation ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}