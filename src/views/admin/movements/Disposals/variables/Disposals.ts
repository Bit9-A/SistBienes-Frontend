export interface Disposal {
    id: number
    bien_id: number
    nombre: string
    descripcion: string
    fecha: string
    valor: number
    cantidad: number
    concepto_id: number
    dept_id: number
  }
  
  export interface Department {
    id: number
    name: string
  }
  
  export interface Concept {
    id: number
    name: string
  }
  
  export const departments: Department[] = [
    { id: 1, name: "Recursos Humanos" },
    { id: 2, name: "Finanzas" },
    { id: 3, name: "Tecnología" },
  ]
  
  export const concepts: Concept[] = [
    { id: 1, name: "Obsolescencia" },
    { id: 2, name: "Daño" },
    { id: 3, name: "Transferencia" },
    { id: 4, name: "Venta" },
  ]
  