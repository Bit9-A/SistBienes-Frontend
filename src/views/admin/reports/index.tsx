"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import * as ReportUtils from "./utils/ReportUtils";
import { MissingGood } from "api/ReportApi";
import ReportForm from "./components/ReportForm";
import { MovableAsset } from "api/AssetsApi";
import { getProfile } from "api/UserApi";

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReport: (newMissingGood: Omit<MissingGood, "id">) => Promise<void>;
}

const MissingAssetsReport = () => {
  const [missingAssets, setMissingAssets] = useState<MissingGood[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBienes, setIsBienes] = useState(false);
  const [deptId, setDeptId] = useState<number | null>(null);

  // Colores para el tema
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("type.title", "white");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    const fetchMissingAssets = async () => {
      try {
        const profile = await getProfile();
        let assets: MissingGood[] = [];
        setIsAdmin(profile?.nombre_tipo_usuario === 'Administrador');
        setIsBienes(profile?.dept_id === 1);
        setDeptId(profile?.dept_id);

        if (profile?.nombre_tipo_usuario === 'Administrador' || profile?.dept_id === 1) {
          // Admins and Bienes see all
          assets = await ReportUtils.getMissingAssets();
        } else {
          // Others see only their department
          assets = (await ReportUtils.getMissingAssets()).filter(asset => asset.unidad === profile?.dept_id);
        }
        setMissingAssets(assets);
      } catch (error) {
        console.error("Error al cargar los bienes faltantes:", error);
      }
    };

    fetchMissingAssets();
  }, []);

  const handleCreateReport = async (newMissingGood: Omit<MissingGood, "id">) => {
    try {
      const profile = await getProfile();
      
      const updatedMissingGood = {
        ...newMissingGood,
        funcionario_id: profile?.id || 0,
        fecha: new Date().toISOString(),
        funcionario_nombre: "",
        jefe_nombre: "",
        departamento: "",
        numero_identificacion: ""
      };
      
      await ReportUtils.createMissingAsset(updatedMissingGood);
      
      // Refresh the list after creating the reports
      const updatedAssets = await ReportUtils.getMissingAssets();
      setMissingAssets(updatedAssets);
    } catch (error) {
      console.error("Error creating missing asset report:", error);
      throw error;
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Contenedor principal */}
      <Card
        bg={cardBg}
        boxShadow="sm"
        borderRadius="xl"
        border="1px"
        mb={6}
      >
        {/* Encabezado del card */}
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="lg" fontWeight="bold" color={textColor}>
              Reportar Bienes Faltantes
            </Heading>
            <Button
              bgColor="type.primary"
              colorScheme="purple"
              leftIcon={<FiPlus />}
              onClick={onOpen}
            >
              Nuevo Reporte
            </Button>
          </Flex>
        </CardHeader>

        {/* Cuerpo del card */}
        <CardBody>
          {/* Tabla de bienes faltantes */}
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
                  <Th>N°</Th>
                  <Th>Unidad de Trabajo</Th>
                  <Th>Existencias</Th>
                  <Th>Diferencia Cantidad</Th>
                  <Th>Diferencia Valor</Th>
                  <Th>Funcionario</Th>
                  <Th>Jefe</Th>
                  <Th>Observaciones</Th>
                  <Th>Numero de Identificacion</Th>
                </Tr>
              </Thead>
              <Tbody>
                {missingAssets.map((asset, index) => (
                  <Tr
                    key={asset.id}
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td>{index + 1}</Td>
                    <Td>{asset.departamento}</Td>
                    <Td>{asset.existencias}</Td>
                    <Td>{asset.diferencia_cantidad}</Td>
                    <Td>{asset.diferencia_valor}</Td>
                    <Td>{asset.funcionario_nombre}</Td>
                    <Td>{asset.jefe_nombre}</Td>
                    <Td>{asset.observaciones}</Td>
                    <Td>{asset.numero_identificacion}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <ReportForm
        isOpen={isOpen}
        onClose={onClose}
        onCreateReport={handleCreateReport}
      />
    </Box>
  );
};

export default MissingAssetsReport;
