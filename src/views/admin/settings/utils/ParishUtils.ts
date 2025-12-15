import { createParroquia, updateParroquia, deleteParroquia } from "api/SettingsApi";
import { Parroquia } from "api/SettingsApi";
import { useToast } from "@chakra-ui/react";

const handleAddParroquia = async (
    newParroquiaName: string,
    setParroquias: React.Dispatch<React.SetStateAction<Parroquia[]>>,
    onClose: () => void
    ) => {
    if (newParroquiaName.trim() === "") return;
    
    try {
        const newParroquia = await createParroquia({ nombre: newParroquiaName });
        setParroquias((prev) => [...prev, newParroquia]);
       
        onClose(); 
    } catch (error) {
        console.error("Error al crear la parroquia:", error);
    }
    }

const handleEditParroquia = async (
    selectedParroquia: Parroquia | null,
    newParroquiaName: string,
    setParroquias: React.Dispatch<React.SetStateAction<Parroquia[]>>,
    onClose: () => void
) => {
    if (!selectedParroquia || newParroquiaName.trim() === "") return;

    try {
        const updatedParroquia = await updateParroquia(selectedParroquia.id, { nombre: newParroquiaName });
        setParroquias((prev) =>
            prev.map((parroquia) =>
                parroquia.id === updatedParroquia.id ? updatedParroquia : parroquia
            )
        );
        
        onClose(); // Cierra el modal
    } catch (error) {
        console.error("Error al actualizar la parroquia:", error);
    }
}
const handleDeleteParroquia = async (
    id: number,
    setParroquias: React.Dispatch<React.SetStateAction<Parroquia[]>>
) => {
    try {
        await deleteParroquia(id);
        setParroquias((prev) => prev.filter((parroquia) => parroquia.id !== id)); // Elimina la parroquia del estado
    } catch (error) {
        console.error("Error al eliminar la parroquia:", error);
    }
}
const openEditParroquiaModal = (
    parroquia: Parroquia,
    setSelectedParroquia: React.Dispatch<React.SetStateAction<Parroquia | null>>,
    setNewParroquiaName: React.Dispatch<React.SetStateAction<string>>,
    onOpen: () => void
) => {
    setSelectedParroquia(parroquia);
    setNewParroquiaName(parroquia.nombre);
    onOpen();
}
export { handleAddParroquia, handleEditParroquia, handleDeleteParroquia, openEditParroquiaModal };

