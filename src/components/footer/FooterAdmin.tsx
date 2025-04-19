import { Box, Flex, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const textColor = useColorModeValue('gray.600', 'white');
  const bgColor = useColorModeValue('gray.100', 'navy.800');
  const iconColor = useColorModeValue('blue.500', 'white');

  return (
    <Box bg={bgColor} py="20px" px="30px" mt="auto">
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="10px"
        textAlign="center"
      >
        
        <Text fontSize="sm" color={textColor}>
          Alcaldía Bolivariana del Municipio Cárdenas © {new Date().getFullYear()} All rights reserved
        </Text>

      
        <Flex gap="15px">
          <Link href="https://www.facebook.com" isExternal>
            <Icon as={FaFacebook as React.ElementType} w="20px" h="20px" color={iconColor} _hover={{ color: 'blue.600' }} />
          </Link>
          <Link href="https://www.twitter.com" isExternal>
            <Icon as={FaTwitter as React.ElementType} w="20px" h="20px" color={iconColor} _hover={{ color: 'blue.400' }} />
          </Link>
          <Link href="https://www.instagram.com" isExternal>
            <Icon as={FaInstagram as React.ElementType} w="20px" h="20px" color={iconColor} _hover={{ color: 'pink.400' }} />
          </Link>
          <Link href="https://www.youtube.com" isExternal>
            <Icon as={FaYoutube as React.ElementType} w="20px" h="20px" color={iconColor} _hover={{ color: 'red.500' }} />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}