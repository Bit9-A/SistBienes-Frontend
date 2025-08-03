"use client"

import { useState, useEffect, useCallback } from "react"
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
  Spinner, // Importar Spinner para el estado de carga
  Center, // Importar Center
} from "@chakra-ui/react"
// Custom Components
import { SidebarResponsive } from "components/sidebar/Sidebar"
import PropTypes from "prop-types"
// Assets
import { MdNotificationsNone } from "react-icons/md"
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi"
import routes from "routes"
// API
import { getProfile, logout as logoutApi, type UserProfile } from "../../api/UserApi"
import { handleLogout as Logout } from "../../views/auth/signIn/utils/authUtils"
import { useNavigate } from "react-router-dom"
import {
  fetchNotifications,
  fetchNotificationsByDeptId,
  type Notification,
} from "../../views/admin/notifications/utils/NotificationsUtils"
import { updateNotificationStatus } from "../../api/NotificationsApi" // Importar desde la API


interface HeaderLinksProps {
  secondary: boolean
  onProfileClick?: () => void
  onLogout?: () => void
  user: UserProfile
}
export default function HeaderLinks({ secondary, onProfileClick, onLogout, user }: HeaderLinksProps) {
  const toast = useToast()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(true)

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

  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true)
    try {
      const profile = userProfile || (await getProfile())
      setUserProfile(profile)
      const userIsAdmin = profile.tipo_usuario === 1
      setIsAdmin(userIsAdmin)

      let data: Notification[] = []
      if (userIsAdmin) {
        data = (await fetchNotifications()) || []
      } else if (profile?.dept_id) {
        data = (await fetchNotificationsByDeptId(profile.dept_id)) || []
      }
      setNotifications(data)
      setUnreadCount(data.filter((n) => n.isRead === 0).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoadingNotifications(false)
    }
  }, [userProfile, toast])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleMarkAsRead = async (id: number) => {
    try {
      await updateNotificationStatus(id, 1)
      await loadNotifications()
      toast({
        title: "Notificación marcada como leída",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleLogout = async () => {
    try {
      await Logout()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
      navigate("/auth/sign-in")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    } else {
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
          {unreadCount > 0 && (
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
              {unreadCount}
            </Badge>
          )}
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
            {unreadCount > 0 && (
              <Badge colorScheme="blue" borderRadius="full">
                {unreadCount} nuevas
              </Badge>
            )}
          </Flex>
          {loadingNotifications ? (
            <Center py={4}>
              <Spinner size="sm" color="blue.500" />
              <Text ml={2} fontSize="sm" color={subtitleColor}>Cargando...</Text>
            </Center>
          ) : notifications.length === 0 ? (
            <Text fontSize="sm" color={subtitleColor} textAlign="center" py={4}>
              No hay notificaciones
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {notifications.slice(0, 3).map((notification) => (
                <Box
                  key={notification.id}
                  p={3}
                  bg={notification.isRead === 0 ? hoverBg : "transparent"}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => handleMarkAsRead(notification.id)}
                  _hover={{ bg: hoverBg }}
                >
                  <Text fontSize="sm" fontWeight={notification.isRead === 0 ? "medium" : "normal"} mb={1}>
                    {notification.descripcion}
                  </Text>
                  <Text fontSize="xs" color={subtitleColor}>
                    {formatDate(notification.fecha)}
                  </Text>
                </Box>
              ))}
              {notifications.length > 3 && (
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate("/admin/notifications")}
                  mt={2}
                >
                  Ver todas las notificaciones
                </Button>
              )}
            </VStack>
          )}
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
