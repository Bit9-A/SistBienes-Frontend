import React, { useEffect, useState } from 'react';
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
  useDisclosure,
  useToast,
  IconButton,
  Flex,
  Text,
  Textarea,
} from '@chakra-ui/react';

import { FiPlus } from 'react-icons/fi';
import {
  getMarcas,
  getModelos,
  modelo,
  marca,
  getModelosByMarca,
} from '../../../../api/AssetsApi';
import { handleAddMarca, handleAddModelo } from '../utils/inventoryUtils';

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
  const [filteredModelos, setFilteredModelos] = useState<any[]>([]);
  const [localMarcas, setLocalMarcas] = useState<marca[]>(marcas);
  const [localModelos, setLocalModelos] = useState<modelo[]>(modelos);
  const [isMultiple, setIsMultiple] = useState(false); // Estado para controlar la opción seleccionada

  const toast = useToast();

  const {
    isOpen: isMarcaModalOpen,
    onOpen: onMarcaModalOpen,
    onClose: onMarcaModalClose,
  } = useDisclosure();

  const {
    isOpen: isModeloModalOpen,
    onOpen: onModeloModalOpen,
    onClose: onModeloModalClose,
  } = useDisclosure();

  const [newMarca, setNewMarca] = useState('');
  const [newModelo, setNewModelo] = useState('');

  //filtar modelos según la marca seleccionada
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = parseInt(e.target.value, 10);
    setFormData((prev: any) => ({ ...prev, marca_id: selectedMarcaId }));

    if (selectedMarcaId) {
      try {
        const modelos = await getModelosByMarca(selectedMarcaId); // Llama a la API para obtener los modelos
        setFilteredModelos(modelos); // Actualiza los modelos filtrados
      } catch (error) {
        console.error('Error al obtener los modelos por marca:', error);
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar los modelos de la marca seleccionada.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setFilteredModelos([]); // Limpia los modelos si no hay marca seleccionada
    }
  };

  useEffect(() => {
    setFormData(asset || {});
  }, [asset]);

  useEffect(() => {
    // Filtrar modelos según la marca seleccionada
    if (formData.marca_id) {
      setFilteredModelos(
        modelos.filter((modelo) => modelo.marca_id === formData.marca_id),
      );
    } else {
      setFilteredModelos([]);
    }
  }, [formData.marca_id, modelos]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validar campos obligatorios
    if (
      !formData.numero_identificacion ||
      formData.numero_identificacion.trim() === ''
    ) {
      toast({
        title: 'Error',
        description: 'El número de identificación es obligatorio.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      !formData.nombre_descripcion ||
      formData.nombre_descripcion.trim() === ''
    ) {
      toast({
        title: 'Error',
        description: 'La descripción es obligatoria.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.cantidad || formData.cantidad <= 0) {
      toast({
        title: 'Error',
        description: 'La cantidad debe ser mayor a 0.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Validar campos obligatorios
    if (!formData.fecha || isNaN(new Date(formData.fecha).getTime())) {
      toast({
        title: 'Error',
        description: 'La fecha es inválida o no está presente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Si estamos editando, asegurarnos de que la fecha original se mantenga
    if (formData.id && asset.fecha) {
      formData.fecha = asset.fecha; // Mantener la fecha original al editar
    }
    if (!isMultiple) {
      formData.cantidad = 1;
    }
    // Formatear la fecha al formato 'YYYY-MM-DD'
    const date = new Date(formData.fecha);
    formData.fecha = date.toISOString().split('T')[0]; // Extraer solo la parte de la fecha

    console.log('Datos enviados al servidor:', formData); // Depuración
    onSubmit(formData);
  };

  const handleAddMarcaForm = async () => {
    try {
      const createdMarca = await handleAddMarca({ nombre: newMarca });
      console.log('Marca creada:', createdMarca); // Depuración
      setLocalMarcas((prev) => [...prev, createdMarca]); // Actualiza las marcas locales
      toast({
        title: 'Marca agregada',
        description: `La marca "${createdMarca.nombre}" se agregó correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewMarca(''); // Limpia el campo de entrada
      onMarcaModalClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al agregar la marca:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la marca.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddModeloForm = async () => {
    if (formData.marca_id) {
      try {
        console.log('Datos enviados al servidor:', {
          nombre: newModelo,
          idmarca: formData.marca_id,
        }); // Depuración

        const createdModelo = await handleAddModelo({
          nombre: newModelo,
          idmarca: formData.marca_id,
        }); // Llama a la función de inventoryUtils
        setFilteredModelos((prev) => [...prev, createdModelo]); // Actualiza los modelos filtrados
        setLocalModelos((prev) => [...prev, createdModelo]); // Actualiza los modelos locales

        toast({
          title: 'Modelo agregado',
          description: `El modelo "${createdModelo.nombre}" se agregó correctamente.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setNewModelo(''); // Limpia el campo de entrada
        onModeloModalClose(); // Cierra el modal
      } catch (error) {
        console.error('Error al agregar el modelo:', error);
        toast({
          title: 'Error',
          description: 'No se pudo agregar el modelo.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Seleccione una marca antes de agregar un modelo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {formData.id ? 'Editar Bien' : 'Agregar Nuevo Bien'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            {/* Campo de Identificación (Solo Lectura al Editar) */}
            <FormControl>
              <FormLabel>Tipo de Bien</FormLabel>
              <Select
                value={isMultiple ? 'multiple' : 'individual'}
                onChange={(e) => {
                  const value = e.target.value;
                  setIsMultiple(value === 'multiple');
                  if (value === 'individual') {
                    setFormData((prev: any) => ({ ...prev, cantidad: 1 })); // Establecer cantidad en 1
                  }
                }}
              >
                <option value="individual">Bien Individual</option>
                <option value="multiple">Múltiples Bienes</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Identificación</FormLabel>
              <Input
                name="numero_identificacion"
                value={formData.numero_identificacion || ''}
                isReadOnly={!!formData.id} // Solo lectura si se está editando
                onChange={handleChange}
                placeholder="Número de Identificación"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="nombre_descripcion"
                value={formData.nombre_descripcion || ''}
                onChange={handleChange}
                placeholder="Descripción del Bien"
                resize="none"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Departamento</FormLabel>
              <Select
                name="dept_id"
                value={formData.dept_id || ''}
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
                value={formData.subgrupo_id || ''}
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
              <Flex>
                <Select
                  name="marca_id"
                  value={formData.marca_id || ''}
                  onChange={handleMarcaChange} // Llama a handleMarcaChange
                  placeholder="Seleccione una marca"
                >
                  <option value="">Ninguna</option>
                  {localMarcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </Select>
                <Button
                  aria-label="Agregar Marca"
                  color="white"
                  bgColor="type.primary"
                  ml={2}
                  onClick={onMarcaModalOpen}
                >
                  Agregar Marca
                </Button>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>Modelo</FormLabel>
              <Flex>
                <Select
                  name="modelo_id"
                  value={formData.modelo_id || ''}
                  onChange={handleChange}
                  placeholder="Seleccione un modelo"
                  isDisabled={!formData.marca_id} // Deshabilitar si no hay marca seleccionada
                >
                  <option value="">Ninguno</option>
                  {filteredModelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </option>
                  ))}
                </Select>
                <Button
                  aria-label="Agregar Modelo"
                  color="white"
                  bgColor="type.primary"
                  ml={2}
                  onClick={onModeloModalOpen}
                >
                  Agregar Modelo
                </Button>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel>Condición</FormLabel>
              <Select
                name="id_estado"
                value={formData.id_estado || ''}
                onChange={handleChange}
                placeholder="Seleccione una condición (opcional)"
              >
                <option value="">Sin Condición</option>
                <option value="1">Nuevo</option>
                <option value="2">Usado</option>
                <option value="3">Dañado</option>
              </Select>
            </FormControl>

            {isMultiple && (
              <FormControl>
                <FormLabel>Cantidad</FormLabel>
                <Input
                  name="cantidad"
                  type="number"
                  value={formData.cantidad || ''}
                  onChange={handleChange}
                  placeholder="Cantidad"
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Valor Unitario</FormLabel>
              <Input
                name="valor_unitario"
                type="number"
                value={formData.valor_unitario || ''}
                onChange={handleChange}
                placeholder="Valor Unitario"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor Total</FormLabel>
              <Input
                name="valor_total"
                type="number"
                value={formData.valor_total || ''}
                onChange={handleChange}
                placeholder="Valor Total"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Serial</FormLabel>
              <Input
                name="numero_serial"
                value={formData.numero_serial || ''}
                onChange={handleChange}
                placeholder="Número Serial"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Parroquia</FormLabel>
              <Select
                name="parroquia_id"
                value={formData.parroquia_id || ''}
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
                  value={formData.fecha || ''}
                  onChange={handleChange}
                />
              </FormControl>
            )}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {formData.id ? 'Guardar Cambios' : 'Agregar Bien'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Modal para agregar nueva marca */}
      <Modal isOpen={isMarcaModalOpen} onClose={onMarcaModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nueva Marca</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre de la Marca</FormLabel>
              <Input
                value={newMarca}
                onChange={(e) => setNewMarca(e.target.value)}
                placeholder="Ingrese el nombre de la marca"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddMarcaForm}>
              Agregar
            </Button>
            <Button variant="ghost" onClick={onMarcaModalClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para agregar nuevo modelo */}
      <Modal isOpen={isModeloModalOpen} onClose={onModeloModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nuevo Modelo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre del Modelo</FormLabel>
              <Input
                value={newModelo}
                onChange={(e) => setNewModelo(e.target.value)}
                placeholder="Ingrese el nombre del modelo"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddModeloForm}>
              Agregar
            </Button>
            <Button variant="ghost" onClick={onModeloModalClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
};
