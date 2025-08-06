'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  // Stack, // Ya no se usa
  Divider,
  useColorModeValue,
  Icon,
  Text,
  Badge,
  useBreakpointValue,
  Button,
  // Grid, // Ya no se usa
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiX,
  FiFilter,
  FiUsers,
  FiChevronDown,
} from 'react-icons/fi';

interface AssetFiltersProps {
  departments: { id: number; nombre: string }[];
  onFilter: (filters: {
    departmentId?: number;
    startDate?: string;
    endDate?: string;
    order?: 'recent' | 'oldest';
    search?: string;
    isActive?: number;
  }) => void;
  canFilterByDept?: boolean;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  departments,
  onFilter,
  canFilterByDept = false,
}) => {
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [order, setOrder] = useState<'recent' | 'oldest'>('recent');
  const [search, setSearch] = useState<string>('');
  const [isActive, setIsActive] = useState<number>(1); // Por defecto mostrar solo activos

  const badgeBg = useColorModeValue('blue.50', 'blue.900');
  const badgeColor = useColorModeValue('blue.600', 'blue.200');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Contar filtros activos
  const activeFiltersCount = [
    canFilterByDept ? departmentId !== undefined : false,
    !!startDate,
    !!endDate,
    order !== 'recent',
    !!search,
    isActive !== 1, // Contar como filtro activo si no es el valor por defecto (activos)
  ].filter(Boolean).length;

useEffect(() => {
  onFilter({
    departmentId: canFilterByDept ? departmentId : undefined,
    startDate,
    endDate,
    order,
    search,
    isActive,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [departmentId, startDate, endDate, order, canFilterByDept, search, isActive]);

const handleClear = () => {
  setDepartmentId(undefined);
  setStartDate('');
  setEndDate('');
  setOrder('recent');
  setSearch('');
  setIsActive(1); // Resetear a activos por defecto
  onFilter({
    departmentId: undefined,
    startDate: '',
    endDate: '',
    order: 'recent',
    search: '',
    isActive: 1,
  });
};
  return (
    <Box>
      {/* Header with Filters Title and Clear Button */}
      <Flex
        mb={4}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={4}
      >
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
      <Flex
        flexWrap="wrap" // Permite que los elementos se envuelvan a la siguiente línea
        gap={6} // Aumentado el espacio entre los elementos
        alignItems="flex-end" // Alinea los elementos al final para que los labels queden alineados
      >
        <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Buscar
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiFilter} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar en todos los campos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderRadius="md"
              pl={10}
            />
          </InputGroup>
        </FormControl>
        {canFilterByDept && (
          <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
              Departamento
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiUsers} color="gray.400" />
              </InputLeftElement>
              <Select
                placeholder="Todos los departamentos"
                value={departmentId !== undefined ? departmentId : ''}
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

        <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Fecha desde
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              pl={10}
              borderRadius="md"
            />
          </InputGroup>
        </FormControl>
        <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Fecha hasta
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiCalendar} color="gray.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              pl={10}
              borderRadius="md"
            />
          </InputGroup>
        </FormControl>
        <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Estado
          </FormLabel>
          <Select
            value={isActive}
            onChange={(e) => setIsActive(Number(e.target.value))}
            borderRadius="md"
            icon={<FiChevronDown />}
          >
            <option value={1}>Activos</option>
            <option value={0}>Inactivos</option>
            <option value={-1}>Todos</option>
          </Select>
        </FormControl>
        <FormControl flexGrow={1} flexShrink={0} flexBasis={{ base: '100%', md: '180px', lg: '200px' }} maxWidth={{ base: 'full', md: '280px', lg: '320px' }}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={1}>
            Orden
          </FormLabel>
          <Select
            value={order}
            onChange={(e) =>
              setOrder(e.target.value === 'recent' ? 'recent' : 'oldest')
            }
            borderRadius="md"
            icon={<FiChevronDown />}
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </Select>
        </FormControl>
      </Flex> {/* Cambiado de Grid a Flex con minWidth */}
    </Box>
  );
};
