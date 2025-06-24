'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Stack,
  Container,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { BsBox2 } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
import { AssetTable } from "./components/AssetTable";
import { AssetForm } from "./components/AssetForm";
import { AssetFilters } from "./components/AssetFilters";
import {
  handleAddAsset,
  handleEditAsset,
  handleDeleteAsset,
} from "./utils/inventoryUtils";
import { getAssets, getMarcas, getModelos, MovableAsset } from "../../../api/AssetsApi";
import { getDepartments, getSubGroupsM, getParroquias } from "../../../api/SettingsApi";
import axiosInstance from "../../../utils/axiosInstance"

export default function Inventory() {
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
const [assetStates, setAssetStates] = useState([]);


    //Obtener los estados de bienes /goods-status
  const getAssetStates = async () => {
    const response = await axiosInstance.get('/goods-status')
    return response.data.statusGoods
  }
  // Filtros
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: undefined,
    date: "",
    order: "recent",
  });

  // Colores y estilos
  const cardBg = useColorModeValue("white", "gray.700");
  const tabBorderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const bg = useColorModeValue("gray.50", "gray.900");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, departmentsData, subgroupsData, marcasData, modelosData, parishData,assetStatesData] = await Promise.all([
          getAssets(),
          getDepartments(),
          getSubGroupsM(),
          getMarcas(),
          getModelos(),
          getParroquias(),
          getAssetStates(),
        ]);
        setAssets(assetsData);
        setDepartments(departmentsData);
        setSubgroups(subgroupsData);
        setMarcas(marcasData);
        setModelos(modelosData);
        setParroquias(parishData);
        setAssetStates(assetStatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar assets cada vez que cambian los filtros o los assets originales
  useEffect(() => {
    let filtered = [...assets];
    if (filters.departmentId) {
      filtered = filtered.filter(a => a.dept_id === filters.departmentId);
    }
    if (filters.date) {
      filtered = filtered.filter(a => a.fecha && a.fecha.startsWith(filters.date));
    }
    if (filters.order === "recent") {
      filtered = filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } else {
      filtered = filtered.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    }
    setFilteredAssets(filtered);
  }, [assets, filters]);

  // Handlers
  const handleFormSubmit = async (asset: MovableAsset) => {
    try {
      if (isEditing) {
        await handleEditAsset(asset.id, asset, setAssets, () => setIsFormOpen(false));
      } else {
        await handleAddAsset(asset, setAssets, () => setIsFormOpen(false));
      }
      setSelectedAsset(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  const handleDelete = async (assetId: any) => {
    try {
      await handleDeleteAsset(assetId, setAssets);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const handleFilter = (newFilters: any) => {
    setFilters({
      departmentId: newFilters.departmentId,
      date: newFilters.date,
      order: newFilters.order,
    });
  };

  // Tabs (solo uno activo en este ejemplo)
  const tabs = [
    {
      id: "inventory",
      label: "Inventario",
      icon: FiPackage,
      color: "purple",
      description: "Gestión de bienes muebles",
    },
  ];
  const [activeTab] = useState("inventory");
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="7xl" py={6}>
        {/* Main Header */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={tabBorderColor} mb={6}>
          <CardHeader>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={4}
            >
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <FiPackage size={24} color="#0059ae" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Gestión de Bienes
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Sistema integral para la administración de bienes muebles
                </Box>
              </Box>
              {activeTabData && (
                <Badge
                  colorScheme={activeTabData.color}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {activeTabData.label}
                </Badge>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Tab Navigation (solo un tab en este caso, pero puedes agregar más) */}
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={tabBorderColor} mb={6}>
          <CardBody p={4}>
            <Stack direction={{ base: "column", md: "row" }} spacing={2}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "solid" : "ghost"}
                  colorScheme={activeTab === tab.id ? tab.color : "gray"}
                  bg={activeTab === tab.id ? `${tab.color}.500` : "transparent"}
                  color={activeTab === tab.id ? "white" : textColor}
                  borderRadius="lg"
                  // onClick={() => setActiveTab(tab.id)} // Si agregas más tabs, habilita esto
                  _hover={{
                    bg: activeTab === tab.id ? `${tab.color}.600` : hoverBg,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={tab.icon} />}
                  size="lg"
                  fontWeight="medium"
                  flex={{ base: "1", md: "auto" }}
                  minW="200px"
                  boxShadow={activeTab === tab.id ? "md" : "none"}
                  isActive={activeTab === tab.id}
                >
                  <Box textAlign="left">
                    <Box>{tab.label}</Box>
                    <Box fontSize="xs" opacity={0.8} fontWeight="normal">
                      {tab.description}
                    </Box>
                  </Box>
                </Button>
              ))}
            </Stack>
          </CardBody>
        </Card>

        {/* Tab Content */}
        <Box>
          {/* Filtros y tabla de bienes */}
          <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={tabBorderColor} mb={6}>
            <CardBody>
              <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
                <AssetFilters
                  departments={departments}
                  onFilter={handleFilter}
                />
                <Button
                  bgColor="type.primary"
                  colorScheme="purple"
                  size="md"
                  leftIcon={<BsBox2 />}
                  onClick={() => {
                    setSelectedAsset(null);
                    setIsEditing(false);
                    setIsFormOpen(true);
                  }}
                >
                  Agregar Bien
                </Button>
              </Flex>
              <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
                <AssetTable
                  assets={filteredAssets}
                  onEdit={(asset) => {
                    setSelectedAsset(asset);
                    setIsEditing(true);
                    setIsFormOpen(true);
                  }}
                  onDelete={(asset) => handleDelete(asset.id)}
                />
              </Box>
              {isFormOpen && (
                <AssetForm
                  isOpen={isFormOpen}
                  onClose={() => setIsFormOpen(false)}
                  onSubmit={handleFormSubmit}
                  asset={selectedAsset}
                  departments={departments}
                  subgroups={subgroups}
                  marcas={marcas}
                  modelos={modelos}
                  parroquias={parroquias}
                  assetStates={assetStates} 
                />
              )}
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}