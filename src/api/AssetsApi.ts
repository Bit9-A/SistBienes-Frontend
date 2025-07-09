import axiosInstance from "../utils/axiosInstance";

export interface MovableAsset {
  id: number;
  numero_identificacion: string;
  nombre_descripcion: string;
  numero_serial: string;
  grupo: number;
  subgrupo_id: number;
  subgrupo_nombre?: string;  
  subgrupo_codigo?:string;    // Nuevo: nombre del subgrupo
  cantidad: number;
  descripcion: string;
  marca_id?: number;
  marca_nombre?: string;         // Nuevo: nombre de la marca
  modelo_id?: number;
  modelo_nombre?: string;        // Nuevo: nombre del modelo
  valor_unitario: number;
  valor_total: number;
  fecha: string;
  dept_id: number;
  dept_nombre?: string;          // Nuevo: nombre del departamento
  estado_id?: number;
  estado_nombre?: string;        // Nuevo: nombre del estado
  parroquia_id: number;
  parroquia_nombre?: string;
  isActive?:number;     // Nuevo: nombre de la parroquia
  isComputer?:number
}

export interface marca{
    id: number;
    nombre: string;
}

export interface modelo{
    id: number;
    nombre: string;
    idmarca: number;
}


//Historial de activos
//ruta /history/:id
export const getAssetHistory = async (assetId: number): Promise<any[]> => {
    try {
        const response = await axiosInstance.get(`/history/${assetId}`);
        return response.data.history; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error(error);
        return [];
        }
    }


// Obtener todos los activos
export const getAssets = async (): Promise<MovableAsset[]> => {
    try {
        const response = await axiosInstance.get('/furniture');
        return response.data.furniture; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }   
}
//Obtener activo por id
export const getAssetById = async (id: number): Promise<MovableAsset> => {
    try {
        const response = await axiosInstance.get(`/furniture/${id}`);
        return response.data.furniture; // Asegúrate de que la respuesta tenga esta estructura
        }
        catch (error) {
            console.error('Error fetching asset by id:', error);
            throw error;
            }
    }

// Crear un nuevo activo
export const createAsset = async (assetData: MovableAsset) => {
    try {
        
        const response = await axiosInstance.post('/furniture', assetData);
        console.log('Asset created successfully:', response.data); // Imprime el mensaje del servidor
        return response.data; // Devuelve el activo creado
    } catch (error:any) {
        console.error('Error creating asset:', error.response?.data || error.message); // Imprime el mensaje del servidor
        throw error;
    } 
}
// Actualizar un activo existente
export const updateAsset = async (assetId: number, assetData: Partial<MovableAsset>) => {
    try {
        console.log('Updating asset with ID:', assetId, 'Data:', assetData); // Imprime el ID y los datos del activo
      const response = await axiosInstance.put(`/furniture/${assetId}`, assetData);
      return response.data;
    } catch (error: any) {
      console.error("Error al actualizar el bien:", error.response?.data || error.message); // Imprime el mensaje del servidor
      throw error;
    }
  };
// Eliminar un activo existente
export const deleteAsset = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/furniture/${id}`);
        return response.data; // Devuelve el activo eliminado
    } catch (error) {
        console.error('Error deleting asset:', error);
        throw error;
    } 
}

// Obtener todas las marcas
export const getMarcas = async (): Promise<marca[]> => {
    try {
        const response = await axiosInstance.get('/api/marcas');
        return response.data.marcas; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error:any) {
        console.error('Error fetching marcas:', error.response?.data || error.message); // Imprime el mensaje del servidor
        throw error;
    }   
}
//Obtener Marco por Id
export const getMarcaById = async (id: number): Promise<marca> =>
{
    try {
        const response = await axiosInstance.get(`/api/marcas/${id}`);
        return response.data.marca; // Asegúrate de que la respuesta tenga esta estructura
        } catch (error:any) {
            console.error('Error fetching marca by id:', error.response?.data || error.message); // Im
            throw error;
            }
}



// Crear una nueva marca
export const createMarca = async (marcaData: any) => {
    try {
        const response = await axiosInstance.post('/api/marcas', marcaData);
    
        return response.data; // Devuelve la marca creada
    } catch (error) {
        console.error('Error creating marca:', error);
        throw error;
    } 
}
// Actualizar una marca existente
export const updateMarca = async (id: number, marcaData: any) => {
    try {
        const response = await axiosInstance.put(`/api/marcas/${id}`, marcaData);
        return response.data; // Devuelve la marca actualizada
    } catch (error) {
        console.error('Error updating marca:', error);
        throw error;
    } 
}
// Eliminar una marca existente
export const deleteMarca = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/marcas/${id}`);
        return response.data; // Devuelve la marca eliminada
    } catch (error) {
        console.error('Error deleting marca:', error);
        throw error;
    } 
}
// Obtener todos los modelos
export const getModelos = async (): Promise<modelo[]> => {
    try {
        const response = await axiosInstance.get('/api/modelos');
        return response.data.modelos; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching modelos:', error);
        throw error;
    }   
}
// Crear un nuevo modelo
export const createModelo = async (modeloData: any) => {
    try {
        const response = await axiosInstance.post('/api/modelos', modeloData);

        return response.data; // Devuelve el modelo creado
    } catch (error) {
        console.error('Error creating modelo:', error);
        throw error;
    } 
}
// Actualizar un modelo existente
export const updateModelo = async (id: number, modeloData: any) => {
    try {
        const response = await axiosInstance.put(`/api/modelos/${id}`, modeloData);
        return response.data; // Devuelve el modelo actualizado
    } catch (error) {
        console.error('Error updating modelo:', error);
        throw error;
    } 
}
// Eliminar un modelo existente
export const deleteModelo = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/modelos/${id}`);
        return response.data; // Devuelve el modelo eliminado
    } catch (error) {
        console.error('Error deleting modelo:', error);
        throw error;
    } 
}

//obetener modelos por marca api/modelos/marca/:idmarca

export const getModelosByMarca = async (idMarca: number) => {
    try {
        const response = await axiosInstance.get(`/api/modelos/marca/${idMarca}`);
        return response.data.modelos; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching modelos by marca:', error);
        throw error;
    }   
}

//Obtener bienes por departamento
export const getAssetsByDepartment = async (departmentId: number): Promise<MovableAsset[]> => {
    try {
        const response = await axiosInstance.get(`/furniture/dept/${departmentId}`);
        return response.data.furniture; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching assets by department:', error);
        throw error;
    }   
}
