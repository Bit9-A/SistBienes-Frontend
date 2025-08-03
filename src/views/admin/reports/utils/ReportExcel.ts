import axiosInstance from '../../../../utils/axiosInstance';

export async function exportBM3ByMissingGoodsId(
  missingGoodsId: number,
  funcionarioId: number, // Cambiado de responsableId a funcionarioId
  departamentoNombre: string, // Para el nombre del archivo
  funcionarioNombre: string // Cambiado de responsableNombre a funcionarioNombre
) {
  try {
    const respuesta = await axiosInstance.post('/excel/bm3', {
      missing_goods_id: missingGoodsId,
      responsable_id: funcionarioId, // Se envía como responsable_id al backend
    }, {
      responseType: 'blob',
    });

    if (respuesta.status !== 200) {
      const errorText = await respuesta.data.text();
      let errorMessage = `Fallo al generar el archivo Excel BM3.`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (parseError) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const fecha = new Date().toISOString().split('T')[0];
    const contentDisposition = respuesta.headers['content-disposition'];
    // El nombre del archivo ahora puede venir directamente del backend si se usa res.download
    // Si no, se puede construir aquí con la información disponible
    let nombreArchivo = `BM3_${departamentoNombre}_${funcionarioNombre}_${fecha}.xlsx`; // Usar funcionarioNombre

    if (contentDisposition) {
      const matchNombreArchivo = contentDisposition.match(/filename\*?=['"](?:UTF-8'')?([^"']+)/i);
      if (matchNombreArchivo && matchNombreArchivo[1]) {
        try {
          nombreArchivo = decodeURIComponent(matchNombreArchivo[1]);
        } catch (e) {
          console.warn("Error decoding filename, using raw filename:", matchNombreArchivo[1]);
          nombreArchivo = matchNombreArchivo[1];
        }
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

    console.log(`¡Archivo Excel BM3 descargado exitosamente!`);
  } catch (error: any) {
    console.error(`Error al descargar el archivo Excel BM3:`, error);
    alert(`Error: ${error.message}`);
  }
}
