export interface Transfer {
    id: string
    fecha: string
    bien: string
    cantidadBienes: number
    departamentoOrigen: string
    departamentoDestino: string
    responsable: string
    observaciones?: string
}
