'use client';

import { useState, useEffect } from 'react';
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
  useToast, // Import useToast
} from '@chakra-ui/react';
import { BsBox2 } from 'react-icons/bs';
import { FiPackage } from 'react-icons/fi';
import { AssetTable } from './components/AssetTable';
import { AssetForm } from './components/AssetForm';
import { AssetFilters } from './components/AssetFilters';
import {
  handleAddAsset,
  handleEditAsset,
  handleDeleteAsset,
} from './utils/inventoryUtils';
import {
  getAssets,
  getMarcas,
  getModelos,
  type MovableAsset,
} from '../../../api/AssetsApi';
import {
  getDepartments,
  getSubGroupsM,
  getParroquias,
} from '../../../api/SettingsApi';
import axiosInstance from '../../../utils/axiosInstance';
import { getProfile } from 'api/UserApi';
import { exportBM1WithMarkers } from 'views/admin/inventory/utils/inventoryExcel';
import { ExportBM1Modal } from './components/ExportBM1Modal';
import { exportQRLabels } from 'views/admin/inventory/utils/inventoryLabels';
import { ExportQRLabelsModal } from './components/ExportQRLabelsModal';

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
  const [userProfile, setUserProfile] = useState(null);
  const [canFilterByDept, setCanFilterByDept] = useState(false);
  const [userAssets, setUserAssets] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQRLabelsModalOpen, setIsQRLabelsModalOpen] = useState(false); // New state for QR labels modal
  const toast = useToast(); // Initialize useToast

  // Obtener los estados de bienes /goods-status
  const getAssetStates = async () => {
    const response = await axiosInstance.get('/goods-status');
    return response.data.statusGoods;
  };

  // Filtros
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: undefined,
    startDate: '',
    endDate: '',
    order: 'recent',
    search: '',
  });

  // Colores y estilos
  const cardBg = useColorModeValue('white', 'gray.700');
  const tabBorderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const bg = useColorModeValue('gray.50', 'gray.900');

  const nombreDepartamentoSeleccionado = (() => {
    if (!filters.departmentId) return '';
    const dept = departments.find((d) => d.id === filters.departmentId);
    return dept ? dept.nombre : '';
  })();

  // Función para cargar los bienes y otros datos
  const fetchAllData = async () => {
    try {
      const [
        assetsData,
        departmentsData,
        subgroupsData,
        marcasData,
        modelosData,
        parishData,
        assetStatesData,
      ] = await Promise.all([
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
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Solo mostrar assets del departamento del usuario autenticado
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
        if (profile?.tipo_usuario === 1 || profile?.dept_nombre === 'Bienes') {
          setUserAssets(assets);
          setCanFilterByDept(true);
        } else if (profile?.dept_id) {
          const filtered = assets.filter(
            (asset) => asset.dept_id === profile.dept_id,
          );
          setUserAssets(filtered);
          setCanFilterByDept(false);
        } else {
          setUserAssets(assets);
          setCanFilterByDept(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserAssets(assets);
        setCanFilterByDept(false);
      }
    };

    fetchUserProfile();
  }, [assets]);

  // Filtrar assets cada vez que cambian los filtros o los assets originales
  useEffect(() => {
    let filtered = [...userAssets];

    if (canFilterByDept && filters.departmentId) {
      filtered = filtered.filter((a) => a.dept_id === filters.departmentId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (a) => a.fecha && new Date(a.fecha) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (a) => a.fecha && new Date(a.fecha) <= new Date(filters.endDate),
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((a) =>
        Object.values(a).some(
          (val) => val && String(val).toLowerCase().includes(searchLower),
        ),
      );
    }

    if (filters.order === 'recent') {
      filtered = filtered.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
    } else {
      filtered = filtered.sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
    }

    setFilteredAssets(filtered);
  }, [userAssets, filters, canFilterByDept]);

  // Handlers
  const handleFormSubmit = async (asset: MovableAsset, logDetails?: string) => {
    try {
      if (isEditing) {
        await handleEditAsset(asset.id, asset, setAssets, () =>
          setIsFormOpen(false),
          logDetails || `Se editó el bien con ID: ${asset.id}`,
        );
      } else {
        await handleAddAsset(asset, setAssets, () => setIsFormOpen(false));
      }
      setSelectedAsset(null);
      setIsEditing(false);
      fetchAllData(); // Re-fetch data to update the table
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleDelete = async (assetId: any) => {
    try {
      await handleDeleteAsset(assetId, setAssets);
      fetchAllData(); // Re-fetch data to update the table
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleFilter = (newFilters: any) => {
    setFilters({
      departmentId: newFilters.departmentId,
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      order: newFilters.order,
      search: newFilters.search,
    });
  };

  // Tabs (solo uno activo en este ejemplo)
  const tabs = [
    {
      id: 'inventory',
      label: 'Inventario',
      icon: FiPackage,
      color: 'purple',
      description: 'Gestión de bienes muebles',
    },
  ];

  const [activeTab] = useState('inventory');
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <Box minH="100vh" bg={bg} pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Container
        maxW="100vw"
        px={{ base: 2, md: 4 }}
        py={{ base: 2, md: 4 }}
        w="full"
      >
        {/* Main Header */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardHeader p={{ base: 4, md: 6 }}>
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              justify="space-between"
              align={{ base: 'start', lg: 'center' }}
              gap={{ base: 3, md: 4 }}
            >
              <Box>
                <Flex align="center" gap={{ base: 2, md: 3 }} mb={2}>
                  <Box p={{ base: 1.5, md: 2 }} bg="blue.100" borderRadius="lg">
                    <FiPackage size={24} color="#0059ae" />
                  </Box>
                  <Heading
                    size={{ base: 'md', md: 'lg' }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    Gestión de Bienes
                  </Heading>
                </Flex>
                <Box
                  color="gray.600"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  display={{ base: 'none', sm: 'block' }}
                >
                  Sistema integral para la administración de bienes muebles
                </Box>
              </Box>
              {activeTabData && (
                <Badge
                  colorScheme={activeTabData.color}
                  variant="subtle"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  borderRadius="full"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  mt={{ base: 2, lg: 0 }}
                >
                  {activeTabData.label}
                </Badge>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card
          bg={cardBg}
          shadow="md"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardBody p={{ base: 3, md: 4 }}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: 2, md: 2 }}
            >
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'solid' : 'ghost'}
                  colorScheme={activeTab === tab.id ? tab.color : 'gray'}
                  bg={activeTab === tab.id ? `${tab.color}.500` : 'transparent'}
                  color={activeTab === tab.id ? 'white' : textColor}
                  borderRadius="lg"
                  _hover={{
                    bg: activeTab === tab.id ? `${tab.color}.600` : hoverBg,
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={tab.icon} />}
                  size={{ base: 'md', md: 'lg' }}
                  fontWeight="medium"
                  flex={{ base: '1', md: 'auto' }}
                  minW={{ base: 'auto', md: '200px' }}
                  boxShadow={activeTab === tab.id ? 'md' : 'none'}
                  isActive={activeTab === tab.id}
                  w={{ base: 'full', md: 'auto' }}
                >
                  <Box textAlign="left">
                    <Box fontSize={{ base: 'sm', md: 'md' }}>{tab.label}</Box>
                    <Box
                      fontSize={{ base: '2xs', md: 'xs' }}
                      opacity={0.8}
                      fontWeight="normal"
                      display={{ base: 'none', md: 'block' }}
                    >
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
          <Flex alignContent={'flex-end'} justifyContent={'flex-end'} mb={4}>
            
            {/*Si el usuario es administrador o de bienes*/}
            <Button
              colorScheme="green"
              onClick={() => {
                if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === 'Bienes')) {
                  setIsExportModalOpen(true);
                } else {
                  exportBM1WithMarkers(userProfile?.dept_id, userProfile?.dept_nombre);
                }
              }}
            >
              Exportar a Excel
            </Button>
            <Button
              colorScheme="purple"
              ml={2}
              onClick={() => {
                if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === 'Bienes')) {
                  setIsQRLabelsModalOpen(true);
                } else {
                  exportQRLabels(userProfile?.dept_id, userProfile?.dept_nombre);
                }
              }}
            >
              Exportar Etiquetas QR
            </Button>
          </Flex>
          {/* Filtros y tabla de bienes */}
          <Card
            bg={cardBg}
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor={tabBorderColor}
            mb={{ base: 4, md: 6 }}
          >
            <CardBody p={{ base: 3, md: 4 }}>
              <Flex
                direction={{ base: 'column', lg: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', lg: 'center' }}
                mb={{ base: 3, md: 4 }}
                gap={{ base: 3, md: 4 }}
              >
                <Box
                  flex={{ base: '1', lg: 'auto' }}
                  w={{ base: 'full', lg: 'auto' }}
                >
                  <AssetFilters
                    departments={departments}
                    onFilter={handleFilter}
                    canFilterByDept={canFilterByDept}
                  />
                </Box>
                <Flex gap={2} align="center">
                  {/* Aquí puedes agregar el botón de importar si lo necesitas */}
                  <Button
                    bgColor="type.primary"
                    colorScheme="purple"
                    size={{ base: 'md', md: 'md' }}
                    leftIcon={<BsBox2 />}
                    onClick={() => {
                      setSelectedAsset(null);
                      setIsEditing(false);
                      setIsFormOpen(true);
                    }}
                    w={{ base: 'full', lg: 'auto' }}
                    minW={{ base: 'auto', lg: '160px' }}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    <Box display={{ base: 'none', sm: 'block' }}>
                      Agregar Bien
                    </Box>
                    <Box display={{ base: 'block', sm: 'none' }}>Agregar</Box>
                  </Button>
                </Flex>
              </Flex>
              <Box
                bg={cardBg}
                p={{ base: 2, md: 4 }}
                borderRadius="lg"
                boxShadow="sm"
                overflowX="auto"
              >
                <AssetTable
                  assets={filteredAssets}
                  onEdit={(asset) => {
                    setSelectedAsset(asset);
                    setIsEditing(true);
                    setIsFormOpen(true);
                    toast({
                      title: "Editando bien",
                      description: `Abriendo formulario para editar el bien con ID: ${asset.id}`,
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                      position: "top",
                    });
                  }}
                  onDelete={(asset) => handleDelete(asset.id)}
                  userProfile={userProfile}
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

              <ExportBM1Modal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                departments={departments}
                onExport={exportBM1WithMarkers}
              />

              <ExportQRLabelsModal
                isOpen={isQRLabelsModalOpen}
                onClose={() => setIsQRLabelsModalOpen(false)}
                departments={departments}
                onExport={exportQRLabels}
              />
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
