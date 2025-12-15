import { createTransfer, Transfer, CreateTransferPayload } from "api/TransferApi";

/**
 * Crea un registro de transferencia (traslado) en el sistema.
 * @param transferData - Objeto con los datos mínimos requeridos para crear el transfer.
 * @returns La respuesta de la API o lanza un error.
 */
export async function createTransferRecord(transferData: CreateTransferPayload) {
  // Puedes validar aquí los campos requeridos si lo deseas
  if (
    !transferData.fecha ||
    !transferData.origen_id ||
    !transferData.destino_id ||
    !transferData.bienes ||
    transferData.bienes.length === 0 ||
    !transferData.responsable_id 
  ) {
    throw new Error("Faltan datos requeridos para crear el transfer");
  }

  // Puedes ajustar los defaults aquí si lo necesitas
  const payload: CreateTransferPayload = {
    cantidad: transferData.bienes.length, // La cantidad es el número de bienes
    observaciones: "",
    ...transferData,
  };

  return await createTransfer(payload);
}
