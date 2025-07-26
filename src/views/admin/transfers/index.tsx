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

export default function TransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [componentTransfers, setComponentTransfers] = useState<TransferComponent[]>([]); // Nuevo estado
  const [assets, setAssets] = useState<MovableAsset[]>([]); // Nuevo estado
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Nuevo estado para el mes
  const [selectedYear, setSelectedYear] = useState<string>(""); // Nuevo estado para el año

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
      // Cargar traslados de bienes, departamentos y activos de forma independiente
      try {
        const transferData = await getAllTransfers();
        setTransfers(transferData);
      } catch (error) {
        console.error("Error fetching transfers:", error);
        setTransfers([]); // Asegurarse de que el estado se actualice incluso si hay un error
      }

      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }

      try {
        const assetsData = await getAssets();
        setAssets(assetsData);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setAssets([]);
      }

      // Cargar traslados de componentes de forma independiente
      try {
        const componentTransfersData = await getTransferComponents();
        setComponentTransfers(componentTransfersData);
      } catch (error) {
        console.error("Error fetching component transfers:", error);
        setComponentTransfers([]);
      }
    };

    fetchAllData();
  }, []);

  // Filtrado simple por búsqueda y fechas
  const filteredTransfers = useMemo(() => {
    let filtered = Array.isArray(transfers) ? transfers : [];

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

    return filtered;
  }, [transfers, searchQuery, selectedMonth, selectedYear]);

  // Handlers
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleDateFilter = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
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
                  onSearch={handleSearch}
                  onDateFilter={handleDateFilter}
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
                    componentTransfers={componentTransfers}
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
