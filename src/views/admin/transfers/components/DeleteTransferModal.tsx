import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton, Button, Text
} from "@chakra-ui/react";
import type { Transfer } from "../variables/transferTypes";

interface DeleteTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transfer: Transfer | null;
}

export const DeleteTransferModal: React.FC<DeleteTransferModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    transfer,
}) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Confirmar eliminación</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>
                    ¿Estás seguro que deseas eliminar el traslado{" "}
                    <b>{transfer?.id}</b>?
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancelar
                </Button>
                <Button colorScheme="red" onClick={onConfirm}>
                    Eliminar
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);