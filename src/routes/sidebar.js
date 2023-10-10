
 const routes = [
  {
    path: '/app/dashboard', 
    icon: 'DashboardIcon', 
    name: 'Dashboard', 
  },
  {
    path: '/app/vendors',
    icon: 'NoteIcon',
    name: 'Manage Vendors',
  },
  {
    path: '/app/telcos',
    icon: 'NoteIcon',
    name: 'Manage Telcos',
  },
  {
    path: '/app/vendor-telco',
    icon: 'AttachmentIcon',
    name: 'Telco/Vendor Mapping',
  },
  {
    path: '/app/fee-setup',
    icon: 'MoneyIcon',
    name: 'Fee Setup',
  },
  {
    path: '/app/reports',
    icon: 'ChartIcon',
    name: 'Reports',
  },
  {
    path: '/app/settings',
    icon: 'SettingsIcon',
    name: 'Settings',
  },
  
]

const adminRoutes = [
  {
    path: '/app/admin/dashboard', 
    icon: 'DashboardIcon', 
    name: 'Dashboard', 
  },
  {
    path: '/app/admin/vendors',
    icon: 'NoteIcon',
    name: 'Manage Vendors',
  },
  {
    path: '/app/admin/telcos',
    icon: 'NoteIcon',
    name: 'Manage Telcos',
  },
  {
    path: '/app/admin/vendor-telco',
    icon: 'AttachmentIcon',
    name: 'Telco/Vendor Mapping',
  },
  {
    path: '/app/admin/fee-setup',
    icon: 'MoneyIcon',
    name: 'Fee Setup',
  },
  {
    path: '/app/admin/reports',
    icon: 'ChartIcon',
    name: 'Reports',
  },
  {
    path: '/app/admin/settings',
    icon: 'SettingsIcon',
    name: 'Settings',
  },
  
]

const superAdminRoutes = [
  {
    path: '/app/super-admin/user-management',
    icon: 'UserIcon',
    name: 'Profile Management',
  },
  {
    path: '/app/super-admin/audit-log',
    icon: 'ChartIcon',
    name: 'Audit Log',
  },
]

export {routes, adminRoutes, superAdminRoutes}

