"use client"

import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  Divider,
  Badge,
  Box,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
// Custom Components
import { SidebarResponsive } from "components/sidebar/Sidebar"
import PropTypes from "prop-types"
// Assets
import { MdNotificationsNone, MdInfoOutline } from "react-icons/md"
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi"
import routes from "routes"
// API
import { getProfile, logout as logoutApi, type UserProfile } from "../../api/UserApi"

interface HeaderLinksProps {
  secondary: boolean
  onProfileClick?: () => void
  onLogout?: () => void
}

export default function HeaderLinks({ secondary, onProfileClick, onLogout }: HeaderLinksProps) {
  // Estados
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white")
  const menuBg = useColorModeValue("white", "navy.800")
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const textColorBrand = useColorModeValue("brand.700", "brand.400")
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)")
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)",
  )
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100")
  const subtitleColor = useColorModeValue("gray.600", "gray.400")

  // Cargar perfil del usuario al montar el componente
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await getProfile()
        setUserProfile(profile)
        console.log("Perfil cargado:", profile)
      } catch (error: any) {
        console.error("Error al cargar el perfil:", error)

        // Si hay error de autenticación, redirigir al login
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          window.location.href = "/auth/sign-in"
        } else {
          toast({
            title: "Error",
            description: "No se pudo cargar la información del usuario",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [toast])

  // Obtener el rol del usuario basado en tipo_usuario
  const getUserRole = (tipoUsuario: number): string => {
    switch (tipoUsuario) {
      case 1:
        return "Administrador"
      case 2:
        return "Usuario"
      case 3:
        return "Supervisor"
      default:
        return "Usuario"
    }
  }

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout()
      } else {
        // Llamar a la API de logout
        await logoutApi()

        // Limpiar localStorage
        localStorage.removeItem("user")
        localStorage.removeItem("token")

        // Mostrar mensaje de éxito
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente",
          status: "success",
          duration: 2000,
          isClosable: true,
        })

        // Redirigir al login
        setTimeout(() => {
          window.location.href = "/auth/sign-in"
        }, 1000)
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Aunque haya error, limpiar localStorage y redirigir
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      window.location.href = "/auth/sign-in"
    }
  }

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    } else {
      // Lógica por defecto para abrir perfil
      console.log("Abriendo información personal...")
    }
  }

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <Flex
        w={{ sm: "100%", md: "auto" }}
        alignItems="center"
        justifyContent="center"
        bg={menuBg}
        p="10px"
        borderRadius="30px"
        boxShadow={shadow}
      >
        <Spinner size="sm" color="brand.500" />
      </Flex>
    )
  }

  // Valores por defecto si no hay perfil
  const userName = userProfile?.nombre_completo || "Usuario"
  const userRole = userProfile ? getUserRole(userProfile.tipo_usuario) : "Usuario"
  const userEmail = userProfile?.email || ""

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />

      {/* Notificaciones */}
      <Menu>
        <MenuButton p="0px" position="relative">
          <Icon mt="6px" as={MdNotificationsNone} color={navbarIcon} w="18px" h="18px" me="10px" />
          {/* Badge de notificaciones */}
          <Badge
            position="absolute"
            top="0px"
            right="6px"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW="16px"
            h="16px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            3
          </Badge>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "350px" }}
          maxW={{ base: "320px", md: "unset" }}
        >
          <Flex w="100%" mb="20px" justify="space-between" align="center">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notificaciones
            </Text>
            <Badge colorScheme="blue" borderRadius="full">
              3 nuevas
            </Badge>
          </Flex>
          <VStack spacing={2} align="stretch">
            <Box p={3} bg={hoverBg} borderRadius="md" cursor="pointer">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Nuevo traslado registrado
              </Text>
              <Text fontSize="xs" color={subtitleColor}>
                Hace 5 minutos
              </Text>
            </Box>
            <Box p={3} bg={hoverBg} borderRadius="md" cursor="pointer">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Bien actualizado
              </Text>
              <Text fontSize="xs" color={subtitleColor}>
                Hace 1 hora
              </Text>
            </Box>
            <Box p={3} bg={hoverBg} borderRadius="md" cursor="pointer">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Reporte generado
              </Text>
              <Text fontSize="xs" color={subtitleColor}>
                Hace 2 horas
              </Text>
            </Box>
          </VStack>
        </MenuList>
      </Menu>

      {/* Información/Ayuda */}
      <Menu>
        <MenuButton p="0px">
          <Icon mt="6px" as={MdInfoOutline} color={navbarIcon} w="18px" h="18px" me="10px" />
        </MenuButton>
        <MenuList boxShadow={shadow} p="20px" borderRadius="20px" bg={menuBg} border="none" mt="22px" minW="250px">
          <Text fontSize="md" fontWeight="600" color={textColor} mb="15px">
            Ayuda y Soporte
          </Text>
          <VStack spacing={2} align="stretch">
            <MenuItem _hover={{ bg: hoverBg }} borderRadius="8px" px="14px">
              <Text fontSize="sm">Documentación</Text>
            </MenuItem>
            <MenuItem _hover={{ bg: hoverBg }} borderRadius="8px" px="14px">
              <Text fontSize="sm">Contactar Soporte</Text>
            </MenuItem>
            <MenuItem _hover={{ bg: hoverBg }} borderRadius="8px" px="14px">
              <Text fontSize="sm">Reportar Problema</Text>
            </MenuItem>
          </VStack>
        </MenuList>
      </Menu>

      {/* Menú de Usuario */}
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          p="8px"
          borderRadius="full"
          _hover={{ bg: hoverBg }}
          _active={{ bg: hoverBg }}
        >
          <HStack spacing={3}>
            <Avatar name={userName} bg="brand.500" size="sm" w="32px" h="32px" />
            <VStack spacing={0} align="start" display={{ base: "none", md: "flex" }}>
              <Text fontSize="sm" fontWeight="600" color={textColor} lineHeight="1">
                {userName}
              </Text>
              <Text fontSize="xs" color={subtitleColor} lineHeight="1">
                {userRole}
              </Text>
            </VStack>
            <Icon as={FiChevronDown} color={navbarIcon} w="14px" h="14px" />
          </HStack>
        </MenuButton>
        <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none" minW="250px">
          {/* Header del menú */}
          <Flex w="100%" mb="0px">
            <VStack
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              align="start"
              spacing={1}
            >
              <Text fontSize="sm" fontWeight="700" color={textColor}>
                👋 Hola, {userName.split(" ")[0]}
              </Text>
              <Text fontSize="xs" color={subtitleColor}>
                {userRole}
              </Text>
              {userEmail && (
                <Text fontSize="xs" color={subtitleColor}>
                  {userEmail}
                </Text>
              )}
            </VStack>
          </Flex>

          {/* Opciones del menú */}
          <VStack p="10px" spacing={1} align="stretch">
            <MenuItem
              _hover={{ bg: hoverBg }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={handleProfileClick}
            >
              <HStack spacing={3}>
                <Icon as={FiUser} w="16px" h="16px" color={textColor} />
                <Text fontSize="sm" color={textColor}>
                  Información Personal
                </Text>
              </HStack>
            </MenuItem>

            <MenuItem _hover={{ bg: hoverBg }} _focus={{ bg: "none" }} borderRadius="8px" px="14px">
              <HStack spacing={3}>
                <Icon as={FiSettings} w="16px" h="16px" color={textColor} />
                <Text fontSize="sm" color={textColor}>
                  Configuración
                </Text>
              </HStack>
            </MenuItem>

            <Divider my={2} />

            <MenuItem
              _hover={{ bg: "red.50" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <HStack spacing={3}>
                <Icon as={FiLogOut} w="16px" h="16px" color="red.500" />
                <Text fontSize="sm" color="red.500">
                  Cerrar Sesión
                </Text>
              </HStack>
            </MenuItem>
          </VStack>
        </MenuList>
      </Menu>
    </Flex>
  )
}

HeaderLinks.propTypes = {
  secondary: PropTypes.bool,
  onProfileClick: PropTypes.func,
  onLogout: PropTypes.func,
}
