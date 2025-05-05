
"use client"

import type React from "react"
import { useState } from "react"
import { Box, Icon, Button, Flex, useColorModeValue, Heading, Card, CardHeader, CardBody } from "@chakra-ui/react"
import { BsBox2 } from "react-icons/bs"
import { useInventoryData } from "./variables/inventoryData"
import { SearchBar } from "./components/SearchBar"
import { AssetTable } from "./components/AssetTable"
import { Pagination } from "./components/Pagination"
import { AddAssetModal } from "./components/AddAssetModal"
import { DeleteAssetModal } from "./components/DeleteAssetModal"
import type { MovableAsset } from "./variables/inventoryTypes"

const Inventory: React.FC = () => {
  const {
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
  } = useInventoryData()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [newAsset, setNewAsset] = useState<Partial<MovableAsset>>({})
  const [selectedAsset, setSelectedAsset] = useState<MovableAsset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedAsset = { ...newAsset, [name]: value };

    if (name === "cantidad" || name === "valor_unitario") {
      const cantidad = Number(name === "cantidad" ? value : updatedAsset.cantidad) || 0;
      const valorUnitario = Number(name === "valor_unitario" ? value : updatedAsset.valor_unitario) || 0;
      updatedAsset.valor_total = cantidad * valorUnitario;
    }

    setNewAsset(updatedAsset);
  };

  // Modal handlers
  const openAddModal = () => {
    setNewAsset({})
    setIsAddModalOpen(true)
  }

  const handleAddSubmit = () => {
    const today = new Date();
    const fechaActual = today.toISOString().split('T')[0];
    const cantidad = Number(newAsset.cantidad) || 0;
    const valorUnitario = Number(newAsset.valor_unitario) || 0;
    const valorTotal = cantidad * valorUnitario;
    const assetToAdd = {
      ...newAsset,
      fecha: fechaActual,
      valor_total: valorTotal,
    };

    if (addAsset(assetToAdd)) {
      setNewAsset({});
      setIsAddModalOpen(false);
    }
  };

  const handleEditClick = (asset: MovableAsset) => {
    setSelectedAsset(asset)
    setNewAsset(asset)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = () => {
    if (selectedAsset && updateAsset(selectedAsset.numero_identificacion, newAsset)) {
      setSelectedAsset(null);
      setNewAsset({});
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (asset: MovableAsset) => {
    setSelectedAsset(asset)
    setDeleteConfirmation("")
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSubmit = () => {
    if (
      selectedAsset &&
      deleteConfirmation.trim().toLowerCase() === selectedAsset.numero_identificacion.trim().toLowerCase()
    ) {
      deleteAsset(selectedAsset.numero_identificacion);
      setSelectedAsset(null);
      setDeleteConfirmation("");
      setIsDeleteModalOpen(false);
    }
  };

  // UI colors
  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color="type.title">
              Inventario de Bienes
            </Heading>
            <Button
              bgColor="type.primary"
              colorScheme="purple"
              size="md"
              leftIcon={<Icon as={BsBox2} />}
              onClick={openAddModal}
            >
              Agregar Bien
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          {/* Search and filters */}
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />

          {/* Assets table */}
          <AssetTable assets={filteredAssets} onEdit={handleEditClick} onDelete={handleDeleteClick} />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </CardBody>
      </Card>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        asset={newAsset}
        groups={groups}
        conditions={conditions}
        locations={locations}
        departments={departments}
        onChange={handleInputChange}
        onSubmit={handleAddSubmit}
        title="Agregar Nuevo Bien"
        submitButtonText="Agregar Bien"
      />

      {/* Edit Asset Modal */}
      <AddAssetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        asset={newAsset}
        groups={groups}
        conditions={conditions}
        locations={locations}
        departments={departments}
        onChange={handleInputChange}
        onSubmit={handleEditSubmit}
        title="Editar Bien"
        submitButtonText="Guardar Cambios"
      />

      {/* Delete Asset Modal */}
      <DeleteAssetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        asset={selectedAsset}
        confirmationText={deleteConfirmation}
        onConfirmationChange={setDeleteConfirmation}
        onDelete={handleDeleteSubmit}
      />
    </Box>
  )
}

export default Inventory
