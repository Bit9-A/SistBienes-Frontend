"use client"
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
    const fetchData = async () => {
      try {
        const [transferData, departmentsData, componentTransfersData, assetsData] = await Promise.all([
          getAllTransfers(),
          getDepartments(),
          getTransferComponents(),
          getAssets(), // Corregido: getAssets en lugar de getMovableAssets
        ]);
        setTransfers(transferData);
        setDepartments(departmentsData);
        setComponentTransfers(componentTransfersData);
        setAssets(assetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrado simple por búsqueda y fechas
  const filteredTransfers = Array.isArray(transfers)
    ? transfers.filter((t) => {
        const matchesQuery =
          searchQuery === "" ||
          t.id.toString().includes(searchQuery) ||
          (t.observaciones && t.observaciones.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStart = !startDate || new Date(t.fecha) >= new Date(startDate);
        const matchesEnd = !endDate || new Date(t.fecha) <= new Date(endDate);
        return matchesQuery && matchesStart && matchesEnd;
      })
    : [];

  // Handlers
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleDateFilter = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
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
                  startDate={startDate}
                  endDate={endDate}
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
              {componentTransfers.length === 0 && activeTab === "componentTransfers" && (
                <Flex justify="center" align= "center" minH="200px">
             
                </Flex>
              )}
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
