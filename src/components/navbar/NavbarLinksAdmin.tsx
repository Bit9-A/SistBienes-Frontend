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
  useToast,
} from "@chakra-ui/react"
// Custom Components
import { SidebarResponsive } from "components/sidebar/Sidebar"
import PropTypes from "prop-types"
// Assets
import { MdNotificationsNone } from "react-icons/md"
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi"
import routes from "routes"
// API
import { logout as logoutApi, type UserProfile } from "../../api/UserApi"
import { useNavigate } from "react-router-dom"


interface HeaderLinksProps {
  secondary: boolean
  onProfileClick?: () => void
  onLogout?: () => void
  user: UserProfile
}

export default function HeaderLinks({ secondary, onProfileClick, onLogout, user }: HeaderLinksProps) {
  const toast = useToast()
  const navigate = useNavigate()

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white")
  const menuBg = useColorModeValue("white", "navy.800")
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)")
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)",
  )
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100")
  const subtitleColor = useColorModeValue("gray.600", "gray.400")


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
        localStorage.removeItem("sidebarState")

        // Mostrar mensaje de éxito
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente",
          status: "success",
          duration: 2000,
          isClosable: true,
        })

        // Redirigir al login usando navigate
        navigate("/auth/sign-in")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Aunque haya error, limpiar localStorage y redirigir
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("sidebarState")
      navigate("/auth/sign-in")
    }
  }

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    } else {
      // Lógica por defecto para abrir perfil
      navigate("/admin/profile")
    }
  }

  // Valores del usuario
  const userName = user.nombre_completo
  const userRole = user.nombre_tipo_usuario
  const userEmail = user.email

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

      {/* Menú de usuario */}
      <Menu>
        <MenuButton p="0px" position="relative">
          <HStack spacing={3} cursor="pointer">
            <Avatar
              size="sm"
              name={userName}
              bg="brand.500"
              color="white"
            />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm" color={textColor}>
                {userName}
              </Text>
              <Text fontSize="xs" color={subtitleColor}>
                {userRole}
              </Text>
            </VStack>
            <Box display={{ base: "none", md: "flex" }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm" fontWeight="500">
                {userEmail}
              </Text>
            </MenuItem>
            <Divider my={2} borderColor={borderColor} />
            <MenuItem
              _hover={{ bg: hoverBg }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={handleProfileClick}
            >
              <Icon as={FiUser} me="8px" />
              <Text fontSize="sm">Perfil</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: hoverBg }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
            >
              <Icon as={FiSettings} me="8px" />
              <Text fontSize="sm">Configuración</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: hoverBg }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <Icon as={FiLogOut} me="8px" />
              <Text fontSize="sm">Cerrar Sesión</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  )
}

HeaderLinks.propTypes = {
  secondary: PropTypes.bool,
  onProfileClick: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object.isRequired,
}