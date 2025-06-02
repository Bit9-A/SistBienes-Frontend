"use client"

import { Card, CardBody, Stack, Flex, Text, Badge, Divider, Grid, Box, IconButton } from "@chakra-ui/react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import type { Desincorp } from "api/IncorpApi"
import type { Department, ConceptoMovimiento } from "api/SettingsApi"
import { v4 as uuidv4 } from "uuid"

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
  const getConceptName = (conceptId: number) => {
    const concept = concepts.find((c) => c.id === conceptId)
    return concept ? concept.nombre : conceptId
  }

  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId)
    return dept ? dept.nombre : deptId
  }

  if (disposals.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Text>No hay desincorporaciones que coincidan con los filtros.</Text>
      </Box>
    )
  }

  return (
    <Stack spacing={4}>
      {disposals.map((item, index) => (
        <Card key={uuidv4()} borderColor={borderColor} boxShadow="sm">
          <CardBody p={3}>
            <Stack spacing={2}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">N° {index + 1}</Text>
                <Badge colorScheme="red">{getConceptName(item.concepto_id)}</Badge>
              </Flex>

              <Divider my={1} />

              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    N° Identificación
                  </Text>
                  <Text fontSize="sm">{item.bien_id}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Fecha
                  </Text>
                  <Text fontSize="sm">
                    {item.fecha
                      ? new Date(item.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Departamento
                  </Text>
                  <Text fontSize="sm">{getDepartmentName(item.dept_id)}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Valor
                  </Text>
                  <Text fontSize="sm">{Number(item.valor).toFixed(2)}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Cantidad
                  </Text>
                  <Text fontSize="sm">{item.cantidad}</Text>
                </Box>
              </Grid>

              <Flex justify="flex-end" gap={2} mt={2}>
                <IconButton
                  aria-label="Editar"
                  icon={<FiEdit />}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => onEdit(item)}
                />
                <IconButton
                  aria-label="Eliminar"
                  icon={<FiTrash2 />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(item.id)}
                />
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Stack>
  )
}