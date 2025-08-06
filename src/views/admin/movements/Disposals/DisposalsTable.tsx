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
  Button,
} from "@chakra-ui/react"
import { FiTrash2 } from "react-icons/fi"
import {
  getDesincorps,
  createDesincorp,
  updateDesincorp,
  deleteDesincorp,
  Desincorp,
} from "api/IncorpApi"
import DisposalsFilters from "./components/DisposalsFilters"
import DisposalsForm from "./components/DisposalsForm"
import DesktopTable from "./components/DesktopTable"
import MobileCards from "./components/MobileCard"
import { ExportBM2Modal } from "./components/ExportBM2Modal"
import { type Department, getDepartments } from "api/SettingsApi"
import { type ConceptoMovimiento, getConceptosMovimientoDesincorporacion, getConceptosMovimientoIncorporacion } from "api/SettingsApi"
import { type MovableAsset, getAssets, updateAsset } from "api/AssetsApi"
import { type SubGroup, getSubGroupsM } from "api/SettingsApi"
import { createTransferRecord } from "views/admin/transfers/utils/createTransfers";
import { type CreateTransferPayload } from "api/TransferApi";
import { createIncorp, type Incorp } from "api/IncorpApi";
import { exportBM2ByDepartment } from "views/admin/inventory/utils/inventoryExcel";
import { createNotificationAction } from "views/admin/notifications/utils/NotificationsUtils";

import { getProfile } from "api/UserApi";
import { filterByUserProfile } from "../../../../utils/filterByUserProfile";

