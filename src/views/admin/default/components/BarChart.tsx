import { Box, Flex, Text, useColorModeValue, IconButton, Menu, MenuButton, MenuList, MenuItem, Select } from '@chakra-ui/react';
import { FiDownload, FiFilter, FiMoreVertical } from 'react-icons/fi';
import Card from 'components/card/Card';

const estados = [
    { label: 'Activos', color: '#22c55e', value: 80 },
    { label: 'En mantenimiento', color: '#f59e42', value: 20 },
    { label: 'Dado de baja', color: '#ef4444', value: 5 },
];

const maxValue = Math.max(...estados.map(e => e.value));

const BarChart = () => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgBar = useColorModeValue('gray.200', 'whiteAlpha.200');


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
                {estados.map((estado) => (
                    <Flex align="center" mb="4" key={estado.label}>
                        <Box
                            h="10px"
                            w="10px"
                            borderRadius="full"
                            bg={estado.color}
                            mr="2"
                        />
                        <Text fontWeight="600" fontSize="sm" color={textColor} minW="140px" mr="2">
                            {estado.label}
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
                                    bg={estado.color}
                                    width={`${(estado.value / maxValue) * 100}%`}
                                    transition="width 0.5s"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                />
                            </Box>
                        </Box>
                        <Text fontWeight="700" fontSize="sm" color={textColor} minW="32px" ml="2">
                            {estado.value}
                        </Text>
                    </Flex>
                ))}
            </Box>
        </Card>
    );
};

export default BarChart;