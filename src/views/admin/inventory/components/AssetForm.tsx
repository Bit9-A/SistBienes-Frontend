"use client"

import type React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    useColorModeValue,
} from "@chakra-ui/react"
import { HSeparator } from "components/separator/Separator"
import { useInventoryData } from "../utils/inventoryUtils"
import type { MovableAsset } from "../../../../api/AssetsApi"

interface AddAssetModalProps {
    isOpen: boolean
    onClose: () => void
    asset: Partial<MovableAsset>
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    title: string
    submitButtonText: string
    onSubmit: () => Promise<void> // Agregada esta propiedad
}

export const AssetForm: React.FC<AddAssetModalProps> = ({
    isOpen,
    onClose,
    asset,
    onChange,
    title,
    submitButtonText,
    onSubmit,
}) => {
    const textColor = useColorModeValue("secondaryGray.900", "white")

    // Usar el hook para acceder a las funciones de inventario
    const { addAsset, updateAsset, groups, departments, conditions, locations } = useInventoryData()

    const handleSubmit = async () => {
        try {
            if (asset.id) {
                // Actualizar un activo existente
                const success = await updateAsset(asset.id, asset)
                if (success) {
                    onClose()
                }
            } else {
                // Agregar un nuevo activo
                const success = await addAsset(asset)
                if (success) {
                    onClose()
                }
            }
        } catch (error) {
            console.error("Error al guardar el activo:", error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" motionPreset="slideInBottom" size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
                    {title}
                    <HSeparator my="5px" />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
                        <FormControl>
                            <FormLabel>Numero de Identificación</FormLabel>
                            <Input
                                name="numero_identificacion"
                                value={asset.numero_identificacion || ""}
                                onChange={onChange}
                                placeholder="Numero de Identificación"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Nombre & Descripción</FormLabel>
                            <Textarea
                                name="descripcion"
                                value={asset.descripcion || ""}
                                onChange={onChange}
                                placeholder="Nombre & Descripción"
                                resize="none"
                                rows={1}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Serial</FormLabel>
                            <Input
                                name="numero_serial"
                                value={asset.numero_serial || ""}
                                onChange={onChange}
                                placeholder="Serial"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Marca</FormLabel>
                            <Input
                                name="marca"
                                value={asset.marca_id || ""}
                                onChange={onChange}
                                placeholder="Marca"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Modelo</FormLabel>
                            <Input
                                name="modelo"
                                value={asset.modelo_id || ""}
                                onChange={onChange}
                                placeholder="Modelo"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Cantidad</FormLabel>
                            <Input
                                name="cantidad"
                                type="number"
                                value={asset.cantidad || ""}
                                onChange={onChange}
                                placeholder="Cantidad"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Valor Unitario</FormLabel>
                            <Input
                                name="valor_unitario"
                                type="number"
                                step="0.01"
                                value={asset.valor_unitario || ""}
                                onChange={onChange}
                                placeholder="Valor Unitario"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Departamento</FormLabel>
                            <Select
                                name="departamento"
                                value={asset.departamento || ""}
                                onChange={onChange}
                                borderRadius="md"
                            >
                                <option value="">Departamento...</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.nombre}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Seleccione Un Subgrupo</FormLabel>
                            <Select
                                name="subgrupo"
                                value={asset.subgrupo || ""}
                                onChange={onChange}
                                borderRadius="md"
                            >
                                <option value="">Subgrupos...</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.nombre}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Condición del Bien</FormLabel>
                            <Select
                                name="id_estado"
                                value={asset.id_estado || ""}
                                onChange={onChange}
                                borderRadius="md"
                            >
                                <option value="">Condición...</option>
                                {conditions.map((condition) => (
                                    <option key={condition.id} value={condition.id}>
                                        {condition.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl gridColumn="span 2">
                            <FormLabel>Parroquia Perteneciente</FormLabel>
                            <Select
                                name="id_Parroquia"
                                value={asset.id_Parroquia || ""}
                                onChange={onChange}
                                borderRadius="md"
                            >
                                <option value="">Parroquia...</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.nombre}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="solid"
                        bg="type.primary"
                        color="type.primary"
                        borderColor="type.primary"
                        textColor="type.cbutton"
                        _hover={{
                            bg: "transparent",
                            color: "type.primary",
                            border: "0.5px solid",
                            borderColor: "type.primary",
                        }}
                        onClick={onSubmit} // Usar la función onSubmit pasada como prop
                    >
                        {submitButtonText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>  
          )
}