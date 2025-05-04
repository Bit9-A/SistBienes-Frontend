import React from 'react';
import { useState } from 'react';
// chakra imports
import {
	IconButton,
	Box,
	Flex,
	Drawer,
	DrawerBody,
	Icon,
	useColorModeValue,
	DrawerOverlay,
	useDisclosure,
	DrawerContent,
	DrawerCloseButton
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import { renderThumb, renderTrack, renderView } from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { IoMenu, IoClose } from 'react-icons/io5';

// Assets
import { IoMenuOutline } from 'react-icons/io5';

function Sidebar(props: { routes: RoutesType[]; setToggleSidebar: (value: boolean) => void }) {
	const { routes, setToggleSidebar } = props;
  
	const [isOpen, setIsOpen] = useState(false); // Estado interno del Sidebar
  
	const sidebarBg = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	const buttonBg = useColorModeValue('type.primary', 'type.primary'); // Color del botón
  
	const toggleSidebar = () => {
	  const newState = !isOpen;
	  setIsOpen(newState);
	  setToggleSidebar(newState); // Actualiza el estado global del Sidebar
	};
  
	return (
	  <Flex display={{ base: 'none', lg: 'flex' }}> {/* Ocultar en pantallas pequeñas */}
		{/* Botón para abrir el sidebar */}
		{!isOpen && (
		  <IconButton
			aria-label="Open Sidebar"
			icon={<Icon as={IoMenu as React.ElementType} />}
			onClick={toggleSidebar}
			bg={buttonBg}
			color="white"
			position="fixed"
			top="20px"
			left="20px"
			zIndex="1000"
			_hover={{ bg: 'gray.600' }}
		  />
		)}
  
		{/* Sidebar */}
		<Box
		  bg={sidebarBg}
		  transition="width 0.3s ease"
		  w={isOpen ? '300px' : '0px'}
		  h="100vh"
		  overflow="hidden"
		  boxShadow={shadow}
		  position="fixed"
		  zIndex="999"
		>
		  {isOpen && (
			<>
			  <Scrollbars
				autoHide
				renderTrackVertical={renderTrack}
				renderThumbVertical={renderThumb}
				renderView={renderView}
			  >
				<Content routes={routes} />
			  </Scrollbars>
  
			  {/* Botón para cerrar el sidebar */}
			  <IconButton
				aria-label="Close Sidebar"
				icon={<Icon as={IoClose as React.ElementType} />}
				onClick={toggleSidebar}
				bg={buttonBg}
				color="white"
				position="absolute"
				bottom="20px"
				left="50%"
				transform="translateX(-50%)"
				zIndex="1000"
				_hover={{ bg: 'gray.600' }}
			  />
			</>
		  )}
		</Box>
	  </Flex>
	);
  }
  

  


// FUNCTIONS
export function SidebarResponsive(props: { routes: RoutesType[] }) {
	let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	let menuColor = useColorModeValue('gray.400', 'white');
	// // SIDEBAR
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	const { routes } = props;
	// let isWindows = navigator.platform.startsWith("Win");
	//  BRAND

	return (
		<Flex display={{ sm: 'flex', xl: 'none' }} alignItems='center'>
			<Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
				<Icon
					as={IoMenuOutline  as React.ElementType}
					color={menuColor}
					my='auto'
					w='20px'
					h='20px'
					me='10px'
					_hover={{ cursor: 'pointer' }}
				/>
			</Flex>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
				finalFocusRef={btnRef}>
				<DrawerOverlay />
				<DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
					<DrawerCloseButton
						zIndex='3'
						onClick={onClose}
						_focus={{ boxShadow: 'none' }}
						_hover={{ boxShadow: 'none' }}
					/>
					<DrawerBody maxW='285px' px='0rem' pb='0'>
						<Scrollbars
							autoHide
							renderTrackVertical={renderTrack}
							renderThumbVertical={renderThumb}
							renderView={renderView}>
							<Content routes={routes} />
						</Scrollbars>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}
// PROPS

export default Sidebar;