export default function DisposalsTable() {
  const [disposals, setDisposals] = useState<Desincorp[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Desincorp | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Desincorp>>({})
  const [filterDept, setFilterDept] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isBM2ModalOpen, onOpen: onBM2ModalOpen, onClose: onBM2ModalClose } = useDisclosure();
  const [departments, setDepartments] = useState<Department[]>([])
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([])
  const [assets, setAssets] = useState<MovableAsset[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])
  const [incorpConceptoTraspasoId, setIncorpConceptoTraspasoId] = useState<number | undefined>(undefined);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileDisposals, setProfileDisposals] = useState<Desincorp[]>([]);
  
  const [canFilterByDept, setCanFilterByDept] = useState(false);
  const toast = useToast()

  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")

  const isMobile = useBreakpointValue({ base: true, md: false })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  const fetchDisposals = async () => {
    try {
      setLoading(true);
      const data = await getDesincorps();
      setDisposals(data);
      setError(null);
    } catch (error: any) {
      if (
        error?.response?.status === 404 &&
        error?.response?.data?.message === "No se encontraron desincorporaciones"
      ) {
        setDisposals([]);
        setError(null);
      } else {
        setError("Error al cargar los datos de desincorporaciones. Por favor, intenta nuevamente.");
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

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [deptData, conceptDesincorpData, assetData, subGroupData, conceptIncorpData] = await Promise.all([
          getDepartments(),
          getConceptosMovimientoDesincorporacion(),
          getAssets(),
          getSubGroupsM(),
          getConceptosMovimientoIncorporacion(),
        ]);
        setDepartments(deptData);
        setConcepts(conceptDesincorpData);
        setAssets(assetData);
        setSubgroups(subGroupData);

        const conceptoTraspasoIncorp = conceptIncorpData.find(
          (concepto: any) => concepto.codigo === "02"
        );
        if (conceptoTraspasoIncorp) {
          setIncorpConceptoTraspasoId(conceptoTraspasoIncorp.id);
        }
      } catch (error) {
        toast({
          title: "Error al cargar catálogos",
          description: "Algunos datos de selección (departamentos, conceptos, etc.) podrían no estar disponibles.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCatalogs();
    fetchDisposals();
  }, []);

  const processTransferAndAssetUpdate = async (
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
      const transferPayload: CreateTransferPayload = {
        fecha: fecha,
        cantidad: bienesToTransfer.length,
        origen_id: origen_id,
        destino_id: destino_id,
        bienes: bienesToTransfer,
        responsable_id: userProfile.id,
        observaciones: observaciones,
      };
      await createTransferRecord(transferPayload);
      toast({
        title: "Traslado creado",
        description: "Se ha creado un traslado con los bienes desincorporados.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      for (const bienId of bienesToTransfer) {
        try {
          const assetToUpdate = assets.find(asset => asset.id === bienId);
          if (assetToUpdate) {
            const updatedAsset = { ...assetToUpdate, dept_id: destino_id };
            await updateAsset(bienId, updatedAsset);
            toast({
              title: "Bien actualizado",
              description: `El departamento del bien ${bienId} ha sido actualizado.`,
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
        } catch (assetUpdateError) {
          toast({
            title: "Error",
            description: `Error al actualizar el departamento del bien ${bienId}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
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
    }
  };

  const processDisposal = async (
    data: Partial<Desincorp>,
    deptDestinoId?: number,
    allConcepts?: ConceptoMovimiento[],
    isMultiple: boolean = false
  ) => {
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
      return false;
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
      await createDesincorp(dataToSend as Omit<Desincorp, "id">);

      const selectedConcept = allConcepts?.find((c) => c.id === concepto_id);
      const assetName = assets.find((a) => a.id === bien_id)?.numero_identificacion || `Bien ID: ${bien_id}`;
      const deptOrigenName = departments.find((d) => d.id === dept_id)?.nombre || 'desconocido';

      if (selectedConcept?.codigo === '51' && deptDestinoId && incorpConceptoTraspasoId) {
        const deptDestinoName = departments.find((d) => d.id === deptDestinoId)?.nombre || 'desconocido';

        const incorpDataForTransfer: Omit<Incorp, "id"> = {
          bien_id: bien_id,
          fecha: fecha,
          valor: valor,
          cantidad: cantidad,
          concepto_id: incorpConceptoTraspasoId,
          dept_id: deptDestinoId,
          observaciones: `Incorporación automática por traspaso desde el departamento ${deptOrigenName}. ${data.observaciones || ''}`,
        };
        await createIncorp(incorpDataForTransfer);
        toast({
          title: "Incorporación por traspaso creada",
          description: "Se ha creado una incorporación automática por traspaso.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });

        await createNotificationAction({
          dept_id: dept_id,
          descripcion: `El bien ${assetName} ha sido desincorporado de su departamento por traspaso al departamento ${deptDestinoName}.`,
        });
        await createNotificationAction({
          dept_id: deptDestinoId,
          descripcion: `El bien ${assetName} ha sido incorporado a su departamento por traspaso desde el departamento ${deptOrigenName}.`,
        });

        await processTransferAndAssetUpdate(
          fecha,
          dept_id,
          deptDestinoId,
          [bien_id],
          data.observaciones || "",
        );
      } else {
        await createNotificationAction({
          dept_id: dept_id,
          descripcion: `El bien ${assetName} ha sido desincorporado de su departamento por concepto de ${selectedConcept?.nombre || 'desconocido'}.`,
        });

        try {
          const assetToUpdate = assets.find(asset => asset.id === bien_id);
          if (assetToUpdate) {
            const updatedAsset = { ...assetToUpdate, isActive: 0 };
            await updateAsset(bien_id, updatedAsset);
            toast({
              title: "Estado del bien actualizado",
              description: `El bien ${assetName} ha sido marcado como inactivo.`,
              status: "info",
              duration: 1500,
              isClosable: true,
            });
          }
        } catch (assetUpdateError) {
          toast({
            title: "Error",
            description: `Error al actualizar el estado del bien ${assetName}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }

      if (!isMultiple) {
        toast({
          title: "Desincorporación creada",
          description: "La desincorporación se ha creado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al crear desincorporación para el bien ${bien_id}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const handleAdd = async (
    disposalData?: Partial<Desincorp>,
    deptDestinoId?: number,
    allConcepts?: ConceptoMovimiento[],
  ) => {
    const data = disposalData || newDisposal;
    const success = await processDisposal(data, deptDestinoId, allConcepts);
    if (success) {
      fetchDisposals();
      onClose();
    }
  };

  const handleMultipleAdd = async (
    disposalDataArray: Partial<Desincorp>[],
    deptDestinoId: number,
    allConcepts: ConceptoMovimiento[],
    selectedAssetIds: number[],
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

    const bienesToTransfer: number[] = [];
    let transferFecha = "";
    let transferOrigenId = 0;
    let transferObservaciones = "";
    let allSuccess = true;

    for (const data of disposalDataArray) {
      const success = await processDisposal(data, deptDestinoId, allConcepts, true);
      if (!success) {
        allSuccess = false;
        break;
      }

      const selectedConcept = allConcepts.find((c) => c.id === Number(data.concepto_id));
      if (selectedConcept?.codigo === '51') {
        bienesToTransfer.push(Number(data.bien_id));
        transferFecha = data.fecha || "";
        transferOrigenId = Number(data.dept_id);
        transferObservaciones = data.observaciones || "";
      }
    }

    if (!allSuccess) {
      return;
    }

    if (bienesToTransfer.length > 0 && deptDestinoId && incorpConceptoTraspasoId) {
      const deptDestinoName = departments.find((d) => d.id === deptDestinoId)?.nombre || 'desconocido';
      const deptOrigenName = departments.find((d) => d.id === transferOrigenId)?.nombre || 'desconocido';

      for (const bienId of bienesToTransfer) {
        const asset = assets.find(a => a.id === bienId);
        if (asset) {
          const incorpDataForTransfer: Omit<Incorp, "id"> = {
            bien_id: bienId,
            fecha: transferFecha,
            valor: asset.valor_total,
            cantidad: 1,
            concepto_id: incorpConceptoTraspasoId,
            dept_id: deptDestinoId,
            observaciones: `Incorporación automática por traspaso desde el departamento ${deptOrigenName}. ${transferObservaciones || ''}`,
          };
          await createIncorp(incorpDataForTransfer);

          await createNotificationAction({
            dept_id: transferOrigenId,
            descripcion: `El bien ${asset.numero_identificacion} ha sido desincorporado de su departamento por traspaso al departamento ${deptDestinoName}.`,
          });
          await createNotificationAction({
            dept_id: deptDestinoId,
            descripcion: `El bien ${asset.numero_identificacion} ha sido incorporado a su departamento por traspaso desde el departamento ${deptOrigenName}.`,
          });
        }
      }
      toast({
        title: "Incorporaciones por traspaso creadas",
        description: "Se han creado incorporaciones automáticas por traspaso.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      await processTransferAndAssetUpdate(
        transferFecha,
        transferOrigenId,
        deptDestinoId,
        bienesToTransfer,
        transferObservaciones,
      );
    }

    toast({
      title: "Desincorporaciones creadas",
      description: "Las desincorporaciones se han creado exitosamente",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchDisposals();
    onClose();
  };

  const handleEdit = async () => {
    if (selectedDisposal && newDisposal) {
      try {
        await updateDesincorp(selectedDisposal.id, newDisposal)
        
        toast({
          title: "Desincorporación actualizada",
          description: "La desincorporación se ha actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchDisposals();
        setSelectedDisposal(null)
        setNewDisposal({})
        onClose()
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

  const handleFilterDate = (month: string, year: string) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const filteredDisposals = useMemo(() => {
    let filtered = profileDisposals;

    if (filterDept !== "all") {
      filtered = filtered.filter((desincorp) => String(desincorp.dept_id) === filterDept);
    }

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((desincorp) => {
        const desincorpDate = new Date(desincorp.fecha);
        return (
          desincorpDate.getMonth() + 1 === Number(selectedMonth) &&
          desincorpDate.getFullYear() === Number(selectedYear)
        );
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((desincorp) => {
        const desincorpDate = new Date(desincorp.fecha);
        return desincorpDate.getMonth() + 1 === Number(selectedMonth);
      });
    } else if (selectedYear) {
      filtered = filtered.filter((desincorp) => {
        const desincorpDate = new Date(desincorp.fecha);
        return desincorpDate.getFullYear() === Number(selectedYear);
      });
    }

    return filtered;
  }, [profileDisposals, filterDept, selectedMonth, selectedYear]);

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
    }
  };

  return (
    <Stack spacing={4}>
      {/* Loading/Error overlays */}
      {(loading || error) && (
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            {loading ? (
              <Center py={20}>
                <Stack align="center" spacing={4}>
                  <Spinner size="xl" color="red.500" thickness="4px" />
                  <Heading size="md" color={textColor}>
                    Cargando desincorporaciones...
                  </Heading>
                </Stack>
              </Center>
            ) : (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error al cargar datos</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}
          </CardBody>
        </Card>
      )}
      {/* Filters and Add Button Section */}
      <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          <DisposalsFilters
            onFilterDepartment={handleFilterDepartment}
            onFilterDate={handleFilterDate}
            onAddClick={openAddDialog}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
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
