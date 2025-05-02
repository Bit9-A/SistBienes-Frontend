import React, { useState, useEffect } from 'react';
import {
    Box,
    Icon,
    Button,
    Flex,
    Table,
    Thead,
    Tbody,
    Text,
    Tr,
    Th,
    Td,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    useColorModeValue,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    TableContainer,
    useDisclosure,
    Heading,
    Card,
    CardHeader,
    CardBody,
    HStack,
    InputGroup,
    InputLeftElement,
    IconButton,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    Select,
} from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons"
import { HSeparator } from "components/separator/Separator";
import {
    FiEdit,
    FiTrash2,
    FiMoreVertical,
    FiDownload,
    FiArchive,
} from "react-icons/fi"

import { BsBoxes } from "react-icons/bs";

type Transfer = {
    id: string;
    fecha: string;
    bien: string;
    cantidadBienes: number;
    departamentoOrigen: string;
    departamentoDestino: string;
    responsable: string;
    observaciones?: string;
};

const initialTransfers: Transfer[] = [
    {
        id: "TRF-001",
        fecha: "10/04/2025",
        bien: "Laptop Dell XPS 13, Laptop Asus ViveBook",
        cantidadBienes: 2,
        departamentoOrigen: "Sistemas",
        departamentoDestino: "Administración",
        responsable: "Juan Pérez",
        observaciones: "Por requerimiento administrativo"
    },
    {
        id: "TRF-002",
        fecha: "15/04/2025",
        bien: "Proyector Epson",
        cantidadBienes: 1,
        departamentoOrigen: "Audiovisuales",
        departamentoDestino: "Sala de Reuniones",
        responsable: "Ana Gómez",
        observaciones: "Mantenimiento de equipos"
    },

];

export default function TransferPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [transfers] = useState<Transfer[]>(initialTransfers);
    const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(initialTransfers);

    const handleDateFilter = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        applyFilters(searchQuery, start, end);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters(query, startDate, endDate);
    };

    const applyFilters = (query: string, start: string, end: string) => {
        let filtered = [...transfers];

        if (start) {
            filtered = filtered.filter((item) => new Date(item.fecha) >= new Date(start));
        }
        if (end) {
            filtered = filtered.filter((item) => new Date(item.fecha) <= new Date(end));
        }
        if (query) {
            filtered = filtered.filter((item) =>
                item.bien.toLowerCase().includes(query.toLowerCase()) ||
                item.departamentoOrigen.toLowerCase().includes(query.toLowerCase()) ||
                item.departamentoDestino.toLowerCase().includes(query.toLowerCase()) ||
                item.responsable.toLowerCase().includes(query.toLowerCase()) ||
                (item.observaciones && item.observaciones.toLowerCase().includes(query.toLowerCase()))
            );
        }
        setFilteredTransfers(filtered);
    };
    const cardBg = useColorModeValue("white", "gray.700")
    const headerBg = useColorModeValue("gray.50", "gray.800")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const hoverBg = useColorModeValue("gray.50", "gray.700")
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mx="auto" py={10}>
            <Card className='mt-6'>
                <CardHeader>
                    <Heading size="lg" fontWeight="bold" color={'type.title'}>
                        Historial de Traslados
                    </Heading>
                    <p className="text-muted-foreground">
                        Registro completo de movimientos, incorporaciones y desincorporaciones de bienes
                    </p>
                </CardHeader>
                <CardBody>
                    <Flex direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "stretch", md: "center" }}
                        mb={6}
                        gap={4}>
                        <HStack spacing={4} flex={{ md: 2 }}>
                            <InputGroup maxW={{ md: "320px" }}>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Buscar por ID, nombre o descripción"
                                    variant="outline"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
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
                                    value={startDate}
                                    onChange={(e) => handleDateFilter(e.target.value, endDate)}
                                    placeholder="Fecha inicial"
                                />
                                <Box>a</Box>
                                <Input
                                    type="date"
                                    size="md"
                                    value={endDate}
                                    onChange={(e) => handleDateFilter(startDate, e.target.value)}
                                    placeholder="Fecha final"
                                />
                                {(startDate || endDate) && (
                                    <Button size="sm" variant="ghost" onClick={() => handleDateFilter("", "")}>
                                        Limpiar
                                    </Button>
                                )}
                            </Flex>
                        </HStack>
                    </Flex>
                    <TableContainer
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        boxShadow="sm"
                        overflow="auto"
                        mb={4}
                    >
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
                                {filteredTransfers.map((item) => (
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
                                                    <Icon as={BsBoxes as React.ElementType} />

                                                </Box>
                                                <Box>
                                                    <Text fontWeight="medium">{`${item.id}`}</Text>
                                                </Box>
                                            </Flex></Td>
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
                                                        icon={<Icon as={FiMoreVertical as React.ElementType} />}
                                                        variant="ghost"
                                                        size="sm"
                                                    />
                                                    <MenuList>
                                                        <MenuItem icon={<Icon as={FiArchive as React.ElementType} />} onClick={() => { setSelectedTransfer(item); onOpen() }} >Más Detalles</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {filteredTransfers.length === 0 && (
                        <Text color="gray.400" textAlign="center" mt={4}>
                            No se encontraron traspasos para los filtros seleccionados.
                        </Text>
                    )}

                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        scrollBehavior="inside"
                        motionPreset="slideInBottom"
                        size="lg"
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize="xl" fontWeight="bold" color={textColor} mb="10px">
                                Detalles Traslado
                                <HSeparator my="5px" />
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl id="id" isRequired>
                                        <FormLabel fontSize="sm">ID</FormLabel>
                                        <Input type="text" value={selectedTransfer?.id || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="fecha" isRequired>
                                        <FormLabel fontSize="sm">Fecha</FormLabel>
                                        <Input type="date" value={selectedTransfer?.fecha || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="responsable" isRequired>
                                        <FormLabel fontSize="sm">Responsable</FormLabel>
                                        <Input type="text" value={selectedTransfer?.responsable || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="origen" isRequired>
                                        <FormLabel fontSize="sm">Departamento Origen</FormLabel>
                                        <Input type="text" value={selectedTransfer?.departamentoOrigen || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="destino" isRequired>
                                        <FormLabel fontSize="sm">Departamento Destino</FormLabel>
                                        <Input type="text" value={selectedTransfer?.departamentoDestino || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="cantidadBienes" isRequired>
                                        <FormLabel fontSize="sm">Cantidad de Bienes</FormLabel>
                                        <Input type="text" value={selectedTransfer?.cantidadBienes?.toString() || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="bien" isRequired>
                                        <FormLabel fontSize="sm">Bien</FormLabel>
                                        <Textarea value={selectedTransfer?.bien || ""} isDisabled />
                                    </FormControl>
                                    <FormControl id="observaciones">
                                        <FormLabel fontSize="sm">Observaciones</FormLabel>
                                        <Textarea value={selectedTransfer?.observaciones || ""} isDisabled />
                                    </FormControl>
                                </SimpleGrid>
                            </ModalBody>
                            <ModalFooter>

                                <Flex justify="center" gap={2}>
                                    <Button
                                        aria-label="Editar usuario"
                                        leftIcon={<Icon as={FiEdit as React.ElementType} />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                    >Editar</Button>
                                    <Button
                                        aria-label="Eliminar usuario"
                                        leftIcon={<Icon as={FiTrash2 as React.ElementType} />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                    > Eliminar</Button>
                                </Flex>

                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </CardBody>


            </Card>
        </Box>
    );
}