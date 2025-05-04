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
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any; // Usuario a editar (opcional)
  onSave: (user: any) => void; // Función para guardar cambios
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    tipo_usuario: '2',
    dept_id: '1',
  });
   

  const toast = useToast();
   
  useEffect(() => {
    if (user) {
      setFormData(user); // Carga los datos del usuario seleccionado
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        cedula: '',
        telefono: '',
        tipo_usuario: '2',
        dept_id: '1',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    toast({
      title: user ? 'Usuario actualizado' : 'Usuario creado',
      description: user
        ? 'Los datos del usuario se han actualizado correctamente.'
        : 'El usuario se ha creado correctamente.',
      status: 'success', // Tipo de notificación: success, error, warning, info
      duration: 3000, // Duración en milisegundos
      isClosable: true, // Permite cerrar la notificación manualmente
    });
    onClose() // Llama a la función de guardado
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Flex gap={4}>
              <FormControl flex="1">
                <FormLabel>Nombre</FormLabel>
                <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Apellido</FormLabel>
                <Input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
              </FormControl>
            </Flex>

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

            <Flex gap={4}>
              <FormControl flex="1">
                <FormLabel>Tipo de Usuario</FormLabel>
                <Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                  <option value="3">Invitado</option>
                </Select>
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Departamento</FormLabel>
                <Select name="dept_id" value={formData.dept_id} onChange={handleChange}>
                  <option value="1">Recursos Humanos</option>
                  <option value="2">Tecnología</option>
                  <option value="3">Finanzas</option>
                  <option value="4">Marketing</option>
                </Select>
              </FormControl>
            </Flex>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            {user ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;