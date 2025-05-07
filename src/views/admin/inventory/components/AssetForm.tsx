import React,{useEffect} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: any) => void;
  asset: any;
  departments: any[];
  subgroups: any[];
  marcas: any[];
  modelos: any[];
  parroquias: any[];
}

export const AssetForm: React.FC<AssetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  asset,
  departments,
  subgroups,
  marcas,
  modelos,
  parroquias,
}) => {
  const [formData, setFormData] = React.useState(asset || {});

    useEffect(() => {
        setFormData(asset || {});
    }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Si estamos editando, asegurarnos de que la fecha original se mantenga
    if (formData.id && asset.fecha) {
      formData.fecha = asset.fecha; // Mantener la fecha original al editar
    }
  
    // Formatear la fecha al formato 'YYYY-MM-DD'
    if (formData.fecha) {
      const date = new Date(formData.fecha);
      formData.fecha = date.toISOString().split("T")[0]; // Extraer solo la parte de la fecha
    }
  
    console.log("Datos del formulario enviados:", formData);
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{formData.id ? "Editar Bien" : "Agregar Nuevo Bien"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            {/* Campo de Identificación (Solo Lectura al Editar) */}
            <FormControl>
              <FormLabel>Identificación</FormLabel>
              <Input
                name="numero_identificacion"
                value={formData.numero_identificacion || ""}
                isReadOnly={!!formData.id} // Solo lectura si se está editando
                onChange={handleChange}
                placeholder="Número de Identificación"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="nombre_descripcion"
                value={formData.nombre_descripcion || ""}
                onChange={handleChange}
                placeholder="Descripción del Bien"
                resize="none"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Select
                name="dept_id"
                value={formData.dept_id || ""}
                onChange={handleChange}
                placeholder="Seleccione un departamento"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Subgrupo</FormLabel>
              <Select
                name="subgrupo_id"
                value={formData.subgrupo_id || ""}
                onChange={handleChange}
                placeholder="Seleccione un subgrupo"
              >
                {subgroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Marca</FormLabel>
              <Select
                name="marca_id"
                value={formData.marca_id || ""}
                onChange={handleChange}
                placeholder="Seleccione una marca (opcional)"
              >
                <option value="">Sin Marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Modelo</FormLabel>
              <Select
                name="modelo_id"
                value={formData.modelo_id || ""}
                onChange={handleChange}
                placeholder="Seleccione un modelo (opcional)"
              >
                <option value="">Sin Modelo</option>
                {modelos.map((modelo) => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Condición</FormLabel>
              <Select
                name="id_estado"
                value={formData.id_estado || ""}
                onChange={handleChange}
                placeholder="Seleccione una condición (opcional)"
              >
                <option value="">Sin Condición</option>
                <option value="1">Nuevo</option>
                <option value="2">Usado</option>
                <option value="3">Dañado</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Cantidad</FormLabel>
              <Input
                name="cantidad"
                type="number"
                value={1}
                onChange={handleChange}
                isDisabled={true} // Deshabilitar siempre
                placeholder="Cantidad"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor Unitario</FormLabel>
              <Input
                name="valor_unitario"
                type="number"
                value={formData.valor_unitario || ""}
                onChange={handleChange}
                placeholder="Valor Unitario"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor Total</FormLabel>
              <Input
                name="valor_total"
                type="number"
                value={formData.valor_total || ""}
                onChange={handleChange}
                placeholder="Valor Total"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Serial</FormLabel>
              <Input
                name="numero_serial"
                value={formData.numero_serial || ""}
                onChange={handleChange}
                placeholder="Número Serial"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Parroquia</FormLabel>
              <Select
                name="parroquia_id"
                value={formData.parroquia_id || ""}
                onChange={handleChange}
                placeholder="Ubicación del Bien"
              >
                {parroquias.map((parroquia) => (
                  <option key={parroquia.id} value={parroquia.id}>
                    {parroquia.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Campo de Fecha (Solo se muestra al agregar) */}
            {!formData.id && (
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input
                  name="fecha"
                  type="date"
                  value={formData.fecha || ""}
                  onChange={handleChange}
                />
              </FormControl>
            )}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {formData.id ? "Guardar Cambios" : "Agregar Bien"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};