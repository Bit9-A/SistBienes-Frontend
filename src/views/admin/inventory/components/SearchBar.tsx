"use client"

import type React from "react"
import { Flex, HStack, InputGroup, InputLeftElement, Input, Button, Icon } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { FiDownload } from "react-icons/fi"

interface SearchBarProps {
    searchQuery: string
    onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
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
                        placeholder="Buscar Bienes..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        borderRadius="md"
                    />
                </InputGroup>
            </HStack>

            <Button
                leftIcon={<Icon as={FiDownload} />}
                variant="outline"
                color="type.primary"
                borderColor="type.primary"
                _hover={{ bg: "type.primary", color: "type.cbutton" }}
            >
                Exportar
            </Button>
        </Flex>
    )
}
