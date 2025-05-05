// Define all types in a separate file for better organization and reuse

export interface MovableAsset {
    id: number
    grupo: number
    subgrupo: string
    cantidad: number
    nombre: string
    descripcion: string
    marca: string
    modelo: string
    numero_serial: string
    valor_unitario: number
    valor_total: number
    fecha: string
    departamento: number
    id_estado: number
    id_Parroquia: number
}

export interface MovableAssetGroup {
    id: string
    name: string
}

export interface MovableAssetCondition {
    id: number
    name: string
}

export interface MovableAssetLocation {
    id: number
    name: string
}

export interface Department {
    id: number
    name: string
}
