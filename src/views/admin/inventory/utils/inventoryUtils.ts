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
  
  // Manejo de Marcas
  export const handleAddMarca = async (
    newMarca: Partial<marca>,
    setMarcas: React.Dispatch<React.SetStateAction<marca[]>>,
    onClose: () => void
  ) => {
    try {
      const createdMarca = await createMarca(newMarca);
      setMarcas((prev) => [...prev, createdMarca]); // Agrega la nueva marca al estado
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear la marca:", error);
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
  export const handleAddModelo = async (
    newModelo: Partial<modelo>,
    setModelos: React.Dispatch<React.SetStateAction<modelo[]>>,
    onClose: () => void
  ) => {
    try {
      const createdModelo = await createModelo(newModelo);
      setModelos((prev) => [...prev, createdModelo]); // Agrega el nuevo modelo al estado
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el modelo:", error);
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