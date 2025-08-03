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
import { uploadConfigImage } from "../../../../api/SettingsApi"; // Asegúrate de que esta ruta sea correcta
const GeneralSettings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#310493"); // Color primario inicial
  const [secondaryColor, setSecondaryColor] = useState("#00dafc"); // Color secundario inicial
  const [favicon, setFavicon] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);;
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

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBanner(e.target.files?.[0] || null);
  };
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFavicon(e.target.files?.[0] || null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0]);
    }
  }
  const handlerImagePost = async () => {
    try {
      const formData = new FormData();
      if (logo) formData.append("logo", logo);
      if (banner) formData.append("banner", banner);
      if (favicon) formData.append("favicon", favicon);
      // Agrega los campos de texto
      formData.append("colorprimario", primaryColor);
      formData.append("colorsecundario", secondaryColor);

      // Obtén el valor del input de nombre de la institución
      const nombreInput = document.getElementById("nombreInstitucionInput") as HTMLInputElement | null;
      if (nombreInput && nombreInput.value) {
        formData.append("nombre_institucion", nombreInput.value);
      }

      await uploadConfigImage(formData);
      alert("Configuración cargada correctamente.");
    } catch (error) {
      console.error("Error al subir la configuración:", error);
      alert("Error al subir la configuración. Por favor, inténtalo de nuevo.");
    }
    setFavicon(null);
    setBanner(null);
    setLogo(null);
    const faviconInput = document.getElementById("faviconInput") as HTMLInputElement | null;
    if (faviconInput) faviconInput.value = "";
    const bannerInput = document.getElementById("bannerInput") as HTMLInputElement | null;
    if (bannerInput) bannerInput.value = "";
    const logoInput = document.getElementById("logoInput") as HTMLInputElement | null;
    if (logoInput) logoInput.value = "";
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>
        Configuración General
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Nombre de la Institución</FormLabel>
          <Input id="nombreInstitucionInput" placeholder="Nombre de la institución" focusBorderColor="type.bgbutton" />
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
            <Input type="file" id="faviconInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={handleFaviconChange} />
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
            <Input type="file" id="bannerInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={handleBannerChange} />
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
            <Input type="file" id="logoInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={handleLogoChange} />
          </Box>
        </FormControl>

        {/* Color Pickers en disposición horizontal */}
        <HStack spacing={8} align="stretch">
          <FormControl>
            <FormLabel>Color Primario</FormLabel>
            <ColorPicker color={primaryColor} onColorChange={handlePrimaryColorChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Color Secundario</FormLabel>
            <ColorPicker color={secondaryColor} onColorChange={handleSecondaryColorChange} />
          </FormControl>
        </HStack>

        <Button
          colorScheme="purple"
          bgColor={"type.primary"}
          alignSelf="flex-end"
          onClick={handlerImagePost}
        >
          Guardar cambios
        </Button>
      </VStack>
    </Box>
  );
};

export default GeneralSettings;