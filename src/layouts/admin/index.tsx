// Chakra imports
import { Portal, Box, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import routes, { getFilteredRoutes } from '../../routes';
import { useLocation } from 'react-router-dom';
import { getProfile, UserProfile } from '../../api/UserApi';
import { jwtDecode } from 'jwt-decode';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';

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
  const [showSessionWarning, setShowSessionWarning] = useState(false);
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

        // Verificar la expiración del token
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData && userData.token) {
            const decodedToken: { exp: number } = jwtDecode(userData.token);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = decodedToken.exp - currentTime;

            if (timeLeft < 600 && timeLeft > 0) { // Menos de 10 minutos, pero no expirado
              setShowSessionWarning(true);
            } else {
              setShowSessionWarning(false);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        // Si hay error de autenticación, redirigir al login
        navigate('/auth/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Verificar si el usuario es administrador (tipo_usuario === 1)
  const isAdmin = () => {
    return userProfile && userProfile.nombre_tipo_usuario === "Administrador";
  };

  // Obtener las rutas filtradas según el rol
  const filteredRoutes = getFilteredRoutes(isAdmin());

  useEffect(() => {
    setBrandText(getActiveRoute(filteredRoutes));
  }, [location, filteredRoutes]);

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
          setToggleSidebar: handleToggleSidebar,
        }}
      >
        <Sidebar
          routes={filteredRoutes}
          setToggleSidebar={handleToggleSidebar}
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
                onOpen={onOpen}
                logoText={''}
                brandText={brandText}
                secondary={getActiveNavbar(filteredRoutes)}
                message={getActiveNavbarText(filteredRoutes)}
                fixed={fixed}
                toggleSidebar={toggleSidebar}
                user={userProfile}
                {...rest}
              />
            </Box>
          </Portal>

          {showSessionWarning && (
            <Alert status="warning" position="fixed" bottom="4" left="50%" transform="translateX(-50%)" width="auto" zIndex="9999" borderRadius="md" boxShadow="lg">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Sesión a punto de expirar</AlertTitle>
                <AlertDescription display="block">
                  Tu sesión se extenderá automáticamente con tu próxima acción.
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowSessionWarning(false)} />
            </Alert>
          )}

          {getRoute() ? (
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <Routes>
                {getRoutes(filteredRoutes)}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={
                        isAdmin() ? '/admin/default' : '/admin/asset-management'
                      }
                      replace
                    />
                  }
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
