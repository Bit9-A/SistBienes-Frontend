import { Department, createDepartment, updateDepartment, deleteDepartment } from '../../../../api/SettingsApi';

export const handleAddDepartment = async (
  newDepartmentName: string,
  newDepartmentCode: string,
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>,
  onClose: () => void
) => {
  if (newDepartmentName.trim() === '' || newDepartmentCode.trim() === '') return;

  try {
    const newDepartment = await createDepartment({
      nombre: newDepartmentName,
      codigo: newDepartmentCode,
    });
    setDepartments((prev) => [...prev, newDepartment]); // Agrega el nuevo departamento al estado
    onClose(); // Cierra el modal
  } catch (error) {
    console.error('Error al crear el departamento:', error);
  }
};

export const handleEditDepartment = async (
  selectedDepartment: Department | null,
  newDepartmentName: string,
  newDepartmentCode: string,
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>,
  onClose: () => void
) => {
  if (!selectedDepartment || newDepartmentName.trim() === '' || newDepartmentCode.trim() === '') return;

  try {
    const updatedDepartment = await updateDepartment(selectedDepartment.id, {
      nombre: newDepartmentName,
      codigo: newDepartmentCode,
    });
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
    onClose(); // Cierra el modal
  } catch (error) {
    console.error('Error al actualizar el departamento:', error);
  }
};

export const handleDeleteDepartment = async (
  id: number,
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>
) => {
  try {
    await deleteDepartment(id);
    setDepartments((prev) => prev.filter((dept) => dept.id !== id)); // Elimina el departamento del estado
  } catch (error) {
    console.error('Error al eliminar el departamento:', error);
  }
};