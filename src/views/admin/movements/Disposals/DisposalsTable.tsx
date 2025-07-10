"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  Heading,
  Card,
  CardBody,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Button, // Añadir Button aquí
} from "@chakra-ui/react"
import { FiTrash2 } from "react-icons/fi"
import {
  getDesincorps,
  createDesincorp,
  updateDesincorp,
  deleteDesincorp,
  Desincorp,
} from "api/IncorpApi"
import { filterDisposals } from "./utils/DisposalsUtils"
import DisposalsFilters from "./components/DisposalsFilters"
import DisposalsForm from "./components/DisposalsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"
import { ExportBM2Modal } from "./components/ExportBM2Modal" // Importar el nuevo modal
import { type Department, getDepartments } from "api/SettingsApi"
import { type ConceptoMovimiento, getConceptosMovimientoDesincorporacion, getConceptosMovimientoIncorporacion } from "api/SettingsApi"
import { type MovableAsset, getAssets, updateAsset } from "api/AssetsApi"
import { type SubGroup, getSubGroupsM } from "api/SettingsApi"
import { createTransferRecord } from "views/admin/transfers/utils/createTransfers";
import { type Transfer } from "api/TransferApi";
import { createIncorp, type Incorp } from "api/IncorpApi";
import { exportBM2ByDepartment } from "views/admin/inventory/utils/inventoryExcel"; // Importar la función de exportación BM2

import { getProfile } from "api/UserApi";
import { filterByUserProfile } from "../../../../utils/filterByUserProfile";

