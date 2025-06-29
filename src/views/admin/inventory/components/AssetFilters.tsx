"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
  Divider,
  useColorModeValue,
  Icon,
  Text,
  Badge,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { FiCalendar, FiX, FiFilter, FiUsers, FiChevronDown } from "react-icons/fi";

interface AssetFiltersProps {
  departments: { id: number; nombre: string }[];
  onFilter: (filters: {
    departmentId?: number;
    date?: string;
    order?: "recent" | "oldest";
  }) => void;
  canFilterByDept?: boolean; // <-- NUEVO
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  departments,
  onFilter,
  canFilterByDept = false, // <-- NUEVO
}) => {
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [date, setDate] = useState<string>("");
  const [order, setOrder] = useState<"recent" | "oldest">("recent");

  const badgeBg = useColorModeValue("blue.50", "blue.900");
  const badgeColor = useColorModeValue("blue.600", "blue.200");
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Contar filtros activos
  const activeFiltersCount = [
    canFilterByDept ? departmentId !== undefined : false,
    !!date,
    order !== "recent",
  ].filter(Boolean).length;

  // Filtrar automáticamente al cambiar cualquier filtro
  useEffect(() => {
    onFilter({
      departmentId: canFilterByDept ? departmentId : undefined,
      date,
      order,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, date, order, canFilterByDept]);

  const handleClear = () => {
    setDepartmentId(undefined);
    setDate("");
    setOrder("recent");
    onFilter({
      departmentId: undefined,
      date: "",
      order: "recent",
    });
  };

  return (
    <Box>
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
        {canFilterByDept && (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
              Departamento
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiUsers} color="gray.400" />
              </InputLeftElement>
              <Select
                placeholder="Todos los departamentos"
                value={departmentId !== undefined ? departmentId : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setDepartmentId(value ? Number(value) : undefined);
                }}
                pl={10}
                borderRadius="md"
                icon={<FiChevronDown />}
              >
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre}
                  </option>
                ))}
              </Select>
            </InputGroup>
          </FormControl>
        )}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Fecha
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              pl={10}
              borderRadius="md"
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Orden
          </FormLabel>
          <Select
            value={order}
            onChange={(e) =>
              setOrder(e.target.value === "recent" ? "recent" : "oldest")
            }
            borderRadius="md"
            icon={<FiChevronDown />}
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};