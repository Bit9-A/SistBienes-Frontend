"use client"

import { useState, useEffect } from "react"
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
  useToast,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { BsBox2 } from "react-icons/bs"
import { FiPackage, FiDownload, FiFileText, FiTag } from "react-icons/fi"
import { AssetTable } from "./components/AssetTable"
import { AssetForm } from "./components/AssetForm"
import { AssetFilters } from "./components/AssetFilters"
import { handleAddAsset, handleEditAsset, handleDeleteAsset } from "./utils/inventoryUtils"
import { getAssets, getMarcas, getModelos, type MovableAsset } from "../../../api/AssetsApi"
import { getDepartments, getSubGroupsM, getParroquias } from "../../../api/SettingsApi"
import axiosInstance from "../../../utils/axiosInstance"
import { getProfile } from "api/UserApi"
import { exportBM1WithMarkers, generateBM4Pdf } from "views/admin/inventory/utils/inventoryExcel"
import { ExportBM1Modal } from "./components/ExportBM1Modal"
import { ExportBM4Modal } from "./components/ExportBM4Modal"
import { exportQRLabels } from "views/admin/inventory/utils/inventoryLabels"
import { ExportQRLabelsModal } from "./components/ExportQRLabelsModal"

export default function Inventory() {
  const [assets, setAssets] = useState([])
  const [departments, setDepartments] = useState([])
  const [subgroups, setSubgroups] = useState([])
  const [parroquias, setParroquias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [assetStates, setAssetStates] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [canFilterByDept, setCanFilterByDept] = useState(false)
  const [userAssets, setUserAssets] = useState([])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isQRLabelsModalOpen, setIsQRLabelsModalOpen] = useState(false)
  const [isBM4ModalOpen, setIsBM4ModalOpen] = useState(false)

  const toast = useToast()

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })

  // Obtener los estados de bienes /goods-status
  const getAssetStates = async () => {
    const response = await axiosInstance.get("/goods-status")
    return response.data.statusGoods
  }

  // Filtros
  const [filteredAssets, setFilteredAssets] = useState([])
  const [filters, setFilters] = useState({
    departmentId: undefined,
    startDate: "",
    endDate: "",
    order: "recent",
    search: "",
    isActive: 1, // Añadir filtro isActive por defecto a 1 (activos)
  })

  // Colores y estilos
  const cardBg = useColorModeValue("white", "gray.700")
  const tabBorderColor = useColorModeValue("gray.200", "gray.700")
  const textColor = useColorModeValue("gray.800", "white")
  const hoverBg = useColorModeValue("gray.100", "gray.700")
  const bg = useColorModeValue("gray.50", "gray.900")

  // Función para cargar los bienes y otros datos
  const fetchAllData = async () => {
    try {
      const [
        assetsResult,
        departmentsResult,
        subgroupsResult,
        marcasResult,
        modelosResult,
        parishResult,
        assetStatesResult,
      ] = await Promise.allSettled([
        getAssets(),
        getDepartments(),
        getSubGroupsM(),
        getMarcas(),
        getModelos(),
        getParroquias(),
        getAssetStates(),
      ])

      if (assetsResult.status === "fulfilled") {
        setAssets(assetsResult.value)
      } else {
        console.error("Error fetching assets:", assetsResult.reason)
        setAssets([])
      }

      if (departmentsResult.status === "fulfilled") {
        setDepartments(departmentsResult.value)
      } else {
        console.error("Error fetching departments:", departmentsResult.reason)
        setDepartments([])
      }

      if (subgroupsResult.status === "fulfilled") {
        setSubgroups(subgroupsResult.value)
      } else {
        console.error("Error fetching subgroups:", subgroupsResult.reason)
        setSubgroups([])
      }

      if (marcasResult.status === "fulfilled") {
        setMarcas(marcasResult.value)
      } else {
        console.error("Error fetching marcas:", marcasResult.reason)
        setMarcas([])
      }

      if (modelosResult.status === "fulfilled") {
        setModelos(modelosResult.value)
      } else {
        console.error("Error fetching modelos:", modelosResult.reason)
        setModelos([])
      }

      if (parishResult.status === "fulfilled") {
        setParroquias(parishResult.value)
      } else {
        console.error("Error fetching parroquias:", parishResult.reason)
        setParroquias([])
      }

      if (assetStatesResult.status === "fulfilled") {
        setAssetStates(assetStatesResult.value)
      } else {
        console.error("Error fetching asset states:", assetStatesResult.reason)
        setAssetStates([])
      }
    } catch (error) {
      console.error("Unhandled error in fetchAllData:", error)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  // Solo mostrar assets del departamento del usuario autenticado
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile()
        setUserProfile(profile)
        if (profile?.tipo_usuario === 1 || profile?.dept_nombre === "Bienes") {
          setUserAssets(assets)
          setCanFilterByDept(true)
        } else if (profile?.dept_id) {
          const filtered = assets.filter((asset) => asset.dept_id === profile.dept_id)
          setUserAssets(filtered)
          setCanFilterByDept(false)
        } else {
          setUserAssets(assets)
          setCanFilterByDept(false)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUserAssets(assets)
        setCanFilterByDept(false)
      }
    }

    if (assets.length > 0) {
      fetchUserProfile()
    }
  }, [assets])

  // Filtrar assets cada vez que cambian los filtros o los assets originales
  useEffect(() => {
    let filtered = [...userAssets]

    if (canFilterByDept && filters.departmentId) {
      filtered = filtered.filter((a) => a.dept_id === filters.departmentId)
    }

    if (filters.startDate) {
      filtered = filtered.filter((a) => a.fecha && new Date(a.fecha) >= new Date(filters.startDate))
    }

    if (filters.endDate) {
      filtered = filtered.filter((a) => a.fecha && new Date(a.fecha) <= new Date(filters.endDate))
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((a) =>
        Object.values(a).some((val) => val && String(val).toLowerCase().includes(searchLower)),
      )
    }

    // Filtrar por estado activo/inactivo/todos
    if (filters.isActive !== -1) {
      // -1 significa "Todos"
      filtered = filtered.filter((a) => a.isActive === filters.isActive)
    }

    if (filters.order === "recent") {
      filtered = filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    } else {
      filtered = filtered.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    }

    setFilteredAssets(filtered)
  }, [userAssets, filters, canFilterByDept])

  // Handlers
  const handleFormSubmit = async (asset: MovableAsset, logDetails?: string) => {
    try {
      if (isEditing) {
        await handleEditAsset(
          asset.id,
          asset,
          setAssets,
          () => setIsFormOpen(false),
          logDetails || `Se editó el bien con ID: ${asset.id}`,
        )
      } else {
        await handleAddAsset(
          asset,
          setAssets,
          () => setIsFormOpen(false),
          logDetails || `Se creó el bien con N°: ${asset.numero_identificacion}`,
        )
      }
      setSelectedAsset(null)
      setIsEditing(false)
      fetchAllData() // Re-fetch data to update the table
    } catch (error) {
      console.error("Error saving asset:", error)
    }
  }

  const handleDelete = async (assetId: any) => {
    try {
      await handleDeleteAsset(assetId, setAssets)
      fetchAllData() // Re-fetch data to update the table
    } catch (error) {
      console.error("Error deleting asset:", error)
    }
  }

  const handleFilter = (newFilters: any) => {
    setFilters({
      departmentId: newFilters.departmentId,
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      order: newFilters.order,
      search: newFilters.search,
      isActive: newFilters.isActive, // Asegurarse de que isActive se actualice
    })
  }

  // Tabs (solo uno activo en este ejemplo)
  const tabs = [
    {
      id: "inventory",
      label: "Inventario",
      icon: FiPackage,
      color: "purple",
      description: "Gestión de bienes muebles",
    },
  ]

  const [activeTab] = useState("inventory")
  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="100vw" px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }} w="full">
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
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={{ base: 3, md: 4 }}
            >
              <Box>
                <Flex align="center" gap={{ base: 2, md: 3 }} mb={2}>
                  <Box p={{ base: 1.5, md: 2 }} bg="blue.100" borderRadius="lg">
                    <FiPackage size={24} color="#0059ae" />
                  </Box>
                  <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color={textColor}>
                    Gestión de Bienes
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
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
                  fontSize={{ base: "xs", md: "sm" }}
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
            <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 2, md: 2 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "solid" : "ghost"}
                  colorScheme={activeTab === tab.id ? tab.color : "gray"}
                  bg={activeTab === tab.id ? `${tab.color}.500` : "transparent"}
                  color={activeTab === tab.id ? "white" : textColor}
                  borderRadius="lg"
                  _hover={{
                    bg: activeTab === tab.id ? `${tab.color}.600` : hoverBg,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={tab.icon} />}
                  size={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  flex={{ base: "1", md: "auto" }}
                  minW={{ base: "auto", md: "200px" }}
                  boxShadow={activeTab === tab.id ? "md" : "none"}
                  isActive={activeTab === tab.id}
                  w={{ base: "full", md: "auto" }}
                >
                  <Box textAlign="left">
                    <Box fontSize={{ base: "sm", md: "md" }}>{tab.label}</Box>
                    <Box
                      fontSize={{ base: "2xs", md: "xs" }}
                      opacity={0.8}
                      fontWeight="normal"
                      display={{ base: "none", md: "block" }}
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
          {/* Botones de exportación responsive */}
          <Card
            bg={cardBg}
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor={tabBorderColor}
            mb={{ base: 4, md: 6 }}
          >
            <CardBody p={{ base: 3, md: 4 }}>
              {isMobile || isTablet ? (
                <VStack spacing={3} align="stretch">
                  <Button
                    colorScheme="green"
                    leftIcon={<FiDownload />}
                    size={{ base: "md", md: "lg" }}
                    onClick={() => {
                      if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                        setIsExportModalOpen(true)
                      } else {
                        exportBM1WithMarkers(userProfile?.dept_id, userProfile?.dept_nombre)
                      }
                    }}
                  >
                    Exportar a Excel
                  </Button>
                  <Button
                    colorScheme="purple"
                    leftIcon={<FiTag />}
                    size={{ base: "md", md: "lg" }}
                    onClick={() => {
                      if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                        setIsQRLabelsModalOpen(true)
                      } else {
                        exportQRLabels(userProfile?.dept_id, userProfile?.dept_nombre)
                      }
                    }}
                  >
                    Exportar Etiquetas QR
                  </Button>
                  <Button
                    colorScheme="orange"
                    leftIcon={<FiFileText />}
                    size={{ base: "md", md: "lg" }}
                    onClick={() => setIsBM4ModalOpen(true)}
                  >
                    Exportar BM-4
                  </Button>
                </VStack>
              ) : (
                <HStack spacing={3} justify="flex-end" wrap="wrap">
                  <Button
                    colorScheme="green"
                    leftIcon={<FiDownload />}
                    size="md"
                    onClick={() => {
                      if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                        setIsExportModalOpen(true)
                      } else {
                        exportBM1WithMarkers(userProfile?.dept_id, userProfile?.dept_nombre)
                      }
                    }}
                  >
                    Exportar a Excel
                  </Button>
                  <Button
                    colorScheme="purple"
                    leftIcon={<FiTag />}
                    size="md"
                    onClick={() => {
                      if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                        setIsQRLabelsModalOpen(true)
                      } else {
                        exportQRLabels(userProfile?.dept_id, userProfile?.dept_nombre)
                      }
                    }}
                  >
                    Exportar Etiquetas QR
                  </Button>
                  <Button
                    colorScheme="orange"
                    leftIcon={<FiFileText />}
                    size="md"
                    onClick={() => setIsBM4ModalOpen(true)}
                  >
                    Exportar BM-4
                  </Button>
                </HStack>
              )}
            </CardBody>
          </Card>

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
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                align={{ base: "stretch", lg: "center" }}
                mb={{ base: 3, md: 4 }}
                gap={{ base: 3, md: 4 }}
              >
                <Box flex={{ base: "1", lg: "auto" }} w={{ base: "full", lg: "auto" }}>
                  <AssetFilters departments={departments} onFilter={handleFilter} canFilterByDept={canFilterByDept} />
                </Box>
                <Flex gap={2} align="center">
                  <Button
                    bgColor="type.primary"
                    colorScheme="purple"
                    size={{ base: "md", md: "md" }}
                    leftIcon={<BsBox2 />}
                    onClick={() => {
                      setSelectedAsset(null)
                      setIsEditing(false)
                      setIsFormOpen(true)
                    }}
                    w={{ base: "full", lg: "auto" }}
                    minW={{ base: "auto", lg: "160px" }}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    <Box display={{ base: "none", sm: "block" }}>Agregar Bien</Box>
                    <Box display={{ base: "block", sm: "none" }}>Agregar</Box>
                  </Button>
                </Flex>
              </Flex>

              <Box bg={cardBg} p={{ base: 2, md: 4 }} borderRadius="lg" boxShadow="sm" overflowX="auto">
                <AssetTable
                  assets={filteredAssets}
                  onEdit={(asset) => {
                    setSelectedAsset(asset)
                    setIsEditing(true)
                    setIsFormOpen(true)
                    toast({
                      title: "Editando bien",
                      description: `Abriendo formulario para editar el bien con ID: ${asset.id}`,
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                      position: "top",
                    })
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

              <ExportBM4Modal
                isOpen={isBM4ModalOpen}
                onClose={() => setIsBM4ModalOpen(false)}
                departments={departments}
                userProfile={userProfile}
                onExport={async (deptId, mes, año, responsableId, departamentoNombre) => {
                  try {
                    await generateBM4Pdf(deptId, mes, año, responsableId, departamentoNombre)
                    toast({
                      title: "Exportación BM4 iniciada",
                      description: `Se está generando el reporte BM4 para ${departamentoNombre} (${mes}/${año}).`,
                      status: "info",
                      duration: 5000,
                      isClosable: true,
                    })
                  } catch (error) {
                    toast({
                      title: "Error de exportación",
                      description: `No se pudo generar el reporte BM4.`,
                      status: "error",
                      duration: 5000, 
                      isClosable: true,
                    })
                    console.error("Error exporting BM4:", error)
                  }
                }}
              />
            </CardBody>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}
