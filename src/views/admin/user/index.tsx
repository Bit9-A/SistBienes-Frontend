"use client"

import { useState, useEffect } from "react"
import {
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
  Stack,
  Select,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiUserPlus,
  FiFilter,
  FiDownload,
  FiUser,
  FiMail,
  FiHash,
} from "react-icons/fi"

interface Usuario {
  id: number
  tipo_usuario: number
  email: string
  password: string
  nombre: string
  apellido: string
  telefono?: string
  dept_id: number
  cedula: string
}

// Map for user types
const userTypes = {
  1: { name: "Administrador", color: "green" },
  2: { name: "Usuario", color: "blue" },
  3: { name: "Invitado", color: "orange" },
}

// Map for departments
const departments = {
  1: "Recursos Humanos",
  2: "Tecnología",
  3: "Finanzas",
  4: "Marketing",
}

const UserManage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState<number | string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const usersPerPage = 5

  // Colors
  const cardBg = useColorModeValue("white", "gray.700")
  const tableBg = useColorModeValue("white", "gray.700")
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  // Simulación de datos (puedes reemplazar esto con una llamada a tu API)
  useEffect(() => {
    const fetchUsuarios = async () => {
      // Simulated data - in a real app, this would be an API call
      const data: Usuario[] = [
        {
          id: 1,
          tipo_usuario: 1,
          email: "juan.perez@example.com",
          password: "123456",
          nombre: "Juan",
          apellido: "Pérez",
          telefono: "123-456-7890",
          dept_id: 1,
          cedula: "V-12345678",
        },
        {
          id: 2,
          tipo_usuario: 2,
          email: "maria.gomez@example.com",
          password: "abcdef",
          nombre: "María",
          apellido: "Gómez",
          telefono: "987-654-3210",
          dept_id: 2,
          cedula: "V-87654321",
        },
        {
          id: 3,
          tipo_usuario: 2,
          email: "carlos.rodriguez@example.com",
          password: "qwerty",
          nombre: "Carlos",
          apellido: "Rodríguez",
          telefono: "555-123-4567",
          dept_id: 3,
          cedula: "V-23456789",
        },
        {
          id: 4,
          tipo_usuario: 3,
          email: "ana.martinez@example.com",
          password: "zxcvbn",
          nombre: "Ana",
          apellido: "Martínez",
          telefono: "777-888-9999",
          dept_id: 2,
          cedula: "V-34567890",
        },
        {
          id: 5,
          tipo_usuario: 1,
          email: "pedro.sanchez@example.com",
          password: "asdfgh",
          nombre: "Pedro",
          apellido: "Sánchez",
          telefono: "444-555-6666",
          dept_id: 4,
          cedula: "V-45678901",
        },
        {
          id: 6,
          tipo_usuario: 2,
          email: "laura.diaz@example.com",
          password: "poiuyt",
          nombre: "Laura",
          apellido: "Díaz",
          telefono: "222-333-4444",
          dept_id: 1,
          cedula: "V-56789012",
        },
      ]
      setUsuarios(data)
      setFilteredUsers(data)
    }

    fetchUsuarios()
  }, [])

  // Filter users based on search and department
  useEffect(() => {
    let result = [...usuarios]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.nombre.toLowerCase().includes(query) ||
          user.apellido.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.cedula.toLowerCase().includes(query),
      )
    }

    // Filter by department
    if (selectedDept !== "all") {
      result = result.filter((user) => user.dept_id === Number(selectedDept))
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedDept, usuarios])

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Handle user edit
  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user)
    onOpen()
  }

  // Handle user delete
  const handleDeleteUser = (userId: number) => {
    // In a real app, you would call an API to delete the user
    setUsuarios(usuarios.filter((user) => user.id !== userId))
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color="teal.600">
              Gestión de Usuarios
            </Heading>
            <Button
              leftIcon={<FiUserPlus />}
              colorScheme="teal"
              size="md"
              onClick={() => {
                setSelectedUser(null) // Clear selected user for new user form
                onOpen()
              }}
            >
              Nuevo Usuario
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          {/* Filters and Search */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={6}
            gap={4}
          >
            <HStack spacing={4} flex={{ md: 2 }}>
              <InputGroup maxW={{ md: "320px" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar usuario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                />
              </InputGroup>

              <Box>
                <Select
                  icon={<FiFilter />}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  borderRadius="md"
                  w={{ base: "full", md: "180px" }}
                >
                  <option value="all">Todos los departamentos</option>
                  {Object.entries(departments).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>

            <Button leftIcon={<FiDownload />} variant="outline" colorScheme="teal" size="md">
              Exportar
            </Button>
          </Flex>

          {/* Users Table */}
          {filteredUsers.length > 0 ? (
            <>
              <TableContainer
                border="1px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="sm"
                overflow="hidden"
                mb={4}
              >
                <Table variant="simple" size="md">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>Usuario</Th>
                      <Th>Tipo</Th>
                      <Th display={{ base: "none", md: "table-cell" }}>Email</Th>
                      <Th display={{ base: "none", lg: "table-cell" }}>Teléfono</Th>
                      <Th display={{ base: "none", lg: "table-cell" }}>Departamento</Th>
                      <Th display={{ base: "none", md: "table-cell" }}>Cédula</Th>
                      <Th textAlign="center">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentUsers.map((usuario) => (
                      <Tr key={usuario.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                        <Td>
                          <Flex align="center">
                            <Box
                              bg="teal.50"
                              color="teal.700"
                              borderRadius="full"
                              p={2}
                              mr={3}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <FiUser />
                            </Box>
                            <Box>
                              <Text fontWeight="medium">{`${usuario.nombre} ${usuario.apellido}`}</Text>
                              <Text fontSize="sm" color="gray.500" display={{ base: "block", md: "none" }}>
                                {usuario.email}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={"gray"}
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {"Desconocido"}
                          </Badge>
                        </Td>
                        <Td display={{ base: "none", md: "table-cell" }}>{usuario.email}</Td>
                        <Td display={{ base: "none", lg: "table-cell" }}>{usuario.telefono || "N/A"}</Td>
                        <Td display={{ base: "none", lg: "table-cell" }}>{"N/A"}</Td>
                        <Td display={{ base: "none", md: "table-cell" }}>{usuario.cedula}</Td>
                        <Td>
                          <Flex justify="center" gap={2}>
                            <IconButton
                              aria-label="Editar usuario"
                              icon={<FiEdit />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEditUser(usuario)}
                            />
                            <IconButton
                              aria-label="Eliminar usuario"
                              icon={<FiTrash2 />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDeleteUser(usuario.id)}
                            />
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Más opciones"
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem icon={<FiUser />}>Ver perfil</MenuItem>
                                <MenuItem icon={<FiMail />}>Enviar correo</MenuItem>
                                <MenuItem icon={<FiHash />}>Restablecer contraseña</MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Flex justify="space-between" align="center" mt={4}>
                <Text color="gray.600">
                  Mostrando {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} de{" "}
                  {filteredUsers.length} usuarios
                </Text>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={currentPage === 1}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      colorScheme={currentPage === page ? "teal" : "gray"}
                      variant={currentPage === page ? "solid" : "outline"}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    isDisabled={currentPage === totalPages}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Siguiente
                  </Button>
                </HStack>
              </Flex>
            </>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                No se encontraron usuarios con los filtros aplicados.
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* User Edit/Create Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Nombre</FormLabel>
                  <Input defaultValue={selectedUser?.nombre || ""} placeholder="Nombre" />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Apellido</FormLabel>
                  <Input defaultValue={selectedUser?.apellido || ""} placeholder="Apellido" />
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input defaultValue={selectedUser?.email || ""} placeholder="Email" type="email" />
              </FormControl>

              <FormControl>
                <FormLabel>Cédula</FormLabel>
                <Input defaultValue={selectedUser?.cedula || ""} placeholder="V-12345678" />
              </FormControl>

              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input defaultValue={selectedUser?.telefono || ""} placeholder="Teléfono" />
              </FormControl>

              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Tipo de Usuario</FormLabel>
                  <Select defaultValue={selectedUser?.tipo_usuario || 2}>
                    {Object.entries(userTypes).map(([id, { name }]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Departamento</FormLabel>
                  <Select defaultValue={selectedUser?.dept_id || 1}>
                    {Object.entries(departments).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>

              {!selectedUser && (
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <Input placeholder="Contraseña" type="password" />
                </FormControl>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3}>
              {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default UserManage
