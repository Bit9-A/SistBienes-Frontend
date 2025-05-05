"use client"

import type React from "react"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Box,
    Text,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
} from "@chakra-ui/react"
import { FiMoreVertical, FiArchive } from "react-icons/fi"
import { BsBoxes } from "react-icons/bs"
import type { Transfer } from "../variables/transferTypes"

interface TransferTableProps {
    transfers: Transfer[]
    onViewDetails: (transfer: Transfer) => void
}

export const TransferTable: React.FC<TransferTableProps> = ({ transfers, onViewDetails }) => {
    const headerBg = useColorModeValue("gray.50", "gray.800")
    const borderColor = useColorModeValue("gray.200", "gray.600")

    return (
        <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
            <Table variant="simple" size="md">
                <Thead bg={headerBg}>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Fecha</Th>
                        <Th>Origen</Th>
                        <Th>Destino</Th>
                        <Th>Responsable</Th>
                        <Th>Cantidad</Th>
                        <Th>Observaciones</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {transfers.map((item) => (
                        <Tr key={item.id}>
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
                                        <Icon as={BsBoxes} />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium">{`${item.id}`}</Text>
                                    </Box>
                                </Flex>
                            </Td>
                            <Td>{item.fecha}</Td>
                            <Td>{item.departamentoOrigen}</Td>
                            <Td>{item.departamentoDestino}</Td>
                            <Td>{item.responsable}</Td>
                            <Td>{item.cantidadBienes} </Td>
                            <Td>{item.observaciones}</Td>
                            <Td>
                                <Flex justify="center" gap={2}>
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            aria-label="Más opciones"
                                            icon={<Icon as={FiMoreVertical} />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                        <MenuList>
                                            <MenuItem icon={<Icon as={FiArchive} />} onClick={() => onViewDetails(item)}>
                                                Más Detalles
                                            </MenuItem>
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
