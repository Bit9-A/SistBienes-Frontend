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
  useToast,
  Flex,
  Text,
  Textarea,
  Checkbox,
  HStack,
  Icon,
  Box,
} from '@chakra-ui/react';
import { FiMonitor } from 'react-icons/fi';
import {
  type modelo,
  type marca,
  getModelosByMarca,
  type MovableAsset,
  createAsset,
} from '../../../../api/AssetsApi';
import { createComponent } from '../../../../api/ComponentsApi';
import AddMarcaModeloModal from './BrandModal';
import AssetComponents, {
  ComponentData,
} from '../../../../components/AssetComponents/AssetComponents';
import axiosInstance from '../../../../utils/axiosInstance';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: any) => Promise<any> | any;
  asset: MovableAsset | null;
  departments: any[];
  subgroups: any[];
  marcas: marca[];
  modelos: modelo[];
  parroquias: any[];
  assetStates: any[]; // agrega esto
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
  assetStates,
}) => {
  // Estados principales
  const [formData, setFormData] = useState<Partial<MovableAsset>>(asset || {});
  const [filteredModelos, setFilteredModelos] = useState<modelo[]>([]);
  const [localMarcas, setLocalMarcas] = useState<marca[]>([]);
  const [localModelos, setLocalModelos] = useState<modelo[]>([]);
  const [isComputer, setIsComputer] = useState(false);
  const [step, setStep] = useState(0);
  const [createdAssetId, setCreatedAssetId] = useState<number | null>(null);
  const toast = useToast();

  // Modal de marca/modelo
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
  const [isModeloModalOpen, setIsModeloModalOpen] = useState(false);

  // Componentes de computadora (para el paso 3)
  const [computerComponents, setComputerComponents] = useState<ComponentData[]>(
    [],
  );

  // Efectos de inicialización
  useEffect(() => {
    setLocalMarcas(marcas || []);
    setLocalModelos(modelos || []);
  }, [marcas, modelos]);

  useEffect(() => {
    if (isOpen) {
      setFormData(asset || {});
      setIsComputer(asset?.isComputer === 1);
      setStep(0);
      setCreatedAssetId(null);
      // Inicializa los componentes básicos por defecto (con tipos correctos)
      setComputerComponents([
        { tipo: 'TM', nombre: '', numero_serial: '' },
        { tipo: 'CPU', nombre: '', numero_serial: '' },
        { tipo: 'RAM', nombre: '', numero_serial: '' },
        { tipo: 'HDD', nombre: '', numero_serial: '' },
        { tipo: 'PS', nombre: '', numero_serial: '' },
      ]);
      if (asset?.marca_id) {
        getModelosByMarca(asset.marca_id)
          .then((modelosData) => setFilteredModelos(modelosData || []))
          .catch(() => setFilteredModelos([]));
      }
    }
  }, [asset, isOpen]);

  // Manejo de cambios en campos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de cambio de marca
  const handleMarcaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarcaId = Number.parseInt(e.target.value, 10);
    setFormData((prev) => ({
      ...prev,
      marca_id: selectedMarcaId,
      modelo_id: undefined,
    }));
    if (selectedMarcaId) {
      try {
        const modelosData = await getModelosByMarca(selectedMarcaId);
        setFilteredModelos(modelosData || []);
      } catch {
        setFilteredModelos([]);
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
      setFilteredModelos([]);
    }
  };

  // Guardar bien y pasar a componentes (si es computadora)
  const handleNextStep = async () => {
    if (step === 1 && isComputer && !createdAssetId) {
      // Validaciones mínimas
      if (
        !formData.numero_identificacion ||
        !formData.nombre_descripcion ||
        !formData.fecha
      ) {
        toast({
          title: 'Error',
          description: 'Complete todos los campos obligatorios.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      formData.cantidad = 1;
      formData.isComputer = 1;
      const date = new Date(formData.fecha);
      formData.fecha = date.toISOString().split('T')[0];
      try {
        // Guardar bien
        const result = await createAsset(formData as MovableAsset);
        // Aquí el id está en result.furniture.id
        const assetId = result?.furniture?.id;
        if (assetId) {
          setCreatedAssetId(assetId);
          setStep(2);
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo guardar el bien.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo guardar el bien.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  // Prefijos para la API
  const getPrefijo = (tipo: string) => {
    if (tipo === 'TM') return 'TM';
    if (tipo === 'CPU') return 'CPU';
    if (tipo === 'RAM') return 'RAM';
    if (tipo === 'HDD') return 'HDD';
    if (tipo === 'SSD') return 'SSD';
    if (tipo === 'PS') return 'PS';
    return tipo;
  };

  // Guardar componentes
  const handleSaveComponents = async () => {
    if (!createdAssetId) return;
    if (computerComponents.length === 0) {
      toast({
        title: 'Error',
        description: 'Agregue al menos un componente.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      for (const comp of computerComponents) {
        await createComponent({
          bien_id: createdAssetId,
          nombre: `${getPrefijo(comp.tipo)}: ${comp.nombre}`,
          numero_serial: comp.numero_serial,
        });
      }
      toast({
        title: 'Éxito',
        description: 'Componentes agregados correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los componentes.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Guardar bien normal (no computadora) o edición
  const handleSubmit = async () => {
    // Validaciones mínimas
    if (
      !formData.numero_identificacion ||
      !formData.nombre_descripcion ||
      !formData.fecha
    ) {
      toast({
        title: 'Error',
        description: 'Complete todos los campos obligatorios.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    formData.cantidad = 1;
    formData.isComputer = isComputer ? 1 : 0;
    const date = new Date(formData.fecha);
    formData.fecha = date.toISOString().split('T')[0];
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el bien.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Paso y título
  const getTotalSteps = () => (isComputer && !formData.id ? 3 : 2);
  const getStepTitle = () => {
    if (step === 0) return 'Información Básica';
    if (step === 1) return 'Detalles';
    if (step === 2) return 'Componentes';
    return '';
  };

  // Render
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {formData.id ? 'Editar Bien' : 'Agregar Bien'} - Paso {step + 1} de{' '}
          {getTotalSteps()}: {getStepTitle()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Paso 1 */}
          {step === 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl>
                <FormLabel>Identificación</FormLabel>
                <Input
                  name="numero_identificacion"
                  value={formData.numero_identificacion || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  name="nombre_descripcion"
                  value={formData.nombre_descripcion || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Select
                  name="dept_id"
                  value={formData.dept_id || ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
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
          )}

          {/* Paso 2 */}
          {step === 1 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <FormControl>
                <FormLabel>Subgrupo</FormLabel>
                <Select
                  name="subgrupo_id"
                  value={formData.subgrupo_id || ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {subgroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {!formData.id && (
                <FormControl>
                  <FormLabel>Tipo de Bien</FormLabel>
                  <Checkbox
                    isChecked={isComputer}
                    onChange={(e) => setIsComputer(e.target.checked)}
                  >
                    <HStack spacing={2}>
                      <Icon as={FiMonitor} />
                      <Text>Es una computadora</Text>
                    </HStack>
                  </Checkbox>
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Marca</FormLabel>
                <Flex>
                  <Select
                    name="marca_id"
                    value={formData.marca_id || ''}
                    onChange={handleMarcaChange}
                    flex="1"
                  >
                    <option value="">Ninguna</option>
                    {localMarcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </Select>
                  <Button  bgColor='type.primary'
                    color="white"
                    colorScheme='purple'
                     ml={2} onClick={() => setIsMarcaModalOpen(true)}>
                    + Marca
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
                    isDisabled={!formData.marca_id}
                    flex="1"
                  >
                    <option value="">Ninguno</option>
                    {filteredModelos.map((modelo) => (
                      <option key={modelo.id} value={modelo.id}>
                        {modelo.nombre}
                      </option>
                    ))}
                  </Select>
                  <Button
                    ml={2}
                    bgColor='type.primary'
                    color="white"
                    colorScheme='purple'
                    onClick={() => setIsModeloModalOpen(true)}
                    isDisabled={!formData.marca_id}
                  >
                    + Modelo
                  </Button>
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel>Condición</FormLabel>
                <Select
                  name="id_estado"
                  value={formData.id_estado || ''}
                  onChange={handleChange}
                >
                  <option value="">Sin Condición</option>
                  {assetStates
                    .filter((estado) => estado.id === 2 || estado.id === 3)
                    .map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Valor</FormLabel>
                <Input
                  name="valor_unitario"
                  type="number"
                  value={formData.valor_unitario || ''}
                  onChange={handleChange}
                />
              </FormControl>
                    
              <FormControl>
                <FormLabel>Serial</FormLabel>
                <Input
                  name="numero_serial"
                  value={formData.numero_serial || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Parroquia</FormLabel>
                <Select
                  name="id_Parroquia"
                  value={formData.id_Parroquia || ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {parroquias.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          )}

          {/* Paso 3: Componentes */}
          {step === 2 && isComputer && (
            <AssetComponents
              components={computerComponents}
              setComponents={setComputerComponents}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {step > 0 && (
            <Button mr={3} onClick={() => setStep((prev) => prev - 1)}>
              Atrás
            </Button>
          )}
          {/* Botón siguiente o guardar */}
          {step < getTotalSteps() - 1 ? (
            <Button bgColor={'type.primary'} color={'white'} colorScheme={'purple'} onClick={handleNextStep}>
              Siguiente
            </Button>
          ) : isComputer && !formData.id ? (
            <Button bgColor={'type.primary'}  color={'white'}colorScheme={'purple'}  onClick={handleSaveComponents}>
              Guardar Componentes y Finalizar
            </Button>
          ) : (
            <Button bgColor={'type.primary'} color={'white'} colorScheme={'purple'} onClick={handleSubmit}>
              Guardar
            </Button>
          )}
          <Button variant="ghost" ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
      {/* Modales de Marca y Modelo */}
      <AddMarcaModeloModal
        isOpen={isMarcaModalOpen}
        onClose={() => setIsMarcaModalOpen(false)}
        type="marca"
        onAddSuccess={(createdMarca) => {
          setLocalMarcas((prev) => [...prev, createdMarca]);
          setFormData((prev) => ({ ...prev, marca_id: createdMarca.id }));
        }}
      />
      <AddMarcaModeloModal
        isOpen={isModeloModalOpen}
        onClose={() => setIsModeloModalOpen(false)}
        type="modelo"
        marcaId={formData.marca_id}
        onAddSuccess={(createdModelo) => {
          setFilteredModelos((prev) => [...prev, createdModelo]);
          setLocalModelos((prev) => [...prev, createdModelo]);
          setFormData((prev) => ({ ...prev, modelo_id: createdModelo.id }));
        }}
      />
    </Modal>
  );
};
