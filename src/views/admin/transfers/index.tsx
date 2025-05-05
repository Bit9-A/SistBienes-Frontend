"use client"

import { useState } from "react"
import { Box, Card, CardHeader, CardBody, Heading, useDisclosure } from "@chakra-ui/react"
import { TransferSearchFilter } from "./components/TransferSearchFilter"
import { TransferTable } from "./components/TransferTable"
import { DeleteTransferModal } from "./components/DeleteTransferModal";
import { TransferDetailsModal } from "./components/TransferDetailsModal"
import { NoTransfersFound } from "./components/NoTransfersFound"
import { useTransferData } from "./variables/useTransferData"
import type { Transfer } from "./variables/transferTypes"

export default function TransferPage() {
    const { filteredTransfers, searchQuery, startDate, endDate, handleSearch, handleDateFilter, editTransfer, deleteTransfer } = useTransferData()

    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transferToDelete, setTransferToDelete] = useState<Transfer | null>(null);


    const handleViewDetails = (transfer: Transfer) => {
        setSelectedTransfer(transfer)
        onOpen()
    }

    const handleEditTransfer = (transfer: Transfer) => {
        if (transfer) {
            editTransfer(transfer);
        }
        onClose();
    };

    const handleAskDelete = (transfer: Transfer) => {
        setTransferToDelete(transfer);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (transferToDelete) {
            deleteTransfer(transferToDelete.id);
            setIsDeleteModalOpen(false);
            onClose();
            setTransferToDelete(null);
        }
    };

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mx="auto" py={10}>
            <Card className="mt-6">
                <CardHeader>
                    <Heading size="lg" fontWeight="bold" color={"type.title"}>
                        Historial de Traslados
                    </Heading>
                    <p className="text-muted-foreground">
                        Registro completo de movimientos, incorporaciones y desincorporaciones de bienes
                    </p>
                </CardHeader>
                <CardBody>
                    <TransferSearchFilter
                        searchQuery={searchQuery}
                        startDate={startDate}
                        endDate={endDate}
                        onSearch={handleSearch}
                        onDateFilter={handleDateFilter}
                    />

                    <TransferTable transfers={filteredTransfers} onViewDetails={handleViewDetails} />

                    {filteredTransfers.length === 0 && <NoTransfersFound />}

                    <TransferDetailsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        transfer={selectedTransfer}
                        onEdit={handleEditTransfer}
                        onAskDelete={handleAskDelete}
                    />
                    <DeleteTransferModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        transfer={transferToDelete}
                    />
                </CardBody>
            </Card>
        </Box>
    )
}
