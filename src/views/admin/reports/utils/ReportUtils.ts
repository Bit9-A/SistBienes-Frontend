import { MissingGoods } from "api/ReportApi";

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
