
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Grid,
  GridItem,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react"
import { type Incorporation, departments, concepts } from "../variables/Incorporations"

interface IncorporationsFormProps {
  isOpen: boolean
  onClose: () => void
  selectedIncorporation: Incorporation | null
  newIncorporation: Partial<Incorporation>
  setNewIncorporation: (incorporation: Partial<Incorporation>) => void
  handleAdd: () => void
  handleEdit: () => void
  isMobile: boolean
}

export default function IncorporationsForm({
  isOpen,
  onClose,
  selectedIncorporation,
  newIncorporation,
  setNewIncorporation,
  handleAdd,
  handleEdit,
  isMobile,
}: IncorporationsFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedIncorporation ? "Editar Incorporación" : "Agregar Incorporación"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={4} mb={4}>
            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="bien_id" textAlign={{ base: "left", md: "right" }}>
                N° Identificación
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="nombre" textAlign={{ base: "left", md: "right" }}>
                Nombre
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="descripcion" textAlign={{ base: "left", md: "right" }}>
                Descripción
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="fecha" textAlign={{ base: "left", md: "right" }}>
                Fecha
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="valor" textAlign={{ base: "left", md: "right" }}>
                Valor
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="cantidad" textAlign={{ base: "left", md: "right" }}>
                Cantidad
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="concepto" textAlign={{ base: "left", md: "right" }}>
                Concepto
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="departamento" textAlign={{ base: "left", md: "right" }}>
                Departamento
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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
  )
}
