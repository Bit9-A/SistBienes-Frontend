'use client';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
  List,
  ListItem,
  Text,
  useColorModeValue,
  Icon,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiPlus, FiSearch } from 'react-icons/fi';

interface AutocompleteFieldProps {
  label: string;
  placeholder: string;
  value: number | undefined;
  options: Array<{ id: number; nombre: string }>;
  onSelect: (id: number) => void;
  onAdd: (name: string) => Promise<any>;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  bg?: string;
  borderColor?: string;
  editToggleButton?: React.ReactNode;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  label,
  placeholder,
  value,
  options,
  onSelect,
  onAdd,
  isDisabled = false,
  isReadOnly = false,
  bg,
  borderColor,
  editToggleButton,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Theme colors
  const suggestionsBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const borderColorTheme = useColorModeValue('gray.200', 'gray.600');

  // Update input value when selected value changes
  useEffect(() => {
    if (value) {
      const selectedOption = options.find((opt) => opt.id === value);
      if (selectedOption) {
        setInputValue(selectedOption.nombre);
      }
    } else {
      setInputValue('');
    }
  }, [value, options]);

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = options.filter((option) =>
        option.nombre.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);

    // Clear selection if input doesn't match any option exactly
    const exactMatch = options.find(
      (opt) => opt.nombre.toLowerCase() === newValue.toLowerCase(),
    );
    if (!exactMatch && value) {
      onSelect(0); // Clear selection
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: { id: number; nombre: string }) => {
    setInputValue(option.nombre);
    onSelect(option.id);
    setShowSuggestions(false);
  };

  // Handle add new item
  const handleAdd = async () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Error',
        description: 'Ingrese un nombre válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if item already exists
    const existingItem = options.find(
      (opt) => opt.nombre.toLowerCase() === inputValue.trim().toLowerCase(),
    );

    if (existingItem) {
      handleOptionSelect(existingItem);
      toast({
        title: 'Elemento encontrado',
        description: `"${existingItem.nombre}" ya existe y ha sido seleccionado`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const newItem = await onAdd(inputValue.trim().toUpperCase());

      toast({
        title: 'Agregado exitosamente',
        description: `"${newItem.nombre}" ha sido agregado y seleccionado`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Select the newly created item
      setInputValue(newItem.nombre);
      onSelect(newItem.id);
      setShowSuggestions(false);
    } catch (error: any) {
      console.error('Error adding item:', error);

      if (error.response?.status === 400) {
        toast({
          title: 'Error',
          description: `"${inputValue}" ya existe`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo agregar el elemento',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <FormControl>
      <Flex align="center" justify="space-between" mb={2}>
        <FormLabel fontWeight="semibold" mb="0">
          {label}
        </FormLabel>
        {editToggleButton}
      </Flex>

      <Box position="relative">
        <Flex gap={2}>
          <Box position="relative" flex="1">
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
                bg={bg}
                borderColor={borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: isReadOnly ? borderColor : 'blue.300',
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px blue.500',
                }}
                transition="all 0.2s"
                pl="3rem" // Adjust padding to make space for the icon
              />
            </InputGroup>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredOptions.length > 0 && !isReadOnly && (
              <Box
                ref={listRef}
                position="absolute"
                top="100%"
                left={0}
                right={0}
                zIndex={1000}
                bg={suggestionsBg}
                border="1px"
                borderColor={borderColorTheme}
                borderRadius="md"
                boxShadow="lg"
                maxH="200px"
                overflowY="auto"
                mt={1}
              >
                <List spacing={0}>
                  {filteredOptions.slice(0, 10).map((option) => (
                    <ListItem
                      key={option.id}
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: hoverBg }}
                      onClick={() => handleOptionSelect(option)}
                      borderBottom="1px"
                      borderColor={borderColorTheme}
                      _last={{ borderBottom: 'none' }}
                    >
                      <Text fontSize="sm">{option.nombre}</Text>
                    </ListItem>
                  ))}
                  {filteredOptions.length > 10 && (
                    <ListItem
                      px={3}
                      py={2}
                      fontSize="xs"
                      color="gray.500"
                      textAlign="center"
                    >
                      ... y {filteredOptions.length - 10} más
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Box>

          <Button
            bgColor="type.primary"
            color="white"
            colorScheme="purple"
            onClick={handleAdd}
            size="lg"
            minW="120px"
            isDisabled={isDisabled || isReadOnly || !inputValue.trim()}
            isLoading={isLoading}
            leftIcon={<FiPlus />}
          >
            Agregar
          </Button>
        </Flex>
      </Box>
    </FormControl>
  );
};
