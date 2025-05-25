import { Icon } from '@chakra-ui/react';
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
import MainDashboard from 'views/admin/default';

import Profile from 'views/admin/profile';

import Inventory from 'views/admin/inventory';


// Auth Imports
import SignInCentered from 'views/auth/signIn';
import UserManage from 'views/admin/user';

import Settings from 'views/admin/settings';
import AssetManagementPage from 'views/admin/movements/index';
import NotificationsHistory from 'views/admin/notifications';
import Transfer from 'views/admin/transfers';

import AuditModule from 'views/admin/audit';
import MissingAssetsReport from 'views/admin/reports';




// Define las rutas con sus permisos
const routes = [
  {
    name: 'Inicio',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    adminOnly: true,
  },
  {
    name: 'Gestión de Usuarios',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <UserManage />,
    adminOnly: true,
  },
  {
    name: 'Gestión de Bienes',
    layout: '/admin',
    path: '/asset-management',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Inventory />,
    adminOnly: false,
  },
  {
    name: 'Incorporaciones e Desincorporaciones',
    layout: '/admin',
    path: '/incorporations',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <AssetManagementPage />,
    adminOnly: false,
  },
  {
    name: 'Traslados',
    layout: '/admin',
    path: '/transfers',
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    component: <Transfer />,
    adminOnly: false,
  },
  {
    name: 'Auditoría',
    layout: '/admin',
    path: '/audit',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <AuditModule />,
    adminOnly: false,
  },
  {
    name: 'Reportes',
    layout: '/admin',
    path: '/reports',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <MissingAssetsReport />,
    adminOnly: false,
  },
  {
    name: 'Configuración',
    layout: '/admin',
    path: '/settings',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: <Settings />,
    adminOnly: true,
  },
  {
    name: 'Notificaciones',
    layout: '/admin',
    path: '/notifications',
    icon: <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />,
    component: <NotificationsHistory />,
    adminOnly: true,
  },
  {
    name: 'Cerrar sesión',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    adminOnly: false,
  },
];

// Función para filtrar rutas según el rol del usuario
export const getFilteredRoutes = (isAdmin: boolean) => {
  return routes.filter(route => !route.adminOnly || isAdmin);
};

export default routes;