"use client"
import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, CardBody, Heading, useDisclosure } from "@chakra-ui/react";
import { TransferSearchFilter } from "./components/TransferSearchFilter";
import { TransferTable } from "./components/TransferTable";
import { DeleteTransferModal } from "./components/DeleteTransferModal";
import { TransferDetailsModal } from "./components/TransferDetailsModal";
import { NoTransfersFound } from "./components/NoTransfersFound";
import { Transfer, getAllTransfers, Bien } from "../../../api/TransferApi";
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

    function groupTransfersWithBienes(transfers: Transfer[]): Transfer[] {
        const grouped: Record<number, Transfer & { bienes: Bien[] }> = {};

        transfers.forEach((t) => {
            if (!grouped[t.id]) {
                grouped[t.id] = {
                    ...t,
                    bienes: [],
                };
            }
            // Crea el bien a partir de los campos que tienes (ajusta según tu modelo real)
            grouped[t.id].bienes.push({
                id: t.bien_traslado_id,
                nombre: `Mueble ${t.id_mueble}`,
                // Puedes agregar más campos si los tienes en la respuesta
            });
        });

        return Object.values(grouped);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transferData, departmentsData] = await Promise.all([
                    getAllTransfers(),
                    getDepartments(),
                ]);
                const groupedTransfers = groupTransfersWithBienes(transferData);
                setTransfers(groupedTransfers);
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
        onOpen();
    };

    const handleEditTransfer = (transfer: Transfer) => {
        onClose();
    };

    const handleAskDelete = (transfer: Transfer) => {
        setTransferToDelete(transfer);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (transferToDelete) {
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

                    <TransferTable transfers={filteredTransfers} departments={departments} onViewDetails={handleViewDetails} />

                    {filteredTransfers.length === 0 && <NoTransfersFound />}

                    <TransferDetailsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        transfer={selectedTransfer}
                        departments={departments}
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
    );
}