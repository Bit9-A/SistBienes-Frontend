"use client"
import type React from "react"
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Icon,
  FormErrorMessage,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Flex,
  Badge,
} from "@chakra-ui/react"
import { FiTag, FiInfo, FiDollarSign, FiLock, FiUnlock } from "react-icons/fi"
import { AutocompleteField } from "./AutocompleteField"

interface DetailsSectionProps {
  formData: any
  errors: Record<string, string>
  subgroups: any[]
  parroquias: any[]
  assetStates: any[]
  localMarcas: any[]
  filteredModelos: any[]
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onMarcaSelect: (marcaId: number) => void
  onModeloSelect: (modeloId: number) => void
  onAddMarca: (name: string) => Promise<any>
  onAddModelo: (name: string) => Promise<any>
  EditToggleButton: React.ComponentType<{ fieldName: string; isRequired?: boolean }>
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  formData,
  errors,
  subgroups,
  parroquias,
  assetStates,
  localMarcas,
  filteredModelos,
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
  onInputChange,
  onMarcaSelect,
  onModeloSelect,
  onAddMarca,
  onAddModelo,
  EditToggleButton,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Sección de Clasificación */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px">
        <CardHeader pb={3}>
          <Flex align="center" gap={2}>
            <Icon as={FiTag} color="green.500" />
            <Heading size="md">Clasificación</Heading>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.subgrupo_id} isRequired>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Subgrupo
                  {asset?.id && !editableFields.subgrupo_id && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                  {asset?.id && editableFields.subgrupo_id && (
                    <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                  )}
                </FormLabel>
                <EditToggleButton fieldName="subgrupo_id" isRequired />
              </Flex>
              <Select
                name="subgrupo_id"
                value={formData.subgrupo_id || ""}
                onChange={onInputChange}
                placeholder="Seleccione un subgrupo"
                isDisabled={isComputer || (asset?.id ? !editableFields.subgrupo_id : false)}
                size="lg"
                bg={asset?.id ? (editableFields.subgrupo_id ? editableBg : readOnlyBg) : editableBg}
                borderColor={asset?.id ? (editableFields.subgrupo_id ? editableBorder : readOnlyBorder) : borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.subgrupo_id ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              >
                {subgroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.codigo} - {g.nombre}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.subgrupo_id}</FormErrorMessage>
              {isComputer && (
                <Text fontSize="sm" color="blue.600" mt={1} fontStyle="italic">
                  ✓ Seleccionado automáticamente: Otros Elementos (Código 12)
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.parroquia_id} isRequired>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Parroquia
                  {asset?.id && !editableFields.parroquia_id && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                  {asset?.id && editableFields.parroquia_id && (
                    <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                  )}
                </FormLabel>
                <EditToggleButton fieldName="parroquia_id" isRequired />
              </Flex>
              <Select
                name="parroquia_id"
                value={formData.parroquia_id || ""}
                onChange={onInputChange}
                placeholder="Seleccione una parroquia"
                size="lg"
                isDisabled={asset?.id ? !editableFields.parroquia_id : false}
                bg={asset?.id ? (editableFields.parroquia_id ? editableBg : readOnlyBg) : editableBg}
                borderColor={asset?.id ? (editableFields.parroquia_id ? editableBorder : readOnlyBorder) : borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.parroquia_id ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              >
                {parroquias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.parroquia_id}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Sección de Especificaciones Técnicas */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px">
        <CardHeader pb={3}>
          <Flex align="center" gap={2}>
            <Icon as={FiInfo} color="orange.500" />
            <Heading size="md">Especificaciones Técnicas</Heading>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Número Serial
                  {asset?.id && !editableFields.numero_serial && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                  {asset?.id && editableFields.numero_serial && (
                    <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                  )}
                </FormLabel>
                <EditToggleButton fieldName="numero_serial" />
              </Flex>
              <Input
                name="numero_serial"
                value={formData.numero_serial || ""}
                onChange={onInputChange}
                placeholder="Ingrese el número serial (opcional - se asignará SN:N/A si está vacío)"
                size="lg"
                isReadOnly={asset?.id ? !editableFields.numero_serial : false}
                bg={asset?.id ? (editableFields.numero_serial ? editableBg : readOnlyBg) : editableBg}
                borderColor={asset?.id ? (editableFields.numero_serial ? editableBorder : readOnlyBorder) : borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.numero_serial ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.valor_unitario} isRequired>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Valor Unitario (Bs.)
                  {asset?.id && !editableFields.valor_unitario && (
                    <Icon as={FiLock} color={lockIconColor} boxSize={3} />
                  )}
                  {asset?.id && editableFields.valor_unitario && (
                    <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />
                  )}
                </FormLabel>
                <EditToggleButton fieldName="valor_unitario" isRequired />
              </Flex>
              <Input
                name="valor_unitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_unitario || ""}
                onChange={onInputChange}
                placeholder="0.00"
                size="lg"
                isReadOnly={asset?.id ? !editableFields.valor_unitario : false}
                bg={asset?.id ? (editableFields.valor_unitario ? editableBg : readOnlyBg) : editableBg}
                borderColor={
                  asset?.id ? (editableFields.valor_unitario ? editableBorder : readOnlyBorder) : borderColor
                }
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.valor_unitario ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              />
              <FormErrorMessage>{errors.valor_unitario}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Sección de Información Adicional (Opcional) */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px">
        <CardHeader pb={3}>
          <Flex align="center" gap={2}>
            <Icon as={FiDollarSign} color="gray.500" />
            <Heading size="md">Información Adicional</Heading>
            <Badge variant="outline" colorScheme="gray">
              Opcional
            </Badge>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <AutocompleteField
              label="Marca"
              placeholder="Buscar o agregar marca..."
              value={formData.marca_id}
              options={localMarcas}
              onSelect={onMarcaSelect}
              onAdd={onAddMarca}
              isDisabled={asset?.id ? !editableFields.marca_id : false}
              isReadOnly={asset?.id ? !editableFields.marca_id : false}
              bg={asset?.id ? (editableFields.marca_id ? editableBg : readOnlyBg) : editableBg}
              borderColor={asset?.id ? (editableFields.marca_id ? editableBorder : readOnlyBorder) : borderColor}
              editToggleButton={<EditToggleButton fieldName="marca_id" />}
            />

            <AutocompleteField
              label="Modelo"
              placeholder="Buscar o agregar modelo..."
              value={formData.modelo_id}
              options={filteredModelos}
              onSelect={onModeloSelect}
              onAdd={onAddModelo}
              isDisabled={!formData.marca_id || (asset?.id ? !editableFields.modelo_id : false)}
              isReadOnly={asset?.id ? !editableFields.modelo_id : false}
              bg={asset?.id ? (editableFields.modelo_id ? editableBg : readOnlyBg) : editableBg}
              borderColor={asset?.id ? (editableFields.modelo_id ? editableBorder : readOnlyBorder) : borderColor}
              editToggleButton={<EditToggleButton fieldName="modelo_id" />}
            />

            <FormControl>
              <Flex align="center" justify="space-between" mb={2}>
                <FormLabel fontWeight="semibold" mb="0" display="flex" alignItems="center" gap={1}>
                  Condición
                  {asset?.id && !editableFields.estado_id && <Icon as={FiLock} color={lockIconColor} boxSize={3} />}
                  {asset?.id && editableFields.estado_id && <Icon as={FiUnlock} color={unlockIconColor} boxSize={3} />}
                </FormLabel>
                <EditToggleButton fieldName="estado_id" />
              </Flex>
              <Select
                name="estado_id"
                value={formData.estado_id || ""}
                onChange={onInputChange}
                placeholder="Seleccione una condición"
                size="lg"
                isDisabled={asset?.id ? !editableFields.estado_id : false}
                bg={asset?.id ? (editableFields.estado_id ? editableBg : readOnlyBg) : editableBg}
                borderColor={asset?.id ? (editableFields.estado_id ? editableBorder : readOnlyBorder) : borderColor}
                borderWidth="2px"
                _hover={{
                  borderColor: asset?.id ? (editableFields.estado_id ? "blue.400" : readOnlyBorder) : "blue.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                transition="all 0.2s"
              >
                {assetStates
                  .filter((estado) => estado.id === 2 || estado.id === 3)
                  .map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nombre}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  )
}
