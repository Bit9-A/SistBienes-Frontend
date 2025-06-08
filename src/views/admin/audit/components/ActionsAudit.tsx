"use client"

import { useState } from "react"
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  HStack,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { FiUser } from "react-icons/fi"
import { Log } from "api/AuditApi"
import { ACTION_TYPES } from "api/AuditApi"

interface ActionAuditProps {
  logs: Log[]
  loading: boolean
  headerBg: string
  hoverBg: string
  borderColor: string
}

export default function ActionAudit({ logs, loading, headerBg, hoverBg, borderColor }: ActionAuditProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")

  // Get unique departments for filter
  const departmentOptions = [...new Set(logs.map((log) => log.departamento).filter(Boolean))]

  // Filter logs by type, department and search query
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.usuario_id?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.detalles || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.accion || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || log.accion === filterType
    const matchesDepartment = filterDepartment === "all" || log.departamento === filterDepartment

    return matchesSearch && matchesType && matchesDepartment
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Box>
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
              placeholder="Buscar por acción o detalles..."
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
              {ACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
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
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </Box>
        </HStack>
      </Flex>

      <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm" overflow="auto" mb={4}>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th>#</Th>
              <Th>Usuario</Th>
              <Th>Acción</Th>
              <Th>Fecha</Th>
              <Th>Detalles</Th>
              <Th>Departamento</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLogs.map((log, index) => (
              <Tr key={log.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{index + 1}</Td>
                <Td>
                  <Flex align="center" gap={2}>
                    <FiUser />
                    <Text>{log.usuario_nombre}</Text>
                  </Flex>
                </Td>
                <Td>
                  <Text>{log.accion}</Text>
                </Td>
                <Td>
                  <Text>{formatDate(log.fecha)}</Text>
                </Td>
                <Td>
                  <Text>{log.detalles}</Text>
                </Td>
                <Td>
                  <Text>{log.departamento}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
