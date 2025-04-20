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
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Inventory from 'views/admin/inventory';


// Auth Imports
import SignInCentered from 'views/auth/signIn';
import UserManage from 'views/admin/user';
import Marketplace from 'views/admin/marketplace';
import Settings from 'views/admin/settings';

const routes = [
  {
    name: 'Inicio',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard/>,
  },
  {
    name: 'Gestión de Usuarios',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdPerson as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <UserManage/>,
  },
  {
    name: 'Gestión de Bienes',
    layout: '/admin',
    path: '/asset-management',
    icon: <Icon as={MdBarChart as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <Inventory/>,
  },
  {
    name: 'Incorporaciones e Desincorporaciones',
    layout: '/admin',
    path: '/incorporations',
    icon: <Icon as={MdOutlineShoppingCart as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <DataTables/>,
  },
  {
    name: 'Traslados',
    layout: '/admin',
    path: '/transfers',
    icon: <Icon as={MdHistory as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: null,
  },
  {
    name: 'Auditoría',
    layout: '/admin',
    path: '/audit',
    icon: <Icon as={MdAssignment as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: null,
  },
  {
    name: 'Reportes',
    layout: '/admin',
    path: '/reports',
    icon: <Icon as={MdBarChart as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: null,
  },
  {
    name: 'Configuración',
    layout: '/admin',
    path: '/settings',
    icon: <Icon as={MdSettings as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <Settings/>,
  },
  {
    name: 'Notificaciones',
    layout: '/admin',
    path: '/notifications',
    icon: <Icon as={MdNotifications as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: null,
  },
  {
    name: 'Cerrar sesión',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock as React.ElementType} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;