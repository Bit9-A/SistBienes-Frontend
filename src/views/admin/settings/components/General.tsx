import type React from "react"
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Icon,
} from "@chakra-ui/react"
import { FiUpload } from "react-icons/fi"

const GeneralSettings: React.FC = () => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>
        Configuración General
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Nombre de la Institución</FormLabel>
          <Input placeholder="Nombre de la institución" />
        </FormControl>

        <FormControl>
          <FormLabel>Favicon</FormLabel>
          <Box
            border="2px"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "blue.400" }}
          >
            <Icon as={FiUpload} boxSize={6} color="gray.500" />
            <Text mt={2} color="gray.500">
              Arrastra y suelta una imagen aquí o haz clic para seleccionar
            </Text>
            <Input type="file" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Banner</FormLabel>
          <Box
            border="2px"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "blue.400" }}
          >
            <Icon as={FiUpload} boxSize={6} color="gray.500" />
            <Text mt={2} color="gray.500">
              Arrastra y suelta una imagen aquí o haz clic para seleccionar
            </Text>
            <Input type="file" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Logo para Impresión</FormLabel>
          <Box
            border="2px"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "blue.400" }}
          >
            <Icon as={FiUpload} boxSize={6} color="gray.500" />
            <Text mt={2} color="gray.500">
              Arrastra y suelta una imagen aquí o haz clic para seleccionar
            </Text>
            <Input type="file" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" />
          </Box>
        </FormControl>

        <Button colorScheme="blue" alignSelf="flex-end">
          Guardar cambios
        </Button>
      </VStack>
    </Box>
  )
}

export default GeneralSettings