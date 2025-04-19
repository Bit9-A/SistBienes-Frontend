// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarRTL';
import Sidebar from 'components/sidebar/Sidebar';
import { RtlProvider } from 'components/rtlProvider/RtlProvider';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../../routes';

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/rtl/full-screen-maps';
  };
  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary ?? false;
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === '/rtl') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = 'rtl';
  const { onOpen } = useDisclosure();
  return (
    <RtlProvider>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} setToggleSidebar={setToggleSidebar} {...rest} />
  <Box
    float="right"
    minHeight="100vh"
    height="100%"
    overflow="auto"
    position="relative"
    maxHeight="100%"
    w={{
      base: '100%',
      xl: toggleSidebar ? '100%' : 'calc(100% - 300px)', // Ajustar ancho según el estado del sidebar
    }}
    ml={{
      base: '0px',
      xl: toggleSidebar ? '0px' : '300px', // Mover contenido a la derecha si el sidebar está abierto
    }}
    transition="all 0.3s ease"
  >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          {getRoute() ? (
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/rtl/default" replace />}
                />
              </Routes>
            </Box>
          ) : null}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </RtlProvider>
  );
}
