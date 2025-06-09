import { Box, Flex, Text, useColorModeValue, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FiDownload, FiMoreVertical } from 'react-icons/fi';
import { getDashboardCountsFurniture, DashboardCountsFurniture } from '../../../../api/DashboardApi';
import React, { useEffect, useState } from 'react';

import Card from 'components/card/Card';


const estadoColors: Record<string, string> = {
    'Nuevo': '#22c55e',
    'Usado': '#f59e42',
    'Dañado': '#ef4444',
};


const BarChart = () => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgBar = useColorModeValue('gray.200', 'whiteAlpha.200');
    const [counts, setCounts] = useState<DashboardCountsFurniture[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await getDashboardCountsFurniture();
                setCounts(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching dashboard counts:', error);
                setCounts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    if (loading) return <Text>Cargando...</Text>;

    const maxValue = counts.length > 0 ? Math.max(...counts.map(e => Number(e.total))) : 1;


    const handleDownload = () => {
        alert('Descargar imagen no implementado');
    };

    return (
        <Card p="24px" w="100%">
            {/* Toolbar personalizada */}
            <Flex justify="space-between" align="center" mb="4">
                <Box>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        Resumen de Bienes
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Distribución por estado
                    </Text>
                </Box>
                <Flex gap={2}>
                    <Menu>
                        <MenuButton as={IconButton} icon={<FiMoreVertical />} size="sm" variant="ghost" />
                        <MenuList>
                            <MenuItem icon={<FiDownload />}
                                onClick={handleDownload}>Descargar</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Box>
                {counts.map((estado) => (
                    <Flex align="center" mb="4" key={estado.nombre}>
                        <Box
                            h="10px"
                            w="10px"
                            borderRadius="full"
                            bg={estadoColors[estado.nombre] || '#888'}
                            mr="2"
                        />
                        <Text fontWeight="600" fontSize="sm" color={textColor} minW="140px" mr="2">
                            {estado.nombre}
                        </Text>
                        <Box flex="1" mx="2">
                            <Box
                                h="8px"
                                borderRadius="md"
                                bg={bgBar}
                                position="relative"
                                overflow="hidden"
                            >
                                <Box
                                    h="8px"
                                    borderRadius="md"
                                    bg={estadoColors[estado.nombre] || '#888'}
                                    width={`${(Number(estado.total) / maxValue) * 100}%`}
                                    transition="width 0.5s"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                />
                            </Box>
                        </Box>
                        <Text fontWeight="700" fontSize="sm" color={textColor} minW="32px" ml="2">
                            {estado.total}
                        </Text>
                    </Flex>
                ))}
            </Box>
        </Card>
    );
};

export default BarChart;