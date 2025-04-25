"use client"

import { useState } from "react"
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

import UserForm from "./components/UserForm"


const userTypes = {
  1: { name: "Administrador", color: "green" },
  2: { name: "Usuario", color: "blue" },
  3: { name: "Invitado", color: "orange" },
}

// Map for departments - for dropdown options
const departments = {
  1: "Recursos Humanos",
  2: "Tecnología",
  3: "Finanzas",
  4: "Marketing",
}

// Sample user data for display purposes only
const sampleUsers = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    telefono: "123-456-7890",
    tipo_usuario: 1,
    dept_id: 1,
    cedula: "V-12345678",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "Gómez",
    email: "maria.gomez@example.com",
    telefono: "987-654-3210",
    tipo_usuario: 2,
    dept_id: 2,
    cedula: "V-87654321",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    telefono: "555-123-4567",
    tipo_usuario: 3,
    dept_id: 3,
    cedula: "V-23456789",
  },
]

const UserManage = () => {
  // State for UI elements only (no functionality)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState<string>("all")
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Colors for theming
  const cardBg = useColorModeValue("white", "gray.700")
  const headerBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const textColor = useColorModeValue("type.title", "white")

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} >
      {/* Main Card Container */}
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" border="1px" borderColor={borderColor} mb={6}>
        {/* Card Header with Title and New User Button */}
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Usuarios
            </Heading>
            <Button bgColor={'type.bgbutton'} leftIcon={<Icon as={FiUserPlus as React.ElementType} />} colorScheme="teal" size="md" onClick={onOpen}>
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
                  icon={<Icon as={FiFilter as React.ElementType} />}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  borderRadius="md"
                  w={{ base: "full", md: "auto" }}
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

            <Button color={'type.title'} leftIcon={<Icon as={FiDownload as React.ElementType} />} variant="outline" colorScheme={'type.bgbutton'} size="md">
              Exportar
            </Button>
          </Flex>

          {/* Users Table */}
          <TableContainer
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            overflow="auto"
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
                {sampleUsers.map((user) => (
                  <Tr key={user.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
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
                          <Icon as={FiUser as React.ElementType} />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">{`${user.nombre} ${user.apellido}`}</Text>
                          <Text fontSize="sm" color="gray.500" display={{ base: "block", md: "none" }}>
                            {user.email}
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
                    <Td display={{ base: "none", md: "table-cell" }}>{user.email}</Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{user.telefono || "N/A"}</Td>
                    <Td display={{ base: "none", lg: "table-cell" }}>{"N/A"}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{user.cedula}</Td>
                    <Td>
                      <Flex justify="center" gap={2}>
                        <IconButton
                          aria-label="Editar usuario"
                          icon={<Icon as={FiEdit as React.ElementType} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => { }}
                        />
                        <IconButton
                          aria-label="Eliminar usuario"
                          icon={<Icon as={FiTrash2 as React.ElementType} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => { }}
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Más opciones"
                            icon={<Icon as={FiMoreVertical as React.ElementType} />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<Icon as={FiUser as React.ElementType} />}>Ver perfil</MenuItem>
                            <MenuItem icon={<Icon as={FiMail as React.ElementType} />}>Enviar correo</MenuItem>
                            <MenuItem icon={<Icon as={FiHash as React.ElementType} />}>Restablecer contraseña</MenuItem>
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
            <Text color="gray.600">Mostrando 1-3 de 3 usuarios</Text>
            <HStack spacing={2}>
              <Button size="sm" isDisabled={true} colorScheme={'type.bgbutton'} variant="outline">
                Anterior
              </Button>
              <Button size="sm" bgColor={'type.bgbutton'} color={'type.cbutton'} variant="solid">
                1
              </Button>
              <Button size="sm" isDisabled={true} colorScheme={'type.bgbutton'} variant="outline">
                Siguiente
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
      <UserForm isOpen={isOpen} onClose={onClose} userTypes={userTypes} departments={departments} />
    </Box>
  )
}

export default UserManage
