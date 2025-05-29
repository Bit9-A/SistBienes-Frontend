// Chakra imports
import { Avatar, Box, Flex, FormLabel, Icon, Select, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
//Data Api

// Custom components
import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdFileCopy } from 'react-icons/md';
import PieCard from 'views/admin/default/components/PieCard';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import BarChart from "views/admin/default/components/BarChart";
import ColumnChart from 'views/admin/default/components/ColummChart';
export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
					value='2935'
				/>
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
					value='7'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdFileCopy as React.ElementType} color={brandColor} />}
						/>
					}
					name='Personas Conectadas'
					value='8'
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
				<TotalSpent />
				<ColumnChart />
			</SimpleGrid>
		</Box>
	);
}
