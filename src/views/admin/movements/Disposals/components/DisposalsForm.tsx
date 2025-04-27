"use client"

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
import { type Disposal, departments, concepts } from "../variables/Disposals"

interface DisposalsFormProps {
  isOpen: boolean
  onClose: () => void
  selectedDisposal: Disposal | null
  newDisposal: Partial<Disposal>
  setNewDisposal: (disposal: Partial<Disposal>) => void
  handleAdd: () => void
  handleEdit: () => void
  isMobile: boolean
}

export default function DisposalsForm({
  isOpen,
  onClose,
  selectedDisposal,
  newDisposal,
  setNewDisposal,
  handleAdd,
  handleEdit,
  isMobile,
}: DisposalsFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedDisposal ? "Editar Desincorporación" : "Agregar Desincorporación"}</ModalHeader>
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
                value={newDisposal.bien_id || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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
                value={newDisposal.nombre || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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
                value={newDisposal.descripcion || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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
                value={newDisposal.fecha || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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
                value={newDisposal.valor || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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
                value={newDisposal.cantidad || ""}
                onChange={(e) =>
                  setNewDisposal({
                    ...newDisposal,
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

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <FormLabel htmlFor="departamento" textAlign={{ base: "left", md: "right" }}>
                Departamento
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
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
  )
}
