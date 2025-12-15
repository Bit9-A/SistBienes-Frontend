"use client"
import React, { useState, useEffect, useMemo } from "react";
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
  Text,
} from "@chakra-ui/react";
import { FiPackage } from "react-icons/fi";
import { TransferSearchFilter } from "./components/TransferSearchFilter";
import { TransferTable } from "./components/TransferTable";
import { TransferDetailsModal } from "./components/TransferDetailsModal";
import { NoTransfersFound } from "./components/NoTransfersFound";
import { Transfer, getAllTransfers } from "../../../api/TransferApi";
import { Department, getDepartments } from "../../../api/SettingsApi";
import { TransferComponent, getTransferComponents } from "../../../api/ComponentsApi";
import { MovableAsset, getAssets } from "../../../api/AssetsApi"; // Corregido: getAssets en lugar de getMovableAssets
import { useDisclosure } from "@chakra-ui/react";
import ComponentTransferHistory from "./components/ComponentTransferHistory";
import { getProfile, UserProfile } from "../../../api/UserApi"; // Importar getProfile

export default function TransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [componentTransfers, setComponentTransfers] = useState<TransferComponent[]>([]); // Nuevo estado
  const [assets, setAssets] = useState<MovableAsset[]>([]); // Nuevo estado
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados para el perfil de usuario y permisos
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [canFilterByDept, setCanFilterByDept] = useState(false);
  const [userTransfers, setUserTransfers] = useState<Transfer[]>([]); // Traslados filtrados por usuario
  const [userComponentTransfers, setUserComponentTransfers] = useState<TransferComponent[]>([]); // Traslados de componentes filtrados por usuario

  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Nuevo estado para el mes
  const [selectedYear, setSelectedYear] = useState<string>(""); // Nuevo estado para el año
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(""); // Nuevo estado para el filtro de departamento

  // Colores y estilos
  const cardBg = useColorModeValue("white", "gray.700");
  const tabBorderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const bg = useColorModeValue("gray.50", "gray.900");

  // Tabs (estructura igual a movements)
  const tabs = [
    {
      id: "transfers",
      label: "Traslados",
      icon: FiPackage,
      color: "purple",
      description: "Historial de traslados de bienes",
    },
    {
      id: "componentTransfers", // Nuevo ID
      label: "Traslados de Componentes", // Nuevo label
      icon: FiPackage, // Puedes cambiar el icono si hay uno más específico
      color: "blue", // Nuevo color
      description: "Historial de traslados de componentes entre bienes", // Nueva descripción
    },
  ];
  const [activeTab, setActiveTab] = useState("transfers");
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [transferData, departmentsData, assetsData, componentTransfersData, profileData] =
          await Promise.allSettled([
            getAllTransfers(),
            getDepartments(),
            getAssets(),
            getTransferComponents(),
            getProfile(),
          ]);

        if (transferData.status === "fulfilled") {
          setTransfers(transferData.value);
          //console.log("Fetched transfers:", transferData.value); // Log para depuración
        } else {
          console.error("Error fetching transfers:", transferData.reason);
          setTransfers([]);
        }

        if (departmentsData.status === "fulfilled") {
          setDepartments(departmentsData.value);
        //  console.log("Fetched departments:", departmentsData.value); // Log para depuración
        } else {
          console.error("Error fetching departments:", departmentsData.reason);
          setDepartments([]);
        }

        if (assetsData.status === "fulfilled") {
          setAssets(assetsData.value);
        } else {
          console.error("Error fetching assets:", assetsData.reason);
          setAssets([]);
        }

        if (componentTransfersData.status === "fulfilled") {
          setComponentTransfers(componentTransfersData.value);
        } else {
          console.error("Error fetching component transfers:", componentTransfersData.reason);
          setComponentTransfers([]);
        }

        if (profileData.status === "fulfilled") {
          setUserProfile(profileData.value);
          // Determinar si el usuario puede filtrar por departamento
          if (profileData.value?.tipo_usuario === 1 || profileData.value?.dept_nombre === "Bienes") {
            setCanFilterByDept(true);
          } else {
            setCanFilterByDept(false);
            // Si no puede filtrar, establecer el departamento del usuario como filtro por defecto
            if (profileData.value?.dept_id) {
              setSelectedDepartmentId(profileData.value.dept_id.toString());
            }
          }
        } else {
          console.error("Error fetching user profile:", profileData.reason);
          setUserProfile(null);
          setCanFilterByDept(false);
        }
      } catch (error) {
        console.error("Unhandled error in fetchAllData:", error);
      }
    };

    fetchAllData();
  }, []);

  // Filtrado principal de traslados y traslados de componentes
  const filteredTransfers = useMemo(() => {
    let currentTransfers = Array.isArray(transfers) ? transfers : [];
    let currentComponentTransfers = Array.isArray(componentTransfers) ? componentTransfers : [];

    // Aplicar filtrado por perfil de usuario primero
    if (userProfile && (userProfile.tipo_usuario !== 1 && userProfile.dept_nombre !== "Bienes")) {
      if (userProfile.dept_id) {
        currentTransfers = currentTransfers.filter(
          (t) => t.origen_id === userProfile.dept_id || t.destino_id === userProfile.dept_id
        );
        currentComponentTransfers = currentComponentTransfers.filter((tc) => {
          const originAsset = assets.find(asset => asset.id === tc.bien_origen_id);
          const destinationAsset = assets.find(asset => asset.id === tc.bien_destino_id);
          return (originAsset && originAsset.dept_id === userProfile.dept_id) ||
                 (destinationAsset && destinationAsset.dept_id === userProfile.dept_id);
        });
      } else {
        currentTransfers = [];
        currentComponentTransfers = [];
      }
    }

    // Aplicar filtros adicionales (búsqueda, fecha, departamento) a los traslados de bienes
    let filtered = currentTransfers;

    if (searchQuery !== "") {
      filtered = filtered.filter(
        (t) =>
          t.id.toString().includes(searchQuery) ||
          (t.observaciones && t.observaciones.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((t) => {
        const transferDate = new Date(t.fecha);
        return (
          transferDate.getMonth() + 1 === Number(selectedMonth) &&
          transferDate.getFullYear() === Number(selectedYear)
        );
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((t) => {
        const transferDate = new Date(t.fecha);
        return transferDate.getMonth() + 1 === Number(selectedMonth);
      });
    } else if (selectedYear) {
      filtered = filtered.filter((t) => {
        const transferDate = new Date(t.fecha);
        return transferDate.getFullYear() === Number(selectedYear);
      });
    }

    // Aplicar filtro por departamento solo si el usuario tiene permiso para filtrar y ha seleccionado un departamento
    if (canFilterByDept && selectedDepartmentId) {
      filtered = filtered.filter(
        (t) =>
          t.origen_id === Number(selectedDepartmentId) ||
          t.destino_id === Number(selectedDepartmentId)
      );
    }

   /* console.log("Filtering transfers:", {
      userTransfers: currentTransfers,
      searchQuery,
      selectedMonth,
      selectedYear,
      selectedDepartmentId,
      canFilterByDept,
      filteredResult: filtered
    }); // Log para depuración*/
    return filtered;
  }, [transfers, userProfile, searchQuery, selectedMonth, selectedYear, selectedDepartmentId, canFilterByDept]); // Dependencias actualizadas

  const filteredComponentTransfers = useMemo(() => {
    let currentComponentTransfers = Array.isArray(componentTransfers) ? componentTransfers : [];

    // Aplicar filtrado por perfil de usuario primero
    if (userProfile && (userProfile.tipo_usuario !== 1 && userProfile.dept_nombre !== "Bienes")) {
      if (userProfile.dept_id) {
        currentComponentTransfers = currentComponentTransfers.filter((tc) => {
          const originAsset = assets.find(asset => asset.id === tc.bien_origen_id);
          const destinationAsset = assets.find(asset => asset.id === tc.bien_destino_id);
          return (originAsset && originAsset.dept_id === userProfile.dept_id) ||
                 (destinationAsset && destinationAsset.dept_id === userProfile.dept_id);
        });
      } else {
        currentComponentTransfers = [];
      }
    }

    // Aplicar filtros adicionales (búsqueda, fecha, departamento) a los traslados de componentes
    let filtered = currentComponentTransfers;

    if (searchQuery !== "") {
      filtered = filtered.filter(
        (tc) =>
          tc.id.toString().includes(searchQuery) ||
          (tc.observaciones && tc.observaciones.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tc.componente_nombre && tc.componente_nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tc.numero_serial && tc.numero_serial.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((tc) => {
        const transferDate = new Date(tc.fecha);
        return (
          transferDate.getMonth() + 1 === Number(selectedMonth) &&
          transferDate.getFullYear() === Number(selectedYear)
        );
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((tc) => {
        const transferDate = new Date(tc.fecha);
        return transferDate.getMonth() + 1 === Number(selectedMonth);
      });
    } else if (selectedYear) {
      filtered = filtered.filter((tc) => {
        const transferDate = new Date(tc.fecha);
        return transferDate.getFullYear() === Number(selectedYear);
      });
    }

    // Aplicar filtro por departamento solo si el usuario tiene permiso para filtrar y ha seleccionado un departamento
    if (canFilterByDept && selectedDepartmentId) {
      filtered = filtered.filter(
        (tc) =>
          tc.dept_origen === Number(selectedDepartmentId) ||
          tc.dept_destino === Number(selectedDepartmentId)
      );
    }

    return filtered;
  }, [componentTransfers, userProfile, searchQuery, selectedMonth, selectedYear, assets, canFilterByDept, selectedDepartmentId]); // Dependencias actualizadas


  // Handlers
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleDateFilter = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  };

  const handleViewDetails = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    onOpen();
  };

  const handleEditTransfer = (transfer: Transfer) => {
    onClose();
  };
  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container   maxW="100vw"
  px={{ base: 2, md: 4 }}
  py={{ base: 2, md: 4 }}
  w="full">
        {/* Main Header */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={6}
        >
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
                    Historial de Traslados
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Registro completo de movimientos, incorporaciones y desincorporaciones de bienes
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

        {/* Tab Navigation */}
        <Card
          bg={cardBg}
          shadow="md"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={6}
        >
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
                  onClick={() => setActiveTab(tab.id)}
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
          <Card
            bg={cardBg}
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor={tabBorderColor}
            mb={6}
          >
            <CardBody>
              <Flex
                justify="space-between"
                align="center"
                mb={4}
                wrap="wrap"
                gap={4}
              >
                <TransferSearchFilter
                  searchQuery={searchQuery}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedDepartmentId={selectedDepartmentId} // Pasar el nuevo estado
                  onSearch={handleSearch}
                  onDateFilter={handleDateFilter}
                  onDepartmentFilter={handleDepartmentFilter} // Pasar el nuevo handler
                  departments={departments} // Pasar los departamentos
                  canFilterByDept={canFilterByDept} // Pasar el permiso de filtro
                />
              </Flex>
              {activeTab === "transfers" && (
                <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
                  <TransferTable
                    transfers={filteredTransfers}
                    departments={departments}
                    onViewDetails={handleViewDetails}
                  />
                </Box>
              )}
              {activeTab === "componentTransfers" && ( // Nueva condición
                <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
                  <ComponentTransferHistory
                    componentTransfers={filteredComponentTransfers} // Usar los traslados de componentes filtrados
                    assets={assets}
                    departments={departments}
                  />
                </Box>
              )}
              {filteredTransfers.length === 0 && activeTab === "transfers" && <NoTransfersFound />}
              {/* El mensaje de "No hay traslados de componentes" se maneja dentro de ComponentTransferHistory */}
              <TransferDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                transferId={selectedTransfer?.id || null}
                departments={departments}
                onEdit={handleEditTransfer}
              />
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
