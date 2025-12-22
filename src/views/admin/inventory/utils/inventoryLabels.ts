import axiosInstance from '../../../../utils/axiosInstance';

/**
 * Descarga el archivo PDF de etiquetas QR generado por el backend.
 * @param deptId ID del departamento.
 * @param departamentoNombre Nombre del departamento.
 */
export async function exportQRLabels(
  deptId: number,
  departamentoNombre: string,
) {
  try {
    /*console.log(
      '[exportQRLabels] Sending request with deptId:',
      deptId,
      'type:',
      typeof deptId,
    );*/
    const respuesta = await axiosInstance.post(
      '/labels/qr',
      { deptId: deptId },
      {
        responseType: 'blob', // Importante para manejar la respuesta como un Blob
      },
    );

    if (respuesta.status !== 200) {
      throw new Error('Fallo al generar el archivo PDF de etiquetas QR');
    }

    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const contentDisposition = respuesta.headers['content-disposition'];

    // Extraer el nombre del archivo del header 'content-disposition'
    let nombreArchivo = `EtiquetasQR_${departamentoNombre}_${fecha}.pdf`; // Nombre por defecto
    if (contentDisposition) {
      const matchNombreArchivo = contentDisposition.match(/filename="([^"]+)"/);
      if (matchNombreArchivo && matchNombreArchivo[1]) {
        nombreArchivo = matchNombreArchivo[1];
      }
    }

    const blob = new Blob([respuesta.data], {
      type: respuesta.headers['content-type'],
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Error al descargar el archivo PDF de etiquetas QR:', error);
    alert(`Error: ${error.message}`);
  }
}
