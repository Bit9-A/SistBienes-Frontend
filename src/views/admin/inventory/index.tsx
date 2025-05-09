import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import { BsBox2 } from "react-icons/bs";
import { AssetTable } from "./components/AssetTable";
import { AssetForm } from "./components/AssetForm";
import {
  handleAddAsset,
  handleEditAsset,
  handleDeleteAsset,
  handleAddMarca,
  handleEditMarca,
  handleDeleteMarca,
  handleAddModelo,
  handleEditModelo,
  handleDeleteModelo,
} from "./utils/inventoryUtils";
import { getAssets, getMarcas, getModelos, MovableAsset } from "../../../api/AssetsApi";
import { getDepartments, getSubGroupsM, getParroquias } from "../../../api/SettingsApi";

const Inventory = () => {
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, departmentsData, subgroupsData, marcasData, modelosData, parishData] = await Promise.all([
          getAssets(),
          getDepartments(),
          getSubGroupsM(),
          getMarcas(),
          getModelos(),
          getParroquias(),
        ]);
        setAssets(assetsData);
        setDepartments(departmentsData);
        setSubgroups(subgroupsData);
        setMarcas(marcasData);
        setModelos(modelosData);
        setParroquias(parishData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle add or edit asset
  const handleFormSubmit = async (asset:MovableAsset) => {
    try {
      if (isEditing) {
        await handleEditAsset(asset.id, asset, setAssets, onFormClose);
      } else {
        await handleAddAsset(asset, setAssets, onFormClose);
      }
      setSelectedAsset(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  // Handle delete asset
  const handleDelete = async (assetId:any) => {
    try {
      await handleDeleteAsset(assetId, setAssets);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color="type.title">
              Inventario de Bienes
            </Heading>
            <Button
          bgColor="type.primary"
          colorScheme="purple"
          size="md"
          leftIcon={<BsBox2 />}
          onClick={() => {
            setSelectedAsset(null);
            setIsEditing(false);
            onFormOpen();
          }}
        >
          Agregar Bien
        </Button>
          </Flex>
        </CardHeader>
       <CardBody>
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
        <AssetTable
          assets={assets}
          onEdit={(asset) => {
            setSelectedAsset(asset);
            setIsEditing(true);
            onFormOpen();
          }}
          onDelete={(asset) => handleDelete(asset.id)}
        />
      </Box>

      {isFormOpen && (
  <AssetForm
    isOpen={isFormOpen}
    onClose={onFormClose}
    onSubmit={handleFormSubmit} // Función para manejar el envío del formulario
    asset={selectedAsset} // Bien seleccionado para editar o vacío para agregar
    departments={departments} // Lista de departamentos
    subgroups={subgroups} // Lista de subgrupos
    marcas={marcas} // Lista de marcas
    modelos={modelos} // Lista de modelos
    parroquias={parroquias} // Lista de parroquias
  />
)}
      </CardBody>
      </Card>
    </Box>
    
  );
};

export default Inventory;