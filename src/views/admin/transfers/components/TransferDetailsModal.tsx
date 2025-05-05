"use client"

import React, { useState } from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    SimpleGrid,
    Flex,
    Icon,
    IconButton,
    useColorModeValue,
    Button
} from "@chakra-ui/react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { HSeparator } from "components/separator/Separator"
import type { Transfer } from "../variables/transferTypes"

interface TransferDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    transfer: Transfer | null
    onEdit?: (transfer: Transfer) => void
    onAskDelete?: (transfer: Transfer) => void
}

export const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
    isOpen,
    onClose,
    transfer,
    onEdit,
    onAskDelete,
}) => {
    const textColor = useColorModeValue("secondaryGray.900", "white")
    const [isEditing, setIsEditing] = useState(false)
    const [editTransfer, setEditTransfer] = useState<Transfer | null>(null)

    React.useEffect(() => {
        if (transfer) {
            setEditTransfer(transfer)
            setIsEditing(false)
        }
    }, [transfer, isOpen])

    if (!transfer || !editTransfer) return null

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditTransfer(prev => prev ? { ...prev, [name]: value } : prev)
    }

    const handleSave = () => {
        if (onEdit && editTransfer) {
            onEdit(editTransfer)
            setIsEditing(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" motionPreset="slideInBottom" size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
                    Detalles Traslado
                    <HSeparator my="5px" />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl id="id" isRequired>
                            <FormLabel fontSize="sm">ID</FormLabel>
                            <Input type="text" value={editTransfer.id || ""} isDisabled />
                        </FormControl>
                        <FormControl id="fecha" isRequired>
                            <FormLabel fontSize="sm">Fecha</FormLabel>
                            <Input
                                type="date"
                                name="fecha"
                                value={editTransfer.fecha || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="responsable" isRequired>
                            <FormLabel fontSize="sm">Responsable</FormLabel>
                            <Input
                                type="text"
                                name="responsable"
                                value={editTransfer.responsable || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="origen" isRequired>
                            <FormLabel fontSize="sm">Departamento Origen</FormLabel>
                            <Input
                                type="text"
                                name="departamentoOrigen"
                                value={editTransfer.departamentoOrigen || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="destino" isRequired>
                            <FormLabel fontSize="sm">Departamento Destino</FormLabel>
                            <Input
                                type="text"
                                name="departamentoDestino"
                                value={editTransfer.departamentoDestino || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="cantidadBienes" isRequired>
                            <FormLabel fontSize="sm">Cantidad de Bienes</FormLabel>
                            <Input
                                type="number"
                                name="cantidadBienes"
                                value={editTransfer.cantidadBienes?.toString() || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="bien" isRequired>
                            <FormLabel fontSize="sm">Bien</FormLabel>
                            <Textarea
                                name="bien"
                                value={editTransfer.bien || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                        <FormControl id="observaciones">
                            <FormLabel fontSize="sm">Observaciones</FormLabel>
                            <Textarea
                                name="observaciones"
                                value={editTransfer.observaciones || ""}
                                onChange={handleInputChange}
                                isDisabled={!isEditing}
                            />
                        </FormControl>
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                    <Flex justify="center" gap={2}>
                        {isEditing ? (
                            <>
                                <Button colorScheme="blue" size="sm" onClick={handleSave}>
                                    Guardar
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </Button>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    aria-label="Editar Traslado"
                                    icon={<Icon as={FiEdit} />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => setIsEditing(true)}
                                />
                                <IconButton
                                    aria-label="Eliminar Traslado"
                                    icon={<Icon as={FiTrash2} />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => onAskDelete && transfer && onAskDelete(transfer)}
                                />
                            </>
                        )}
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}