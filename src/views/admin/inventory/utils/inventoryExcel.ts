/**
 * Descarga el archivo Excel generado por el backend.
 * @param deptId ID del departamento.
 * @param departamentoNombre Nombre del departamento.
 */

import axiosInstance from '../../../../utils/axiosInstance';

export async function exportBM1WithMarkers(deptId: number, departamentoNombre: string) {
  try {
    const respuesta = await axiosInstance.post('/excel/bm1', { dept_id: deptId, dept_nombre: departamentoNombre }, {
      responseType: 'blob', // Importante para manejar la respuesta como un Blob
    });

    if (respuesta.status !== 200) {
      // Axios ya maneja errores HTTP con su interceptor, pero se puede añadir una verificación adicional
      // Si el backend envía un JSON de error, necesitaríamos leerlo de otra manera si responseType es 'blob'
      // Para simplificar, asumimos que si no es 200, es un error general o ya fue manejado por el interceptor
      throw new Error('Fallo al generar el archivo Excel');
    }
    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const contentDisposition = respuesta.headers['content-disposition'];

  
    // Extraer el nombre del archivo del header 'content-disposition'
    let nombreArchivo = `BM1_${departamentoNombre}_${fecha}.xlsx`; // Nombre por defecto si no se encuentra en el header'
    if (contentDisposition) {
      const matchNombreArchivo = contentDisposition.match(/filename="([^"]+)"/);
      if (matchNombreArchivo && matchNombreArchivo[1]) {
        nombreArchivo = matchNombreArchivo[1];
      }
    }

    const blob = new Blob([respuesta.data], { type: respuesta.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log('¡Archivo Excel descargado exitosamente!');
  } catch (error: any) {
    console.error('Error al descargar el archivo Excel:', error);
    alert(`Error: ${error.message}`);
  }
}
