export const filterUsers = (
  users: any[],
  searchQuery: string,
  selectedDept: string,
  selectedUserType: string
) => {
  return users.filter((user) => {
    const matchesSearch =
      (user.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (user.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

    const matchesDept =
      selectedDept === 'all' || user.dept_id?.toString() === selectedDept;

    const matchesUserType =
      selectedUserType === 'all' || user.tipo_usuario?.toString() === selectedUserType;

    return matchesSearch && matchesDept && matchesUserType;
  });
};
  
  export const handleDeleteUser = async (id: number, deleteUser: (id: number) => Promise<void>, setUsers: any) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers: any[]) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };
  
  export const handleUpdateUser = async (
    user: any,
    updateUser: (id: number, userData: any) => Promise<void>,
    setUsers: any
  ) => {
    try {
      const { id, ...userData } = user;
      await updateUser(id, userData);
      setUsers((prevUsers: any[]) =>
        prevUsers.map((u) => (u.id === id ? { ...u, ...userData } : u))
      );
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };
  
  export const handleEditUser = (user: any, setEditingUser: any, onOpen: () => void) => {
    setEditingUser(user);
    onOpen();
  };

  export const handleCreateUser = async (
    user: any,
    createUser: (userData: any) => Promise<void>,
    setUsers: any
  ) => {
    try {
      const newUser = await createUser(user);
      setUsers((prevUsers: any[]) => [...prevUsers, newUser]);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  export const handleSaveEditUser = async (
    updatedUser: any,
    updateUser: (id: number, userData: any) => Promise<void>,
    setUsers: any,
    onClose: () => void
  ) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      setUsers((prevUsers: any[]) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
      );
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };