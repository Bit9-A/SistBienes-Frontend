"use client"

import type React from "react"
import { Flex, Text, HStack, Button } from "@chakra-ui/react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
    return (
        <Flex justify="space-between" align="center" mt={4}>
            <Text color="gray.600">Mostrando Bienes</Text>
            <HStack spacing={2}>
                <Button
                    size="sm"
                    variant="outline"
                    colorScheme="type.primary"
                    isDisabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Anterior
                </Button>
                <Button size="sm" bgColor="type.primary" color="type.cbutton" variant="solid">
                    {currentPage}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    colorScheme="type.primary"
                    isDisabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Siguiente
                </Button>
            </HStack>
        </Flex>
    )
}
