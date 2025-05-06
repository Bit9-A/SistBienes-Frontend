"use client";

import { useState, useEffect } from "react";
import {
  getDepartments,
  getSubGroupsM,
  getParroquias,
  Department,
  SubGroup,
  Parroquia,
} from "../../../../api/SettingsApi";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  MovableAsset,
} from "../../../../api/AssetsApi";

export const useInventoryData = () => {
  const [assets, setAssets] = useState<MovableAsset[]>([]);
  const [groups, setGroups] = useState<SubGroup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
const [locations, setLocations] = useState<Parroquia[]>([]); // Datos simulados para ubicaciones
  const [conditions] = useState([
    { id: 1, name: "Nuevo" },
    { id: 2, name: "Usado" },
    { id: 3, name: "Dañado" },
  ]); // Datos simulados para condiciones del bien
  const [filteredAssets, setFilteredAssets] = useState<MovableAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch assets from the API
  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response);
      setFilteredAssets(response);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch subgroups from the API
  const fetchGroups = async () => {
    try {
      const response = await getSubGroupsM();
      setGroups(response);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await getParroquias(); // Cambia esto por la función real para obtener ubicaciones
      setLocations(response);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }
  // Load initial data
  useEffect(() => {
    fetchAssets();
    fetchDepartments();
    fetchGroups();
    fetchLocations(); // Llama a la función para obtener ubicaciones
  }, []);

  // Search and filter functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query);
  };

  const applyFilters = (query: string) => {
    let filtered = [...assets];
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.numero_identificacion
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(query.toLowerCase()) ||
          item.marca_id.toString().toLowerCase().includes(query.toLowerCase()) ||
          item.modelo_id.toString().toLowerCase().includes(query.toLowerCase()) ||
          item.numero_serial.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredAssets(filtered);
  };

  // Add a new asset
  const addAsset = async (newAsset: Partial<MovableAsset>) => {
    try {
      const response = await createAsset(newAsset as MovableAsset);
      setAssets((prev) => [...prev, response]);
      setFilteredAssets((prev) => [...prev, response]);
      return true;
    } catch (error) {
      console.error("Error adding asset:", error);
      return false;
    }
  };

  // Update an existing asset
  const updateAssetData = async (
    id: number,
    updatedAsset: Partial<MovableAsset>
  ) => {
    try {
      const response = await updateAsset(id, { ...updatedAsset, id } as MovableAsset);
      const updatedAssets = assets.map((asset) =>
        asset.id === id ? { ...asset, ...response } : asset
      );
      setAssets(updatedAssets);
      setFilteredAssets(updatedAssets);
      return true;
    } catch (error) {
      console.error("Error updating asset:", error);
      return false;
    }
  };

  // Delete an asset
  const deleteAssetData = async (id: number) => {
    try {
      await deleteAsset(id);
      const updatedAssets = assets.filter((asset) => asset.id !== id);
      setAssets(updatedAssets);
      setFilteredAssets(updatedAssets);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return {
    assets,
    filteredAssets,
    groups,
    departments,
    locations, // Retorna las ubicaciones simuladas
    conditions, // Retorna las condiciones simuladas
    searchQuery,
    handleSearch,
    addAsset,
    updateAsset: updateAssetData,
    deleteAsset: deleteAssetData,
  };
};