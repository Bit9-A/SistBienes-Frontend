import { Box, Flex, Text, useColorModeValue, } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getDashboardCountsForMonth, DashboardCountsForMonth } from '../../../../api/DashboardApi';

// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
// Assets
import { lineChartOptionsTotalSpent } from 'variables/charts';

export default function TotalSpent(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const [counts, setCounts] = useState<DashboardCountsForMonth[]>([]);
	const [loading, setLoading] = useState(true);


	// Fetch API
	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const response = await getDashboardCountsForMonth();
				setCounts(response);
			} catch (error) {
				console.error('Error fetching dashboard counts:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCounts();
	}, []);

	// Prepara los datos para el gráfico
	const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
	const dataByMonth = Array(12).fill(0);

	counts.forEach(item => {
		dataByMonth[item.mes - 1] = Number(item.total_muebles);
	});


	const lineChartDataTotalSpent = [
		{
			name: 'Adquisiciones Por Mes',
			data: dataByMonth
		}
	];

	const chartOptions = {
		...lineChartOptionsTotalSpent,
		xaxis: {
			...lineChartOptionsTotalSpent.xaxis,
			categories: months
		}
	};



	return (
		<Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px' {...rest}>
			<Flex w='100%' flexDirection={{ base: 'column', lg: 'row' }}>
				<Flex flexDirection='column' me='20px' mt='28px'>
					<Text color={textColor} fontSize='34px' textAlign='start' fontWeight='700' lineHeight='100%'>
						{dataByMonth.reduce((acum, value) => acum + value, 0)}
					</Text>
					<Flex align='center' mb='20px'>
						<Text color='secondaryGray.600' fontSize='sm' fontWeight='500' mt='4px' me='12px'>
							Adquisiones En el Año
						</Text>
					</Flex>
				</Flex>
				<Box minH='260px' minW='75%' mt='auto'>
					<LineChart chartData={lineChartDataTotalSpent} chartOptions={chartOptions} />
				</Box>
			</Flex>
		</Card>
	);
}
