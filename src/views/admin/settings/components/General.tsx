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
  Image, // Importar Image para mostrar la vista previa
  useToast, // Importar useToast
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { uploadConfigImage, getGeneralConfig, GeneralConfig} from "../../../../api/SettingsApi"; // Asegúrate de que esta ruta sea correcta

const GeneralSettings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#310493"); // Color primario inicial
  const [favicon, setFavicon] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [nombreInstitucion, setNombreInstitucion] = useState<string>("");

  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const toast = useToast(); // Inicializar useToast

  useEffect(() => {
    document.documentElement.style.setProperty("--chakra-colors-type-primary", "#310493");
    localStorage.setItem("primaryColor", "#310493");
    
    const fetchConfig = async () => {
      console.log("Fetching general configuration...");
      const baseURL = import.meta.env.VITE_API_BASE_URL; // Mover baseURL aquí
      console.log("Base URL:", baseURL);

      try {
        const config: GeneralConfig = await getGeneralConfig();
        console.log("Configuración obtenida (en General.tsx):", config); // Log adicional para depuración
        
        if (config) { // Asegurarse de que config no es undefined
          setPrimaryColor(config.colorprimario || "#310493");
          setNombreInstitucion(config.nombre_institucion || "");
          
          if (config.url_favicon) {
            const fullUrl = `${baseURL}${config.url_favicon}`;
            setFaviconPreview(fullUrl);
            console.log("Favicon URL (en General.tsx):", fullUrl);
          } else {
            setFaviconPreview(null);
          }
          if (config.url_banner) {
            const fullUrl = `${baseURL}${config.url_banner}`;
            setBannerPreview(fullUrl);
            console.log("Banner URL (en General.tsx):", fullUrl);
          } else {
            setBannerPreview(null);
          }
          if (config.url_logo) {
            const fullUrl = `${baseURL}${config.url_logo}`;
            setLogoPreview(fullUrl);
            console.log("Logo URL (en General.tsx):", fullUrl);
          } else {
            setLogoPreview(null);
          }
        } else {
          console.warn("La configuración obtenida es undefined o null. Se usarán valores por defecto.");
          toast({
            title: "Advertencia.",
            description: "No se encontró configuración general. Se usarán valores por defecto.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error al cargar la configuración general (en General.tsx):", error);
        toast({
          title: "Error al cargar.",
          description: "No se pudo cargar la configuración general.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchConfig();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handlerImagePost = async () => {
    try {
      const formData = new FormData();
      if (logo) formData.append("logo", logo);
      if (banner) formData.append("banner", banner);
      if (favicon) formData.append("favicon", favicon);
      formData.append("colorprimario", primaryColor);
      formData.append("nombre_institucion", nombreInstitucion);

      await uploadConfigImage(formData);
      toast({
        title: "Configuración guardada.",
        description: "La configuración se ha cargado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Después de una subida exitosa, recargar la configuración para mostrar las nuevas imágenes
      const config: GeneralConfig = await getGeneralConfig();
      setPrimaryColor(config.colorprimario);
      setNombreInstitucion(config.nombre_institucion);
      
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      if (config.url_favicon) setFaviconPreview(`${baseURL}${config.url_favicon}`);
      else setFaviconPreview(null); // Limpiar si no hay URL
      if (config.url_banner) setBannerPreview(`${baseURL}${config.url_banner}`);
      else setBannerPreview(null); // Limpiar si no hay URL
      if (config.url_logo) setLogoPreview(`${baseURL}${config.url_logo}`);
      else setLogoPreview(null); // Limpiar si no hay URL

    } catch (error) {
      console.error("Error al subir la configuración:", error);
      toast({
        title: "Error al guardar.",
        description: "Hubo un error al subir la configuración. Por favor, inténtalo de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setFavicon(null);
    setBanner(null);
    setLogo(null);
    setFaviconPreview(null); // Limpiar los previews de los archivos seleccionados
    setBannerPreview(null);
    setLogoPreview(null);

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
          <Input 
            id="nombreInstitucionInput" 
            placeholder="Nombre de la institución" 
            focusBorderColor="type.bgbutton" 
            value={nombreInstitucion}
            onChange={(e) => setNombreInstitucion(e.target.value)}
          />
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
            {faviconPreview ? (
              <Image src={faviconPreview} alt="Favicon Preview" maxH="100px" mx="auto" mb={2} />
            ) : (
              <>
                <Icon as={FiUpload} boxSize={6} color="gray.500" />
                <Text mt={2} color="gray.500">
                  Arrastra y suelta una imagen aquí o haz clic para seleccionar
                </Text>
              </>
            )}
            <Input type="file" id="faviconInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={(e) => handleFileChange(e, setFavicon, setFaviconPreview)} />
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
            {bannerPreview ? (
              <Image src={bannerPreview} alt="Banner Preview" maxH="100px" mx="auto" mb={2} />
            ) : (
              <>
                <Icon as={FiUpload} boxSize={6} color="gray.500" />
                <Text mt={2} color="gray.500">
                  Arrastra y suelta una imagen aquí o haz clic para seleccionar
                </Text>
              </>
            )}
            <Input type="file" id="bannerInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={(e) => handleFileChange(e, setBanner, setBannerPreview)} />
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
            {logoPreview ? (
              <Image src={logoPreview} alt="Logo Preview" maxH="100px" mx="auto" mb={2} />
            ) : (
              <>
                <Icon as={FiUpload} boxSize={6} color="gray.500" />
                <Text mt={2} color="gray.500">
                  Arrastra y suelta una imagen aquí o haz clic para seleccionar
                </Text>
              </>
            )}
            <Input type="file" id="logoInput" accept="image/*" opacity={0} position="absolute" top={0} left={0} w="100%" h="100%" cursor="pointer" onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)} />
          </Box>
        </FormControl>

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
