"use client";

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
  Textarea,
  Box,
} from '@chakra-ui/react';
import { getProfile } from 'api/UserApi';
import { MovableAsset, getAssets } from 'api/AssetsApi';
import AssetsTableCustom from 'views/admin/inventory/components/AssetsTableCustom';
import { Department, SubGroup, getDepartments, getSubGroupsM } from 'api/SettingsApi';
import { MissingGood } from 'api/ReportApi';
import * as ReportUtils from "../utils/ReportUtils";

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReport: (newMissingGood: Omit<MissingGood, "id">) => Promise<void>;
}

const ReportForm: React.FC<ReportFormProps> = ({ isOpen, onClose, onCreateReport }) => {
  const [selectedAssets, setSelectedAssets] = useState<MovableAsset[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subgroups, setSubgroups] = useState<SubGroup[]>([]);
  const [unidad, setUnidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [assets, setAssets] = useState<MovableAsset[]>([]);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
         const subgroupsData = await getSubGroupsM();
        setSubgroups(subgroupsData);
        const assetsData = await getAssets();
        setAssets(assetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

    const handleAssetSelect = (selected: MovableAsset[]) => {
    setSelectedAssets(selected);
  };

  const handleCreateReport = async () => {
    try {
      if (!selectedAssets || selectedAssets.length === 0) {
        alert("Por favor, selecciona al menos un bien para reportar.");
        return;
      }

      const profile = await getProfile();
      const asset = selectedAssets[0];

      const newMissingGood: Omit<MissingGood, "id"> = {
        unidad: Number(unidad) || 0,
        existencias: 0,
        diferencia_cantidad: 0,
        diferencia_valor: 0,
        funcionario_id: profile?.id || 0,
        jefe_id: 0, // You might need to fetch this
        observaciones: observaciones,
        fecha: new Date().toISOString(),
        bien_id: asset.id,
        dept_id: asset.dept_id,
        funcionario_nombre: "",
        jefe_nombre: "",
        departamento: "",
        numero_identificacion: ""
      };
      onCreateReport(newMissingGood);
      onClose();
    } catch (error) {
      console.error("Error creating missing asset report:", error);
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reportar Bienes Faltantes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <FormLabel>Unidad (Departamento)</FormLabel>
              <Input
                placeholder="Ejemplo: Recursos Humanos"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
              />
            </GridItem>
            <GridItem>
              <FormLabel>Observaciones</FormLabel>
              <Textarea
                placeholder="Ejemplo: Escritorio no encontrado durante la auditoría."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </GridItem>
          </Grid>
           <AssetsTableCustom
            isOpen={showAssetSelector}
            onClose={() => setShowAssetSelector(false)}
            assets={assets}
            departments={departments}
            subgroups={subgroups}
            mode="all"
            onSelect={handleAssetSelect}
          />
           <Button
                    mt={2}
                    size="sm"
                    onClick={() => setShowAssetSelector(true)}
                >
                    Buscar bienes
                </Button>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateReport}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportForm;

