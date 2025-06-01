"use client"

import type React from "react"
import { Flex, Input, InputGroup, InputLeftElement, FormLabel, Button, Box, HStack } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

interface TransferSearchFilterProps {
    searchQuery: string
    startDate: string
    endDate: string
    onSearch: (query: string) => void
    onDateFilter: (start: string, end: string) => void
}

export const TransferSearchFilter: React.FC<TransferSearchFilterProps> = ({
    searchQuery,
    startDate,
    endDate,
    onSearch,
    onDateFilter,
}) => {
    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={6}
            gap={4}
        >
            <HStack spacing={4} flex={{ md: 2 }}>
                <InputGroup maxW={{ md: "320px" }}>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar por ID, nombre o descripción"
                        variant="outline"
                        value={searchQuery ?? ''}
                        onChange={(e) => onSearch(e.target.value)}
                        borderRadius="md"
                    />
                </InputGroup>
                <FormLabel htmlFor="date-filter" fontSize="sm" mb={1}>
                    Filtrar por Fecha
                </FormLabel>
                <Flex gap={2} alignItems="center">
                    <Input
                        type="date"
                        size="md"
                        value={startDate ?? ''}
                        onChange={(e) => onDateFilter(e.target.value, endDate)}
                        placeholder="Fecha inicial"
                    />
                    <Box>a</Box>
                    <Input
                        type="date"
                        size="md"
                        value={endDate ?? ''}
                        onChange={(e) => onDateFilter(startDate, e.target.value)}
                        placeholder="Fecha final"
                    />
                    {(startDate || endDate) && (
                        <Button size="sm" variant="ghost" onClick={() => onDateFilter("", "")}>
                            Limpiar
                        </Button>
                    )}
                </Flex>
            </HStack>
        </Flex>
    )
}
