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
} from '@chakra-ui/react';

interface Department {
  id: number;
  nombre: string;
}

interface ExportBM1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onExport: (deptId: number, deptName: string) => void;
}

export const ExportBM1Modal: React.FC<ExportBM1ModalProps> = ({
  isOpen,
  onClose,
  departments,
  onExport,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);

  const handleExportClick = () => {
    if (selectedDepartmentId) {
      const selectedDept = departments.find(dept => dept.id === selectedDepartmentId);
      if (selectedDept) {
        onExport(selectedDept.id, selectedDept.nombre);
        onClose();
      }
    } else {
      alert('Por favor, selecciona un departamento.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Exportar BM-1 por Departamento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Selecciona un Departamento</FormLabel>
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
