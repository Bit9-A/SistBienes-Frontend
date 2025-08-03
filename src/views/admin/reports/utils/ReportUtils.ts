import { MissingGoods } from "api/ReportApi";
import { createDesincorp, Desincorp } from "api/IncorpApi";
import { getConceptosMovimientoDesincorporacion, ConceptoMovimiento } from "api/SettingsApi"; // Importar la función y la interfaz

// Función para crear una desincorporación cuando se reporta un bien faltante
export const createDisposalForMissingGood = async (
  missingGoodData: Partial<MissingGoods>
) => {
  try {
    if (!missingGoodData.bien_id || !missingGoodData.fecha || missingGoodData.diferencia_valor === undefined || missingGoodData.unidad === undefined) {
      console.error("Datos incompletos para crear la desincorporación.");
      throw new Error("Datos incompletos para crear la desincorporación.");
    }

    // Obtener el ID del concepto de movimiento "60"
    const conceptos = await getConceptosMovimientoDesincorporacion();
    const concepto60 = conceptos.find((c: ConceptoMovimiento) => c.codigo === "60");

    if (!concepto60) {
      console.error("Concepto de movimiento con código '60' no encontrado.");
      throw new Error("Concepto de movimiento con código '60' no encontrado.");
    }

    const disposalData: Omit<Desincorp, "id"> = {
      bien_id: missingGoodData.bien_id,
      fecha: missingGoodData.fecha,
      valor: Math.abs(missingGoodData.diferencia_valor),
      cantidad: missingGoodData.diferencia_cantidad ?? 1,
      concepto_id: concepto60.id, // Usar la ID del concepto "60"
      dept_id: missingGoodData.unidad,
      observaciones: `Desincorporación automática por reporte de bien faltante. Observaciones del reporte: ${missingGoodData.observaciones || "N/A"}`,
    };

    const newDisposal = await createDesincorp(disposalData);
    console.log("Desincorporación creada exitosamente:", newDisposal);
    return newDisposal;
  } catch (error) {
    console.error("Error al crear la desincorporación para el bien faltante:", error);
    throw error;
  }
};

// Filtrar bienes faltantes por búsqueda, departamento y fechas
export const filterMissingGoods = (
  missingGoods: MissingGoods[],
  searchQuery: string,
  selectedDept: string,
  startDate: string,
  endDate: string
) => {
  const query = searchQuery.toLowerCase();

  return missingGoods.filter((mg) => {
    // Normaliza la fecha a YYYY-MM-DD
    const mgDateStr = mg.fecha ? new Date(mg.fecha).toISOString().slice(0, 10) : "";

    // Filtro por departamento
    const matchesDept =
      selectedDept === "all" ||
      mg.unidad?.toString() === selectedDept ||
      mg.departamento?.toLowerCase().includes(selectedDept.toLowerCase());

    // Filtro por fechas
    const matchesStart = !startDate || mgDateStr >= startDate;
    const matchesEnd = !endDate || mgDateStr <= endDate;

    // Filtro por búsqueda (puedes ajustar los campos a buscar)
    const matchesQuery =
      mg.funcionario_nombre?.toLowerCase().includes(query) ||
      mg.jefe_nombre?.toLowerCase().includes(query) ||
      mg.departamento?.toLowerCase().includes(query) ||
      mg.numero_identificacion?.toLowerCase().includes(query) ||
      mg.observaciones?.toLowerCase().includes(query) ||
      mg.bien_id?.toString().includes(query);

    return matchesDept && matchesStart && matchesEnd && (query === "" || matchesQuery);
  });
  };
