import React, { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Box,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import { MovableAsset } from 'api/AssetsApi';
import { Department, SubGroup } from 'api/SettingsApi';

interface AssetsTableCustomProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MovableAsset[];
  departments: Department[];
  subgroups: SubGroup[];
  mode: 'all' | 'department';
  onSelect: (selectedAssets: MovableAsset[]) => void; // Cambiado para selección múltiple
  departmentId?: number;
}

export const AssetsTableCustom: React.FC<AssetsTableCustomProps> = ({
  isOpen,
  onClose,
  assets = [],
  departments = [],
  subgroups = [],
  mode,
  onSelect,
  departmentId,
}) => {
  const [searchId, setSearchId] = useState('');
  const [searchDept, setSearchDept] = useState('all');
  const [searchSubgroup, setSearchSubgroup] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Filtro por número de identificación
      const matchesId =
        searchId.trim() === '' ||
        asset.numero_identificacion
          ?.toLowerCase()
          .includes(searchId.toLowerCase());

      // Filtro por departamento (igual que en users)
      const matchesDept =
        mode === 'department'
          ? String(asset.dept_id) === String(departmentId)
          : searchDept === 'all' ||
            String(asset.dept_id) === String(searchDept);

      // Filtro por subgrupo (igual que en users)
      const matchesSubgroup =
        searchSubgroup === 'all' ||
        String(asset.subgrupo_id) === String(searchSubgroup);

      return matchesId && matchesDept && matchesSubgroup;
    });
  }, [assets, mode, departmentId, searchId, searchDept, searchSubgroup]);

  const handleCheck = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (filteredAssets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds((prev) => prev.filter((id) => !filteredAssets.some((a) => a.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...filteredAssets.filter((a) => !prev.includes(a.id)).map((a) => a.id),
      ]);
    }
  };

  const handleDone = () => {
    const selectedAssets = assets.filter((a) => selectedIds.includes(a.id));
    onSelect(selectedAssets);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar Bienes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4} display="flex" flexWrap="wrap" gap={3}>
            <Input
              placeholder="Buscar por número de identificación"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              maxW="250px"
            />
            {mode === 'all' && (
              <Select
                value={searchDept}
                onChange={(e) => setSearchDept(e.target.value)}
                maxW="220px"
              >
                <option value="all">Todos los departamentos</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={String(dept.id)}>
                    {dept.nombre}
                  </option>
                ))}
              </Select>
            )}
            <Select
              value={searchSubgroup}
              onChange={(e) => setSearchSubgroup(e.target.value)}
              maxW="220px"
            >
              <option value="all">Todos los subgrupos</option>
              {subgroups.map((sg) => (
                <option key={sg.id} value={String(sg.id)}>
                  {sg.nombre}
                </option>
              ))}
            </Select>
          </Box>
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={
                        filteredAssets.length > 0 &&
                        filteredAssets.every((a) => selectedIds.includes(a.id))
                      }
                      isIndeterminate={
                        filteredAssets.some((a) => selectedIds.includes(a.id)) &&
                        !filteredAssets.every((a) => selectedIds.includes(a.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>N° Identificación</Th>
                  <Th>Nombre y Descripción</Th>
                  <Th>Departamento</Th>
                  <Th>Subgrupo</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAssets.length === 0 ? (
                  <Tr>
                    <Td colSpan={5}>
                      <Text textAlign="center" color="gray.500">
                        No hay bienes que coincidan con los filtros.
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <Tr key={asset.id}>
                      <Td>
                        <Checkbox
                          isChecked={selectedIds.includes(asset.id)}
                          onChange={() => handleCheck(asset.id)}
                        />
                      </Td>
                      <Td>{asset.numero_identificacion}</Td>
                      <Td>{asset.nombre_descripcion}</Td>
                      <Td>{asset.dept_nombre || 'N/A'}</Td>
                      <Td>{asset.subgrupo_nombre || 'N/A'}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
          <Box mt={4} textAlign="right">
            <Button
              colorScheme="blue"
              onClick={handleDone}
              isDisabled={selectedIds.length === 0}
            >
              Listo
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssetsTableCustom;