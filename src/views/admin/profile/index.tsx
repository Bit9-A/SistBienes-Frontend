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

import { getProfile, UserProfile, changePassword } from "../../../api/UserApi"
import { getDepartments } from "../../../api/SettingsApi"
import { getUserRoles } from "../../../api/UserRoleApi"

const Profile = () => {
	const [departments, setDepartments] = useState([]) // Lista de departamentos
	const [userRoles, setUserRoles] = useState([]) // Lista de roles de usuario
	const [user, setUser] = useState<UserProfile | null>(null); // Estado para el perfil del usuario
	const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para mostrar la contraseña
	const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
	const [currentPassword, setCurrentPassword] = useState(""); // Estado para la contraseña actual
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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



	const handleChangePassword = async () => {
		try {
			if (newPassword !== confirmPassword) {
				alert("Las contraseñas no coinciden");
				return;
			}

			const user = localStorage.getItem("user");
			const token = user ? JSON.parse(user).token : null;

			const response = await changePassword({
				currentPassword,
				newPassword
			});

			if (response.ok) {
				alert("Contraseña cambiada correctamente");
				setIsModalOpen(false);
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			} else {
				alert(response.message || "Error al cambiar la contraseña");
			}
		} catch (error) {
			console.error(error);
			alert("Ocurrió un error inesperado");
		}
		finally {
			setIsSubmitting(false);
		}
	};


	const ProfileField = ({
		label,
		name,
		value,
		type = "text",
		isTextarea = false,
	}: {
		label: string
		name: string
		value: string
		type?: string
		isTextarea?: boolean
		onClick?: () => void // Definir el tipo de onClick
	}) => (
		<FormControl>
			<FormLabel color={secondaryTextColor} fontSize="sm" fontWeight="medium">
				{label}:
			</FormLabel>
			{(
				<Box p={3} bg={sectionBg} borderRadius="md" border="1px" borderColor={borderColor}>
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
									name={user?.nombre_completo} // Cambiado a nombre
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

											/>
											<ProfileField
												label="Correo Electrónico"
												name="email"
												value={user?.email}

												type="email"
											/>
											<ProfileField
												label="Teléfono"
												name="telefono"
												value={user?.telefono}

											/>
											<ProfileField
												label="Cédula"
												name="cedula"
												value={user?.cedula}

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
											<ProfileField label="Departamento" name="dept_nombre" value={user?.dept_nombre} />
										</VStack>
									</CardBody>
								</Card>
							</GridItem>
						</Grid>

						{/* Action Buttons */}
						<Flex justify="center" gap={4}>
							<Button
								bgColor="type.primary"
								colorScheme="purple"
								size="lg"
								px={8}
								py={6}
								shadow="md"
								_hover={{ transform: "scale(1.05)" }}
								transition="all 0.3s"
								onClick={() => setIsModalOpen(true)}
								alignSelf="start"
							>
								Cambiar Contraseña
							</Button>
						</Flex>
					</CardBody>
				</Card>
			</Container>

			{/* Modal para ingresar la contraseña actual */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Cambiar Contraseña</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Contraseña Actual</FormLabel>
								<Input
									type="password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Nueva Contraseña</FormLabel>
								<Input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Confirmar Nueva Contraseña</FormLabel>
								<Input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button bgColor="type.primary"
							colorScheme="purple" onClick={handleChangePassword}
							isLoading={isSubmitting}>Cambiar</Button>
						<Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default Profile
