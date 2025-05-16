export interface Asset {
  id?: string | number
  nombre: string
  descripcion?: string
  serial?: string
  marca?: string
  modelo?: string
  estado?: string
  valor?: number
  cantidad?: number
}

export interface Transfer {
  id?: string | number
  fecha?: string
  responsable?: string
  departamentoOrigen?: string
  departamentoDestino?: string
  cantidadBienes?: number
  observaciones?: string
  bien?: string // Campo original para compatibilidad
  bienes?: Asset[] // Nuevo campo para múltiples bienes
}
