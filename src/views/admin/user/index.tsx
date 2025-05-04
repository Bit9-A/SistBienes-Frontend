import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
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
} from 'react-icons/fi';

import {CreateUserForm,EditUserForm} from './components/UserForm';

import { getUsers, updateUser, deleteUser, createUser,User } from '../../../api/UserApi';
import { filterUsers,handleDeleteUser,handleEditUser,handleUpdateUser, handleSaveEditUser,handleCreateUser} from "./utils/UserLogic"


const UserManage = () => {
  // State for UI elements only (no functionality)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedUserType, setSelectedUserType] = useState('all');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState(null); // Usuario seleccionado para editar

  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // Usuario seleccionado para eliminar
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure(); // Controla el estado del diálogo de confirmación




  // Fetch users from API or state management
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = filterUsers(users, searchQuery, selectedDept, selectedUserType);
  
  // Funciones para manejar la creación y edición de usuarios
  const handleCreateUserWrapper = async (newUser:any) => {
    await handleCreateUser(newUser, createUser, setUsers);
    await fetchUsers(); // Refresca la lista de usuarios después de crear uno nuevo
    onClose(); // Cierra el modal después de crear el usuario
  };

  const handleSaveEditUserWrapper = async (updatedUser:any) => {
    handleSaveEditUser(updatedUser, updateUser, setUsers, onClose);
    await fetchUsers(); // Refresca la lista de usuarios después de editar
  };


  // Funciones para manejar la eliminación de usuarios
  const handleDeleteUserWrapper = async (id:number) => {
    await handleDeleteUser(id, deleteUser, setUsers);
    await fetchUsers(); // Refresca la lista de usuarios después de eliminar
  }

  // Colors for theming
  const cardBg = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('type.title', 'white');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Card Container */}
      <Card
        bg={cardBg}
        boxShadow="sm"
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        mb={6}
      >
        {/* Card Header with Title and New User Button */}
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Usuarios
            </Heading>
            <Button
              bgColor={'type.primary'}
              leftIcon={<Icon as={FiUserPlus as React.ElementType} />}
              colorScheme="purple"
              size="md"
              onClick={() => {
                setEditingUser(null);
                onOpen(); // Abre el formulario de creación
              }}
            >
              Nuevo Usuario
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          {/* Filters and Search */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            mb={6}
            gap={4}
          >
            <HStack spacing={4} flex={{ md: 2 }}>
              <InputGroup maxW={{ md: '320px' }}>
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
                  w={{ base: 'full', md: 'auto' }}
                >
                  <option value="all">Todos los departamentos</option>
                  {/*Object.entries(departments).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                   </option>
                  ))*/}
                </Select>
              </Box>
            </HStack>

            <Button
              color={'type.title'}
              leftIcon={<Icon as={FiDownload as React.ElementType} />}
              variant="outline"
              colorScheme={'type.primary'}
              size="md"
            >
              Exportar
            </Button>
          </Flex>

          <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
            <Table variant="simple" size="md">
              <Thead bg={headerBg}>
                <Tr>
                  <Th>Usuario</Th>
                  <Th>Tipo</Th>
                  <Th>Email</Th>
                  <Th>Teléfono</Th>
                  <Th>Departamento</Th>
                  <Th>Cédula</Th>
                  <Th textAlign="center">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                    <Td>
                      <Text fontWeight="medium">{`${user.nombre} ${user.apellido}`}</Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={user.tipo_usuario?.color || 'gray'}
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {user.tipo_usuario?.name || 'Desconocido'}
                      </Badge>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.telefono || 'N/A'}</Td>
                    <Td>{user.dept_id || 'N/A'}</Td>
                    <Td>{user.cedula}</Td>
                    <Td>
                      <Flex justify="center" gap={2}>
                        <IconButton
                          aria-label="Editar usuario"
                          icon={<FiEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleEditUser(user,setEditingUser,onOpen)} // Abre el formulario de edición
                        />
                        <IconButton
                          aria-label="Eliminar usuario"
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => { 
                            setUserToDelete(user);
                            onDeleteDialogOpen();}}
                        />
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
              <Button
                size="sm"
                isDisabled={true}
                colorScheme={'type.primary'}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                size="sm"
                bgColor={'type.primary'}
                color={'type.cbutton'}
                variant="solid"
              >
                1
              </Button>
              <Button
                size="sm"
                isDisabled={true}
                colorScheme={'type.primary'}
                variant="outline"
              >
                Siguiente
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
     
     {/* Renderiza el formulario correspondiente */}
     {editingUser ? (
        <EditUserForm
          isOpen={isOpen}
          onClose={()=>{
            setEditingUser(null);
            onClose(); // Cierra el modal después de editar
          }}
          user={editingUser}
          onSave={handleSaveEditUserWrapper} // Función para guardar cambios
        />
      ) : (
        <CreateUserForm isOpen={isOpen} onClose={onClose} onSave={handleCreateUserWrapper} />
      )}
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        isCentered
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={undefined}
        onClose={onDeleteDialogClose}
        motionPreset="slideInBottom"
        closeOnOverlayClick={false}
        size="lg"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong>{userToDelete?.nombre} {userToDelete?.apellido}</strong>? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteDialogClose}>Cancelar</Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeleteUserWrapper(userToDelete.id);
                  onDeleteDialogClose();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserManage;

