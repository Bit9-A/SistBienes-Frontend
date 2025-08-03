import {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    MovableAsset,
    getMarcas,
    createMarca,
    updateMarca,
    deleteMarca,
    marca,
    getModelos,
    createModelo,
    updateModelo,
    deleteModelo,
    getAssetsByDepartment,
    modelo,
    getMarcaById
  } from "../../../../api/AssetsApi";
import { logCustomAction } from "views/admin/audit/utils/AuditUtils";

  
  // Manejo de Bienes
  export const handleAddAsset = async (
    newAsset: Partial<MovableAsset>,
    setAssets: React.Dispatch<React.SetStateAction<MovableAsset[]>>,
    onClose: () => void,
    logDetails: string // Add logDetails parameter
  ) => {
    try {
      const createdAsset = await createAsset(newAsset as MovableAsset);
      setAssets((prev) => [...prev, createdAsset]);
      onClose();
      await logCustomAction({
        accion: "Crear Bien",
        detalles: logDetails, // Use logDetails here
      });
    } catch (error) {
      console.error("Error al crear el bien:", error);
    }
  };
  
  export const handleEditAsset = async (
    assetId: number,
    updatedAsset: Partial<MovableAsset>,
    setAssets: React.Dispatch<React.SetStateAction<MovableAsset[]>>,
    onClose: () => void,
    logDetails: string // Add logDetails parameter
  ) => {
    try {
      const updated = await updateAsset(assetId, updatedAsset as MovableAsset);
      setAssets((prev) =>
        prev.map((asset) => (asset.id === updated.id ? updated : asset))
      );
      onClose();
      await logCustomAction({
        accion: "Editar Bien",
        detalles: logDetails, // Use logDetails here
      });
    } catch (error) {
      console.error("Error al actualizar el bien:", error);
    }
  };
  
  export const handleDeleteAsset = async (
    assetId: number,
    setAssets: React.Dispatch<React.SetStateAction<MovableAsset[]>>
  ) => {
    try {
      await deleteAsset(assetId);
      setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
      await logCustomAction({
        accion: "Eliminar Bien",
        detalles: `Se eliminó el bien con ID: ${assetId}`,
      });
    } catch (error) {
      console.error("Error al eliminar el bien:", error);
    }
  };
  
  export const handleAddMarca = async (newMarca: Partial<marca>): Promise<marca> => {
    try {
      const response = await createMarca(newMarca); // Llama a la API para crear la marca
      const createdMarca = response.marca; // Accede a la propiedad 'marca' dentro de la respuesta
      if (!createdMarca || typeof createdMarca.nombre !== "string" || createdMarca.nombre.trim() === "") {
        throw new Error("La marca creada no tiene un nombre válido.");
      }
      await logCustomAction({
        accion: "Crear Marca",
        detalles: `Se creó la marca con el Nombre: ${createdMarca.nombre}`,
      });
      return createdMarca;
    } catch (error) {
      console.error("Error al crear la marca:", error);
      throw error;
    }
  };
  
  export const handleEditMarca = async (
    marcaId: number,
    updatedMarca: Partial<marca>,
    setMarcas: React.Dispatch<React.SetStateAction<marca[]>>,
    onClose: () => void
  ) => {
    try {
      const updated = await updateMarca(marcaId, updatedMarca);
      setMarcas((prev) =>
        prev.map((marca) => (marca.id === updated.id ? updated : marca))
      );
      onClose();
      await logCustomAction({
        accion: "Editar Marca",
        detalles: `Se editó la marca con ID: ${marcaId}`,
      });
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };
  
  export const handleDeleteMarca = async (
    marcaId: number,
    setMarcas: React.Dispatch<React.SetStateAction<marca[]>>
  ) => {
    try {
      await deleteMarca(marcaId);
      setMarcas((prev) => prev.filter((marca) => marca.id !== marcaId));
      await logCustomAction({
        accion: "Eliminar Marca",
        detalles: `Se eliminó la marca con ID: ${marcaId}`,
      });
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };
  
  // Manejo de Modelos
  export const handleAddModelo = async (newModelo: Partial<modelo>): Promise<modelo> => {
    try {
      const response = await createModelo(newModelo); // Llama a la API para crear el modelo
      const createdModelo = response.modelo;
  
      // Mapear idmarca a marca_id para mantener consistencia en el frontend
      if (createdModelo && createdModelo.idmarca) {
        createdModelo.marca_id = createdModelo.idmarca;
        delete createdModelo.idmarca;
      }
  
      if (!createdModelo || !createdModelo.nombre) {
        throw new Error("El modelo creado no tiene un nombre válido.");
      }
      await logCustomAction({
        accion: "Crear Modelo",
        detalles: `Se creó el modelo con el Nombre: ${createdModelo.nombre}`,
      });
      return createdModelo;
    } catch (error) {
      console.error("Error al crear el modelo:", error);
      throw error;
    }
  };
  
  export const handleEditModelo = async (
    modeloId: number,
    updatedModelo: Partial<modelo>,
    setModelos: React.Dispatch<React.SetStateAction<modelo[]>>,
    onClose: () => void
  ) => {
    try {
      const updated = await updateModelo(modeloId, updatedModelo);
      setModelos((prev) =>
        prev.map((modelo) => (modelo.id === updated.id ? updated : modelo))
      );
      onClose();
      await logCustomAction({
        accion: "Editar Modelo",
        detalles: `Se editó el modelo con ID: ${modeloId}`,
      });
    } catch (error) {
      console.error("Error al actualizar el modelo:", error);
    }
  };
  
  export const handleDeleteModelo = async (
    modeloId: number,
    setModelos: React.Dispatch<React.SetStateAction<modelo[]>>
  ) => {
    try {
      await deleteModelo(modeloId);
      setModelos((prev) => prev.filter((modelo) => modelo.id !== modeloId));
      await logCustomAction({
        accion: "Eliminar Modelo",
        detalles: `Se eliminó el modelo con ID: ${modeloId}`,
      });
    } catch (error) {
      console.error("Error al eliminar el modelo:", error);
    }
  };

// Obtener los bieness por departamento
export const fetchAssetsByDepartment = async (departmentId: number): Promise<MovableAsset[]> => {
    try {
        const assets = await getAssetsByDepartment(departmentId);
        return assets;
    } catch (error) {
        console.error("Error al obtener los bienes por departamento:", error);
        throw error;
    }
}

// Obtener todos los bienes
export const fetchAllAssets = async (): Promise<MovableAsset[]> => {
    try {
        const assets = await getAssets();
        return assets;
    } catch (error) {
        console.error("Error al obtener todos los bienes:", error);
        throw error;
    }
}
