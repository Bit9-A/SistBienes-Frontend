import React, { useEffect, useState, useRef, useCallback } from "react"
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
  Textarea,
  Stack,
  Box,
} from "@chakra-ui/react"
import { type MissingGoods } from "api/ReportApi"
import { type Department } from "api/SettingsApi"
import { MovableAsset } from "api/AssetsApi"
import AssetsTableCustom from "views/admin/inventory/components/AssetsTableCustom"
import { getProfile, getDepartmentJefe, UserProfile } from "api/UserApi"

interface ReportFormProps {
  isOpen: boolean
  onClose: () => void
  selectedMissingGood: MissingGoods | null
  newMissingGood: Partial<MissingGoods>
  setNewMissingGood: (mg: Partial<MissingGoods>) => void
  handleAdd: (mgData?: Partial<MissingGoods>) => void
  handleEdit: () => void
  isMobile: boolean
  departments: Department[]
  missingGoods: MissingGoods[]
  assets: MovableAsset[]
}

export default function ReportForm({
  isOpen,
  onClose,
  selectedMissingGood,
  newMissingGood,
  setNewMissingGood,
  handleAdd,
  handleEdit,
  isMobile,
  departments,
  missingGoods,
  assets = [],
}: ReportFormProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined)
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([])
  const [usuarioId, setUsuarioId] = useState<number | null>(null)
  const [departmentHeadName, setDepartmentHeadName] = useState<string | null>(null)

  // Cargar usuario logueado
  useEffect(() => {
    getProfile().then(profile => setUsuarioId(profile.id))
  }, [])

  // Cargar jefe de departamento cuando cambia el departamento seleccionado
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (selectedDeptId) {
        const head = await getDepartmentJefe(selectedDeptId)
        if (head) {
          setDepartmentHeadName(head.nombre_completo || head.nombre || "")
          setNewMissingGood((prev: Partial<MissingGoods>) => ({ ...prev, jefe_id: head.id, jefe_nombre: head.nombre_completo || head.nombre }))
        } else {
          setDepartmentHeadName(null)
          setNewMissingGood((prev: Partial<MissingGoods>) => ({ ...prev, jefe_id: undefined, jefe_nombre: undefined }))
        }
      } else {
        setDepartmentHeadName(null)
        setNewMissingGood((prev: Partial<MissingGoods>) => ({ ...prev, jefe_id: undefined, jefe_nombre: undefined }))
      }
    }, 300) // Debounce de 300ms

    return () => {
      clearTimeout(handler)
    }
  }, [selectedDeptId, setNewMissingGood]) // Eliminar newMissingGood de las dependencias y usar la forma de función de actualización

  // Resetear al abrir/cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedDeptId(undefined)
      setSelectedAssets([])
      setNewMissingGood({} as Partial<MissingGoods>) // Asegurar el tipo
      setDepartmentHeadName(null) // Resetear también el nombre del jefe
    }
  }, [isOpen, setNewMissingGood])

  // Cuando seleccionas bienes, guarda los bienes y cierra el modal de selección
  const handleSelectAssets = (assetsSeleccionados: MovableAsset[]) => {
    setSelectedAssets(assetsSeleccionados)
    setShowAssetSelector(false)
    setNewMissingGood((prev: Partial<MissingGoods>) => ({
      ...prev,
      bien_id: assetsSeleccionados.length === 1 ? assetsSeleccionados[0].id : undefined,
    }))
  }

  // Guardar varios bienes faltantes
  const handleAddMultiple = async () => {
    if (!selectedDeptId || !usuarioId || selectedAssets.length === 0) return
    for (const asset of selectedAssets) {
      const dataToSend: Partial<MissingGoods> = {
        unidad: selectedDeptId,
        existencias: 1,
        diferencia_cantidad: 1,
        diferencia_valor: -Math.abs(asset.valor_total || 0),
        funcionario_id: usuarioId,
        jefe_id: newMissingGood.jefe_id ? Number(newMissingGood.jefe_id) : 0,
        observaciones: newMissingGood.observaciones ?? "",
        fecha: newMissingGood.fecha ?? new Date().toISOString().slice(0, 10),
        bien_id: asset.id,
      }
      await handleAdd(dataToSend)
    }
    setSelectedAssets([])
    onClose()
  }

  return (
    <>
      {/* Modal de selección de bienes */}
      {showAssetSelector && (
        <AssetsTableCustom
          isOpen={showAssetSelector}
          onClose={() => setShowAssetSelector(false)}
          assets={assets.filter(a => a.dept_id === selectedDeptId)}
          departments={departments}
          subgroups={[]} // Si tienes subgrupos, pásalos aquí
          mode="department"
          departmentId={selectedDeptId}
          onSelect={handleSelectAssets}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar bien(es) faltante(s)</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={e => {
              e.preventDefault()
              handleAddMultiple()
            }}
          >
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    name="unidad"
                    value={selectedDeptId ?? ""}
                    onChange={e => {
                      setSelectedDeptId(Number(e.target.value))
                      setSelectedAssets([])
                    }}
                  >
                    <option value="">Seleccione</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Bien(es)</FormLabel>
                  <Input
                    value={selectedAssets.map(a => a.numero_identificacion).join(", ")}
                    isReadOnly
                    placeholder="Seleccione bienes"
                    onClick={() => selectedDeptId && setShowAssetSelector(true)}
                    cursor={selectedDeptId ? "pointer" : "not-allowed"}
                  />
                  <Button
                    mt={2}
                    size="sm"
                    onClick={() => selectedDeptId && setShowAssetSelector(true)}
                    isDisabled={!selectedDeptId}
                  >
                    Buscar bienes
                  </Button>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    name="fecha"
                    type="date"
                    value={newMissingGood.fecha ?? ""}
                    onChange={e => setNewMissingGood({ ...newMissingGood, fecha: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Jefe de Departamento</FormLabel>
                  <Input
                    name="jefe_nombre"
                    value={departmentHeadName ?? ""}
                    isReadOnly
                    placeholder="Seleccione un departamento para cargar el jefe"
                  />
                  <Input
                    name="jefe_id"
                    type="hidden"
                    value={newMissingGood.jefe_id ?? ""}
                    readOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Observaciones</FormLabel>
                  <Textarea
                    name="observaciones"
                    value={newMissingGood.observaciones ?? ""}
                    onChange={e => setNewMissingGood({ ...newMissingGood, observaciones: e.target.value })}
                  />
                </FormControl>
                {/* Los campos existencias, diferencia_cantidad, diferencia_valor y funcionario_id se envían automáticamente */}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                type="submit"
                isDisabled={!selectedDeptId || selectedAssets.length === 0 || !newMissingGood.fecha || !newMissingGood.jefe_id}
              >
                Agregar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
