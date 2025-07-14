import {
  Box,
  Stack,
  Text,
  Badge,
  IconButton,
  HStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiDownload, FiEye } from "react-icons/fi" // Importar FiDownload y FiEye
import { type MissingGoods } from "api/ReportApi"
import { type Department } from "api/SettingsApi"

interface MobileCardProps {
  missingGoods: MissingGoods[]
  borderColor: string
  departments: Department[]
  onViewDetails: (mg: MissingGoods) => void // Nueva prop para ver detalles
  onExportBM3: (missingGood: MissingGoods) => void
}

export default function MobileCard({
  missingGoods,
  borderColor,
  departments,
  onViewDetails, // Recibir la nueva prop
  onExportBM3,
}: MobileCardProps) {
  const cardBg = useColorModeValue("white", "gray.800")

  return (
    <Stack spacing={4}>
      {missingGoods.map((mg) => (
        <Box
          key={mg.id}
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
          p={4}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg">
              Bien ID: {mg.bien_id}
            </Text>
            <HStack spacing={1}>
              <IconButton
                aria-label="Ver Detalles"
                icon={<FiEye />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() => onViewDetails(mg)} // Llamar a la función de ver detalles
              />
              <IconButton
                aria-label="Exportar BM-3"
                icon={<FiDownload />}
                size="sm"
                variant="ghost"
                colorScheme="green"
                onClick={() => onExportBM3(mg)}
              />
            </HStack>
          </Flex>
          <Stack spacing={1} fontSize="sm">
            <Text>
              <b>Fecha:</b> {mg.fecha ? new Date(mg.fecha).toLocaleDateString() : ""}
            </Text>
            <Text>
              <b>Unidad:</b> {mg.unidad}
            </Text>
            <Text>
              <b>Funcionario:</b> {mg.funcionario_nombre}
            </Text>
            <Text>
              <b>Jefe:</b> {mg.jefe_nombre}
            </Text>
            <Text>
              <b>Departamento:</b> {mg.departamento}
            </Text>
            <Text>
              <b>N° Identificación:</b> {mg.numero_identificacion || "-"}
            </Text>
            {mg.observaciones && (
              <Badge colorScheme="purple" mt={1}>
                {mg.observaciones}
              </Badge>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
