"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  useColorModeValue,
  Stack,
  Container,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  Divider,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  HStack,
} from "@chakra-ui/react"
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiMoreVertical,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi"
import { type Notification, fetchNotifications, deleteExistingNotification } from "./utils/NotificationsUtils"
import { updateNotificationStatus } from "api/NotificationsApi"
import { useThemeColors } from "../../../theme/useThemeColors"

const NotificationsHistory = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const { cardBg, textColor, borderColor, headerBg, hoverBg } = useThemeColors()
  const toast = useToast()

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const badgeBg = useColorModeValue("blue.50", "blue.900")
  const badgeColor = useColorModeValue("blue.600", "blue.200")

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = (await fetchNotifications()) || []
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Error al cargar las notificaciones. Por favor, intenta nuevamente.")
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleMarkAsRead = async (id: number) => {
    setActionLoading(id)
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
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = getUnreadNotifications()
    if (unreadNotifications.length === 0) return

    setLoading(true)
    try {
      await Promise.all(unreadNotifications.map((notification) => updateNotificationStatus(notification.id, 1)))
      await loadNotifications()
      toast({
        title: "Todas las notificaciones marcadas como leídas",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "No se pudieron marcar todas las notificaciones como leídas",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotification = async (id: number) => {
    setActionLoading(id)
    try {
      await deleteExistingNotification(id)
      await loadNotifications()
      toast({
        title: "Notificación eliminada",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getUnreadNotifications = () => {
    return notifications.filter((notification) => notification.isRead === 0)
  }

  const getReadNotifications = () => {
    return notifications.filter((notification) => notification.isRead === 1)
  }

  const getFilteredNotifications = (notificationsList: Notification[]) => {
    return notificationsList.filter((notification) => {
      const matchesSearch = notification.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = filterDepartment === "all" || notification.dept_id.toString() === filterDepartment
      return matchesSearch && matchesDepartment
    })
  }

  // Get unique departments for filter
  const departmentOptions = [...new Set(notifications.map((n) => n.departamento).filter(Boolean))]

  const NotificationsTable = ({ notifications }: { notifications: Notification[] }) => {
    const filteredNotifications = getFilteredNotifications(notifications)

    if (filteredNotifications.length === 0) {
      return (
        <Center py={12}>
          <Stack align="center" spacing={4}>
            <Box p={4} bg="gray.100" borderRadius="full">
              <FiBell size={32} color="gray" />
            </Box>
            <Box textAlign="center">
              <Heading size="md" color="gray.500" mb={2}>
                No hay notificaciones
              </Heading>
              <Box color="gray.400" fontSize="sm">
                {searchQuery || filterDepartment !== "all"
                  ? "No se encontraron notificaciones que coincidan con los filtros"
                  : "No tienes notificaciones en esta categoría"}
              </Box>
            </Box>
          </Stack>
        </Center>
      )
    }

    return (
      <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto">
        <Table variant="simple" size={tableSize}>
          <Thead bg={headerBg}>
            <Tr>
              <Th>ID</Th>
              <Th>Descripción</Th>
              <Th>Fecha</Th>
              <Th>Departamento</Th>
              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredNotifications.map((notification) => (
              <Tr
                key={notification.id}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
                opacity={notification.isRead === 1 ? 0.7 : 1}
              >
                <Td>
                  <Badge colorScheme={notification.isRead === 0 ? "red" : "green"} borderRadius="full" px={2}>
                    {notification.id}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight={notification.isRead === 0 ? "semibold" : "normal"}>{notification.descripcion}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(notification.fecha)}
                  </Text>
                </Td>
                <Td>
                  <Badge variant="outline" colorScheme="blue">
                    {notification.departamento}
                  </Badge>
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    {notification.isRead === 0 && (
                      <Tooltip label="Marcar como leída">
                        <IconButton
                          aria-label="Marcar como leída"
                          icon={<FiCheck />}
                          size="sm"
                          colorScheme="green"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                          isLoading={actionLoading === notification.id}
                        />
                      </Tooltip>
                    )}

                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Más opciones"
                        icon={<FiMoreVertical />}
                        size="sm"
                        variant="ghost"
                      />
                      <MenuList>
                        {notification.isRead === 0 && (
                          <MenuItem icon={<FiCheckCircle />} onClick={() => handleMarkAsRead(notification.id)}>
                            Marcar como leída
                          </MenuItem>
                        )}
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          Eliminar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }

  if (loading && notifications.length === 0) {
    return (
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Center py={20}>
            <Stack align="center" spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Heading size="md" color={textColor}>
                Cargando notificaciones...
              </Heading>
            </Stack>
          </Center>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Container maxW="7xl">
          <Alert status="error" borderRadius="lg" mt={8}>
            <AlertIcon />
            <Box>
              <AlertTitle>Error al cargar notificaciones</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    )
  }

  const unreadCount = getUnreadNotifications().length
  const readCount = getReadNotifications().length

  return (
    <Box minH="100vh" bg={bgColor} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="7xl" py={6}>
        {/* Header Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardHeader>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={4}
            >
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <FiBell size={24} color="blue" />
                  </Box>
                  <Heading size="lg" fontWeight="bold" color={textColor}>
                    Centro de Notificaciones
                  </Heading>
                  {unreadCount > 0 && (
                    <Badge colorScheme="red" borderRadius="full" px={2} py={1}>
                      {unreadCount} nuevas
                    </Badge>
                  )}
                </Flex>
                <Box color="gray.600" fontSize="sm">
                  Gestiona y revisa todas tus notificaciones del sistema
                </Box>
              </Box>

              <HStack spacing={2}>
                <Tooltip label="Actualizar notificaciones">
                  <IconButton
                    aria-label="Actualizar"
                    icon={<FiRefreshCw />}
                    onClick={loadNotifications}
                    isLoading={loading}
                    size={buttonSize}
                    variant="outline"
                  />
                </Tooltip>

                {unreadCount > 0 && (
                  <Button
                    colorScheme="green"
                    leftIcon={<FiCheckCircle />}
                    onClick={handleMarkAllAsRead}
                    size={buttonSize}
                    isLoading={loading}
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Filters Section */}
        <Card bg={cardBg} shadow="md" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
          <CardBody p={6}>
            <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
              <Flex align="center" gap={2}>
                <FiFilter color="blue" />
                <Text fontWeight="medium">Filtros</Text>
                {(searchQuery || filterDepartment !== "all") && (
                  <Badge borderRadius="full" px={2} bg={badgeBg} color={badgeColor}>
                    Activos
                  </Badge>
                )}
              </Flex>

              {(searchQuery || filterDepartment !== "all") && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterDepartment("all")
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </Flex>

            <Divider mb={4} />

            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <InputGroup flex="2">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar en notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                />
              </InputGroup>

              <Select
                flex="1"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                borderRadius="md"
              >
                <option value="all">Todos los departamentos</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept.toString()}>
                     {dept}
                  </option>
                ))}
              </Select>
            </Stack>
          </CardBody>
        </Card>

        {/* Content Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)} colorScheme="blue">
              <TabList mb={6}>
                <Tab fontWeight="medium">
                  <Flex align="center" gap={2}>
                    <Text>No Leídas</Text>
                    {unreadCount > 0 && (
                      <Badge colorScheme="red" borderRadius="full" minW="20px" h="20px">
                        {unreadCount}
                      </Badge>
                    )}
                  </Flex>
                </Tab>
                <Tab fontWeight="medium">
                  <Flex align="center" gap={2}>
                    <Text>Leídas</Text>
                    {readCount > 0 && (
                      <Badge colorScheme="green" borderRadius="full" minW="20px" h="20px">
                        {readCount}
                      </Badge>
                    )}
                  </Flex>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <NotificationsTable notifications={getUnreadNotifications()} />
                </TabPanel>
                <TabPanel p={0}>
                  <NotificationsTable notifications={getReadNotifications()} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default NotificationsHistory
