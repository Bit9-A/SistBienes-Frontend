import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import ReactApexChart from 'react-apexcharts';
import { getDashboardCountsByDepartment, DashboardCountsByDepartment } from '../../../../api/DashboardApi';
import React, { useEffect, useState } from 'react';

const BarChart = () => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const [counts, setCounts] = useState<DashboardCountsByDepartment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await getDashboardCountsByDepartment();
                setCounts(response);
            } catch (error) {
                console.error('Error fetching dashboard counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const chartLabels = counts.map(item => item.dept_nombre);
    const chartData = counts.map(item => Number(item.total_valor));


    const chartOptions = {
        chart: {
            type: 'bar' as const,
            toolbar: {
                show: true, export: {
                    csv: {
                        filename: "ColumnChart"
                    },
                    svg: {
                        filename: "ColumnChart"
                    },
                    png: {
                        filename: "ColumnChart"
                    }
                },
                tools: { download: true }
            },
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
        colors: ['#22c55e', '#f59e42', '#3b82f6', '#ef4444', '#c421a1', '#21c4c2', '#b9c421', '#f3c421', '#c421f3', '#21f3c4', '#f321c4', '#c4f321'
            , '#c42121', '#5a21c4', '#ffdb70', '#c42170', '#c47021', '#24c421', '#2193c4', '#c2c421', '#33cdeb', '#2e81c9', '#ee6f93',
            '#61a152', '#d2a82d', '#7321c4', '#0059ae', '#c4bf21', '#484333', '#a3a3a3'],
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
            categories: chartLabels,
            title: { text: "Departamento" }
        },
        yaxis: {
            title: { text: "Valor Total" }
        },
        grid: {
            borderColor: useColorModeValue('#E5E7EB', '#2D3748'),
        },
    };

    const series = [
        {
            name: 'Valor Total',
            data: chartData
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
            </Flex>
            <Box w="100%" h="220px">
                <ReactApexChart options={chartOptions} series={series} type="bar" height={220} />
            </Box>
        </Card>
    );
};

export default BarChart;