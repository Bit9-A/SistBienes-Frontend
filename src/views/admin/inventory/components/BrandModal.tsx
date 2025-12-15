"use client"

import type React from "react"
import { useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react"
import { handleAddMarca, handleAddModelo } from "../utils/inventoryUtils"

interface AddMarcaModeloModalProps {
  isOpen: boolean
  onClose: () => void
  type: "marca" | "modelo"
  marcaId?: number // Solo necesario para agregar modelos
  onAddSuccess: (data: any) => void // Callback para actualizar la lista local
}

const AddMarcaModeloModal: React.FC<AddMarcaModeloModalProps> = ({ isOpen, onClose, type, marcaId, onAddSuccess }) => {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Estado para manejar el botón de carga
  const toast = useToast()

  const handleAdd = async () => {
    try {
      setIsLoading(true) // Mostrar estado de carga
      const upperCaseValue = inputValue.trim().toUpperCase() // Convertir a mayúsculas y eliminar espacios

      if (!upperCaseValue) {
        toast({
          title: "Error",
          description: "El nombre no puede estar vacío.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return
      }

      if (type === "marca") {
        const createdMarca = await handleAddMarca({ nombre: upperCaseValue })
        onAddSuccess(createdMarca)
        toast({
          title: "Marca agregada",
          description: `La marca "${createdMarca.nombre}" se agregó correctamente.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else if (type === "modelo" && marcaId) {
        const createdModelo = await handleAddModelo({
          nombre: upperCaseValue,
          idmarca: marcaId,
        })
        onAddSuccess(createdModelo)
        toast({
          title: "Modelo agregado",
          description: `El modelo "${createdModelo.nombre}" se agregó correctamente.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Error",
          description: "Seleccione una marca antes de agregar un modelo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return
      }

      setInputValue("") // Limpiar el campo de entrada
      onClose() // Cerrar el modal
    } catch (error: any) {
      console.error(`Error al agregar ${type}:`, error)

      // Manejo de errores específicos
      if (error.response?.status === 400) {
        toast({
          title: "Error",
          description: `La ${type} "${inputValue}" ya existe.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Error",
          description: `No se pudo agregar la ${type}. Inténtelo de nuevo más tarde.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setIsLoading(false) // Ocultar estado de carga
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === "marca" ? "Agregar Nueva Marca" : "Agregar Nuevo Modelo"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{type === "marca" ? "Nombre de la Marca" : "Nombre del Modelo"}</FormLabel>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ingrese el nombre de la ${type}`}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleAdd}
            isLoading={isLoading} // Mostrar estado de carga
          >
            Agregar
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddMarcaModeloModal
