"use client"

import { useState, useEffect } from "react"
import type { Transfer } from "../variables/transferTypes"

// Initial data - in a real app, this would come from an API
const initialTransfers: Transfer[] = [
    {
        id: "TRF-001",
        fecha: "2025-04-10",
        bien: "Laptop Dell XPS 13, Laptop Asus ViveBook",
        cantidadBienes: 2,
        departamentoOrigen: "Sistemas",
        departamentoDestino: "Administración",
        responsable: "Juan Pérez",
        observaciones: "Por requerimiento administrativo",
    },
    {
        id: "TRF-002",
        fecha: "2025-04-12",
        bien: "Proyector Epson",
        cantidadBienes: 1,
        departamentoOrigen: "Audiovisuales",
        departamentoDestino: "Sala de Reuniones",
        responsable: "Ana Gómez",
        observaciones: "Mantenimiento de equipos",
    },
]

export const useTransferData = () => {
    const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers)
    const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(initialTransfers)
    const [searchQuery, setSearchQuery] = useState("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    useEffect(() => {
        applyFilters(searchQuery, startDate, endDate);
    }, [transfers, searchQuery, startDate, endDate]);

    const applyFilters = (query: string, start: string, end: string) => {
        let filtered = [...transfers]

        if (start) {
            filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(start))
        }
        if (end) {
            filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(end))
        }
        if (query) {
            filtered = filtered.filter(
                (item) =>
                    item.bien.toLowerCase().includes(query.toLowerCase()) ||
                    item.departamentoOrigen.toLowerCase().includes(query.toLowerCase()) ||
                    item.departamentoDestino.toLowerCase().includes(query.toLowerCase()) ||
                    item.responsable.toLowerCase().includes(query.toLowerCase()) ||
                    (item.observaciones && item.observaciones.toLowerCase().includes(query.toLowerCase())),
            )
        }
        setFilteredTransfers(filtered)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        applyFilters(query, startDate, endDate)
    }

    const handleDateFilter = (start: string, end: string) => {
        setStartDate(start)
        setEndDate(end)
        applyFilters(searchQuery, start, end)
    }

    const editTransfer = (updated: Transfer) => {
        setTransfers(prev =>
            prev.map(t => t.id === updated.id ? { ...t, ...updated } : t)
        );
        applyFilters(searchQuery, startDate, endDate);
    };

    const deleteTransfer = (id: string) => {
        setTransfers(prev => prev.filter(t => t.id !== id));
        applyFilters(searchQuery, startDate, endDate);
    };
    return {
        transfers,
        filteredTransfers,
        searchQuery,
        startDate,
        endDate,
        editTransfer,
        deleteTransfer,
        handleSearch,
        handleDateFilter,

    }
}
