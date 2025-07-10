import type React from "react"
import { useState, useEffect } from "react"
import {
	Box,
	Flex,
	Text,
	Button,
	Input,
	Textarea,
	FormControl,
	FormLabel,
	Avatar,
	Heading,
	VStack,
	HStack,
	Grid,
	GridItem,
	Card,
	CardBody,
	useColorModeValue,
	Icon,
	Divider,
	Container,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react"
import { FiUser, FiBriefcase, FiSettings, FiMapPin } from "react-icons/fi"

import { getProfile, UserProfile } from "../../../api/UserApi"
import { getDepartments } from "../../../api/SettingsApi"
import { getUserRoles } from "../../../api/UserRoleApi"

const Profile = () => {
	const [departments, setDepartments] = useState([]) // Lista de departamentos
	const [userRoles, setUserRoles] = useState([]) // Lista de roles de usuario
	const [user, setUser] = useState<UserProfile | null>(null); // Estado para el perfil del usuario
	const [isEditing, setIsEditing] = useState(false) // Estado para controlar si el modo de edición está activado
	const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para mostrar la contraseña
	const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
	const [currentPassword, setCurrentPassword] = useState(""); // Estado para la contraseña actual

	const fetchDepartments = async () => {
		try {
			const data = await getDepartments()
			setDepartments(data)
		} catch (error) {
			console.error(error)
		}
	}

	const fetchUserRoles = async () => {
		try {
			const data = await getUserRoles()
			setUserRoles(data)
		} catch (error) {
			console.error("Error fetching user roles:", error)
		}
	}

	const fetchUser = async () => {
		try {
			const data = await getProfile()
			setUser(data)
		} catch (error) {
			console.error("Error fetching user:", error)
		}
	}

	useEffect(() => {
		fetchUserRoles() // Carga los roles de usuario al inicio
		fetchDepartments() // Carga los departamentos al inicio
		fetchUser() // Carga el perfil del usuario
	}, [])

	const bgColor = useColorModeValue("gray.50", "gray.900")
	const cardBg = useColorModeValue('white', 'gray.700');
	const textColor = useColorModeValue('gray.800', 'white');
	const secondaryTextColor = useColorModeValue("gray.600", "gray.400")
	const sectionBg = useColorModeValue("gray.50", "gray.700")
	const borderColor = useColorModeValue("gray.200", "gray.600")
	const bg = useColorModeValue('gray.50', 'gray.900');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}))
	}

	const handleSave = () => {
		console.log("Perfil guardado:", user)
		setIsEditing(false)
	}

	const handleCancel = () => {
		setIsEditing(false)
	}

	const handlePasswordSubmit = () => {
		// Aquí puedes agregar la lógica para verificar la contraseña actual
		// Si es correcta, muestra la contraseña
		setIsPasswordVisible(true);
		setIsModalOpen(false);
	}

	const ProfileField = ({
		label,
		name,
		value,
		isEditing,
		type = "text",
		isTextarea = false,
		onClick, // Agregar onClick aquí
	}: {
		label: string
		name: string
		value: string
		isEditing: boolean
		type?: string
		isTextarea?: boolean
		onClick?: () => void // Definir el tipo de onClick
	}) => (
		<FormControl>
			<FormLabel color={secondaryTextColor} fontSize="sm" fontWeight="medium">
				{label}:
			</FormLabel>
			{isEditing ? (
				isTextarea ? (
					<Textarea
						name={name}
						value={value}
						onChange={handleChange}
						bg={cardBg}
						borderColor={borderColor}
						_focus={{
							borderColor: "blue.500",
							boxShadow: "0 0 0 1px blue.500",
						}}
						resize="vertical"
						rows={3}
					/>
				) : (
					<Input
						type={type}
						name={name}
						value={value}
						onChange={handleChange}
						bg={cardBg}
						borderColor={borderColor}
						_focus={{
							borderColor: "blue.500",
							boxShadow: "0 0 0 1px blue.500",
						}}
						onClick={onClick} // Agregar onClick aquí
					/>
				)
			) : (
				<Box p={3} bg={sectionBg} borderRadius="md" border="1px" borderColor={borderColor} onClick={onClick}>
					<Text color={textColor} fontWeight="medium">
						{value}
					</Text>
				</Box>
			)}
		</FormControl>
	)

	return (
		<Box minH="100vh" bg={bg} pt={{ base: '130px', md: '100px', xl: '100px' }}>
			<Container maxW="6xl">
				<Card bg={cardBg} shadow="xl" borderRadius="xl" border="1px" borderColor={borderColor}>
					<CardBody p={8}>
						<Flex
							direction={{ base: "column", md: "row" }}
							align={{ base: "center", md: "flex-start" }}
							mb={8}
							gap={8}
						>
							{/* Profile Picture */}
							<Box flexShrink={0}>
								<Avatar
									size="2xl"
									name={user?.nombre} // Cambiado a nombre
									border="4px"
									borderColor="blue.500"
									shadow="lg"
									transition="transform 0.3s"
									_hover={{ transform: "scale(1.05)" }}
								/>
							</Box>

							{/* Basic Info */}
							<VStack align={{ base: "center", md: "flex-start" }} spacing={2} flex={1}>
								<Heading size="xl" color={textColor}>
									{user?.nombre_completo}
								</Heading>
								<Text fontSize="lg" color="blue.600" fontWeight="semibold">
									{user?.nombre_tipo_usuario}
								</Text>
								<Text fontSize="md" color={secondaryTextColor}>
									{user?.email}
								</Text>
								<HStack color={secondaryTextColor}>
									<Icon as={FiMapPin} />
									<Text fontSize="md">{user?.telefono}</Text>
								</HStack>
							</VStack>
						</Flex>

						<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8} mb={8}>
							{/* Sección de Información Personal */}
							<GridItem>
								<Card bg={sectionBg} border="1px" borderColor={borderColor}>
									<CardBody p={6}>
										<HStack mb={4}>
											<Icon as={FiUser} color="blue.600" boxSize={6} />
											<Heading size="md" color={textColor}>
												Información Personal
											</Heading>
										</HStack>
										<VStack spacing={4} align="stretch">
											<ProfileField
												label="Nombre Completo"
												name="nombre y Apellido"
												value={user?.nombre_completo}
												isEditing={isEditing}
											/>
											<ProfileField
												label="Correo Electrónico"
												name="email"
												value={user?.email}
												isEditing={isEditing}
												type="email"
											/>
											<ProfileField
												label="Teléfono"
												name="telefono"
												value={user?.telefono}
												isEditing={isEditing}
											/>
											<ProfileField
												label="Cédula"
												name="cedula"
												value={user?.cedula}
												isEditing={isEditing}
											/>
											<ProfileField
												label="Contraseña"
												name="password"
												value={isPasswordVisible ? user?.password : "********"} // Muestra la contraseña si es visible
												isEditing={isEditing}
												type="text"
												onClick={() => setIsModalOpen(true)} // Abre el modal al hacer clic
											/>
										</VStack>
									</CardBody>
								</Card>
							</GridItem>

							{/* Sección de Información Laboral */}
							<GridItem>
								<Card bg={sectionBg} border="1px" borderColor={borderColor}>
									<CardBody p={6}>
										<HStack mb={4}>
											<Icon as={FiBriefcase} color="blue.600" boxSize={6} />
											<Heading size="md" color={textColor}>
												Información Laboral
											</Heading>
										</HStack>
										<VStack spacing={4} align="stretch">
											<ProfileField label="Departamento" name="dept_nombre" value={user?.dept_nombre} isEditing={isEditing} />
											<ProfileField label="ID de Usuario" name="id" value={String(user?.id)} isEditing={isEditing} />
										</VStack>
									</CardBody>
								</Card>
							</GridItem>
						</Grid>

						{/* Action Buttons */}
						<Flex justify="center" gap={4}>
							{isEditing ? (
								<>
									<Button
										onClick={handleSave}
										colorScheme="green"
										size="lg"
										px={8}
										py={6}
										shadow="md"
										_hover={{ transform: "scale(1.05)" }}
										transition="all 0.3s"
									>
										Guardar
									</Button>
									<Button
										onClick={handleCancel}
										colorScheme="red"
										size="lg"
										px={8}
										py={6}
										shadow="md"
										_hover={{ transform: "scale(1.05)" }}
										transition="all 0.3s"
									>
										Cancelar
									</Button>
								</>
							) : (
								<Button
									onClick={() => setIsEditing(true)}
									colorScheme="blue"
									size="lg"
									px={10}
									py={6}
									shadow="lg"
									_hover={{ transform: "scale(1.05)" }}
									transition="all 0.3s"
								>
									Editar Perfil
								</Button>
							)}
						</Flex>
					</CardBody>
				</Card>
			</Container>

			{/* Modal para ingresar la contraseña actual */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Verificar Contraseña</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<FormLabel>Contraseña Actual</FormLabel>
							<Input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" onClick={handlePasswordSubmit}>
							Ver
						</Button>
						<Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default Profile
