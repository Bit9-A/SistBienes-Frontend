import React from "react"
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
} from "@chakra-ui/react"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  userTypes: Record<number, { name: string; color: string }>
  departments: Record<number, string>
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, userTypes, departments }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Nuevo Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Flex gap={4}>
              <FormControl flex="1">
                <FormLabel>Nombre</FormLabel>
                <Input placeholder="Nombre" />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Apellido</FormLabel>
                <Input placeholder="Apellido" />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Email" type="email" />
            </FormControl>

            <FormControl>
              <FormLabel>Cédula</FormLabel>
              <Input placeholder="V-12345678" />
            </FormControl>

            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input placeholder="Teléfono" />
            </FormControl>

            <Flex gap={4}>
              <FormControl flex="1">
                <FormLabel>Tipo de Usuario</FormLabel>
                <Select defaultValue="2">
                  {Object.entries(userTypes).map(([id, { name }]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Departamento</FormLabel>
                <Select defaultValue="1">
                  {Object.entries(departments).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input placeholder="Contraseña" type="password" />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3}>
            Crear Usuario
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserForm