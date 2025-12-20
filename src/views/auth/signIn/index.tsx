import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Image,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import banner from 'assets/img/banner.png';
import { handleLogin, handleLogout } from '../signIn/utils/authUtils'; // Asegúrate de que la ruta sea correcta
import { getProfile } from '../../../api/UserApi'; // Ajusta la ruta si es necesario

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate(); // Inicializa useNavigate

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    // Verifica si el usuario ya está autenticado al cargar el componente
    if (localStorage.getItem('user') || localStorage.getItem('token')) {
      handleLogout();
      toast({
        title: 'Sesión cerrada',
        description: 'Has sido desconectado exitosamente.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Por favor, completa todos los campos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await handleLogin(username, password);
      // Obtener el perfil del usuario después de iniciar sesión
      const profile = await getProfile();
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido al sistema.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Redirigir según el tipo de usuario
      if (profile.nombre_tipo_usuario === 'Administrador') {
        navigate('/admin/default');
      } else {
        navigate('/admin/asset-management');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.400');

  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Flex
        w={{ base: '90%', md: '800px' }}
        bg={useColorModeValue('white', 'gray.700')}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
      >
        {/* Banner */}
        <Flex
          alignItems="center"
          justifyContent="center"
          bgColor="type.primary"
          display={{ base: 'none', md: 'flex' }}
        >
          <Image src={banner} alt="Banner Alcaldía" objectFit="contain" />
        </Flex>

        {/* Formulario de inicio de sesión */}
        <Box w={{ base: '100%', md: '60%' }} p={8}>
          <Heading color={textColor} fontSize="2xl" mb={4}>
            Iniciar Sesión
          </Heading>
          <Text color={textColorSecondary} mb={6}>
            Ingresa tu nombre de usuario o correo electrónico y contraseña para
            acceder al sistema.
          </Text>
          <FormControl mb={4}>
            <FormLabel color={textColor}>
              Nombre de Usuario o Correo Electrónico
            </FormLabel>
            <Input
              type="text"
              placeholder="Nombre de usuario o correo electrónico"
              focusBorderColor="type.primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel color={textColor}>Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                focusBorderColor="type.primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={handlePasswordVisibility}
                  size="sm"
                >
                  {showPassword ? (
                    <RiEyeCloseLine color={textColorSecondary} />
                  ) : (
                    <MdOutlineRemoveRedEye color={textColorSecondary} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            w="100%"
            bg="type.primary"
            color="white"
            _hover={{ bg: 'type.primary', opacity: 0.9 }}
            mb={4}
            onClick={handleSubmit}
          >
            Iniciar Sesión
          </Button>
          <Text fontSize="sm" color={textColorSecondary} textAlign="center">
            ¿Olvidaste tu contraseña? Contacta al administrador.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignIn;
