"use client"

import { useState, useEffect } from "react"
import type {
    MovableAsset,
    MovableAssetGroup,
    MovableAssetCondition,
    MovableAssetLocation,
    Department,
} from "../variables/inventoryTypes"

// Custom hook to manage all inventory data
export const useInventoryData = () => {
    const [assets, setAssets] = useState<MovableAsset[]>([])
    const [groups, setGroups] = useState<MovableAssetGroup[]>([])
    const [conditions, setConditions] = useState<MovableAssetCondition[]>([])
    const [locations, setLocations] = useState<MovableAssetLocation[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [filteredAssets, setFilteredAssets] = useState<MovableAsset[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Load initial assets data
    useEffect(() => {
        // Simulated data fetch
        const initialAssets = [
            {
                id: 1,
                grupo: 1,
                subgrupo: "2-01",
                cantidad: 10,
                nombre: "Silla",
                descripcion: "Silla de oficina ergonómica",
                marca: "ErgoChair",
                modelo: "X200",
                numero_serial: "12345ABC",
                valor_unitario: 150.0,
                valor_total: 1500.0,
                fecha: "2025-04-08",
                departamento: 1,
                id_estado: 1,
                id_Parroquia: 1,
            },
            {
                id: 2,
                grupo: 1,
                subgrupo: "2-01",
                cantidad: 10,
                nombre: "Mesa",
                descripcion: "Mesa de oficina ergonómica",
                marca: "ErgoTable",
                modelo: "X200",
                numero_serial: "12345ABC",
                valor_unitario: 150.0,
                valor_total: 1500.0,
                fecha: "2025-04-08",
                departamento: 1,
                id_estado: 1,
                id_Parroquia: 1,
            },
        ]
        setAssets(initialAssets)
        setFilteredAssets(initialAssets)
    }, [])

    // Load groups data
    useEffect(() => {
        setGroups([
            {
                id: "2-01",
                name: "Máquinas, muebles y demás equipos de oficina",
            },
            {
                id: "2-02",
                name: "Mobiliario y enseres de Alojamiento",
            },
            {
                id: "2-03",
                name: "Máquinaria y demás equipos de construcción,campo,industria y taller ",
            },
            {
                id: "2-04",
                name: "Equipos de transporte",
            },
            {
                id: "2-12",
                name: "Otros Elementos",
            },
        ])
    }, [])

    // Load conditions data
    useEffect(() => {
        setConditions([
            {
                id: 1,
                name: "Excelente",
            },
            {
                id: 2,
                name: "Dañado",
            },
            {
                id: 3,
                name: "En Reparacion",
            },
        ])
    }, [])

    // Load locations data
    useEffect(() => {
        setLocations([
            {
                id: 1,
                name: "Parr.Amenodoro Rangel Lamús",
            },
            {
                id: 2,
                name: "Parr.La Florida",
            },
            {
                id: 3,
                name: "Táriba",
            },
        ])
    }, [])

    // Load departments data
    useEffect(() => {
        setDepartments([
            {
                id: 1,
                name: "Bienes",
            },
            {
                id: 2,
                name: "Talento Humano",
            },
            {
                id: 3,
                name: "Sistemas",
            },
        ])
    }, [])

    // Search and filter functionality
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        applyFilters(query)
    }

    const applyFilters = (query: string) => {
        let filtered = [...assets]
        if (query) {
            filtered = filtered.filter(
                (item) =>
                    item.nombre.toLowerCase().includes(query.toLowerCase()) ||
                    item.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                    item.marca.toLowerCase().includes(query.toLowerCase()) ||
                    item.modelo.toLowerCase().includes(query.toLowerCase()) ||
                    item.numero_serial.toLowerCase().includes(query.toLowerCase()),
            )
        }
        setFilteredAssets(filtered)
    }

    // CRUD operations
    const addAsset = (newAsset: Partial<MovableAsset>) => {
        if (newAsset.nombre && newAsset.cantidad) {
            const newId = assets.length + 1
            const assetWithId = { ...newAsset, id: newId } as MovableAsset
            const updatedAssets = [...assets, assetWithId]
            setAssets(updatedAssets)
            setFilteredAssets(updatedAssets)
            return true
        }
        return false
    }

    const updateAsset = (id: number, updatedAsset: Partial<MovableAsset>) => {
        if (updatedAsset.nombre && updatedAsset.cantidad) {
            const updatedAssets = assets.map((asset) => (asset.id === id ? { ...asset, ...updatedAsset } : asset))
            setAssets(updatedAssets)
            setFilteredAssets(updatedAssets)
            return true
        }
        return false
    }

    const deleteAsset = (assetName: string) => {
        const updatedAssets = assets.filter((asset) => asset.nombre !== assetName)
        setAssets(updatedAssets)
        setFilteredAssets(updatedAssets)
    }

    return {
        assets,
        filteredAssets,
        groups,
        conditions,
        locations,
        departments,
        searchQuery,
        handleSearch,
        addAsset,
        updateAsset,
        deleteAsset,
    }
}
