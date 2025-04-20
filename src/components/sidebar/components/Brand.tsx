// Chakra imports
import { Flex, Icon, useColorModeValue, Image, Text } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
import BannerAlcadia from 'assets/img/banner.png';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('white', 'white');
	let textColor = useColorModeValue('white', 'white');
	let titleDepartament= "";

	return (
		<>
		<Flex alignItems='center' flexDirection='column' bgColor={'#310493'}>
			<Image src={BannerAlcadia}></Image>
			<Text fontFamily={'Roboto'} fontSize={'2xl'} textAlign={'center'} color={textColor}>{titleDepartament}</Text>
			<HSeparator mb='20px' />
		</Flex>
		</>
	);
}

export default SidebarBrand;
