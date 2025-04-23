import { Box, Flex, Text, Select, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import ReactApexChart from 'react-apexcharts';

const estados = [
    { label: 'Bienes', color: '#22c55e', value: 25000 },
    { label: 'Prensa', color: '#f59e42', value: 18500 },
    { label: 'Sistemas', color: '#3b82f6', value: 42000 },
    { label: 'Talento Humano', color: '#ef4444', value: 12000 },
];

const BarChart = () => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const cardColor = useColorModeValue('white', 'navy.700');

    const options = {
        chart: {
            type: 'bar' as const,
            toolbar: { show: true },
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end' as const,
                columnWidth: '60%',
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: estados.map(e => e.label),
            labels: {
                style: {
                    colors: estados.map(e => e.color),
                    fontWeight: 700,
                    fontSize: '14px',
                },
            },
        },
        colors: estados.map(e => e.color),
        yaxis: {
            labels: {
                style: {
                    colors: [textColor],
                },
            },
        },
        grid: {
            borderColor: useColorModeValue('#E5E7EB', '#2D3748'),
        },
    };

    const series = [
        {
            name: 'Valor Total',
            data: estados.map(e => e.value),
        },
    ];

    return (
        <Card p='20px' alignItems='center' flexDirection='column' w='100%'>
            <Flex
                px={{ base: '0px', '2xl': '10px' }}
                justifyContent='space-between'
                alignItems='center'
                w='100%'
                mb='8px'
            >
                <Box>
                    <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
                        Valor Total
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Valor de activos por departamento
                    </Text>
                </Box>
                <Select fontSize='sm' variant='subtle' defaultValue='monthly' width='unset' fontWeight='700'>
                    <option value='monthly'>Mensual</option>
                    <option value='yearly'>Anual</option>
                </Select>
            </Flex>
            <Box w="100%" h="220px">
                <ReactApexChart options={options} series={series} type="bar" height={220} />
            </Box>
        </Card>
    );
};

export default BarChart;