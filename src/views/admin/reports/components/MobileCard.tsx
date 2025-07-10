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
import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi" // Importar FiDownload
import { type MissingGoods } from "api/ReportApi"
import { type Department } from "api/SettingsApi"

interface MobileCardProps {
  missingGoods: MissingGoods[]
  borderColor: string
  departments: Department[]
  onEdit: (mg: MissingGoods) => void
  onDelete: (id: number) => void
  onExportBM3: (missingGood: MissingGoods) => void // Nueva prop para exportar BM3
}

export default function MobileCard({
  missingGoods,
  borderColor,
  departments,
  onEdit,
  onDelete,
  onExportBM3, // Recibir la nueva prop
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
                aria-label="Editar"
                icon={<FiEdit2 />}
                size="sm"
                variant="ghost"
                colorScheme="purple"
                onClick={() => onEdit(mg)}
              />
              <IconButton
                aria-label="Eliminar"
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(mg.id)}
              />
              <IconButton
                aria-label="Exportar BM-3"
                icon={<FiDownload />}
                size="sm"
                variant="ghost"
                colorScheme="green"
                onClick={() => onExportBM3(mg)} // Llamar a la función de exportación
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
