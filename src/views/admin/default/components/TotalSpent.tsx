// Chakra imports
import { Box, Flex, Text, useColorModeValue, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Icon } from '@chakra-ui/react';

// Custom components
import { FiDownload, FiFilter, FiMoreVertical } from 'react-icons/fi';
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { lineChartDataTotalSpent, lineChartOptionsTotalSpent } from 'variables/charts';

export default function TotalSpent(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

	const handleDownload = () => {
		alert('Descargar imagen no implementado');
	};

	return (
		<Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px' {...rest}>
			<Flex align='center' justify='space-between' w='100%' pe='20px' pt='5px'>
				<Button bg={boxBg} fontSize='sm' fontWeight='500' color={textColorSecondary} borderRadius='7px'>
					<Icon as={MdOutlineCalendarToday as React.ElementType} color={textColorSecondary} me='4px' />
					This month
				</Button>
				<Flex gap={2}>
					<Menu>
						<MenuButton as={IconButton} icon={<FiMoreVertical />} size="sm" variant="ghost" />
						<MenuList>
							<MenuItem icon={<FiDownload />}
								onClick={handleDownload}>Descargar
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</Flex>
			<Flex w='100%' flexDirection={{ base: 'column', lg: 'row' }}>
				<Flex flexDirection='column' me='20px' mt='28px'>
					<Text color={textColor} fontSize='34px' textAlign='start' fontWeight='700' lineHeight='100%'>
						13
					</Text>
					<Flex align='center' mb='20px'>
						<Text color='secondaryGray.600' fontSize='sm' fontWeight='500' mt='4px' me='12px'>
							Adquisiones Ultimo Mes
						</Text>
					</Flex>
				</Flex>
				<Box minH='260px' minW='75%' mt='auto'>
					<LineChart chartData={lineChartDataTotalSpent} chartOptions={lineChartOptionsTotalSpent} />
				</Box>
			</Flex>
		</Card>
	);
}
