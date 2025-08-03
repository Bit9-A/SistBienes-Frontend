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

export async function generateBM4Pdf(
  deptId: number,
  mes: number,
  año: number,
  responsableId: number,
  departamentoNombre: string, // Para el nombre del archivo
) {
  try {
    const respuesta = await axiosInstance.post('/excel/bm4', {
      dept_id: deptId,
      mes: mes,
      año: año,
      responsable_id: responsableId,
    }, {
      responseType: 'blob', // Importante para manejar la respuesta como un Blob (PDF en este caso)
    });

    if (respuesta.status !== 200) {
      const errorText = await respuesta.data.text();
      let errorMessage = `Fallo al generar el archivo PDF BM4.`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (parseError) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const contentDisposition = respuesta.headers['content-disposition'];
    let nombreArchivo = `BM4_${departamentoNombre}_${mes}_${año}_${fecha}.pdf`; // Nombre por defecto si no se encuentra en el header

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

    const blob = new Blob([respuesta.data], { type: 'application/pdf' }); // Tipo MIME para PDF
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log('¡Archivo PDF BM4 descargado exitosamente!');
  } catch (error: any) {
    console.error('Error al descargar el archivo PDF BM4:', error);
    alert(`Error: ${error.message}`);
  }
}

export async function exportBM2ByDepartment(
  deptId: number,
  departamentoNombre: string,
  mes: number,
  año: number,
  tipo: 'incorporacion' | 'desincorporacion'
) {
  try {
    const respuesta = await axiosInstance.post('/excel/bm2', {
      dept_id: deptId,
      dept_nombre: departamentoNombre,
      mes: mes,
      año: año,
      tipo: tipo,
    }, {
      responseType: 'blob',
    });

    if (respuesta.status !== 200) {
      // Si la respuesta no es 200, intentar leer el cuerpo como texto para un mensaje de error más específico
      const errorText = await respuesta.data.text();
      let errorMessage = `Fallo al generar el archivo Excel BM2 para ${tipo}.`;
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
    let nombreArchivo = `BM2_${tipo}_${departamentoNombre}_${mes}_${año}_${fecha}.xlsx`;

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

    console.log(`¡Archivo Excel BM2 de ${tipo} descargado exitosamente!`);
  } catch (error: any) {
    console.error(`Error al descargar el archivo Excel BM2 de ${tipo}:`, error);
    alert(`Error: ${error.message}`);
  }
}
