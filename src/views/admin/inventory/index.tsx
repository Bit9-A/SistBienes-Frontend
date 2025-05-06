"use client"

import type React from "react"
import { useState } from "react"
import { Box, Icon, Button, Flex, useColorModeValue, Heading, Card, CardHeader, CardBody } from "@chakra-ui/react"
import { BsBox2 } from "react-icons/bs"
import { useInventoryData } from "./utils/inventoryUtils"
import { SearchBar } from "./components/SearchBar"
import { AssetTable } from "./components/AssetTable"
import { Pagination } from "./components/Pagination"
import { AssetForm } from "./components/AssetForm"
import { DeleteAssetModal } from "./components/DeleteAssetModal"
import type { MovableAsset } from "../../../api/AssetsApi"

const Inventory: React.FC = () => {
  const {
    filteredAssets,
    groups,
    locations,
    departments,
    searchQuery,
    handleSearch,
    addAsset,
    updateAsset,
    deleteAsset,
  } = useInventoryData()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [newAsset, setNewAsset] = useState<Partial<MovableAsset>>({})
  const [selectedAsset, setSelectedAsset] = useState<MovableAsset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [formTitle, setFormTitle] = useState("")
  const [submitButtonText, setSubmitButtonText] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let updatedAsset = { ...newAsset, [name]: value }

    if (name === "cantidad" || name === "valor_unitario") {
      const cantidad = Number(name === "cantidad" ? value : updatedAsset.cantidad) || 0
      const valorUnitario = Number(name === "valor_unitario" ? value : updatedAsset.valor_unitario) || 0
      updatedAsset.valor_total = cantidad * valorUnitario
    }

    setNewAsset(updatedAsset)
  }

  // Modal handlers
  const openAddModal = () => {
    setNewAsset({})
    setFormTitle("Agregar Nuevo Bien")
    setSubmitButtonText("Agregar Bien")
    setIsFormModalOpen(true)
  }

  const openEditModal = (asset: MovableAsset) => {
    setSelectedAsset(asset)
    setNewAsset(asset)
    setFormTitle("Editar Bien")
    setSubmitButtonText("Guardar Cambios")
    setIsFormModalOpen(true)
  }

  const handleFormSubmit = async () => {
    if (selectedAsset) {
      // Editar activo existente
      const success = await updateAsset(selectedAsset.id, newAsset)
      if (success) {
        setSelectedAsset(null)
        setNewAsset({})
        setIsFormModalOpen(false)
      }
    } else {
      // Agregar nuevo activo
      const today = new Date()
      const fechaActual = today.toISOString().split("T")[0]
      const cantidad = Number(newAsset.cantidad) || 0
      const valorUnitario = Number(newAsset.valor_unitario) || 0
      const valorTotal = cantidad * valorUnitario
      const assetToAdd = {
        ...newAsset,
        fecha: fechaActual,
        valor_total: valorTotal,
      }

      const success = await addAsset(assetToAdd)
      if (success) {
        setNewAsset({})
        setIsFormModalOpen(false)
      }
    }
  }

  const handleDeleteClick = (id: number) => {
    const asset = filteredAssets.find((a) => a.id === id) || null
    setSelectedAsset(asset)
    setDeleteConfirmation("")
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (
      selectedAsset &&
      deleteConfirmation.trim().toLowerCase() === selectedAsset.numero_identificacion.trim().toLowerCase()
    ) {
      await deleteAsset(selectedAsset.id)
      setSelectedAsset(null)
      setDeleteConfirmation("")
      setIsDeleteModalOpen(false)
    }
  }

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
          <AssetTable assets={filteredAssets} onEdit={openEditModal} onDelete={(id) => handleDeleteClick(id)} />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </CardBody>
      </Card>

      {/* Asset Form Modal */}
      <AssetForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        asset={newAsset}
        onChange={handleInputChange}
        title={formTitle}
        submitButtonText={submitButtonText}
        onSubmit={handleFormSubmit}
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