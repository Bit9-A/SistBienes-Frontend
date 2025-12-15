import { Hide, Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdSettings,
  MdNotifications,
  MdHistory,
  MdAssignment,
} from 'react-icons/md';

// Admin Imports
import React from 'react';

// Admin Imports
const MainDashboard = React.lazy(() => import('views/admin/default'));
const Profile = React.lazy(() => import('views/admin/profile'));
const Inventory = React.lazy(() => import('views/admin/inventory'));
const UserManage = React.lazy(() => import('views/admin/user'));
const Settings = React.lazy(() => import('views/admin/settings'));
const AssetManagementPage = React.lazy(() => import('views/admin/movements/index'));
const NotificationsHistory = React.lazy(() => import('views/admin/notifications'));
const Transfer = React.lazy(() => import('views/admin/transfers'));
const AuditModule = React.lazy(() => import('views/admin/audit'));
const MissingGoodsTable = React.lazy(() => import('views/admin/reports'));

// Auth Imports
const SignInCentered = React.lazy(() => import('views/auth/signIn'));


// Define las rutas con sus permisos
const routes = [
  {
    name: 'Inicio',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    adminOnly: true,
    hidden: false,
  },
  {
    name: 'Gestión de Usuarios',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <UserManage />,
    adminOnly: true,
    hidden: false,
  },
  {
    name: 'Gestión de Bienes',
    layout: '/admin',
    path: '/asset-management',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Inventory />,
    adminOnly: false,
    hidden: false,
  },
  {
    name: 'Incorporaciones e Desincorporaciones',
    layout: '/admin',
    path: '/incorporations',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <AssetManagementPage />,
    adminOnly: false,
    hidden: false,
  },
  {
    name: 'Traslados',
    layout: '/admin',
    path: '/transfers',
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    component: <Transfer />,
    adminOnly: false,
    hidden: false,
  },
  {
    name: 'Auditoría',
    layout: '/admin',
    path: '/audit',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <AuditModule />,
    adminOnly: true,
    hidden: false,
  },
  {
    name: 'Bienes Faltantes',
    layout: '/admin',
    path: '/reports',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <MissingGoodsTable />,
    adminOnly: false,
    hidden: false,
  },
  {
    name: 'Configuración',
    layout: '/admin',
    path: '/settings',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: <Settings />,
    adminOnly: true,
    hidden: false,
  },
  {
    name: 'Notificaciones',
    layout: '/admin',
    path: '/notifications',
    icon: <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />,
    component: <NotificationsHistory />,
    adminOnly: false,
    hidden: false,
  },
  {
    name: 'Perfil',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    adminOnly: false,
    hidden: true,
  },
  {
    name: 'Cerrar sesión',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    adminOnly: false,
    hidden: false,
  },
];


// Función para filtrar rutas según el rol del usuario
export const getFilteredRoutes = (isAdmin: boolean) => {
  return routes.filter(route => !route.adminOnly || isAdmin);
};

export default routes;
