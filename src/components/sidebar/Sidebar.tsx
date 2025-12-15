import React, { useState, useEffect } from 'react';
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

    const [isOpen, setIsOpen] = useState(true); // Estado inicial siempre abierto

    const sidebarBg = useColorModeValue('white', 'navy.800');
    const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
    const buttonBg = useColorModeValue('type.primary', 'type.primary'); // Color del botón

    useEffect(() => {
        setIsOpen(true); // Forzar que siempre esté abierto al inicio
        setToggleSidebar(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        setToggleSidebar(newState);
    };

    return (

        <Flex display={{ base: 'none', lg: 'flex' }}>
            {/* Botón para abrir el sidebar */}
            {!isOpen && (
                <Box
                    position="fixed"
                    top="5%"
                    left="0"
                    zIndex="1000"
                    bg={buttonBg}
                    borderTopRightRadius="md"
                    borderBottomRightRadius="md"
                    px="2"
                    py="4"
                    boxShadow="md"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    onClick={toggleSidebar}
                    _hover={{ bg: 'gray.600' }}
                    style={{ writingMode: 'vertical-rl', textAlign: 'center' }}
                >
                    <Icon as={IoMenu as React.ElementType} color="white" boxSize={6} mb={2} />
                    <Box color="white" fontWeight="bold" fontSize="sm" letterSpacing="wider">

                    </Box>
                </Box>
            )}

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
                        <IconButton
                            aria-label="Close Sidebar"
                            icon={<Icon as={IoClose as React.ElementType} />}
                            onClick={toggleSidebar}
                            bg={buttonBg}
                            color="white"
                            position="absolute"
                            size={"sm"}
                            top="5px"
                            right="5px"
                            zIndex="1000"
                            _hover={{ bg: 'gray.600' }}
                        />

                        {/* Contenido scrollable, con padding arriba para no tapar el botón */}
                        <Box
                            h="100vh"
                            maxH="100vh"
                            overflowY="auto"
                        >
                            <Scrollbars
                                autoHide
                                renderTrackVertical={renderTrack}
                                renderThumbVertical={renderThumb}
                                renderView={renderView}
                                style={{ height: '100vh' }}
                            >
                                <Content routes={routes} />
                            </Scrollbars>
                        </Box>
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
                    as={IoMenuOutline as React.ElementType}
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
                        color={menuColor}
                    />
                    <DrawerBody maxW='285px' px='0rem' pb='0' style={{ paddingTop: 0 }}>
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
