import { Box, Flex, Text, Select, useColorModeValue } from '@chakra-ui/react';
import { getDashboardCounts, DashboardCounts } from '../../../../api/DashboardApi';
import React, { useEffect, useState } from 'react';

// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { pieChartOptions } from 'variables/charts';

export default function Conversion(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra UI - colores
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');

	// Estado
	const [counts, setCounts] = useState<DashboardCounts[]>([]);

	// Fetch API
	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const response = await getDashboardCounts();
				setCounts(response);
			} catch (error) {
				console.error('Error fetching dashboard counts:', error);
			}
		};

		fetchCounts();
	}, []);

	// Filtrado y formato
	const filteredCounts = counts
		.filter((item) => Number(item.total) > 0)
		.map((item) => ({
			label: item.nombre,
			value: Number(item.total),
		}));

	const pieChartData = filteredCounts.map((item) => item.value);
	const pieChartLabels = filteredCounts.map((item) => item.label);

	const colors = [
		'#47a7f5', '#f176a0', '#87cb80', '#ffcd36', '#00dafc', '#6ea1ff', '#fa9cb9', '#a9d99a', '#ffdb70', '#33cdeb', '#2e81c9', '#ee6f93',
		'#61a152', '#d2a82d'];

	const percent = (value: number) => {
		const total = filteredCounts.reduce((acc, item) => acc + item.value, 0);
		return total > 0 ? `${Math.round((value / total) * 100).toFixed(1)}%` : '0%';
	};

	return (
		<Card p='20px' alignItems='center' flexDirection='column' w='100%' {...rest}>
			{/* Header */}
			<Flex
				px={{ base: '0px', '2xl': '10px' }}
				justifyContent='space-between'
				alignItems='center'
				w='100%'
				mb='8px'>
				<Box>
					<Text fontSize="xl" fontWeight="bold" color='type.title'>
						Bienes por Concepto de Movimiento
					</Text>
					<Text fontSize="sm" color="gray.500">
						Distribución porcentual por categoría
					</Text>
				</Box>
				<Select fontSize='sm' variant='subtle' defaultValue='monthly' width='unset' fontWeight='700'>
					<option value='monthly'>Mensual</option>
					<option value='yearly'>Anual</option>
				</Select>
			</Flex>

			{/* PieChart */}
			<PieChart
				h='100%'
				w='100%'
				chartData={pieChartData}
				chartOptions={{
					...pieChartOptions,
					labels: pieChartLabels,
					colors: colors,
					legend: { show: false },
				}}
			/>
			{/* Tarjeta de leyenda */}
			<Card
				bg={cardColor}
				flexDirection='row'
				w='100%'
				p='15px'
				px='20px'
				mt='15px'
				mx='auto'>
				<Flex
					wrap="wrap"
					justify="center"
					gap="20px"
					w="100%">
					{filteredCounts.map((item, index) => (
						<Flex
							key={index}
							direction='column'
							align='center'
							textAlign="center"
							maxW="160px"
							minW="120px"
							flex="1 1 120px"
							mb="10px"
						>
							<Flex align='center' mb='5px'>
								<Box
									h='8px'
									w='8px'
									bg={colors[index % colors.length]}
									borderRadius='50%'
									me='4px'
									flexShrink={0}
								/>
								<Text
									fontSize='xs'
									color='secondaryGray.600'
									fontWeight='700'
									isTruncated
									maxW="120px"
									title={item.label}
								>
									{item.label}
								</Text>
							</Flex>
							<Text fontSize='lg' color={textColor} fontWeight='700'>
								{percent(item.value)}
							</Text>
						</Flex>
					))}
				</Flex>
			</Card>
		</Card>
	);
}
