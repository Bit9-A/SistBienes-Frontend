import React, { useState } from 'react';
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
} from '@chakra-ui/react';

interface Department {
  id: number;
  nombre: string;
}

interface ExportBM2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onExport: (deptId: number, deptName: string, mes: number, año: number, tipo: 'incorporacion' | 'desincorporacion') => void;
  tipoMovimiento: 'incorporacion' | 'desincorporacion';
}

export const ExportBM2Modal: React.FC<ExportBM2ModalProps> = ({
  isOpen,
  onClose,
  departments,
  onExport,
  tipoMovimiento,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handleExportClick = () => {
    if (selectedDepartmentId && selectedMonth && selectedYear) {
      const selectedDept = departments.find(dept => dept.id === selectedDepartmentId);
      if (selectedDept) {
        onExport(selectedDept.id, selectedDept.nombre, selectedMonth, selectedYear, tipoMovimiento);
        onClose();
      }
    } else {
      alert('Por favor, selecciona un departamento, mes y año.');
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
        <ModalHeader>Exportar BM-2 de {tipoMovimiento === 'incorporacion' ? 'Incorporaciones' : 'Desincorporaciones'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Select
                placeholder="Selecciona un departamento"
                onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                value={selectedDepartmentId || ''}
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

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
