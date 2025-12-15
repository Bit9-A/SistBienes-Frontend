import {
    getConceptosMovimientoIncorporacion,
    createConceptoMovimientoIncorporacion,
    updateConceptoMovimientoIncorporacion,
    deleteConceptoMovimientoIncorporacion,
    getConceptosMovimientoDesincorporacion,
    createConceptoMovimientoDesincorporacion,
    updateConceptoMovimientoDesincorporacion,
    deleteConceptoMovimientoDesincorporacion,
    ConceptoMovimiento,
  } from 'api/SettingsApi';
  
  // Función para agregar un concepto de movimiento
  export const handleAddConceptoMovimiento = async (
    tipo: 'incorporacion' | 'desincorporacion',
    newConceptoMovimientoName: string,
    newConceptoMovimientoCode: string,
    setConceptosMovimiento: React.Dispatch<React.SetStateAction<ConceptoMovimiento[]>>,
    onClose: () => void
  ) => {
    if (newConceptoMovimientoName.trim() === '' || newConceptoMovimientoCode.trim() === '') return;
  
    try {
      const createFunction =
        tipo === 'incorporacion'
          ? createConceptoMovimientoIncorporacion
          : createConceptoMovimientoDesincorporacion;
  
      const newConceptoMovimiento = await createFunction({
        nombre: newConceptoMovimientoName,
        codigo: newConceptoMovimientoCode,
      });
  
      setConceptosMovimiento((prev) => [...prev, newConceptoMovimiento]);
      onClose();
    } catch (error) {
      console.error('Error al crear el concepto de movimiento:', error);
    }
  };
  
  // Función para editar un concepto de movimiento
  export const handleEditConceptoMovimiento = async (
    tipo: 'incorporacion' | 'desincorporacion',
    selectedConcepto: ConceptoMovimiento | null,
    newConceptoMovimientoName: string,
    newConceptoMovimientoCode: string,
    setConceptosMovimiento: React.Dispatch<React.SetStateAction<ConceptoMovimiento[]>>,
    onClose: () => void
  ) => {
    if (!selectedConcepto || newConceptoMovimientoName.trim() === '' || newConceptoMovimientoCode.trim() === '') return;
  
    try {
      const updateFunction =
        tipo === 'incorporacion'
          ? updateConceptoMovimientoIncorporacion
          : updateConceptoMovimientoDesincorporacion;
  
      const updatedConcepto = await updateFunction(selectedConcepto.id, {
        nombre: newConceptoMovimientoName,
        codigo: newConceptoMovimientoCode,
      });
  
      setConceptosMovimiento((prev) =>
        prev.map((concepto) => (concepto.id === updatedConcepto.id ? updatedConcepto : concepto))
      );
      onClose();
    } catch (error) {
      console.error('Error al actualizar el concepto de movimiento:', error);
    }
  };
  
  // Función para eliminar un concepto de movimiento
  export const handleDeleteConceptoMovimiento = async (
    tipo: 'incorporacion' | 'desincorporacion',
    id: number,
    setConceptosMovimiento: React.Dispatch<React.SetStateAction<ConceptoMovimiento[]>>
  ) => {
    try {
      const deleteFunction =
        tipo === 'incorporacion'
          ? deleteConceptoMovimientoIncorporacion
          : deleteConceptoMovimientoDesincorporacion;
  
      await deleteFunction(id);
  
      setConceptosMovimiento((prev) => prev.filter((concepto) => concepto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el concepto de movimiento:', error);
    }
  };