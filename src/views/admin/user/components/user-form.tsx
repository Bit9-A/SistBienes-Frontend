import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';

export interface Usuario {
  id?: number;
  tipo_usuario: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  dept_id: number;
  cedula: string;
}

interface UserFormProps {
  onSave: (usuario: Usuario) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<Usuario>({
    tipo_usuario: 1,
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    dept_id: 1,
    cedula: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
    setFormData({
      tipo_usuario: 1,
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      telefono: '',
      dept_id: 1,
      cedula: '',
    });
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Agregar Usuario
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nuevo Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                <option value={1}>Administrador</option>
                <option value={2}>Usuario Regular</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Contraseña</FormLabel>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input name="apellido" value={formData.apellido} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input name="telefono" value={formData.telefono} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Departamento</FormLabel>
              <Input name="dept_id" type="number" value={formData.dept_id} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Cédula</FormLabel>
              <Input name="cedula" value={formData.cedula} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserForm;