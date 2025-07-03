"use client"

import type React from "react"
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Divider,
  Icon,
  Text,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiCalendar, FiX, FiFilter, FiSearch } from "react-icons/fi"

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
  const badgeBg = useColorModeValue("blue.50", "blue.900");
  const badgeColor = useColorModeValue("blue.600", "blue.200");

  // Contar filtros activos
  const activeFiltersCount = [
    !!searchQuery,
    !!startDate,
    !!endDate,
  ].filter(Boolean).length;

  const handleClear = () => {
    onSearch("");
    onDateFilter("", "");
  };

  return (
    <Box w="100%">
      {/* Header with Filters Title and Clear Button */}
      <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Flex align="center" gap={2}>
          <Icon as={FiFilter} color="blue.500" />
          <Text fontWeight="medium">Filtros</Text>
          {activeFiltersCount > 0 && (
            <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
              {activeFiltersCount}
            </Badge>
          )}
        </Flex>
        <Flex gap={2} align="center">
          {activeFiltersCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={handleClear}
              leftIcon={<FiX />}
            >
              Limpiar filtros
            </Button>
          )}
        </Flex>
      </Flex>

      <Divider mb={4} />

      {/* Filter Controls */}
      <Stack direction={{ base: "column", md: "row" }} spacing={4} align={{ base: "stretch", md: "flex-end" }}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Buscar
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por ID, nombre o descripción"
              variant="outline"
              value={searchQuery ?? ''}
              onChange={(e) => onSearch(e.target.value)}
              borderRadius="md"
              pl={10}
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Fecha inicial
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={startDate ?? ''}
              onChange={(e) => onDateFilter(e.target.value, endDate)}
              borderRadius="md"
              pl={10}
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Fecha final
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={endDate ?? ''}
              onChange={(e) => onDateFilter(startDate, e.target.value)}
              borderRadius="md"
              pl={10}
            />
          </InputGroup>
        </FormControl>
      </Stack>
    </Box>
  );
};