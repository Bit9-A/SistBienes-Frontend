"use client"

// Chakra imports
import { Portal, Box, useDisclosure, Spinner, Center } from "@chakra-ui/react"
import Footer from "components/footer/FooterAdmin"
// Layout components
import Navbar from "components/navbar/NavbarAdmin"
import Sidebar from "components/sidebar/Sidebar"
import { SidebarContext } from "contexts/SidebarContext"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { getFilteredRoutes } from "../../routes"
// If RoutesType is needed and is a default export, use:
// import RoutesType from "../../routes"
import { getProfile, type UserProfile, refreshToken } from "../../api/UserApi"
import { jwtDecode } from "jwt-decode"
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, useBreakpointValue } from "@chakra-ui/react"
import axiosInstance from "../../utils/axiosInstance" // Importar axiosInstance

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props
  const location = useLocation()
  const navigate = useNavigate()

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktop = useBreakpointValue({ base: false, lg: true })

  // Obtener el estado inicial del sidebar desde localStorage con lógica responsive
  const getInitialSidebarState = useCallback(() => {
    if (typeof window === "undefined") return false

    // En móvil, el sidebar siempre empieza cerrado
    if (isMobile) return false

    // En desktop, usar el estado guardado o true por defecto
    const saved = localStorage.getItem("sidebarState")
    return saved ? JSON.parse(saved) : true
  }, [isMobile])

  // states and functions
  const [fixed] = useState(false)
  const [toggleSidebar, setToggleSidebar] = useState(getInitialSidebarState())
  const [brandText, setBrandText] = useState("Default Brand Text")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null)

  // Memoizar el cálculo de si es admin
  const isAdmin = useMemo(() => {
    return userProfile && userProfile.nombre_tipo_usuario === "Administrador"
  }, [userProfile])

  // Memoizar las rutas filtradas
  const filteredRoutes = useMemo(() => {
    return getFilteredRoutes(isAdmin)
  }, [isAdmin])

  // Efecto para manejar el estado del sidebar de forma responsive
  useEffect(() => {
    if (isMobile) {
      // En móvil, siempre cerrar el sidebar
      setToggleSidebar(false)
    } else {
      // En desktop, usar el estado inicial
      setToggleSidebar(getInitialSidebarState())
    }
  }, [isMobile, getInitialSidebarState])

  // Función optimizada para manejar el toggle del sidebar
  const handleToggleSidebar = useCallback(
    (value: boolean) => {
      setToggleSidebar(value)
      // Solo guardar en localStorage si no es móvil
      if (!isMobile) {
        localStorage.setItem("sidebarState", JSON.stringify(value))
      }
    },
    [isMobile],
  )

  // Función para decodificar el token y obtener el tiempo restante
  const getTokenExpiration = useCallback(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData?.token) {
          const decodedToken: { exp: number } = jwtDecode(userData.token)
          const currentTime = Math.floor(Date.now() / 1000)
          return decodedToken.exp - currentTime
        }
      } catch (tokenError) {
        console.error("Error decodificando token:", tokenError)
      }
    }
    return 0
  }, [])

  // Función para refrescar el token
  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await refreshToken()
      if (response?.token) {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          localStorage.setItem("user", JSON.stringify({ ...userData, token: response.token }))
          console.log("Token refrescado exitosamente.")
          setShowSessionWarning(false) // Ocultar advertencia después de refrescar
        }
      }
    } catch (error) {
      console.error("Error al refrescar el token:", error)
      // Si el refresco falla, redirigir al login
      navigate("/auth/sign-in")
    }
  }, [navigate])

  // Efecto para manejar el temporizador de la sesión
  useEffect(() => {
    // Limpiar cualquier temporizador existente
    if (sessionTimer) {
      clearInterval(sessionTimer)
    }

    const interval = setInterval(async () => { // Hacer la función async
      let timeLeft = getTokenExpiration()

      if (timeLeft <= 0) {
        // Sesión expirada, redirigir al login
        navigate("/auth/sign-in")
      } else if (timeLeft < 600 && timeLeft > 0) {
        // Menos de 10 minutos, mostrar advertencia
        setShowSessionWarning(true)
      } else if (timeLeft < 1200 && timeLeft > 600) { // Si quedan entre 10 y 20 minutos, intentar refrescar
        // Refrescar el token si está a punto de expirar (ej. entre 10 y 20 minutos)
        // Esto se hace aquí para que sea proactivo pero no en cada request
        await handleRefreshToken()
      } else {
        setShowSessionWarning(false)
      }
    }, 1000 * 30); // Verificar cada 30 segundos

    setSessionTimer(interval)

    // Limpiar el temporizador al desmontar el componente
    return () => {
      if (sessionTimer) {
        clearInterval(sessionTimer)
      }
    }
  }, [navigate, getTokenExpiration, handleRefreshToken]) // Se elimina sessionTimer de las dependencias

  // Obtener el perfil del usuario y configurar el interceptor de Axios
  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await getProfile()

        if (!isMounted) return

        setUserProfile(profile)

        // Configurar interceptor de Axios para añadir el token a las solicitudes
        const interceptorId = axiosInstance.interceptors.request.use(
          (config) => {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
              const userData = JSON.parse(storedUser)
              if (userData?.token) {
                config.headers.Authorization = `Bearer ${userData.token}`
              }
            }
            return config
          },
          (error) => {
            return Promise.reject(error)
          },
        )
        // Guardar el ID del interceptor para poder ejectarlo
        ;(axiosInstance.interceptors.request as any)._interceptorId = interceptorId;

      } catch (error) {
        console.error("Error al obtener el perfil o configurar interceptor:", error)
        if (isMounted) {
          navigate("/auth/sign-in")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUserProfile()

    return () => {
      isMounted = false
      // Limpiar el interceptor al desmontar el componente
      const interceptorId = (axiosInstance.interceptors.request as any)._interceptorId;
      if (interceptorId !== undefined) {
        axiosInstance.interceptors.request.eject(interceptorId);
      }
    }
  }, [navigate]) // Se elimina getTokenExpiration y handleRefreshToken de las dependencias

  // Memoizar funciones de rutas para evitar recálculos
  const getActiveRoute = useCallback(
    (routes: RoutesType[]): string => {
      for (let i = 0; i < routes.length; i++) {
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].name
        }
      }
      return "Default Brand Text"
    },
    [location.pathname],
  )

  const getActiveNavbar = useCallback((routes: RoutesType[]): boolean => {
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary ?? false
      }
    }
    return false
  }, [])

  const getActiveNavbarText = useCallback((routes: RoutesType[]): string | boolean => {
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name
      }
    }
    return false
  }, [])

  // Memoizar las rutas para evitar recrearlas en cada render
  const routeElements = useMemo(() => {
    return filteredRoutes.map((route: RoutesType, key: any) => {
      if (route.layout === "/admin") {
        return <Route path={`${route.path}`} element={route.component} key={key} />
      }
      return null
    })
  }, [filteredRoutes])

  // Actualizar brandText cuando cambie la ubicación
  useEffect(() => {
    setBrandText(getActiveRoute(filteredRoutes))
  }, [location, filteredRoutes, getActiveRoute])

  const getRoute = useCallback(() => {
    return window.location.pathname !== "/admin/full-screen-maps"
  }, [])

  const { onOpen } = useDisclosure()

  // Valores responsive para el layout
  const sidebarWidth = useMemo(() => {
    if (isMobile) return 0
    return toggleSidebar ? 300 : 0
  }, [isMobile, toggleSidebar])

  const mainContentWidth = useMemo(() => {
    if (isMobile) return "100%"
    return toggleSidebar ? "calc(100% - 300px)" : "100%"
  }, [isMobile, toggleSidebar])

  const mainContentMargin = useMemo(() => {
    if (isMobile) return "0px"
    return toggleSidebar ? "300px" : "0px"
  }, [isMobile, toggleSidebar])

  // Si está cargando, mostrar spinner optimizado
  if (isLoading) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
      </Center>
    )
  }

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar: handleToggleSidebar,
        }}
      >
        {/* Sidebar - Solo renderizar si no es móvil o si está abierto */}
        {(!isMobile || toggleSidebar) && (
          <Sidebar
            routes={filteredRoutes}
            setToggleSidebar={handleToggleSidebar}
            {...rest}
          />
        )}

        {/* Main Content */}
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={mainContentWidth}
          ml={mainContentMargin}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={""}
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

          {/* Session Warning - Responsive */}
          {showSessionWarning && (
            <Alert
              status="warning"
              position="fixed"
              bottom={{ base: "4", md: "6" }}
              left="50%"
              transform="translateX(-50%)"
              width={{ base: "90%", md: "auto" }}
              maxWidth="500px"
              zIndex="9999"
              borderRadius="md"
              boxShadow="lg"
            >
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize={{ base: "sm", md: "md" }}>Sesión a punto de expirar</AlertTitle>
                <AlertDescription display="block" fontSize={{ base: "xs", md: "sm" }}>
                  Tu sesión se extenderá automáticamente con tu próxima acción.
                </AlertDescription>
              </Box>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                size={{ base: "sm", md: "md" }}
                onClick={() => setShowSessionWarning(false)}
              />
            </Alert>
          )}

          {/* Main Routes */}
          {getRoute() && (
            <Box
              mx="auto"
              p={{
                base: "15px",
                sm: "20px",
                md: "25px",
                lg: "30px",
              }}
              pe={{ base: "15px", md: "20px" }}
              minH="100vh"
              pt={{ base: "60px", md: "70px", lg: "50px" }}
            >
              <Routes>
                {routeElements}
                <Route
                  path="/"
                  element={<Navigate to={isAdmin ? "/admin/default" : "/admin/asset-management"} replace />}
                />
              </Routes>
            </Box>
          )}

          {/* Footer */}
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  )
}
