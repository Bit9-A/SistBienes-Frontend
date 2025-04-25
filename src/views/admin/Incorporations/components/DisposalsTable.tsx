

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Flex,
  Select,
  FormLabel,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiEdit, FiTrash2 } from "react-icons/fi"

interface Disposal {
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

const departments = [
  { id: 1, name: "Recursos Humanos" },
  { id: 2, name: "Finanzas" },
  { id: 3, name: "Tecnología" },
]

const concepts = [
  { id: 1, name: "Obsolescencia" },
  { id: 2, name: "Daño" },
  { id: 3, name: "Transferencia" },
  { id: 4, name: "Venta" },
]

export default function DisposalsTable() {
  const [disposals, setDisposals] = useState<Disposal[]>([])
  const [filteredDisposals, setFilteredDisposals] = useState<Disposal[]>([])
  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null)
  const [newDisposal, setNewDisposal] = useState<Partial<Disposal>>({})
  const [filterDept, setFilterDept] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  // Simulación de datos iniciales
  useEffect(() => {
    const initialData: Disposal[] = [
      {
        id: 1,
        bien_id: 12345,
        nombre: "Monitor",
        descripcion: "Monitor dañado",
        fecha: "2025-04-15",
        valor: 120.0,
        cantidad: 5,
        concepto_id: 2,
        dept_id: 3,
      },
      {
        id: 2,
        bien_id: 54321,
        nombre: "Impresora",
        descripcion: "Impresora obsoleta",
        fecha: "2025-04-10",
        valor: 200.0,
        cantidad: 2,
        concepto_id: 1,
        dept_id: 1,
      },
    ]
    setDisposals(initialData)
    setFilteredDisposals(initialData)
  }, [])

  const handleAdd = () => {
    if (!newDisposal.bien_id || !newDisposal.nombre || !newDisposal.fecha) return

    const newEntry: Disposal = {
      id: disposals.length + 1,
      bien_id: newDisposal.bien_id,
      nombre: newDisposal.nombre,
      descripcion: newDisposal.descripcion || "",
      fecha: newDisposal.fecha,
      valor: newDisposal.valor || 0,
      cantidad: newDisposal.cantidad || 0,
      concepto_id: newDisposal.concepto_id || 1,
      dept_id: newDisposal.dept_id || 1,
    }

    setDisposals([...disposals, newEntry])
    setFilteredDisposals([...filteredDisposals, newEntry])
    setNewDisposal({})
    onClose()
  }

  const handleEdit = () => {
    if (selectedDisposal) {
      const updatedDisposals = disposals.map((item) =>
        item.id === selectedDisposal.id ? { ...item, ...newDisposal } : item,
      )

      setDisposals(updatedDisposals)
      setFilteredDisposals(
        filterDept ? updatedDisposals.filter((item) => item.dept_id === Number.parseInt(filterDept)) : updatedDisposals,
      )

      setSelectedDisposal(null)
      setNewDisposal({})
      onClose()
    }
  }

  const handleDelete = (id: number) => {
    const updatedDisposals = disposals.filter((item) => item.id !== id)
    setDisposals(updatedDisposals)
    setFilteredDisposals(
      filterDept ? updatedDisposals.filter((item) => item.dept_id === Number.parseInt(filterDept)) : updatedDisposals,
    )
  }

  const handleFilter = (deptId: string) => {
    setFilterDept(deptId)
    applyFilters(deptId, startDate, endDate)
  }

