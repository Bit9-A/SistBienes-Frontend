
import { useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FiArrowRight, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// Datos de ejemplo para notificaciones
const sampleNotifications = [
  {
    id: 1,
    tipo: "Incorporación Pendiente",
    descripcion: "Incorporación de escritorios en espera de traslado.",
    fecha: "2025-04-01",
    estado: "Pendiente",
    deptOrigen: "Recursos Humanos",
    deptDestino: "Finanzas",
  },
  {
    id: 2,
    tipo: "Traslado Realizado",
    descripcion: "Traslado de sillas completado.",
    fecha: "2025-04-03",
    estado: "Completado",
    deptOrigen: "Tecnología",
    deptDestino: "Marketing",
  },
  {
    id: 3,
    tipo: "Alerta",
    descripcion: "Bien nacional con estado crítico.",
    fecha: "2025-04-05",
    estado: "Alerta",
    deptOrigen: "Finanzas",
    deptDestino: null,
  },
];

const NotificationsHistory = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  // Colores para el tema
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("type.title", "white");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Contenedor principal */}
      <Card
        bg={cardBg}
        boxShadow="sm"
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        mb={6}
      >
        {/* Encabezado del card */}
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Historial de Notificaciones
            </Heading>
          </Flex>
        </CardHeader>

        {/* Cuerpo del card */}
        <CardBody>
          {/* Tabla de notificaciones */}
          <TableContainer
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            overflow="auto"
            mb={4}
          >
            <Table variant="simple" size="md">
              <Thead bg={headerBg}>
                <Tr>
                  <Th>ID</Th>
                  <Th>Tipo</Th>
                  <Th>Descripción</Th>
                  <Th>Fecha</Th>
                  <Th>Estado</Th>
                  <Th>Departamento Origen</Th>
                  <Th>Departamento Destino</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notifications.map((notification) => (
                  <Tr
                    key={notification.id}
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {notification.id}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontWeight="medium">{notification.tipo}</Text>
                    </Td>
                    <Td>
                      <Text>{notification.descripcion}</Text>
                    </Td>
                    <Td>
                      <Text>{notification.fecha}</Text>
                    </Td>
                    <Td>
                      <Flex align="center" gap={2}>
                        {notification.estado === "Pendiente" && (
                          <>
                            <FiClock color="orange" />
                            <Text color="orange.500">{notification.estado}</Text>
                          </>
                        )}
                        {notification.estado === "Completado" && (
                          <>
                            <FiCheckCircle color="green" />
                            <Text color="green.500">{notification.estado}</Text>
                          </>
                        )}
                        {notification.estado === "Alerta" && (
                          <>
                            <FiAlertCircle color="red" />
                            <Text color="red.500">{notification.estado}</Text>
                          </>
                        )}
                      </Flex>
                    </Td>
                    <Td>
                      <Text>{notification.deptOrigen}</Text>
                    </Td>
                    <Td>
                      {notification.deptDestino ? (
                        <Flex align="center" gap={2}>
                          <Text>{notification.deptDestino}</Text>
                          <FiArrowRight />
                        </Flex>
                      ) : (
                        <Text color="gray.500">N/A</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Flex justify="space-between" align="center" mt={4}>
            <Text color="gray.600">
              Mostrando 1-{notifications.length} de {notifications.length} notificaciones
            </Text>
            <HStack spacing={2}>
              <Button size="sm" isDisabled={true} colorScheme={'type.primary'} variant="outline">
                Anterior
              </Button>
              <Button size="sm" bgColor={'type.primary'} color={'type.cbutton'} variant="solid">
                1
              </Button>
              <Button size="sm" isDisabled={true} colorScheme={'type.primary'} variant="outline">
                Siguiente
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default NotificationsHistory;