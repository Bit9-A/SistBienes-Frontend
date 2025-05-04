import { useThemeColors } from "../../../theme/useThemeColors";

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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiClock, FiUser, FiDownload, FiFilter, FiFileText } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Datos de ejemplo para auditoría
const sampleAuditLogs = [
  {
    id: 1,
    usuario: "Juan Pérez",
    accion: "Inicio de sesión",
    fecha: "2025-04-01 10:30 AM",
    descripcion: "El usuario inició sesión en el sistema.",
    tipo: "Autenticación",
    departamento: "Recursos Humanos",
  },
  {
    id: 2,
    usuario: "María Gómez",
    accion: "Creación de registro",
    fecha: "2025-04-02 02:15 PM",
    descripcion: "Se creó un nuevo registro de bienes nacionales.",
    tipo: "Creación",
    departamento: "Finanzas",
  },
  {
    id: 3,
    usuario: "Carlos Rodríguez",
    accion: "Eliminación de registro",
    fecha: "2025-04-03 11:45 AM",
    descripcion: "Se eliminó un registro de bienes nacionales.",
    tipo: "Eliminación",
    departamento: "Tecnología",
  },
];

const AuditModule = () => {
  const [auditLogs, setAuditLogs] = useState(sampleAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cardBg, textColor, borderColor, headerBg, hoverBg } = useThemeColors();

  // Filtrar registros por tipo, departamento y búsqueda
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || log.tipo.toLowerCase() === filterType.toLowerCase();
    const matchesDepartment =
      filterDepartment === "all" || log.departamento === filterDepartment;
    return matchesSearch && matchesType && matchesDepartment;
  });

  // Exportar registros a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Registros de Auditoría", 14, 10);
    autoTable(doc, {
      head: [["ID", "Usuario", "Acción", "Fecha", "Descripción", "Tipo", "Departamento"]],
      body: filteredLogs.map((log) => [
        log.id,
        log.usuario,
        log.accion,
        log.fecha,
        log.descripcion,
        log.tipo,
        log.departamento,
      ]),
      startY: 20,
    });
    doc.save("audit_logs.pdf");
  };

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
              Auditoría de Usuarios
            </Heading>
            <HStack spacing={4}>
              <Button
                bgColor="type.primary"
                colorScheme="purple"
                leftIcon={<FiDownload />}
                onClick={exportToPDF}
              >
                Exportar a PDF
              </Button>
            </HStack>
          </Flex>
        </CardHeader>

        {/* Cuerpo del card */}
        <CardBody>
          {/* Filtros y búsqueda */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={6}
            gap={4}
          >
            <HStack spacing={4} flex={{ md: 2 }}>
              <InputGroup maxW={{ md: "320px" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar usuario o acción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                />
              </InputGroup>

              <Box>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  borderRadius="md"
                  w={{ base: "full", md: "auto" }}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="autenticación">Autenticación</option>
                  <option value="creación">Creación</option>
                  <option value="eliminación">Eliminación</option>
                  <option value="actualización">Actualización</option>
                </Select>
              </Box>

              <Box>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  borderRadius="md"
                  w={{ base: "full", md: "auto" }}
                >
                  <option value="all">Todos los departamentos</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Tecnología">Tecnología</option>
                </Select>
              </Box>
            </HStack>
          </Flex>

          {/* Tabla de auditoría */}
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
                  <Th>Usuario</Th>
                  <Th>Acción</Th>
                  <Th>Fecha</Th>
                  <Th>Descripción</Th>
                  <Th>Tipo</Th>
                  <Th>Departamento</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredLogs.map((log) => (
                  <Tr
                    key={log.id}
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {log.id}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex align="center" gap={2}>
                        <FiUser />
                        <Text>{log.usuario}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Text>{log.accion}</Text>
                    </Td>
                    <Td>
                      <Text>{log.fecha}</Text>
                    </Td>
                    <Td>
                      <Text>{log.descripcion}</Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          log.tipo === "Autenticación"
                            ? "green"
                            : log.tipo === "Creación"
                              ? "blue"
                              : log.tipo === "Eliminación"
                                ? "red"
                                : "yellow"
                        }
                        borderRadius="full"
                        px={2}
                      >
                        {log.tipo}
                      </Badge>
                    </Td>
                    <Td>
                      <Text>{log.departamento}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AuditModule;