  const handleDateFilter = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    applyFilters(filterDept, start, end)
  }

  const applyFilters = (deptId: string | null, start: string, end: string) => {
    let filtered = [...disposals]

    // Filtrar por departamento
    if (deptId) {
      filtered = filtered.filter((item) => item.dept_id === Number.parseInt(deptId))
    }

    // Filtrar por fecha
    if (start) {
      filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(start))
    }

    if (end) {
      filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(end))
    }

    setFilteredDisposals(filtered)
  }

  const openEditDialog = (disposal: Disposal) => {
    setSelectedDisposal(disposal)
    setNewDisposal(disposal)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedDisposal(null)
    setNewDisposal({})
    onOpen()
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justify="space-between" mb={4}>
        <Button colorScheme="red" onClick={openAddDialog}>
          Agregar Desincorporación
        </Button>

        <Flex gap={4}>
          <Box>
            <FormLabel htmlFor="date-filter" fontSize="sm" mb={1}>
              Filtrar por Fecha
            </FormLabel>
            <Flex gap={2} alignItems="center">
              <Input
                type="date"
                size="md"
                value={startDate}
                onChange={(e) => handleDateFilter(e.target.value, endDate)}
                placeholder="Fecha inicial"
              />
              <Box>a</Box>
              <Input
                type="date"
                size="md"
                value={endDate}
                onChange={(e) => handleDateFilter(startDate, e.target.value)}
                placeholder="Fecha final"
              />
              {(startDate || endDate) && (
                <Button size="sm" variant="ghost" onClick={() => handleDateFilter("", "")}>
                  Limpiar
                </Button>
              )}
            </Flex>
          </Box>

          <Box>
            <FormLabel htmlFor="dept-filter" fontSize="sm" mb={1}>
              Filtrar por Departamento
            </FormLabel>
            <Select
              id="dept-filter"
              placeholder="Todos los departamentos"
              w="280px"
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="">Todos los departamentos</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      </Flex>

      <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th>ID</Th>
              <Th>N° Identificación</Th>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Fecha</Th>
              <Th>Valor</Th>
              <Th>Cantidad</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredDisposals.map((item) => (
              <Tr key={item.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{item.id}</Td>
                <Td>{item.bien_id}</Td>
                <Td>{item.nombre}</Td>
                <Td>{item.descripcion}</Td>
                <Td>{item.fecha}</Td>
                <Td>{item.valor.toFixed(2)}</Td>
                <Td>{item.cantidad}</Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<FiEdit />}
                      onClick={() => openEditDialog(item)}
                    >
                      Editar
                    </Button>
                    <Button size="sm" colorScheme="red" leftIcon={<FiTrash2 />} onClick={() => handleDelete(item.id)}>
                      Eliminar
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal para agregar/editar */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedDisposal ? "Editar Desincorporación" : "Agregar Desincorporación"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 3fr" gap={4} mb={4}>
              <GridItem>
                <FormLabel htmlFor="bien_id" textAlign="right">
                  N° Identificación
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="bien_id"
                  type="number"
                  value={newDisposal.bien_id || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      bien_id: Number.parseInt(e.target.value),
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="nombre" textAlign="right">
                  Nombre
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="nombre"
                  value={newDisposal.nombre || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      nombre: e.target.value,
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="descripcion" textAlign="right">
                  Descripción
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="descripcion"
                  value={newDisposal.descripcion || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      descripcion: e.target.value,
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="fecha" textAlign="right">
                  Fecha
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="fecha"
                  type="date"
                  value={newDisposal.fecha || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      fecha: e.target.value,
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="valor" textAlign="right">
                  Valor
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={newDisposal.valor || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      valor: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="cantidad" textAlign="right">
                  Cantidad
                </FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  id="cantidad"
                  type="number"
                  value={newDisposal.cantidad || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      cantidad: Number.parseInt(e.target.value),
                    })
                  }
                />
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="concepto" textAlign="right">
                  Concepto
                </FormLabel>
              </GridItem>
              <GridItem>
                <Select
                  id="concepto"
                  value={newDisposal.concepto_id?.toString() || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      concepto_id: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Seleccionar concepto"
                >
                  {concepts.map((concept) => (
                    <option key={concept.id} value={concept.id.toString()}>
                      {concept.name}
                    </option>
                  ))}
                </Select>
              </GridItem>

              <GridItem>
                <FormLabel htmlFor="departamento" textAlign="right">
                  Departamento
                </FormLabel>
              </GridItem>
              <GridItem>
                <Select
                  id="departamento"
                  value={newDisposal.dept_id?.toString() || ""}
                  onChange={(e) =>
                    setNewDisposal({
                      ...newDisposal,
                      dept_id: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Seleccionar departamento"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={selectedDisposal ? handleEdit : handleAdd}>
              {selectedDisposal ? "Guardar Cambios" : "Agregar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
