import {
  getDesincorps,
  getDesincorpById,
  createDesincorp,
  updateDesincorp,
  deleteDesincorp,
  Desincorp,
} from "api/IncorpApi";

// Filtrar desincorporaciones por búsqueda, departamento y fechas
export const filterDisposals = (
  disposals: Desincorp[],
  searchQuery: string,
  selectedDept: string,
  startDate: string,
  endDate: string
) => {
  const query = searchQuery.toLowerCase();

  return disposals.filter((item) => {
    const matchesSearch =
      item.bien_id.toString().includes(query) ||
      item.concepto_id.toString().includes(query) ||
      item.id.toString().includes(query);

    const matchesDept =
      selectedDept === "all" || item.dept_id?.toString() === selectedDept;

    const matchesStartDate = !startDate || new Date(item.fecha) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(item.fecha) <= new Date(endDate);

    return matchesSearch && matchesDept && matchesStartDate && matchesEndDate;
  });
};

// Eliminar una desincorporación
export const handleDeleteDisincorp = async (
  id: number,
  setDisincorps: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    await deleteDesincorp(id);
    setDisincorps((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    console.error("Error al eliminar la desincorporación:", error);
  }
};

// Crear una desincorporación
export const handleCreateDisincorp = async (
  disincorp: Omit<Desincorp, "id">,
  setDisincorps: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const newDisincorp = await createDesincorp(disincorp);
    setDisincorps((prev) => [...prev, newDisincorp]);
    return newDisincorp;
  } catch (error) {
    throw error;
  }
};

// Actualizar una desincorporación
export const handleUpdateDisincorp = async (
  disincorp: Desincorp,
  setDisincorps: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const { id, ...updates } = disincorp;
    const updated = await updateDesincorp(id, updates);
    setDisincorps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  } catch (error) {
    console.error("Error al actualizar la desincorporación:", error);
  }
};

// Obtener todas las desincorporaciones (útil para inicializar el estado)
export const fetchDisincorps = async (
  setDisincorps: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const data = await getDesincorps();
    setDisincorps(data);
  } catch (error) {
    console.error("Error al obtener desincorporaciones:", error);
  }
};

// Obtener una desincorporación por ID
export const fetchDisincorpById = async (id: number) => {
  try {
    return await getDesincorpById(id);
  } catch (error) {
    console.error("Error al obtener la desincorporación:", error);
    return null;
  }
};