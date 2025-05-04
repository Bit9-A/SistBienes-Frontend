import React, { useState, useEffect } from "react";
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
  HStack,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import ColorPicker from "./ColorPicker";

const GeneralSettings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#310493"); // Color primario inicial
  const [secondaryColor, setSecondaryColor] = useState("#00dafc"); // Color secundario inicial

  // Cargar colores desde localStorage al iniciar
  useEffect(() => {
    const savedPrimaryColor = localStorage.getItem("primaryColor");
    const savedSecondaryColor = localStorage.getItem("secondaryColor");

    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
      document.documentElement.style.setProperty("--chakra-colors-type-primary", savedPrimaryColor);
    }

    if (savedSecondaryColor) {
      setSecondaryColor(savedSecondaryColor);
      document.documentElement.style.setProperty("--chakra-colors-type-secondary", savedSecondaryColor);
    }
  }, []);

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty("--chakra-colors-type-primary", color);
    localStorage.setItem("primaryColor", color); // Guardar en localStorage
  };

  const handleSecondaryColorChange = (color: string) => {
    setSecondaryColor(color);
    document.documentElement.style.setProperty("--chakra-colors-type-secondary", color);
    localStorage.setItem("secondaryColor", color); // Guardar en localStorage
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>
        Configuración General
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Nombre de la Institución</FormLabel>
          <Input placeholder="Nombre de la institución" focusBorderColor="type.bgbutton" />
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
            _hover={{ borderColor: "type.bgbutton" }}
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
            _hover={{ borderColor: "type.bgbutton" }}
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
            _hover={{ borderColor: "type.bgbutton" }}
          >
            <Icon as={FiUpload} boxSize={6} color="gray.500" />
            <Text mt={2} color="gray.500">
              Arrastra y suelta una imagen aquí o haz clic para seleccionar
            </Text>
            <Input type="file" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" />
          </Box>
        </FormControl>

        {/* Color Pickers en disposición horizontal */}
        <HStack spacing={8} align="stretch">
          <FormControl>
            <FormLabel>Color Primario</FormLabel>
            <ColorPicker onColorChange={handlePrimaryColorChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Color Secundario</FormLabel>
            <ColorPicker onColorChange={handleSecondaryColorChange} />
          </FormControl>
        </HStack>

        <Button
          colorScheme="purple"
          bgColor={"type.primary"}
          alignSelf="flex-end"
        >
          Guardar cambios
        </Button>
      </VStack>
    </Box>
  );
};

export default GeneralSettings;