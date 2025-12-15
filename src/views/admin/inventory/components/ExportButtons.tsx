import {
  Button,
  HStack,
  VStack,
  useBreakpointValue,
  Icon,
  Box,
} from "@chakra-ui/react"
import { FiDownload, FiFileText, FiTag } from "react-icons/fi"
import { UserProfile } from "api/UserApi" // Asumiendo que tienes un tipo UserProfile

interface ExportButtonsProps {
  userProfile: UserProfile | null;
  setIsExportModalOpen: (isOpen: boolean) => void;
  setIsQRLabelsModalOpen: (isOpen: boolean) => void;
  setIsBM4ModalOpen: (isOpen: boolean) => void;
  // Las funciones de exportación se pasan como props para que ExportButtons no tenga dependencias directas
  onExportBM1: (deptId?: number, deptName?: string) => void;
  onExportQRLabels: (deptId?: number, deptName?: string) => void;
}

export function ExportButtons({
  userProfile,
  setIsExportModalOpen,
  setIsQRLabelsModalOpen,
  setIsBM4ModalOpen,
  onExportBM1,
  onExportQRLabels,
}: ExportButtonsProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })

  return (
    <>
      {isMobile || isTablet ? (
        <VStack spacing={3} align="stretch">
          <Button
            colorScheme="green"
            leftIcon={<FiDownload />}
            size={{ base: "md", md: "lg" }}
            onClick={() => {
              if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                setIsExportModalOpen(true)
              } else {
                onExportBM1(userProfile?.dept_id, userProfile?.dept_nombre)
              }
            }}
          >
            Exportar a Excel
          </Button>
          <Button
            colorScheme="purple"
            leftIcon={<FiTag />}
            size={{ base: "md", md: "lg" }}
            onClick={() => {
              if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                setIsQRLabelsModalOpen(true)
              } else {
                onExportQRLabels(userProfile?.dept_id, userProfile?.dept_nombre)
              }
            }}
          >
            Exportar Etiquetas QR
          </Button>
          <Button
            colorScheme="orange"
            leftIcon={<FiFileText />}
            size={{ base: "md", md: "lg" }}
            onClick={() => setIsBM4ModalOpen(true)}
          >
            Exportar BM-4
          </Button>
        </VStack>
      ) : (
        <HStack spacing={3} justify="flex-end" wrap="wrap">
          <Button
            colorScheme="green"
            leftIcon={<FiDownload />}
            size="md"
            onClick={() => {
              if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                setIsExportModalOpen(true)
              } else {
                onExportBM1(userProfile?.dept_id, userProfile?.dept_nombre)
              }
            }}
          >
            Exportar a Excel
          </Button>
          <Button
            colorScheme="purple"
            leftIcon={<FiTag />}
            size="md"
            onClick={() => {
              if (userProfile && (userProfile.tipo_usuario === 1 || userProfile.dept_nombre === "Bienes")) {
                setIsQRLabelsModalOpen(true)
              } else {
                onExportQRLabels(userProfile?.dept_id, userProfile?.dept_nombre)
              }
            }}
          >
            Exportar Etiquetas QR
          </Button>
          <Button
            colorScheme="orange"
            leftIcon={<FiFileText />}
            size="md"
            onClick={() => setIsBM4ModalOpen(true)}
          >
            Exportar BM-4
          </Button>
        </HStack>
      )}
    </>
  )
}
