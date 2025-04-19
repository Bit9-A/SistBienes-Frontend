/* eslint-disable */
// Chakra Imports
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

export default function AdminNavbar(props: {
	secondary: boolean;
	message: string|boolean;
	brandText: string;
	logoText: string;
	fixed: boolean;
	toggleSidebar: boolean;
	onOpen: (...args: any[]) => any;
}) {
	const [ scrolled, setScrolled ] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, brandText, toggleSidebar } = props;
	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('#fff', 'white');
	let secondaryText = useColorModeValue('#fff', 'white');
	let navbarPosition = 'fixed' as const;
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('#310493','#310493');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};
	
	;
  // Aquí ajustamos dinámicamente el ancho y margen de la Navbar
  const navbarWidth = toggleSidebar
    ?{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      } 
    : { base: 'calc(100vw - 8%)',
		 xl: 'calc(100vw - 8%)' }

  const navbarMarginLeft = toggleSidebar ? '0px' : '300px'; // Ajustar margen izquierdo


	return (
		<Box
		  position="fixed"
		  boxShadow="none"
		  bg={useColorModeValue('#310493', '#310493')}
		  borderColor="transparent"
		  filter="none"
		  backdropFilter="blur(20px)"
		  backgroundPosition="center"
		  backgroundSize="cover"
		  borderRadius="16px"
		  borderWidth="1.5px"
		  borderStyle="solid"
		  transition="all 0.3s ease"
		  alignItems={{ xl: 'center' }}
		  display={secondary ? 'block' : 'flex'}
		  minH="75px"
		  justifyContent={{ xl: 'center' }}
		  lineHeight="25.6px"
		  mx="auto"
		  mt="0px"
		  pb="8px"
		  right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
		  px={{
			sm: '15px',
			md: '10px',
		  }}
		  ps={{
			xl: '12px',
		  }}
		  pt="8px"
		  top={{ base: '12px', md: '16px', xl: '18px' }}
		  w={navbarWidth} // Ancho dinámico
		  ml={navbarMarginLeft} // Margen dinámico
		>
		  <Flex
			w="100%"
			flexDirection={{
			  sm: 'column',
			  md: 'row',
			}}
			alignItems={{ xl: 'center' }}
			mb="0px"
		  >
			<Box mb={{ sm: '8px', md: '0px' }}>
			  <Breadcrumb>
				<BreadcrumbItem color="white" fontSize="sm" mb="5px">
				  <BreadcrumbLink href="#" color="white">
					Pages
				  </BreadcrumbLink>
				</BreadcrumbItem>
	
				<BreadcrumbItem color="white" fontSize="sm">
				  <BreadcrumbLink href="#" color="white">
					{brandText}
				  </BreadcrumbLink>
				</BreadcrumbItem>
			  </Breadcrumb>
			  <Link
				color="white"
				href="#"
				bg="inherit"
				borderRadius="inherit"
				fontWeight="bold"
				fontSize="34px"
				_hover={{ color: 'white' }}
				_active={{
				  bg: 'inherit',
				  transform: 'none',
				  borderColor: 'transparent',
				}}
				_focus={{
				  boxShadow: 'none',
				}}
			  >
				{brandText}
			  </Link>
			</Box>
			<Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
			  <AdminNavbarLinks
				onOpen={props.onOpen}
				secondary={props.secondary}
				fixed={props.fixed}
			  />
			</Box>
		  </Flex>
		</Box>
	  );
}
