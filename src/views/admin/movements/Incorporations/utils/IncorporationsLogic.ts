import {
  getIncorps,
  getIncorpById,
  createIncorp,
  updateIncorp,
  deleteIncorp,
  Incorp,
} from "api/IncorpApi";

// Filtrar incorporaciones por búsqueda, departamento y fechas
export const filterIncorporations = (
  incorporations: Incorp[],
  searchQuery: string,
  selectedDept: string,
  startDate: string,
  endDate: string
) => {
  const query = searchQuery.toLowerCase();

  return incorporations.filter((inc) => {
    // Normaliza la fecha de la incorporación a YYYY-MM-DD
    const incDateStr = inc.fecha ? new Date(inc.fecha).toISOString().slice(0, 10) : "";

    const matchesStart = !startDate || incDateStr >= startDate;
    const matchesEnd = !endDate || incDateStr <= endDate;

    const matchesSearch =
      inc.bien_id.toString().includes(query) ||
      inc.concepto_id.toString().includes(query) ||
      inc.id.toString().includes(query);

    const matchesDept =
      selectedDept === "all" || inc.dept_id?.toString() === selectedDept;

    return matchesSearch && matchesDept && matchesStart && matchesEnd;
  });
};


// Eliminar una incorporación
export const handleDeleteIncorp = async (
  id: number,
  setIncorps: React.Dispatch<React.SetStateAction<Incorp[]>>
) => {
  try {
    await deleteIncorp(id);
    setIncorps((prev) => prev.filter((inc) => inc.id !== id));
  } catch (error) {
    console.error("Error al eliminar la incorporación:", error);
  }
};

// Crear una incorporación
export const handleCreateIncorp = async (
  incorp: Omit<Incorp, "id">,
  setIncorps: React.Dispatch<React.SetStateAction<Incorp[]>>
) => {
  try {
    const newIncorp = await createIncorp(incorp);
    setIncorps((prev) => [...prev, newIncorp]);
    return newIncorp;
  } catch (error) {
    throw error;
  }
};

// Actualizar una incorporación
export const handleUpdateIncorp = async (
  incorp: Incorp,
  setIncorps: React.Dispatch<React.SetStateAction<Incorp[]>>
) => {
  try {
    const { id, ...updates } = incorp;
    const updated = await updateIncorp(id, updates);
    setIncorps((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updated } : i))
    );
    return updated;
  } catch (error) {
    console.error("Error al actualizar la incorporación:", error);
  }
};

// Obtener todas las incorporaciones (útil para inicializar el estado)
export const fetchIncorporations = async (
  setIncorps: React.Dispatch<React.SetStateAction<Incorp[]>>
) => {
  try {
    const data = await getIncorps();
    setIncorps(data);
  } catch (error) {
    console.error("Error al obtener incorporaciones:", error);
  }
};

// Obtener una incorporación por ID
export const fetchIncorpById = async (id: number) => {
  try {
    return await getIncorpById(id);
  } catch (error) {
    console.error("Error al obtener la incorporación:", error);
    return null;
  }
};