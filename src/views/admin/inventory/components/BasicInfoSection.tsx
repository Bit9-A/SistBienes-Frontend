"use client"
import type React from "react"
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Checkbox,
  HStack,
  Icon,
  Box,
  FormErrorMessage,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react"
import { FiInfo, FiMapPin, FiMonitor, FiLock, FiUnlock } from "react-icons/fi"

interface BasicInfoSectionProps {
  formData: any
  errors: Record<string, string>
  departments: any[]
  isComputer: boolean
  asset: any
  editableFields: Record<string, boolean>
  cardBg: string
  lockIconColor: string
  unlockIconColor: string
  editableBg: string
  readOnlyBg: string
  editableBorder: string
  readOnlyBorder: string
  borderColor: string
  sectionBg: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onComputerChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  EditToggleButton: React.ComponentType<{ fieldName: string; isRequired?: boolean }>
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  departments,
  isComputer,
  asset,
  editableFields,
  cardBg,
  lockIconColor,
  unlockIconColor,
  editableBg,
  readOnlyBg,
  editableBorder,
  readOnlyBorder,
  borderColor,
  sectionBg,
  onInputChange,
  onComputerChange,
  EditToggleButton,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Sección de Identificación */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px">
        <CardHeader pb={3}>
          <Flex align="center" gap={2}>
            <Icon as={FiInfo} color="purple.500" />
            <Heading size="md">Identificación del Bien</Heading>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.numero_identificacion} isRequired>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Número de Bien
                  {asset?.id && !editableFields.numero_identificacion && (
                    <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                  )}
                  {asset?.id && editableFields.numero_identificacion && (
                    <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                  )}
                </FormLabel>
                <EditToggleButton fieldName="numero_identificacion" isRequired />
              </Flex>
              <Input
                name="numero_identificacion"
                value={formData.numero_identificacion || ""}
                onChange={onInputChange}
                placeholder="Ej: BM-001-2024"
                size="lg"
                isReadOnly={asset?.id ? !editableFields.numero_identificacion : false}
                bg={asset?.id ? (editableFields.numero_identificacion ? editableBg : readOnlyBg) : editableBg}
                borderColor={
                  asset?.id ? (editableFields.numero_identificacion ? editableBorder : readOnlyBorder) : borderColor
                }
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id
                    ? editableFields.numero_identificacion
                      ? "blue.400"
                      : readOnlyBorder
                    : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              />
              <FormErrorMessage>{errors.numero_identificacion}</FormErrorMessage>
            </FormControl>

            {!formData.id && (
              <FormControl isInvalid={!!errors.fecha} isRequired>
                <Flex align="center" justify="space-between" mb={2}>
                  <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                    Fecha de Registro
                    {asset?.id && !editableFields.fecha && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                    {asset?.id && editableFields.fecha && <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />}
                  </FormLabel>
                  <EditToggleButton fieldName="fecha" isRequired />
                </Flex>
                <Input
                  name="fecha"
                  type="date"
                  value={formData.fecha || ""}
                  onChange={onInputChange}
                  size="lg"
                  isReadOnly={asset?.id ? !editableFields.fecha : false}
                  bg={asset?.id ? (editableFields.fecha ? editableBg : readOnlyBg) : editableBg}
                  borderColor={asset?.id ? (editableFields.fecha ? editableBorder : readOnlyBorder) : borderColor}
                  borderWidth="2px"
                  _hover={{
                    borderColor: asset?.id ? (editableFields.fecha ? "blue.400" : readOnlyBorder) : "blue.300",
                  }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  }}
                  transition="all 0.2s"
                />
                <FormErrorMessage>{errors.fecha}</FormErrorMessage>
              </FormControl>
            )}
          </SimpleGrid>

          <FormControl isInvalid={!!errors.nombre_descripcion} isRequired mt={4}>
            <Flex align="center" justify="space-between" mb={2}>
              <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                Descripción del Bien
                {asset?.id && !editableFields.nombre_descripcion && (
                  <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                )}
                {asset?.id && editableFields.nombre_descripcion && (
                  <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                )}
              </FormLabel>
              <EditToggleButton fieldName="nombre_descripcion" isRequired />
            </Flex>
            <Textarea
              name="nombre_descripcion"
              value={formData.nombre_descripcion || ""}
              onChange={onInputChange}
              placeholder="Describa detalladamente el bien, incluyendo características principales..."
              rows={4}
              size="lg"
              isReadOnly={asset?.id ? !editableFields.nombre_descripcion : false}
              bg={asset?.id ? (editableFields.nombre_descripcion ? editableBg : readOnlyBg) : editableBg}
              borderColor={
                asset?.id ? (editableFields.nombre_descripcion ? editableBorder : readOnlyBorder) : borderColor
              }
              borderWidth="2px"
              _hover={{
                borderColor: asset?.id ? (editableFields.nombre_descripcion ? "blue.400" : readOnlyBorder) : "blue.300",
              }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
              transition="all 0.2s"
            />
            <FormErrorMessage>{errors.nombre_descripcion}</FormErrorMessage>
          </FormControl>
        </CardBody>
      </Card>

      {/* Sección de Ubicación */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px">
        <CardHeader pb={3}>
          <Flex align="center" gap={2}>
            <Icon as={FiMapPin} color="blue.500" />
            <Heading size="md">Ubicación y Asignación</Heading>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.dept_id} isRequired>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Departamento
                  {asset?.id && !editableFields.dept_id && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                  {asset?.id && editableFields.dept_id && <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />}
                </FormLabel>
                <EditToggleButton fieldName="dept_id" isRequired />
              </Flex>
              <Select
                name="dept_id"
                value={formData.dept_id || ""}
                onChange={onInputChange}
                placeholder="Seleccione un departamento"
                size="lg"
                isDisabled={asset?.id ? !editableFields.dept_id : false}
                bg={asset?.id ? (editableFields.dept_id ? editableBg : readOnlyBg) : editableBg}
                borderColor={asset?.id ? (editableFields.dept_id ? editableBorder : readOnlyBorder) : borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.dept_id ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.dept_id}</FormErrorMessage>
            </FormControl>

            {!formData.id && (
              <FormControl>
                <FormLabel fontWeight="semibold">Tipo de Bien</FormLabel>
                <Box p={4} border="1px" borderColor={borderColor} borderRadius="md" bg={sectionBg}>
                  <Checkbox isChecked={isComputer} onChange={onComputerChange} colorScheme="purple" size="lg">
                    <HStack spacing={3}>
                      <Icon as={FiMonitor} boxSize={5} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">Es una computadora</Text>
                        <Text fontSize="sm" color="gray.500">
                          Incluye componentes de hardware
                        </Text>
                      </VStack>
                    </HStack>
                  </Checkbox>
                  {isComputer && (
                    <Text fontSize="sm" color="blue.600" mt={2} fontStyle="italic">
                      ✓ Se seleccionará automáticamente "Otros Elementos" como subgrupo
                    </Text>
                  )}
                </Box>
              </FormControl>
            )}
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  )
}
