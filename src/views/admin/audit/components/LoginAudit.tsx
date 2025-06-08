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
import { Audit } from "api/AuditApi"

interface LoginAuditProps {
  audits: Audit[]
  loading: boolean
  headerBg: string
  hoverBg: string
  borderColor: string
}

export default function LoginAudit({ audits, loading, headerBg, hoverBg, borderColor }: LoginAuditProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  // Get unique departments for filter
  const departmentOptions = [...new Set(audits.map((audit) => audit.departamento).filter(Boolean))]

  // Filter audits by department and search query
  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.departamento.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.ip.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || audit.departamento === filterDepartment

    return matchesSearch && matchesDepartment
  })

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin salida"
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
              placeholder="Buscar por nombre, departamento o IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="md"
            />
          </InputGroup>

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
              <Th>Departamento</Th>
              <Th>Entrada</Th>
              <Th>Salida</Th>
              <Th>IP</Th>
              <Th>Estado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAudits.map((audit, index) => (
              <Tr key={audit.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td>{index + 1}</Td>
                <Td>
                  <Flex align="center" gap={2}>
                    <FiUser />
                    <Text>{audit.nombre}</Text>
                  </Flex>
                </Td>
                <Td>{audit.departamento}</Td>
                <Td>{formatDate(audit.entrada)}</Td>
                <Td>{formatDate(audit.salida)}</Td>
                <Td>{audit.ip}</Td>
                <Td>
                  <Badge colorScheme={audit.salida ? "red" : "green"} borderRadius="full" px={2}>
                    {audit.salida ? "Finalizada" : "Activa"}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
