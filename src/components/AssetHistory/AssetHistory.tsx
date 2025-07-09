import type React from "react"
import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Spinner,
  Card,
  CardBody,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiCalendar, FiPlus, FiMapPin, FiMinusCircle } from "react-icons/fi"

interface AssetHistoryProps {
  assetHistory: any[]
  loadingHistory: boolean
  formatDate: (dateString: string | undefined) => string
  formatCurrency: (value: number | string | undefined) => string
}

export const AssetHistory: React.FC<AssetHistoryProps> = ({
  assetHistory,
  loadingHistory,
  formatDate,
  formatCurrency,
}) => {
  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Box>
      {loadingHistory ? (
        <Flex justify="center" align="center" py={10}>
          <Spinner size="xl" color="type.primary" />
          <Text ml={4}>Cargando historial...</Text>
        </Flex>
      ) : assetHistory.length === 0 ? (
        <VStack spacing={4} align="center" py={10}>
          <Icon as={FiCalendar} size="48px" color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.500">
            No se encontró historial para este bien
          </Text>
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Este bien no tiene movimientos registrados en el historial.
          </Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="type.primary">
            Historial del Bien ({assetHistory.length})
          </Text>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
            {assetHistory.map((event: any, index: number) => (
              <Card
                key={index}
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                _hover={{ borderColor: "blue.300", shadow: "md" }}
                transition="all 0.2s"
              >
                <CardBody>
                  <VStack align="start" spacing={2}>
                    {event.fecha_incorporacion && (
                      <HStack>
                        <Icon as={FiPlus} color="green.500" />
                        <Text fontWeight="bold">Incorporación:</Text>
                        <Text>
                          Fecha: {formatDate(event.fecha_incorporacion)} - Departamento Origen:{" "}
                          {event.dept_origen || "N/A"}
                        </Text>
                      </HStack>
                    )}
                    {event.fecha_traslado && (
                      <HStack>
                        <Icon as={FiMapPin} color="blue.500" />
                        <Text fontWeight="bold">Traslado:</Text>
                        <Text>
                          Fecha: {formatDate(event.fecha_traslado)} - De: {event.dept_origen || "N/A"} a:{" "}
                          {event.dept_destino || "N/A"}
                        </Text>
                      </HStack>
                    )}
                    {event.fecha_desincorporacion && (
                      <HStack>
                        <Icon as={FiMinusCircle} color="red.500" />
                        <Text fontWeight="bold">Desincorporación:</Text>
                        <Text>
                          Fecha: {formatDate(event.fecha_desincorporacion)} - Concepto:{" "}
                          {event.estado_desincorporacion || "N/A"} - Valor:{" "}
                          {formatCurrency(event.valor_desincorporacion)} - Cantidad:{" "}
                          {event.cantidad_desincorporacion || "N/A"} - Departamento:{" "}
                          {event.dept_desincorporacion || "N/A"}
                        </Text>
                      </HStack>
                    )}
                    {/* Información general del bien en cada evento (opcional, si se quiere repetir) */}
                    <Text fontSize="sm" color="gray.600">
                      Bien: {event.bien_nombre} (ID: {event.bien_id})
                    </Text>
                    {event.funcionario_nombre && (
                      <Text fontSize="sm" color="gray.600">
                        Funcionario: {event.funcionario_nombre}
                      </Text>
                    )}
                    {event.dept_actual && (
                      <Text fontSize="sm" color="gray.600">
                        Departamento Actual: {event.dept_actual}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </Box>
  )
}
