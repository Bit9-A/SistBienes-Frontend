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
      (item.numero_identificacion?.toLowerCase().includes(query) ?? false) ||
      item.id.toString().includes(query);

    const matchesDept =
      selectedDept === "all" || item.dept_id?.toString() === selectedDept;

    const matchesStartDate = !startDate || new Date(item.fecha) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(item.fecha) <= new Date(endDate);

    return matchesSearch && matchesDept && matchesStartDate && matchesEndDate;
  });
};

// Eliminar una desincorporación
export const handleDeleteDisposal = async (
  id: number,
  setDisposals: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    await deleteDesincorp(id);
    setDisposals((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    console.error("Error al eliminar la desincorporación:", error);
  }
};

// Crear una desincorporación
export const handleCreateDisposal = async (
  disposal: Omit<Desincorp, "id">,
  setDisposals: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const newDisposal = await createDesincorp(disposal);
    setDisposals((prev) => [...prev, newDisposal]);
    return newDisposal;
  } catch (error) {
    throw error;
  }
};

// Actualizar una desincorporación
export const handleUpdateDisposal = async (
  disposal: Desincorp,
  setDisposals: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const { id, ...updates } = disposal;
    const updated = await updateDesincorp(id, updates);
    setDisposals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  } catch (error) {
    console.error("Error al actualizar la desincorporación:", error);
  }
};

// Obtener todas las desincorporaciones (útil para inicializar el estado)
export const fetchDisposals = async (
  setDisposals: React.Dispatch<React.SetStateAction<Desincorp[]>>
) => {
  try {
    const data = await getDesincorps();
    setDisposals(data);
  } catch (error) {
    console.error("Error al obtener desincorporaciones:", error);
  }
};

// Obtener una desincorporación por ID
export const fetchDisposalById = async (id: number) => {
  try {
    return await getDesincorpById(id);
  } catch (error) {
    console.error("Error al obtener la desincorporación:", error);
    return null;
  }
};