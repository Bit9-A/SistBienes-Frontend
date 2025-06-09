// Chakra imports
import { Avatar, Box, Flex, FormLabel, Icon, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
//Data Api
import { DashboardCountsTotal, getDashboardTotal, DashboardCountsLastWeek, getDashboardCountsLastWeek } from '../../../api/DashboardApi';
// Custom components
import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdFileCopy } from 'react-icons/md';
import PieCard from 'views/admin/default/components/PieCard';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import BarChart from "views/admin/default/components/BarChart";
import ColumnChart from 'views/admin/default/components/ColummChart';
// Data MiniStatistics

export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const [counts, setCounts] = useState<DashboardCountsTotal[]>([]);
	const [lastweekCounts, setLastweekCounts] = useState<DashboardCountsLastWeek[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const response = await getDashboardTotal();
				setCounts(Array.isArray(response) ? response : []);
				const lastWeekResponse = await getDashboardCountsLastWeek();
				setLastweekCounts(Array.isArray(lastWeekResponse) ? lastWeekResponse : []);
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
	return (
		<Box pt={{ base: '130px', md: '90px', xl: '90px' }}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px'>
				<BarChart />
				<PieCard />
				<MiniCalendar h='100%' minW='100%' selectRange={false} />
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdFileCopy as React.ElementType} color={brandColor} />}
						/>
					}
					name='Total Bienes'
					value={counts.length > 0 ? counts[0].suma_cantidad : '0'}
				/>
				<div />
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdFileCopy as React.ElementType} color={brandColor} />}
						/>
					}
					name='Bines Registrados en la última semana'
					value={lastweekCounts.length > 0 ? lastweekCounts[0].ultimaSemana : '0'}
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
				<TotalSpent />
				<ColumnChart />
			</SimpleGrid>
		</Box>
	);
}
