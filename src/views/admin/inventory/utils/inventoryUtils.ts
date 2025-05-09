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
    modelo,
  } from "../../../../api/AssetsApi";
  
  // Manejo de Bienes
  export const handleAddAsset = async (
    newAsset: Partial<MovableAsset>,
    setAssets: React.Dispatch<React.SetStateAction<MovableAsset[]>>,
    onClose: () => void
  ) => {
    try {
      const createdAsset = await createAsset(newAsset as MovableAsset);
      setAssets((prev) => [...prev, createdAsset]); // Agrega el nuevo bien al estado
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el bien:", error);
    }
  };
  
  export const handleEditAsset = async (
    assetId: number,
    updatedAsset: Partial<MovableAsset>,
    setAssets: React.Dispatch<React.SetStateAction<MovableAsset[]>>,
    onClose: () => void
  ) => {
    try {
      const updated = await updateAsset(assetId, updatedAsset as MovableAsset);
      setAssets((prev) =>
        prev.map((asset) => (asset.id === updated.id ? updated : asset))
      );
      onClose(); // Cierra el modal
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
      setAssets((prev) => prev.filter((asset) => asset.id !== assetId)); // Elimina el bien del estado
    } catch (error) {
      console.error("Error al eliminar el bien:", error);
    }
  };
  
  export const handleAddMarca = async (newMarca: Partial<marca>): Promise<marca> => {
    try {
      const response = await createMarca(newMarca); // Llama a la API para crear la marca
      console.log("Respuesta de la API al crear marca:", response); // Depuración
      const createdMarca = response.marca; // Accede a la propiedad 'marca' dentro de la respuesta
      if (!createdMarca || typeof createdMarca.nombre !== "string" || createdMarca.nombre.trim() === "") {
        throw new Error("La marca creada no tiene un nombre válido.");
      }
      return createdMarca; // Devuelve la marca creada
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
      onClose(); // Cierra el modal
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
      setMarcas((prev) => prev.filter((marca) => marca.id !== marcaId)); // Elimina la marca del estado
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };
  
  // Manejo de Modelos
  export const handleAddModelo = async (newModelo: Partial<modelo>): Promise<modelo> => {
    try {
      const response = await createModelo(newModelo); // Llama a la API para crear el modelo
      console.log("Respuesta de la API al crear modelo:", response); // Depuración
      const createdModelo = response.modelo;
  
      // Mapear idmarca a marca_id para mantener consistencia en el frontend
      if (createdModelo && createdModelo.idmarca) {
        createdModelo.marca_id = createdModelo.idmarca;
        delete createdModelo.idmarca; // Elimina la propiedad idmarca si no es necesaria
      }
  
      if (!createdModelo || !createdModelo.nombre) {
        throw new Error("El modelo creado no tiene un nombre válido.");
      }
  
      return createdModelo; // Devuelve el modelo creado
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
      onClose(); // Cierra el modal
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
      setModelos((prev) => prev.filter((modelo) => modelo.id !== modeloId)); // Elimina el modelo del estado
    } catch (error) {
      console.error("Error al eliminar el modelo:", error);
    }
  };