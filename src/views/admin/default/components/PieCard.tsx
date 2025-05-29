// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from '@chakra-ui/react';
import { getDashboardCounts, DashboardCounts } from '../../../../api/DashboardApi'
import React, { useEffect, useState } from 'react';

// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { pieChartOptions } from 'variables/charts';
import { VSeparator } from 'components/separator/Separator';

export default function Conversion(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');
	const [counts, setCounts] = useState<DashboardCounts | null>(null);


	const fetchCounts = async () => {
		try {
			const data = await getDashboardCounts();
			setCounts(data);
		} catch (error) {
			console.error("Error fetching dashboard counts:", error);
		}
	}

	useEffect(() => {
		fetchCounts();
	}, []);

	if (!counts) {
		return (
			<Card p='20px' alignItems='center' flexDirection='column' w='100%' {...rest}>
				<Text>Cargando datos...</Text>
			</Card>
		);
	}
	const pieChartData = [
		Number(counts?.equiposInformaticos || 0),
		Number(counts?.mobiliarios || 25),
		Number(counts?.vehiculos || 30),
		Number(counts?.equiposOficina || 10),
		Number(counts?.audiovisuales || 5)
	];
	const total = pieChartData.reduce((acc, val) => acc + val, 0);

	const percent = (value: number) => total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';

	return (
		<Card p='20px' alignItems='center' flexDirection='column' w='100%' {...rest}>
			<Flex
				px={{ base: '0px', '2xl': '10px' }}
				justifyContent='space-between'
				alignItems='center'
				w='100%'
				mb='8px'>
				<Box>
					<Text fontSize="xl" fontWeight="bold" color={'type.title'}>
						Distribución por Categoría
					</Text>
					<Text fontSize="sm" color="gray.500">
						Porcentaje de bienes por tipo
					</Text>
				</Box>
				<Select fontSize='sm' variant='subtle' defaultValue='monthly' width='unset' fontWeight='700'>
					<option value='monthly'>Monthly</option>
					<option value='yearly'>Yearly</option>
				</Select>
			</Flex>

			<PieChart h='100%' w='100%' chartData={pieChartData} chartOptions={pieChartOptions} />
			<Card
				bg={cardColor}
				flexDirection='row'
				w='100%'
				p='15px'
				px='20px'
				mt='15px'
				mx='auto'
			>
				<Flex direction="row" align="center" justify="space-between" w="100%" wrap="wrap">
					{/* Equipos Informáticos */}
					<Flex direction='column' py='5px' align="center" flex="1" minW="120px" maxW="180px">
						<Flex align='center'>
							<Box h='8px' w='8px' bg='#47a7f5' borderRadius='50%' me='4px' />
							<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' isTruncated>
								Equipos Informáticos
							</Text>
						</Flex>
						<Text fontSize='lg' color={textColor} fontWeight='700'>
							{percent(counts?.equiposInformaticos || 0)}
						</Text>
					</Flex>
					<VSeparator mx={{ base: '10px', xl: '20px', '2xl': '30px' }} />

					{/* Mobiliario */}
					<Flex direction='column' py='5px' align="center" flex="1" minW="100px" maxW="140px">
						<Flex align='center'>
							<Box h='8px' w='8px' bg='#f176a0' borderRadius='50%' me='4px' />
							<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' isTruncated>
								Mobiliario
							</Text>
						</Flex>
						<Text fontSize='lg' color={textColor} fontWeight='700'>
							{percent(counts?.mobiliarios || 0)}
						</Text>
					</Flex>
					<VSeparator mx={{ base: '10px', xl: '20px', '2xl': '30px' }} />

					{/* Vehículos */}
					<Flex direction='column' py='5px' align="center" flex="1" minW="100px" maxW="140px">
						<Flex align='center'>
							<Box h='8px' w='8px' bg='#87cb80' borderRadius='50%' me='4px' />
							<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' isTruncated>
								Vehículos
							</Text>
						</Flex>
						<Text fontSize='lg' color={textColor} fontWeight='700'>
							{percent(counts?.vehiculos || 0)}
						</Text>
					</Flex>
					<VSeparator mx={{ base: '10px', xl: '20px', '2xl': '30px' }} />

					{/* Equipos de Oficina */}
					<Flex direction='column' py='5px' align="center" flex="1" minW="120px" maxW="160px">
						<Flex align='center'>
							<Box h='8px' w='8px' bg='#ffcd36' borderRadius='50%' me='4px' />
							<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' isTruncated>
								Equipos de Oficina
							</Text>
						</Flex>
						<Text fontSize='lg' color={textColor} fontWeight='700'>
							{percent(counts?.equiposOficina || 0)}
						</Text>
					</Flex>
					<VSeparator mx={{ base: '10px', xl: '20px', '2xl': '30px' }} />

					{/* Audiovisuales */}
					<Flex direction='column' py='5px' align="center" flex="1" minW="100px" maxW="140px">
						<Flex align='center'>
							<Box h='8px' w='8px' bg='#00dafc' borderRadius='50%' me='4px' />
							<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' isTruncated>
								Audiovisuales
							</Text>
						</Flex>
						<Text fontSize='lg' color={textColor} fontWeight='700'>
							{percent(counts?.audiovisuales || 0)}
						</Text>
					</Flex>
				</Flex>
			</Card>
		</Card>
	);
}