export default function DisposalsTable() {
  const today = new Date().toISOString().slice(0, 10)
  const [disposals, setDisposals] = useState<Desincorp[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Desincorp | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Desincorp>>({})
  const [filterDept, setFilterDept] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isBM2ModalOpen, onOpen: onBM2ModalOpen, onClose: onBM2ModalClose } = useDisclosure(); // Para el modal BM2
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])
  const [assets, setAssets] = useState<MovableAsset[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])
  const [incorpConceptoTraspasoId, setIncorpConceptoTraspasoId] = useState<number | undefined>(undefined);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileDisposals, setProfileDisposals] = useState<Desincorp[]>([]);
  
  const [canFilterByDept, setCanFilterByDept] = useState(false);
  const toast = useToast()

  // UI theme values
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  // Función para cargar desincorporaciones
  const fetchDisposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDesincorps();
      setDisposals(data);
    } catch (error: any) {
      if (
        error?.response?.status === 404 &&
        error?.response?.data?.message === "No se encontraron desincorporaciones"
      ) {
        setDisposals([]); // No hay registros, pero no es un error
        setError(null);
      } else {
        setError("Error al cargar los datos. Por favor, intenta nuevamente.");
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileAndFilter = async () => {
      const profile = await getProfile();
      setUserProfile(profile);
      const { filtered, canFilterByDept } = filterByUserProfile(disposals, profile);
      setProfileDisposals(filtered);
      setCanFilterByDept(canFilterByDept);
    };
    fetchProfileAndFilter();
  }, [disposals]);

  // Load data on mount
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [deptData, conceptDesincorpData, assetData, subGroupData, conceptIncorpData] = await Promise.all([
          getDepartments(),
          getConceptosMovimientoDesincorporacion(),
          getAssets(),
          getSubGroupsM(),
          getConceptosMovimientoIncorporacion(), // Obtener conceptos de incorporación
        ]);
        setDepartments(deptData);
        setConcepts(conceptDesincorpData); // Estos son los conceptos de desincorporación
        setAssets(assetData);
        setSubgroups(subGroupData);

        const conceptoTraspasoIncorp = conceptIncorpData.find(
          (concepto: any) => concepto.codigo === "02"
        );
        if (conceptoTraspasoIncorp) {
          setIncorpConceptoTraspasoId(conceptoTraspasoIncorp.id);
        } else {
          console.warn("Concepto de incorporación con código '02' no encontrado.");
        }

      } catch (error) {
        setError("Error al cargar catálogos.");
        console.error("Error fetching catalogs:", error);
      }
    };

    fetchCatalogs();
    fetchDisposals(); // Llamar a la función de carga de desincorporaciones
  }, []);

  const processTransferAndAssetUpdate = async (
    fecha: string,
    origen_id: number,
    destino_id: number,
    bienesToTransfer: number[],
    observaciones: string,
  ) => {
    console.log("Executing processTransferAndAssetUpdate");
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "No se pudo obtener el perfil del usuario para crear el traslado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const transferPayload: Omit<Transfer, "id"> = {
        fecha: fecha,
        cantidad: bienesToTransfer.length,
        origen_id: origen_id,
        destino_id: destino_id,
        bienes: bienesToTransfer,
        responsable_id: userProfile.id,
        observaciones: observaciones,
      };
      console.log("Transfer Payload:", transferPayload);
      await createTransferRecord(transferPayload);
      toast({
        title: "Traslado creado",
        description: "Se ha creado un traslado con los bienes desincorporados.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Actualizar el departamento de los bienes
      for (const bienId of bienesToTransfer) {
        try {
          const assetToUpdate = assets.find(asset => asset.id === bienId);
          if (assetToUpdate) {
            const updatedAsset = { ...assetToUpdate, dept_id: destino_id };
            console.log(`Updating asset ${bienId} with new dept_id: ${destino_id}`);
            await updateAsset(bienId, updatedAsset);
            toast({
              title: "Bien actualizado",
              description: `El departamento del bien ${bienId} ha sido actualizado.`,
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.warn(`Asset with ID ${bienId} not found in local state.`);
          }
        } catch (assetUpdateError) {
          toast({
            title: "Error",
            description: `Error al actualizar el departamento del bien ${bienId}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error(`Error al actualizar el bien ${bienId}:`, assetUpdateError);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el traslado asociado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error al crear traslado:", error);
    }
  };

  const handleAdd = async (
    disposalData?: Partial<Desincorp>,
    deptDestinoId?: number,
    allConcepts?: ConceptoMovimiento[],
  ) => {
    console.log("Executing handleAdd (single disposal)");
    const data = disposalData || newDisposal;
    const bien_id = Number(data.bien_id);
    const fecha = data.fecha ? data.fecha : "";
    const valor = Number(data.valor);
    const cantidad = Number(data.cantidad);
    const concepto_id = Number(data.concepto_id);
    const dept_id = Number(data.dept_id);

    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id || !dept_id) {
      toast({
        title: "Campos requeridos",
        description: "Todos los campos son obligatorios",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const dataToSend = {
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
      observaciones: data.observaciones,
    };

    try {
      const created = await createDesincorp(dataToSend as Omit<Desincorp, "id">);
      setDisposals((prev) => [...prev, created]);

      const selectedConcept = allConcepts?.find((c) => c.id === concepto_id);
      console.log(`Single Disposal: Bien ID: ${bien_id}, Concepto ID: ${concepto_id}, Selected Concept:`, selectedConcept);
      if (selectedConcept?.codigo === '51' && deptDestinoId && incorpConceptoTraspasoId) {
        // Crear la incorporación por traspaso
        const incorpDataForTransfer: Omit<Incorp, "id"> = {
          bien_id: bien_id,
          fecha: fecha,
          valor: valor,
          cantidad: cantidad,
          concepto_id: incorpConceptoTraspasoId, // Concepto de incorporación por traspaso (código 02)
          dept_id: deptDestinoId, // Departamento de destino de la desincorporación
          observaciones: `Incorporación automática por traspaso desde el departamento ${departments.find(d => d.id === dept_id)?.nombre || ''}. ${data.observaciones || ''}`,
        };
        await createIncorp(incorpDataForTransfer);
        toast({
          title: "Incorporación por traspaso creada",
          description: "Se ha creado una incorporación automática por traspaso.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });

        // Actualizar el departamento del bien y crear el registro de traslado
        await processTransferAndAssetUpdate(
          fecha,
          dept_id,
          deptDestinoId,
          [bien_id],
          data.observaciones || "",
        );
      }

      toast({
        title: "Desincorporación creada",
        description: "La desincorporación se ha creado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear desincorporación",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error al crear desincorporación:", error);
    }
  };

  const handleMultipleAdd = async (
    disposalDataArray: Partial<Desincorp>[],
    deptDestinoId: number,
    allConcepts: ConceptoMovimiento[],
    selectedAssetIds: number[],
  ) => {
    console.log("Executing handleMultipleAdd (multiple disposals)");
    console.log("User Profile at start of handleMultipleAdd:", userProfile);
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "No se pudo obtener el perfil del usuario para crear el traslado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const nuevos: Desincorp[] = [];
    const bienesToTransfer: number[] = [];
    let isTransferConcept = false;
    let transferFecha = "";
    let transferOrigenId = 0;
    let transferObservaciones = "";

    for (const data of disposalDataArray) {
      const bien_id = Number(data.bien_id);
      const fecha = data.fecha ? data.fecha : "";
      const valor = Number(data.valor);
      const cantidad = Number(data.cantidad);
      const concepto_id = Number(data.concepto_id);
      const dept_id = Number(data.dept_id);

      if (!bien_id || !fecha || !valor || !cantidad || !concepto_id || !dept_id) {
        toast({
          title: "Campos requeridos",
          description: "Todos los campos son obligatorios para cada bien.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const dataToSend = {
        bien_id,
        fecha,
        valor,
        cantidad,
        concepto_id,
        dept_id,
        observaciones: data.observaciones,
      };

      try {
        const created = await createDesincorp(dataToSend as Omit<Desincorp, "id">);
        nuevos.push(created);

        const selectedConcept = allConcepts.find((c) => c.id === concepto_id);
        console.log(`Multiple Disposal: Bien ID: ${bien_id}, Concepto ID: ${concepto_id}, Selected Concept:`, selectedConcept);
        if (selectedConcept?.codigo === '51') {
          isTransferConcept = true;
          bienesToTransfer.push(bien_id);
          transferFecha = fecha;
          transferOrigenId = dept_id;
          transferObservaciones = data.observaciones || "";
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Error al crear desincorporación para el bien ${bien_id}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error(`Error al crear desincorporación para el bien ${bien_id}:`, error);
        return; // Stop if one fails
      }
    }

    setDisposals((prev) => [...prev, ...nuevos]);

    console.log("Transfer conditions check: isTransferConcept:", isTransferConcept, "deptDestinoId:", deptDestinoId, "bienesToTransfer.length:", bienesToTransfer.length, "userProfile?.id:", userProfile?.id);

    if (isTransferConcept && deptDestinoId && bienesToTransfer.length > 0 && incorpConceptoTraspasoId) {
      // Crear la incorporación por traspaso para cada bien
      for (const bienId of bienesToTransfer) {
        const asset = assets.find(a => a.id === bienId);
        if (asset) {
          const incorpDataForTransfer: Omit<Incorp, "id"> = {
            bien_id: bienId,
            fecha: transferFecha,
            valor: asset.valor_total, // Usar el valor del bien
            cantidad: 1, // Asumimos cantidad 1 por bien
            concepto_id: incorpConceptoTraspasoId, // Concepto de incorporación por traspaso (código 02)
            dept_id: deptDestinoId, // Departamento de destino
            observaciones: `Incorporación automática por traspaso desde el departamento ${departments.find(d => d.id === transferOrigenId)?.nombre || ''}. ${transferObservaciones || ''}`,
          };
          await createIncorp(incorpDataForTransfer);
        }
      }
      toast({
        title: "Incorporaciones por traspaso creadas",
        description: "Se han creado incorporaciones automáticas por traspaso.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Actualizar el departamento de los bienes y crear el registro de traslado
      await processTransferAndAssetUpdate(
        transferFecha,
        transferOrigenId,
        deptDestinoId,
        bienesToTransfer,
        transferObservaciones,
      );
    } else {
      console.log("Transfer conditions not met. isTransferConcept:", isTransferConcept, "deptDestinoId:", deptDestinoId, "bienesToTransfer.length:", bienesToTransfer.length, "userProfile?.id:", userProfile?.id, "incorpConceptoTraspasoId:", incorpConceptoTraspasoId);
    }

    toast({
      title: "Desincorporaciones creadas",
      description: "Las desincorporaciones se han creado exitosamente",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTransferAndAssetUpdate = async (
    fecha: string,
    origen_id: number,
    destino_id: number,
    bienesToTransfer: number[],
    observaciones: string,
  ) => {
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "No se pudo obtener el perfil del usuario para crear el traslado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const transferPayload: Omit<Transfer, "id"> = {
        fecha: fecha,
        cantidad: bienesToTransfer.length,
        origen_id: origen_id,
        destino_id: destino_id,
        bienes: bienesToTransfer,
        responsable_id: userProfile.id,
        observaciones: observaciones,
      };
      console.log("Transfer Payload:", transferPayload);
      await createTransferRecord(transferPayload);
      toast({
        title: "Traslado creado",
        description: "Se ha creado un traslado con los bienes desincorporados.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Actualizar el departamento de los bienes
      for (const bienId of bienesToTransfer) {
        try {
          const assetToUpdate = assets.find(asset => asset.id === bienId);
          if (assetToUpdate) {
            const updatedAsset = { ...assetToUpdate, dept_id: destino_id };
            console.log(`Updating asset ${bienId} with new dept_id: ${destino_id}`);
            await updateAsset(bienId, updatedAsset);
            toast({
              title: "Bien actualizado",
              description: `El departamento del bien ${bienId} ha sido actualizado.`,
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.warn(`Asset with ID ${bienId} not found in local state.`);
          }
        } catch (assetUpdateError) {
          toast({
            title: "Error",
            description: `Error al actualizar el departamento del bien ${bienId}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error(`Error al actualizar el bien ${bienId}:`, assetUpdateError);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el traslado asociado.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error al crear traslado:", error);
    }
  };

  const handleEdit = async () => {
    if (selectedDisposal && newDisposal) {
      try {
        const updated = await updateDesincorp(selectedDisposal.id, newDisposal)
        if (!updated || typeof updated.id === "undefined") {
          toast({
            title: "Error",
            description: "No se pudo actualizar la desincorporación",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          return
        }
        setDisposals((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
        setSelectedDisposal(null)
        setNewDisposal({})
        onClose()
        toast({
          title: "Desincorporación actualizada",
          description: "La desincorporación se ha actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al actualizar desincorporación",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteDesincorp(id)
      setDisposals((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Desincorporación eliminada",
        description: "La desincorporación se ha eliminado exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar desincorporación",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleFilterDepartment = (deptId: string) => {
    setFilterDept(deptId)
  }

  const handleFilterDate = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end || today)
  }

  // Filtro igual que incorporations: useMemo y compara fechas con new Date()
 const filteredDisposals = useMemo(() => {
  return filterDisposals(
    profileDisposals,
    "",
    filterDept,
    startDate,
    endDate
  );
}, [profileDisposals, filterDept, startDate, endDate]);

  const openEditDialog = (disposal: Desincorp) => {
    setSelectedDisposal(disposal)
    setNewDisposal(disposal)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedDisposal(null)
    setNewDisposal({})
    onOpen()
  }

  const handleExportBM2 = async (deptId: number, deptName: string, mes: number, año: number, tipo: 'incorporacion' | 'desincorporacion') => {
    try {
      await exportBM2ByDepartment(deptId, deptName, mes, año, tipo);
      toast({
        title: "Exportación BM2 iniciada",
        description: `Se está generando el archivo BM2 de ${tipo} para ${deptName}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error de exportación",
        description: `No se pudo generar el archivo BM2 de ${tipo}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error exporting BM2:", error);
    }
  };

  if (loading) {
    return (
      <Center py={20}>
        <Stack align="center" spacing={4}>
          <Spinner size="xl" color="red.500" thickness="4px" />
          <Heading size="md" color={textColor}>
            Cargando desincorporaciones...
          </Heading>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Error al cargar datos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
    )
  }

  return (
    <Stack spacing={4}>
      {/* Filters and Add Button Section */}
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          <DisposalsFilters
            onFilterDepartment={handleFilterDepartment}
            onFilterDate={handleFilterDate}
            onAddClick={openAddDialog}
            startDate={startDate}
            endDate={endDate}
            departments={departments}
            canFilterByDept={canFilterByDept}
          />
          <Button
            colorScheme="purple"
            onClick={onBM2ModalOpen}
            mt={4} // Añadir margen superior para separar del filtro
          >
            Exportar BM-2
          </Button>
        </CardBody>
      </Card>

      {/* Content Section */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          {/* Results Summary */}
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color={textColor} mb={1}>
                Desincorporaciones
              </Heading>
              <Box color="gray.600" fontSize="sm">
                {filteredDisposals.length} registro{filteredDisposals.length !== 1 ? "s" : ""} encontrado
                {filteredDisposals.length !== 1 ? "s" : ""}
              </Box>
            </Box>
          </Flex>

          {/* Table/Cards Content */}
          {filteredDisposals.length === 0 ? (
            <Center py={12}>
              <Stack align="center" spacing={4}>
                <Box p={4} bg="gray.100" borderRadius="full">
                  <FiTrash2 size={32} color="gray" />
                </Box>
                <Box textAlign="center">
                  <Heading size="md" color="gray.500" mb={2}>
                    No hay desincorporaciones
                  </Heading>
                  <Box color="gray.400" fontSize="sm">
                    No se encontraron desincorporaciones que coincidan con los filtros aplicados
                  </Box>
                </Box>
              </Stack>
            </Center>
          ) : !isMobile ? (
            <DesktopTable
              disposals={filteredDisposals}
              borderColor={borderColor}
              headerBg={headerBg}
              hoverBg={hoverBg}
              tableSize={tableSize}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              departments={departments}
              concepts={concepts}
            />
          ) : (
            <MobileCards
              disposals={filteredDisposals}
              borderColor={borderColor}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              departments={departments}
              concepts={concepts}
            />
          )}
        </CardBody>
      </Card>

      {/* Form Modal */}
      <DisposalsForm
        isOpen={isOpen}
        onClose={onClose}
        selectedDisposal={selectedDisposal}
        newDisposal={newDisposal}
        setNewDisposal={setNewDisposal}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        isMobile={isMobile || false}
        departments={departments}
        concepts={concepts}
        assets={assets}
        subgroups={subgroups}
        disposals={disposals}
        userProfile={userProfile} // Pasar el perfil del usuario si es necesario
        handleMultipleAdd={handleMultipleAdd}
      />

      {/* Modal para exportar BM2 */}
      <ExportBM2Modal
        isOpen={isBM2ModalOpen}
        onClose={onBM2ModalClose}
        departments={departments}
        onExport={handleExportBM2}
        tipoMovimiento="desincorporacion" // Especificar el tipo de movimiento
      />
    </Stack>
  )
}
