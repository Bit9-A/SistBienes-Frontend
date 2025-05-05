// Define all types in a separate file for better organization and reuse

export interface MovableAsset {
    numero_serial: string
    grupo: number
    subgrupo: string
    cantidad: number
    descripcion: string
    marca: string
    modelo: string
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
