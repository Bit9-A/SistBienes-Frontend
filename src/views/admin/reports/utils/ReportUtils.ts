import { MissingGood } from "api/ReportApi";
import * as ReportApi from "api/ReportApi";

// Obtener todos los bienes faltantes
export const getMissingAssets = async (): Promise<MissingGood[]> => {
  try {
    return await ReportApi.getMissingGoods();
  } catch (error) {
    console.error("Error al obtener los bienes faltantes:", error);
    throw error;
  }
};

// Crear un bien faltante
export const createMissingAsset = async (
  missingGoodData: Omit<MissingGood, "id">
): Promise<MissingGood> => {
  try {
    return await ReportApi.createMissingGood(missingGoodData);
  } catch (error) {
    console.error("Error al crear un bien faltante:", error);
    throw error;
  }
};

// Actualizar un bien faltante
export const updateMissingAsset = async (
  id: number,
  updates: Partial<Omit<MissingGood, "id">>
): Promise<MissingGood> => {
  try {
    return await ReportApi.updateMissingGood(id, updates);
  } catch (error) {
    console.error("Error al actualizar un bien faltante:", error);
    throw error;
  }
};

// Eliminar un bien faltante
export const deleteMissingAsset = async (id: number): Promise<void> => {
  try {
    await ReportApi.deleteMissingGood(id);
  } catch (error) {
    console.error("Error al eliminar un bien faltante:", error);
    throw error;
  }
};
