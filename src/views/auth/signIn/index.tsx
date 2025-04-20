import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import banner from 'assets/img/BANNER-ALCALDIA-CARDENAS-1.png';
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.400');
  const textColorBrand = useColorModeValue('brand.500', 'white');
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
        <Flex
          alignItems="center"
          justifyContent="center"
          bgColor="type.bgbutton"
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
            Ingresa tu correo y contraseña para acceder al sistema.
          </Text>
          <FormControl mb={4}>
            <FormLabel color={textColor}>Correo Electrónico</FormLabel>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel color={textColor}>Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                focusBorderColor="blue.500"
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
          <Button w="100%" colorScheme="blue" mb={4}>
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
