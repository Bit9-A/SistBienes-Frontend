"use client"

import type React from "react"
import {
    Box,
    Icon,
    Flex,
    Table,
    Thead,
    Tbody,
    Text,
    Tr,
    Th,
    Td,
    TableContainer,
    IconButton,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    useColorModeValue,
} from "@chakra-ui/react"
import { BsBoxSeam } from "react-icons/bs"
import { FiEdit, FiTrash2, FiMoreVertical, FiArchive } from "react-icons/fi"
import type { MovableAsset } from "../variables/inventoryTypes"
interface AssetTableProps {
    assets: MovableAsset[]
    onEdit: (asset: MovableAsset) => void
    onDelete: (asset: MovableAsset) => void
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete }) => {
    const headerBg = useColorModeValue("gray.50", "gray.800")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const hoverBg = useColorModeValue("gray.50", "gray.700")

    return (
        <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
            <Table variant="simple" size="md">
                <Thead bg={headerBg}>
                    <Tr>
                        <Th display={{ base: "none", md: "table-cell" }}>N°</Th>
                        <Th display={{ base: "none", md: "table-cell" }}>Identificación</Th>
                        <Th display={{ base: "none", lg: "table-cell" }}>Nombre y Descripcion</Th>
                        <Th display={{ base: "none", sm: "table-cell" }}>Serial</Th>
                        <Th display={{ base: "none", md: "table-cell" }}>Marca</Th>
                        <Th display={{ base: "none", md: "table-cell" }}>Modelo</Th>
                        <Th display={{ base: "none", sm: "table-cell" }}>Cantidad</Th>
                        <Th display={{ base: "none", sm: "table-cell" }}>Valor Unitario</Th>
                        <Th display={{ base: "none", sm: "table-cell" }}>Valor Total</Th>
                        <Th display={{ base: "none", lg: "table-cell" }}>Fecha</Th>
                        <Th display={{ base: "none", lg: "table-cell" }}>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {assets.map((asset, index) => (
                        <Tr key={asset.numero_identificacion} _hover={{ bg: hoverBg }} transition="background 0.2s">
                            <Td>
                                <Flex align="center">
                                    <Box
                                        bg="blue.100"
                                        color="blue.700"
                                        borderRadius="full"
                                        p={2}
                                        mr={3}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={BsBoxSeam} />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium">{index + 1}</Text>
                                    </Box>
                                </Flex>
                            </Td>
                            <Td display={{ base: "none", md: "table-cell" }}>{asset.numero_identificacion}</Td>
                            <Td display={{ base: "none", lg: "table-cell" }}>{asset.descripcion}</Td>
                            <Td display={{ base: "none", sm: "table-cell" }}>{asset.numero_serial}</Td>
                            <Td display={{ base: "none", md: "table-cell" }}>{asset.marca}</Td>
                            <Td display={{ base: "none", md: "table-cell" }}>{asset.modelo}</Td>
                            <Td display={{ base: "none", sm: "table-cell" }}>{asset.cantidad}</Td>
                            <Td display={{ base: "none", sm: "table-cell" }}>{asset.valor_unitario}</Td>
                            <Td display={{ base: "none", sm: "table-cell" }}>{asset.valor_total}</Td>
                            <Td display={{ base: "none", lg: "table-cell" }}>{asset.fecha}</Td>

                            <Td>
                                <Flex justify="center" gap={2}>
                                    <IconButton
                                        aria-label="Editar bien"
                                        icon={<Icon as={FiEdit} />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => onEdit(asset)}
                                    />
                                    <IconButton
                                        aria-label="Eliminar bien"
                                        icon={<Icon as={FiTrash2} />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => onDelete(asset)}
                                    />
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            aria-label="Más opciones"
                                            icon={<Icon as={FiMoreVertical} />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                        <MenuList>
                                            <MenuItem icon={<Icon as={FiArchive} />}>Más Detalles</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}
