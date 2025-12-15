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
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { Desincorp } from "api/IncorpApi"
import { Department, ConceptoMovimiento } from "api/SettingsApi"

interface MobileCardsProps {
  disposals: Desincorp[]
  borderColor: string
  onEdit: (disposal: Desincorp) => void
  onDelete: (id: number) => void
  departments: Department[]
  concepts: ConceptoMovimiento[]
}

export default function MobileCards({
  disposals,
  borderColor,
  onEdit,
  onDelete,
  departments,
  concepts,
}: MobileCardsProps) {
  const cardBg = useColorModeValue("white", "gray.800")

  const getDeptName = (id?: number) =>
    departments.find((d) => d.id === id)?.nombre || "-"
  const getConceptName = (id?: number) =>
    concepts.find((c) => c.id === id)?.nombre || "-"

  return (
    <Stack spacing={4}>
      {disposals.map((d) => (
        <Box
          key={d.id}
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
          p={4}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg">
              Bien ID: {d.bien_id}
            </Text>
            <HStack spacing={1}>
              <IconButton
                aria-label="Editar"
                icon={<FiEdit2 />}
                size="sm"
                variant="ghost"
                colorScheme="purple"
                onClick={() => onEdit(d)}
              />
              <IconButton
                aria-label="Eliminar"
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(d.id)}
              />
            </HStack>
          </Flex>
          <Stack spacing={1} fontSize="sm">
            <Text>
              <b>Identificación:</b> {d.numero_identificacion || "-"}
            </Text>
            <Text>
              <b>Departamento:</b> {getDeptName(d.dept_id)}
            </Text>
            <Text>
              <b>Fecha:</b> {d.fecha ? new Date(d.fecha).toLocaleDateString() : ""}
            </Text>
            <Text>
              <b>Concepto:</b> {getConceptName(d.concepto_id)}
            </Text>
            <Text>
              <b>Valor:</b> {d.valor}
            </Text>
            <Text>
              <b>Cantidad:</b> {d.cantidad}
            </Text>
            {d.observaciones && (
              <Badge colorScheme="purple" mt={1}>
                {d.observaciones}
              </Badge>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}