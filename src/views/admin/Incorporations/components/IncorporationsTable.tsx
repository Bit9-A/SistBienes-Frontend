

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

interface Incorporation {
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
  { id: 1, name: "Compra" },
  { id: 2, name: "Donación" },
  { id: 3, name: "Transferencia" },
]

export default function IncorporationsTable() {
  const [incorporations, setIncorporations] = useState<Incorporation[]>([])
  const [filteredIncorporations, setFilteredIncorporations] = useState<Incorporation[]>([])
  const [selectedIncorporation, setSelectedIncorporation] = useState<Incorporation | null>(null)
  const [newIncorporation, setNewIncorporation] = useState<Partial<Incorporation>>({})
  const [filterDept, setFilterDept] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.800")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  // Simulación de datos iniciales
  useEffect(() => {
    const initialData: Incorporation[] = [
      {
        id: 1,
        bien_id: 12345,
        nombre: "Escritorio",
        descripcion: "Escritorio de oficina",
        fecha: "2025-04-20",
        valor: 150.0,
        cantidad: 10,
        concepto_id: 1,
        dept_id: 1,
      },
      {
        id: 2,
        bien_id: 67890,
        nombre: "Silla",
        descripcion: "Silla ergonómica",
        fecha: "2025-04-19",
        valor: 75.0,
        cantidad: 20,
        concepto_id: 2,
        dept_id: 2,
      },
    ]
    setIncorporations(initialData)
    setFilteredIncorporations(initialData)
  }, [])

  const handleAdd = () => {
    if (!newIncorporation.bien_id || !newIncorporation.nombre || !newIncorporation.fecha) return

    const newEntry: Incorporation = {
      id: incorporations.length + 1,
      bien_id: newIncorporation.bien_id,
      nombre: newIncorporation.nombre,
      descripcion: newIncorporation.descripcion || "",
      fecha: newIncorporation.fecha,
      valor: newIncorporation.valor || 0,
      cantidad: newIncorporation.cantidad || 0,
      concepto_id: newIncorporation.concepto_id || 1,
      dept_id: newIncorporation.dept_id || 1,
    }

    setIncorporations([...incorporations, newEntry])
    setFilteredIncorporations([...filteredIncorporations, newEntry])
    setNewIncorporation({})
    onClose()
  }

  const handleEdit = () => {
    if (selectedIncorporation) {
      const updatedIncorporations = incorporations.map((item) =>
        item.id === selectedIncorporation.id ? { ...item, ...newIncorporation } : item,
      )

      setIncorporations(updatedIncorporations)
      setFilteredIncorporations(
        filterDept
          ? updatedIncorporations.filter((item) => item.dept_id === Number.parseInt(filterDept))
          : updatedIncorporations,
      )

      setSelectedIncorporation(null)
      setNewIncorporation({})
      onClose()
    }
  }

  const handleDelete = (id: number) => {
    const updatedIncorporations = incorporations.filter((item) => item.id !== id)
    setIncorporations(updatedIncorporations)
    setFilteredIncorporations(
      filterDept
        ? updatedIncorporations.filter((item) => item.dept_id === Number.parseInt(filterDept))
        : updatedIncorporations,
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
    let filtered = [...incorporations]

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

    setFilteredIncorporations(filtered)
  }

  const openEditDialog = (incorporation: Incorporation) => {
    setSelectedIncorporation(incorporation)
    setNewIncorporation(incorporation)
    onOpen()
  }

  const openAddDialog = () => {
    setSelectedIncorporation(null)
    setNewIncorporation({})
    onOpen()
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justify="space-between" mb={4}>
        <Button colorScheme="purple" onClick={openAddDialog}>
          Agregar Incorporación
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
            {filteredIncorporations.map((item) => (
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
          <ModalHeader>{selectedIncorporation ? "Editar Incorporación" : "Agregar Incorporación"}</ModalHeader>
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
                  value={newIncorporation.bien_id || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.nombre || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.descripcion || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.fecha || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.valor || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.cantidad || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.concepto_id?.toString() || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
                  value={newIncorporation.dept_id?.toString() || ""}
                  onChange={(e) =>
                    setNewIncorporation({
                      ...newIncorporation,
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
            <Button colorScheme="purple" onClick={selectedIncorporation ? handleEdit : handleAdd}>
              {selectedIncorporation ? "Guardar Cambios" : "Agregar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
