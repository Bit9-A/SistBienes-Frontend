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
} from '@chakra-ui/react';

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

const CreateUserForm: React.FC<CreateUserFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    tipo_usuario: '2',
    dept_id: '1',
    password: '',
  });

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
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
    onSave(formData);
    toast({
      title: 'Usuario creado',
      description: 'El usuario se ha creado correctamente.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Nuevo Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
            </FormControl>
            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Cédula</FormLabel>
              <Input name="cedula" value={formData.cedula} onChange={handleChange} placeholder="V-12345678" />
            </FormControl>
            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                type="password"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                <option value="1">Administrador</option>
                <option value="2">Usuario</option>
                <option value="3">Invitado</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Select name="dept_id" value={formData.dept_id} onChange={handleChange}>
                <option value="1">Recursos Humanos</option>
                <option value="2">Tecnología</option>
                <option value="3">Finanzas</option>
                <option value="4">Marketing</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'purple'} bgColor={'type.primary'} mr={3} onClick={handleSubmit}>
            Crear Usuario
          </Button>
          <Button onClick={onClose} colorScheme='red'>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const EditUserForm: React.FC<EditUserFormProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState(user);

  const toast = useToast();

  useEffect(() => {
    if (user) {
      setFormData(user); // Carga los datos del usuario seleccionado
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.apellido || !formData.email) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
            </FormControl>
            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Cédula</FormLabel>
              <Input name="cedula" value={formData.cedula} onChange={handleChange} placeholder="V-12345678" />
            </FormControl>
            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                <option value="1">Administrador</option>
                <option value="2">Usuario</option>
                <option value="3">Invitado</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Select name="dept_id" value={formData.dept_id} onChange={handleChange}>
                <option value="1">Recursos Humanos</option>
                <option value="2">Tecnología</option>
                <option value="3">Finanzas</option>
                <option value="4">Marketing</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" bgColor={'type.primary'} mr={3} onClick={handleSubmit}>
            Guardar Cambios
          </Button>
          <Button onClick={onClose} colorScheme='red'>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { CreateUserForm, EditUserForm };
