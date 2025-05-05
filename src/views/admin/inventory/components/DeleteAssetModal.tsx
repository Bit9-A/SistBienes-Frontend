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
    Text,
    Input,
    Badge,
    useColorModeValue,
} from "@chakra-ui/react"
import { HSeparator } from "components/separator/Separator"
import type { MovableAsset } from "../variables/inventoryTypes"

interface DeleteAssetModalProps {
    isOpen: boolean
    onClose: () => void
    asset: MovableAsset | null
    confirmationText: string
    onConfirmationChange: (text: string) => void
    onDelete: () => void
}

export const DeleteAssetModal: React.FC<DeleteAssetModalProps> = ({
    isOpen,
    onClose,
    asset,
    confirmationText,
    onConfirmationChange,
    onDelete,
}) => {
    const textColor = useColorModeValue("secondaryGray.900", "white")

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" motionPreset="slideInBottom">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
                    Eliminar Bien
                    <HSeparator my="5px" />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mt={2}>
                        ¿Deseas eliminar este bien? Escribe <Badge colorScheme="red">{asset?.numero_serial}</Badge> para confirmar la
                        eliminación.
                    </Text>
                    <Input
                        mt={2}
                        placeholder="Escribe el serial del bien para confirmar"
                        value={confirmationText}
                        onChange={(e) => onConfirmationChange(e.target.value)}
                    />
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
                        onClick={onDelete}
                    >
                        Eliminar Bien
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
