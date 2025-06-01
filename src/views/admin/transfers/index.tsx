"use client"
import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, CardBody, Heading, useDisclosure } from "@chakra-ui/react";
import { TransferSearchFilter } from "./components/TransferSearchFilter";
import { TransferTable } from "./components/TransferTable";
import { TransferDetailsModal } from "./components/TransferDetailsModal";
import { NoTransfersFound } from "./components/NoTransfersFound";
import { Transfer, getAllTransfers, } from "../../../api/TransferApi";
import { Department, getDepartments } from "../../../api/SettingsApi";

export default function TransferPage() {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
    const [transferToDelete, setTransferToDelete] = useState<Transfer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Filtros de búsqueda
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    // Fetch Departments y Transfers


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transferData, departmentsData] = await Promise.all([
                    getAllTransfers(),
                    getDepartments(),
                ]);
                setTransfers(transferData);
                setDepartments(departmentsData);
                console.log("Transfers:", transferData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filtrado simple por búsqueda y fechas
    const filteredTransfers = Array.isArray(transfers)
        ? transfers.filter(t => {
            const matchesQuery = searchQuery === "" || t.id.toString().includes(searchQuery);
            const matchesStart = !startDate || new Date(t.fecha) >= new Date(startDate);
            const matchesEnd = !endDate || new Date(t.fecha) <= new Date(endDate);
            return matchesQuery && matchesStart && matchesEnd;
        })
        : [];

    // Handlers
    const handleSearch = (query: string) => setSearchQuery(query);
    const handleDateFilter = (start: string | null, end: string | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleViewDetails = (transfer: Transfer) => {
        setSelectedTransfer(transfer);
        console.log("Selected Transfer:", transfer.id);
        onOpen();
    };

    const handleEditTransfer = (transfer: Transfer) => {
        onClose();
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

                    <TransferTable transfers={filteredTransfers} departments={departments} onViewDetails={handleViewDetails} />

                    {filteredTransfers.length === 0 && <NoTransfersFound />}

                    <TransferDetailsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        transferId={selectedTransfer?.id || null}
                        departments={departments}
                        onEdit={handleEditTransfer}
                    />
                </CardBody>
            </Card>
        </Box>
    );
}