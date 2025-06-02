import { useState, useEffect } from "react";
import { Box, Button, useDisclosure, useColorModeValue, useBreakpointValue, Stack } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import {
  Incorp,
  getIncorps,
  createIncorp,
  updateIncorp,
  deleteIncorp,
} from "api/IncorpApi";
import {
  filterIncorporations,
} from "./utils/IncorporationsLogic";
import IncorporationsFilters from "./components/IncorporationsFilters";
import IncorporationsForm from "./components/IncorporationsForm";
import DesktopTable from "./components/DesktopTable";
import MobileCards from "./components/MobileCard";
import { Department,getDepartments } from "api/SettingsApi"; // Importa el tipo de Departamento si lo necesitas
import { ConceptoMovimiento,getConceptosMovimientoIncorporacion } from "api/SettingsApi";
 // Importa el tipo de ConceptoMovimiento si lo necesitas
// Mock data for initial load

export default function IncorporationsTable() {

const [incorporations, setIncorporations] = useState<Incorp[]>([]);
  const [filteredIncorporations, setFilteredIncorporations] = useState<Incorp[]>([]);
  const [selectedIncorporation, setSelectedIncorporation] = useState<Incorp | null>(null);
  const [newIncorporation, setNewIncorporation] = useState<Partial<Incorp>>({});
  const [filterDept, setFilterDept] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [departments, setDepartments] = useState<Department[]>([]); // Mock departments
  const [concepts, setConcepts] = useState<ConceptoMovimiento[]>([]); // Mock concepts

  // UI theme values
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });




  // Cargar datos reales al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIncorps();
        const deptData = await getDepartments();
        const conceptData = await getConceptosMovimientoIncorporacion();
        setDepartments(deptData);
        setConcepts(conceptData);
        setIncorporations(data);
        setFilteredIncorporations(data);
      } catch (error) {
        // Manejo de error
      }
    };
    fetchData();
  }, []);

const handleAdd = async () => {
  // Validar y limpiar datos
  const bien_id = Number(newIncorporation.bien_id);
  const fecha = newIncorporation.fecha ? newIncorporation.fecha : "";
  const valor = Number(newIncorporation.valor);
  const cantidad = Number(newIncorporation.cantidad);
  const concepto_id = Number(newIncorporation.concepto_id);
  const dept_id = Number(newIncorporation.dept_id);

  if (
    !bien_id ||
    !fecha ||
    !valor ||
    !cantidad ||
    !concepto_id ||
    !dept_id
  ) {
    // Muestra un toast de error: "Todos los campos son obligatorios"
    return;
  }

  // Solo envía los campos que espera el backend
  const dataToSend = { bien_id, fecha, valor, cantidad, concepto_id, dept_id };

  try {
    const created = await createIncorp(dataToSend);
    setIncorporations((prev) => [...prev, created]);
    setFilteredIncorporations((prev) => [...prev, created]);
    setNewIncorporation({});
    onClose();
  } catch (error) {
    // Manejo de error
    console.error("Error al crear incorporación:", error);
  }
};

const handleEdit = async () => {
  if (selectedIncorporation && newIncorporation) {
    try {
      const { fecha, bien_id, ...updates } = newIncorporation;
      const updated = await updateIncorp(selectedIncorporation.id, updates);

      if (!updated || typeof updated.id === "undefined") {
        // Manejo de error: no se recibió el objeto actualizado
        return;
      }

      setIncorporations((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );
      setFilteredIncorporations((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );
      setSelectedIncorporation(null);
      setNewIncorporation({});
      onClose();
    } catch (error) {
      // Manejo de error
    }
  }
};

  const handleDelete = async (id: number) => {
    try {
      await deleteIncorp(id);
      setIncorporations((prev) => prev.filter((item) => item.id !== id));
      setFilteredIncorporations((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      // Manejo de error
    }
  };

   const handleFilterDepartment = (deptId: string) => {
    setFilterDept(deptId);
    applyFilters(deptId, startDate, endDate);
  };

  const handleFilterDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    applyFilters(filterDept, start, end);
  };

   const applyFilters = (deptId: string, start: string, end: string) => {
    const filtered = filterIncorporations(
      incorporations,
      "", // Si tienes búsqueda, pásala aquí
      deptId,
      start,
      end
    );
    setFilteredIncorporations(filtered);
  };

  const openEditDialog = (inc: Incorp) => {
    setSelectedIncorporation(inc);
    setNewIncorporation(inc);
    onOpen();
  };

  const openAddDialog = () => {
    setSelectedIncorporation(null);
    setNewIncorporation({});
    onOpen();
  };
  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <Box pt={{ base: "100px", md: "80px", xl: "80px" }}>
      <Stack
        spacing={4}
        mb={4}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
      >
        <Button
          colorScheme="purple"
          bgColor={'type.primary'}
          onClick={openAddDialog}
          size={buttonSize}
          leftIcon={isMobile ? undefined : <FiEdit />}
          w={{ base: "full", md: "auto" }}
        >
          {isMobile ? "Agregar" : "Agregar Incorporación"}
        </Button>

        <IncorporationsFilters
          onFilterDepartment={handleFilterDepartment}
          onFilterDate={handleFilterDate}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          startDate={startDate}
          endDate={endDate}
          buttonSize={buttonSize || "md"}
          borderColor={borderColor}
          cardBg={cardBg}
          departments={departments} // Pasa los departamentos al filtro
        />
      </Stack>

      {!isMobile ? (
        <DesktopTable
          incorporations={filteredIncorporations}
          borderColor={borderColor}
          headerBg={headerBg}
          hoverBg={hoverBg}
          tableSize={tableSize}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      ) : (
        <MobileCards
          incorporations={filteredIncorporations}
          borderColor={borderColor}
          departments={departments}
          concepts={concepts}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      )}

      <IncorporationsForm
        isOpen={isOpen}
        onClose={onClose}
        selectedIncorporation={selectedIncorporation}
        newIncorporation={newIncorporation}
        setNewIncorporation={setNewIncorporation}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        isMobile={isMobile || false}
        departments={departments}
        concepts={concepts} // Pasa los conceptos al formulario
      />
    </Box>
  );
}