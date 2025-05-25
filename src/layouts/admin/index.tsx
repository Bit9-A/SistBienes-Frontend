// Chakra imports
import { Portal, Box, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Route } from 'react-router-dom';
import routes, { getFilteredRoutes } from '../../routes';
import { getProfile, UserProfile } from '../../api/UserApi';

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props;
  
  // Obtener el estado inicial del sidebar desde localStorage
  const getInitialSidebarState = () => {
    return true; // Siempre iniciará abierto
  };

  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(getInitialSidebarState());
  const [brandText, setBrandText] = useState('Default Brand Text');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Guardar el estado del sidebar en localStorage cuando cambie
  useEffect(() => {
    if (!toggleSidebar) {
      setToggleSidebar(true); // Forzar que siempre esté abierto al inicio
    }
    localStorage.setItem('sidebarState', JSON.stringify(true));
  }, []);

  // Función personalizada para manejar el toggle del sidebar
  const handleToggleSidebar = (value: boolean) => {
    setToggleSidebar(value);
    localStorage.setItem('sidebarState', JSON.stringify(value));
  };

  // Obtener el perfil del usuario
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        // Si hay error de autenticación, redirigir al login
        navigate('/auth/sign-in', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Verificar si el usuario es administrador (tipo_usuario === 1)
  const isAdmin = () => {
    return userProfile?.tipo_usuario === 1;
  };

  // Obtener las rutas filtradas según el rol
  const filteredRoutes = getFilteredRoutes(isAdmin());

  // Actualizar el título de la página basado en la ruta actual
  useEffect(() => {
    const currentRoute = routes.find(
      route => location.pathname === route.layout + route.path
    );
    if (currentRoute) {
      setBrandText(currentRoute.name);
    }
  }, [location.pathname]);

  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname === routes[i].layout + routes[i].path) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary ?? false;
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === '/admin') {
        return <Route path={`${route.path}`} element={route.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = 'ltr';

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  // Si no hay perfil de usuario, no renderizar nada
  if (!userProfile) {
    return null;
  }

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar
        }}
      >
        <Sidebar routes={filteredRoutes} setToggleSidebar={handleToggleSidebar} {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{
            base: '100%',
            xl: toggleSidebar ? 'calc(100% - 300px)' : '100%',
          }}
          ml={{
            base: '0px',
            xl: toggleSidebar ? '300px' : '0px',
          }}
          transition="all 0.3s ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={useDisclosure().onOpen}
                logoText={''}
                brandText={brandText}
                secondary={false}
                message={brandText}
                fixed={fixed}
                toggleSidebar={toggleSidebar}
                user={userProfile}
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
              <Outlet />
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
