
import { SubGroup, createSubGroupM, updateSubGroupM, deleteSubGroupM } from '../../../../api/SettingsApi';

export const handleAddSubGroup = async (
    newSubGroupName: string,
    newSubGroupCode: string,
    setSubGroups: React.Dispatch<React.SetStateAction<SubGroup[]>>,
    onClose: () => void
  ) => {
    if (newSubGroupName.trim() === '' || newSubGroupCode.trim() === '') return;
  
    try {
      const newSubGroup = await createSubGroupM({
        nombre: newSubGroupName,
        codigo: newSubGroupCode, // Incluye el código
      });
      setSubGroups((prev) => [...prev, newSubGroup]); // Agrega el nuevo subgrupo al estado
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al crear el subgrupo:', error);
    }
  };
  export const handleEditSubGroup = async (
    selectedSubGroup: SubGroup | null,
    newSubGroupName: string,
    newSubGroupCode: string,
    setSubGroups: React.Dispatch<React.SetStateAction<SubGroup[]>>,
    onClose: () => void
  ) => {
    if (!selectedSubGroup || newSubGroupName.trim() === '' || newSubGroupCode.trim() === '') return;
  
    try {
      const updatedSubGroup = await updateSubGroupM(selectedSubGroup.id, {
        nombre: newSubGroupName,
        codigo: newSubGroupCode, // Incluye el código
      });
      setSubGroups((prev) =>
        prev.map((subgroup) =>
          subgroup.id === updatedSubGroup.id ? updatedSubGroup : subgroup
        )
      );
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el subgrupo:', error);
    }
  };

export const handleDeleteSubGroup = async (
    id: number,
    setSubGroups: React.Dispatch<React.SetStateAction<SubGroup[]>>
) => {
    try {
        await deleteSubGroupM(id);
        setSubGroups((prev) => prev.filter((subgroup) => subgroup.id !== id)); // Elimina el subgrupo del estado
    } catch (error) {
        console.error('Error al eliminar el subgrupo:', error);
    }
}

export const openEditSubGroupModal = (
    subgroup: SubGroup,
    setSelectedSubGroup: React.Dispatch<React.SetStateAction<SubGroup | null>>,
    setNewSubGroupName: React.Dispatch<React.SetStateAction<string>>,
    setNewSubGroupCode: React.Dispatch<React.SetStateAction<string>>, // Nuevo estado para el código
    onOpen: () => void
  ) => {
    setSelectedSubGroup(subgroup);
    setNewSubGroupName(subgroup.nombre);
    setNewSubGroupCode(subgroup.codigo); // Establece el código
    onOpen();
  };
