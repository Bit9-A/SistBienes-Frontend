"use client"

import { useState, useEffect } from "react"
import {
  Icon,
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Select,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Container,
  Stack,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { FiEdit, FiTrash2, FiUserPlus, FiFilter, FiDownload, FiCheck, FiUsers } from "react-icons/fi"
import { CreateUserForm, EditUserForm } from "./components/UserForm"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { getUsers, updateUser, createUser } from "../../../api/UserApi"
import { filterUsers, handleEditUser, handleSaveEditUser, handleCreateUser } from "./utils/UserLogic"
import { getDepartments } from "../../../api/SettingsApi"
import { getUserRoles } from "../../../api/UserRoleApi"

const UserManage = () => {
  // State for UI elements only (no functionality)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState("all")
  const [selectedUserType, setSelectedUserType] = useState("all")
  const [departments, setDepartments] = useState([]) // Lista de departamentos
  //estado para el filtro de estado de usuario
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active")
  const [currentPage, setCurrentPage] = useState(1) // Página actual para la paginación
  const itemsPerPage = 10 // Elementos por página para la paginación
  const [userRoles, setUserRoles] = useState([]) // Lista de roles de usuario
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingUser, setEditingUser] = useState(null) // Usuario seleccionado para editar
  const [users, setUsers] = useState([])
  const [userToDelete, setUserToDelete] = useState(null) // Usuario seleccionado para eliminar
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure() // Controla el estado del diálogo de confirmación

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUserRoles = async () => {
    try {
      const data = await getUserRoles()
      setUserRoles(data)
    } catch (error) {
      console.error("Error fetching user roles:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUserRoles() // Carga los roles de usuario al inicio
    fetchDepartments() // Carga los departamentos al inicio
    fetchUsers()
  }, [])

  // Filtro por estado
  const statusFilteredUsers = users.filter((user) => {
    if (statusFilter === "active") return user.isActive === 1 || user.isActive === "1"
    if (statusFilter === "inactive") return user.isActive === 0 || user.isActive === "0"
    return true
  })

  const filteredUsers = filterUsers(statusFilteredUsers, searchQuery, selectedDept, selectedUserType)

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedDept, selectedUserType, statusFilter])

  // Funciones para manejar la creación y edición de usuarios
  const handleCreateUserWrapper = async (newUser: any) => {
    await handleCreateUser(newUser, createUser, setUsers)
    await fetchUsers() // Refresca la lista de usuarios después de crear uno nuevo
    onClose() // Cierra el modal después de crear el usuario
  }

  const handleSaveEditUserWrapper = async (updatedUser: any) => {
    handleSaveEditUser(updatedUser, updateUser, setUsers, onClose)
    await fetchUsers() // Refresca la lista de usuarios después de editar
  }

  const handleDeactivateUserWrapper = async (user: any) => {
    await updateUser(user.id, { ...user, isActive: 0 })
    await fetchUsers() // Refresca la lista de usuarios después de desactivar
  }

  // Función para manejar la edición de usuarios
  const handleCloseAndRefresh = () => {
    onClose()
    fetchUsers()
  }

  // Colors for theming
  const cardBg = useColorModeValue("white", "gray.700")
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const textColor = useColorModeValue("gray.800", "white")
  const tabBorderColor = useColorModeValue("gray.200", "gray.700")
  const bg = useColorModeValue("gray.50", "gray.900")

  // Tabs (solo uno activo en este ejemplo)
  const tabs = [
    {
      id: "users",
      label: "Usuarios",
      icon: FiUsers,
      color: "purple",
      description: "Gestión de usuarios del sistema",
    },
  ]

  const [activeTab] = useState("users")
  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <Box minH="100vh" bg={bg} pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container
         maxW="100vw"
  px={{ base: 2, md: 4 }}
  py={{ base: 2, md: 4 }}
  w="full"
      >
        {/* Main Header */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardHeader p={{ base: 4, md: 6 }}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "start", lg: "center" }}
              gap={{ base: 3, md: 4 }}
            >
              <Box>
                <Flex align="center" gap={{ base: 2, md: 3 }} mb={2}>
                  <Box p={{ base: 1.5, md: 2 }} bg="blue.100" borderRadius="lg">
                    <FiUsers size={24} color="#0059ae" />
                  </Box>
                  <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color={textColor}>
                    Gestión de Usuarios
                  </Heading>
                </Flex>
                <Box color="gray.600" fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
                  Sistema integral para la administración de usuarios
                </Box>
              </Box>
              {activeTabData && (
                <Badge
                  colorScheme={activeTabData.color}
                  variant="subtle"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  borderRadius="full"
                  fontSize={{ base: "xs", md: "sm" }}
                  mt={{ base: 2, lg: 0 }}
                >
                  {activeTabData.label}
                </Badge>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card
          bg={cardBg}
          shadow="md"
          borderRadius="xl"
          border="1px"
          borderColor={tabBorderColor}
          mb={{ base: 4, md: 6 }}
        >
          <CardBody p={{ base: 3, md: 4 }}>
            <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 2, md: 2 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "solid" : "ghost"}
                  colorScheme={activeTab === tab.id ? tab.color : "gray"}
                  bg={activeTab === tab.id ? `${tab.color}.500` : "transparent"}
                  color={activeTab === tab.id ? "white" : textColor}
                  borderRadius="lg"
                  _hover={{
                    bg: activeTab === tab.id ? `${tab.color}.600` : hoverBg,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={tab.icon} />}
                  size={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  flex={{ base: "1", md: "auto" }}
                  minW={{ base: "auto", md: "200px" }}
                  boxShadow={activeTab === tab.id ? "md" : "none"}
                  isActive={activeTab === tab.id}
                  w={{ base: "full", md: "auto" }}
                >
                  <Box textAlign="left">
                    <Box fontSize={{ base: "sm", md: "md" }}>{tab.label}</Box>
                    <Box
                      fontSize={{ base: "2xs", md: "xs" }}
                      opacity={0.8}
                      fontWeight="normal"
                      display={{ base: "none", md: "block" }}
                    >
                      {tab.description}
                    </Box>
                  </Box>
                </Button>
              ))}
            </Stack>
          </CardBody>
        </Card>

        {/* Tab Content */}
        <Box>
          {/* Main Content Card */}
          <Card
            bg={cardBg}
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor={tabBorderColor}
            mb={{ base: 4, md: 6 }}
          >
            <CardHeader p={{ base: 4, md: 6 }}>
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color={textColor}>
                  Usuarios
                </Heading>
                <Button
                  bgColor="type.primary"
                  leftIcon={<Icon as={FiUserPlus} />}
                  colorScheme="purple"
                  size={{ base: "md", md: "md" }}
                  onClick={() => {
                    setEditingUser(null)
                    onOpen() // Abre el formulario de creación
                  }}
                  w={{ base: "full", sm: "auto" }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <Box display={{ base: "none", sm: "block" }}>Nuevo Usuario</Box>
                  <Box display={{ base: "block", sm: "none" }}>Nuevo</Box>
                </Button>
              </Flex>
            </CardHeader>

            <CardBody p={{ base: 3, md: 6 }}>
              {/* Filters and Search */}
              <Flex
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                align={{ base: "stretch", lg: "center" }}
                mb={{ base: 4, md: 6 }}
                gap={{ base: 3, md: 4 }}
              >
                <HStack
                  spacing={{ base: 2, md: 4 }}
                  flex={{ md: 2 }}
                  w="100%"
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "stretch", sm: "center" }}
                >
                  <InputGroup maxW={{ base: "100%", md: "320px" }} flex={1}>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar usuario..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      borderRadius="md"
                      size={{ base: "md", md: "md" }}
                    />
                  </InputGroup>

                  {/* Filtro de estado */}
                  <Select
                    maxW={{ base: "100%", sm: "200px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    size={{ base: "md", md: "md" }}
                  >
                    <option value="active">Solo Activos</option>
                    <option value="inactive">Solo Inactivos</option>
                    <option value="all">Todos</option>
                  </Select>

                  <Menu placement="bottom-end" isLazy>
                    <MenuButton
                      as={Button}
                      rightIcon={<Icon as={FiFilter} />}
                      bg={useColorModeValue("white", "gray.700")}
                      borderColor={useColorModeValue("gray.300", "gray.600")}
                      _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                      _focus={{ boxShadow: "outline" }}
                      color={textColor}
                      borderWidth="1px"
                      w={{ base: "100%", sm: "auto" }}
                      textAlign="left"
                      size={{ base: "md", md: "md" }}
                    >
                      <Box display={{ base: "none", sm: "block" }}>Filtrar</Box>
                      <Box display={{ base: "block", sm: "none" }}>Filtros</Box>
                    </MenuButton>
                    <MenuList
                      maxW={{ base: "100%", md: "300px" }}
                      overflow="auto"
                      bg={useColorModeValue("white", "gray.700")}
                      borderColor={useColorModeValue("gray.300", "gray.600")}
                    >
                      <MenuItem
                        onClick={() => setSelectedDept("all")}
                        fontWeight={selectedDept === "all" ? "bold" : "normal"}
                        color={selectedDept === "all" ? "type.primary" : "inherit"}
                      >
                        {selectedDept === "all" && <Icon as={FiCheck} mr={2} />}
                        Todos los Departamentos
                      </MenuItem>
                      {departments.map((dept) => (
                        <MenuItem
                          key={dept.id}
                          onClick={() => setSelectedDept(String(dept.id))}
                          fontWeight={selectedDept === dept.id ? "bold" : "normal"}
                          color={selectedDept === dept.id ? "type.primary" : "inherit"}
                        >
                          {selectedDept === String(dept.id) && <Icon as={FiCheck} mr={2} />}
                          {dept.nombre}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </HStack>

                <Button
                  color="type.title"
                  leftIcon={<Icon as={FiDownload} />}
                  variant="outline"
                  colorScheme="type.primary"
                  size={{ base: "md", md: "md" }}
                  w={{ base: "full", lg: "auto" }}
                  minW={{ base: "auto", lg: "120px" }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <Box display={{ base: "none", sm: "block" }}>Exportar</Box>
                  <Box display={{ base: "block", sm: "none" }}>Export</Box>
                </Button>
              </Flex>

              <Box bg={cardBg} p={{ base: 2, md: 4 }} borderRadius="lg" boxShadow="sm" overflowX="auto">
                <TableContainer
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  boxShadow="sm"
                  overflow="auto"
                  mb={4}
                >
                  <Table variant="simple" size={{ base: "sm", md: "md" }}>
                    <Thead bg={headerBg}>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Nombre</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Nombre de Usuario
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Tipo</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Email
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Teléfono
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Departamento
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Cédula
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                        <Th textAlign="center" fontSize={{ base: "xs", md: "sm" }}>
                          Acciones
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedUsers.map((user) => (
                        <Tr key={user.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                          <Td>
                            <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                              {`${user.nombre} ${user.apellido}`}
                            </Text>
                            <Text fontSize="xs" color="gray.500" display={{ base: "block", md: "none" }} mt={1}>
                              @{user.username}
                            </Text>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <Text fontSize={{ base: "sm", md: "md" }}>{user.username}</Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={user.tipo_usuario?.color || "gray"}
                              borderRadius="full"
                              px={2}
                              py={1}
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {userRoles.find((role) => String(role.id) === String(user.tipo_usuario))?.nombre || "N/A"}
                            </Badge>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <Text fontSize={{ base: "sm", md: "md" }}>{user.email}</Text>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <Text fontSize={{ base: "sm", md: "md" }}>{user.telefono || "N/A"}</Text>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <Text fontSize={{ base: "sm", md: "md" }}>
                              {departments.find((dept) => String(dept.id) === String(user.dept_id))?.nombre || "N/A"}
                            </Text>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <Text fontSize={{ base: "sm", md: "md" }}>{user.cedula}</Text>
                          </Td>
                          <Td>
                            {user.isActive === 1 ? (
                              <Badge colorScheme="green" fontSize={{ base: "2xs", md: "xs" }}>
                                Activo
                              </Badge>
                            ) : (
                              <Badge colorScheme="red" fontSize={{ base: "2xs", md: "xs" }}>
                                No Activo
                              </Badge>
                            )}
                          </Td>
                          <Td>
                            <Flex justify="center" gap={{ base: 1, md: 2 }}>
                              <IconButton
                                aria-label="Editar usuario"
                                icon={<FiEdit />}
                                size={{ base: "xs", md: "sm" }}
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEditUser(user, setEditingUser, onOpen)}
                              />
                              <IconButton
                                aria-label="Eliminar usuario"
                                icon={<FiTrash2 />}
                                size={{ base: "xs", md: "sm" }}
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  setUserToDelete(user)
                                  onDeleteDialogOpen()
                                }}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                {/* Paginación */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "center", md: "center" }}
                  mt={4}
                  gap={{ base: 3, md: 0 }}
                >
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} textAlign={{ base: "center", md: "left" }}>
                    Mostrando {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                  </Text>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Anterior"
                      icon={<ChevronLeftIcon />}
                      size={{ base: "sm", md: "sm" }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      isDisabled={currentPage === 1}
                      variant="outline"
                    />
                    {/* Botones numerados */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={page}
                          size={{ base: "sm", md: "sm" }}
                          variant={page === currentPage ? "solid" : "outline"}
                          color="white"
                          colorScheme={page === currentPage ? "purple" : "gray"}
                          bg={page === currentPage ? "type.primary" : "gray"}
                          onClick={() => setCurrentPage(page)}
                          fontWeight={page === currentPage ? "bold" : "normal"}
                          mx={0.5}
                          display={{ base: page === currentPage ? "flex" : "none", md: "flex" }}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    <IconButton
                      aria-label="Siguiente"
                      icon={<ChevronRightIcon />}
                      size={{ base: "sm", md: "sm" }}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      isDisabled={currentPage === totalPages || totalPages === 0}
                      variant="outline"
                    />
                  </HStack>
                </Flex>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Container>

      {/* Renderiza el formulario correspondiente */}
      {editingUser ? (
        <EditUserForm
          isOpen={isOpen}
          onClose={() => {
            setEditingUser(null)
            handleCloseAndRefresh() // Cierra el modal después de editar
          }}
          user={editingUser}
          onSave={handleSaveEditUserWrapper} // Función para guardar cambios
        />
      ) : (
        <CreateUserForm isOpen={isOpen} onClose={handleCloseAndRefresh} onSave={handleCreateUserWrapper} />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        isCentered
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={undefined}
        onClose={onDeleteDialogClose}
        motionPreset="slideInBottom"
        closeOnOverlayClick={false}
        size={{ base: "sm", md: "lg" }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={{ base: 4, md: 0 }}>
            <AlertDialogHeader fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
              Confirmar Desactivación
            </AlertDialogHeader>
            <AlertDialogBody fontSize={{ base: "sm", md: "md" }}>
              ¿Estás seguro de que deseas desactivar al usuario{" "}
              <strong>
                {userToDelete?.nombre} {userToDelete?.apellido}
              </strong>
              ? Esta acción no eliminará el usuario, solo lo desactivará.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteDialogClose} size={{ base: "sm", md: "md" }}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeactivateUserWrapper(userToDelete)
                  onDeleteDialogClose()
                }}
                ml={3}
                size={{ base: "sm", md: "md" }}
              >
                Desactivar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default UserManage
