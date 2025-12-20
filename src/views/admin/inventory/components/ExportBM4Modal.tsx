import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { type UserProfile } from 'api/UserApi'; // Importar UserProfile de forma absoluta
import { type Department } from 'api/SettingsApi'; // Importar Department de forma absoluta

// Interfaz para las propiedades del modal de exportación BM4
interface ExportBM4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  userProfile: UserProfile | null;
  onExport: (
    deptId: number,
    mes: number,
    año: number,
    responsableId: number,
    departamentoNombre: string,
  ) => void;
}

export const ExportBM4Modal: React.FC<ExportBM4ModalProps> = ({
  isOpen,
  onClose,
  departments,
  userProfile,
  onExport,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | undefined
  >(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  const isAdminOrBienes =
    userProfile?.tipo_usuario === 1 ||
    userProfile?.tipo_usuario === 5 ||
    userProfile?.dept_nombre === 'Bienes'; // Asumiendo role_id 1 para admin y dept_nombre 'Bienes'

  useEffect(() => {
    if (!isAdminOrBienes && userProfile?.dept_id) {
      setSelectedDepartmentId(userProfile.dept_id);
    } else {
      setSelectedDepartmentId(undefined); // Reset if role changes or no specific dept
    }
  }, [userProfile, isAdminOrBienes]);

  const handleExportClick = () => {
    if (selectedMonth && selectedYear && userProfile?.id) {
      const deptIdToExport = isAdminOrBienes
        ? selectedDepartmentId
        : userProfile.dept_id;
      const deptName =
        departments.find((d) => d.id === deptIdToExport)?.nombre ||
        'Desconocido';

      if (deptIdToExport) {
        onExport(
          deptIdToExport,
          selectedMonth,
          selectedYear,
          userProfile.id,
          deptName,
        );
        onClose();
      } else {
        alert('Por favor, selecciona un departamento, mes y año.');
      }
    } else {
      alert(
        'Por favor, selecciona un mes y año, y asegúrate de que el perfil de usuario esté cargado.',
      );
    }
  };

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Exportar BM-4 (Reporte Mensual)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {isAdminOrBienes && (
              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Select
                  placeholder="Selecciona un departamento"
                  onChange={(e) =>
                    setSelectedDepartmentId(Number(e.target.value))
                  }
                  value={selectedDepartmentId || ''}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {!isAdminOrBienes && userProfile?.dept_id && (
              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Text>
                  {departments.find((d) => d.id === userProfile.dept_id)
                    ?.nombre || 'Cargando...'}
                </Text>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Mes</FormLabel>
              <Select
                placeholder="Selecciona un mes"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth || ''}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Año</FormLabel>
              <NumberInput
                defaultValue={new Date().getFullYear()}
                min={2000}
                max={2100}
                onChange={(valueString) => setSelectedYear(Number(valueString))}
                value={selectedYear}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={handleExportClick}>
            Exportar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
