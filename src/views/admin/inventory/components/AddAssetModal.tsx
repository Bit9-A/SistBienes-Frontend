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
    useColorModeValue,
} from "@chakra-ui/react"
import { HSeparator } from "components/separator/Separator"
import { AssetForm } from "./AssetForm"
import type {
    MovableAsset,
    MovableAssetGroup,
    MovableAssetCondition,
    MovableAssetLocation,
    Department,
} from "../variables/inventoryTypes"

interface AddAssetModalProps {
    isOpen: boolean
    onClose: () => void
    asset: Partial<MovableAsset>
    groups: MovableAssetGroup[]
    conditions: MovableAssetCondition[]
    locations: MovableAssetLocation[]
    departments: Department[]
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    onSubmit: () => void
    title: string
    submitButtonText: string
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
    isOpen,
    onClose,
    asset,
    groups,
    conditions,
    locations,
    departments,
    onChange,
    onSubmit,
    title,
    submitButtonText,
}) => {
    const textColor = useColorModeValue("secondaryGray.900", "white")

    const handleSubmit = () => {
        onSubmit()
        onClose()
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
                    <AssetForm
                        asset={asset}
                        groups={groups}
                        conditions={conditions}
                        locations={locations}
                        departments={departments}
                        onChange={onChange}
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
                        onClick={handleSubmit}
                    >
                        {submitButtonText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
