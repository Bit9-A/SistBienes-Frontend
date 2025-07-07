import { createTransfer, Transfer } from "api/TransferApi";

/**
 * Crea un registro de transferencia (traslado) en el sistema.
 * @param transferData - Objeto con los datos mínimos requeridos para crear el transfer.
 * @returns La respuesta de la API o lanza un error.
 */
export async function createTransferRecord(transferData: Partial<Transfer>) {
  // Puedes validar aquí los campos requeridos si lo deseas
  if (
    !transferData.fecha ||
    !transferData.origen_id ||
    !transferData.destino_id ||
    !transferData.bien_traslado_id ||
    !transferData.id_mueble ||
    !transferData.responsable_id 
  ) {
    throw new Error("Faltan datos requeridos para crear el transfer");
  }

  // Puedes ajustar los defaults aquí si lo necesitas
  const payload: Transfer = {
    id: 0, // El backend debe ignorar o autogenerar este campo
    cantidad: 1,
    observaciones: "",
    ...transferData,
  } as Transfer;

  return await createTransfer(payload);
}