import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { getDepartments, Department } from 'api/SettingsApi';
import { getUserRoles, UserRole } from 'api/UserRoleApi';

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void; // Función para guardar el nuevo usuario
}

interface EditUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Usuario a editar
  onSave: (user: any) => void; // Función para guardar los cambios
}

const isValidEmail = (email: string) => {
  // Expresión regular para validar el formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    cedula: '',
    telefono: '',
    tipo_usuario: '2',
    dept_id: '1',
    password: '',
  });

  const toast = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchUserRoles = async () => {
    try {
      const response = await getUserRoles();
      setUserRoles(response);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUserRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.tipo_usuario ||
      !formData.dept_id
    ) {
      toast({
        title: 'Error',
        description: 'Por favor, completa todos los campos obligatorios.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast({
        title: 'Error',
        description: 'Por favor, ingresa un email válido.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await onSave({ ...formData, isActive: 1 }); // Si hay error, lanzará excepción y no sigue
      toast({
        title: 'Usuario creado',
        description: 'El usuario se ha creado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        'Error desconocido';
      toast({
        title: 'Error',
        description: backendMsg,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      // No cierres el modal aquí
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Nuevo Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            {/* Row 1: Nombre y Apellido */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>
                  Nombre<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>
                  Apellido<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                />
              </FormControl>
            </Stack>

            {/* Row 2: Username y Email */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>
                  Nombre de Usuario <span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>
                  Email<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
            </Stack>

            {/* Row 3: Cédula y Teléfono */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>
                  Cédula<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="V-12345678"
                  maxLength={11}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>
                  Teléfono<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  maxLength={11}
                />
              </FormControl>
            </Stack>

            {/* Row 4: Contraseña */}
            <FormControl>
              <FormLabel>
                Contraseña<span style={{ color: 'red' }}> *</span>
              </FormLabel>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                type="password"
              />
            </FormControl>

            {/* Row 5: Tipo de Usuario y Departamento */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>
                  Tipo de Usuario<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ boxShadow: 'outline' }}
                    w="100%"
                    textAlign="left"
                  >
                    {userRoles.find(
                      (role) => role.id === Number(formData.tipo_usuario),
                    )?.nombre || 'Seleccione un tipo de usuario'}
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                  >
                    {userRoles.map((role) => (
                      <MenuItem
                        key={role.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tipo_usuario: role.id.toString(),
                          }))
                        }
                      >
                        {role.nombre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel>
                  Departamento<span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ boxShadow: 'outline' }}
                    w="100%"
                    textAlign="left"
                  >
                    {departments.find(
                      (dept) => dept.id === Number(formData.dept_id),
                    )?.nombre || 'Seleccione un departamento'}
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    maxH="300px"
                    overflowY="auto"
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dept_id: dept.id.toString(),
                          }))
                        }
                      >
                        {dept.nombre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={'purple'}
            bgColor={'type.primary'}
            mr={3}
            onClick={handleSubmit}
          >
            Crear Usuario
          </Button>
          <Button onClick={onClose} colorScheme="red">
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const EditUserForm: React.FC<EditUserFormProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '', // <-- Nuevo campo
    email: '',
    cedula: '',
    telefono: '',
    tipo_usuario: '',
    dept_id: '',
    isActive: '1', // <-- Nuevo campo
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, userRolesData] = await Promise.all([
          getDepartments(),
          getUserRoles(),
        ]);
        setDepartments(departmentsData);
        setUserRoles(userRolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    if (user) {
      setFormData({
        ...user,
        isActive: user.isActive !== undefined ? String(user.isActive) : '1',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.username ||
      !formData.email
    ) {
      toast({
        title: 'Error',
        description: 'Por favor, completa todos los campos obligatorios.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave(formData);
    toast({
      title: 'Usuario actualizado',
      description: 'Los datos del usuario se han actualizado correctamente.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            {/* Row 1: Nombre y Apellido */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Apellido</FormLabel>
                <Input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                />
              </FormControl>
            </Stack>

            {/* Row 2: Username y Email */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>Nombre de Usuario</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
            </Stack>

            {/* Row 3: Cédula y Teléfono */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>Cédula</FormLabel>
                <Input
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="V-12345678"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                />
              </FormControl>
            </Stack>

            {/* Row 4: Activo */}
            <FormControl>
              <FormLabel>Activo</FormLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </Select>
            </FormControl>

            {/* Row 5: Tipo de Usuario y Departamento */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl flex={1}>
                <FormLabel>Tipo de Usuario</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ boxShadow: 'outline' }}
                    w="100%"
                    textAlign="left"
                  >
                    {userRoles.find(
                      (role) => role.id === Number(formData.tipo_usuario),
                    )?.nombre || 'Seleccione un tipo de usuario'}
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                  >
                    {userRoles.map((role) => (
                      <MenuItem
                        key={role.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tipo_usuario: role.id.toString(),
                          }))
                        }
                      >
                        {role.nombre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel>Departamento</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ boxShadow: 'outline' }}
                    w="100%"
                    textAlign="left"
                  >
                    {departments.find(
                      (dept) => dept.id === Number(formData.dept_id),
                    )?.nombre || 'Seleccione un departamento'}
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    maxH="300px"
                    overflowY="auto"
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dept_id: dept.id.toString(),
                          }))
                        }
                      >
                        {dept.nombre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={'purple'}
            bgColor={'type.primary'}
            mr={3}
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
          <Button onClick={onClose} colorScheme="red">
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { CreateUserForm, EditUserForm };
