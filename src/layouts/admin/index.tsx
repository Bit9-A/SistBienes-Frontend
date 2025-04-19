// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes';

import { useLocation } from 'react-router-dom'; // Importar useLocation

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [brandText, setBrandText] = useState('Default Brand Text'); // Estado para brandText
  const location = useLocation(); // Hook para obtener la ubicación actual

  useEffect(() => {
    // Actualizar brandText cada vez que cambie la ubicación
    setBrandText(getActiveRoute(routes));
  }, [location, routes]); // Escuchar cambios en location y routes

  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (
        location.pathname ===
        routes[i].layout + routes[i].path // Comparar con la ruta actual
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
        return routes[i].secondary;
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
      if (route.layout === '/admin') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar
          routes={routes}
          setToggleSidebar={setToggleSidebar}
          {...rest}
        />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{
            base: '100%',
            xl: toggleSidebar ? 'calc(100% - 300px)' : '100%', // Ajustar ancho según el estado del sidebar
          }}
          ml={{
            base: '0px',
            xl: toggleSidebar ? '300px' : '0px', // Mover contenido a la derecha si el sidebar está abierto
          }}
          transition="all 0.3s ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={''}
                brandText={brandText}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                toggleSidebar={toggleSidebar} // Pasar el estado del sidebar
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
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </Box>
          ) : null}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
