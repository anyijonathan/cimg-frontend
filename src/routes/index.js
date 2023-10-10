import { lazy } from "react";

const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));
const AdminVendors = lazy(() => import("../pages/AdminPages/Vendors"));
const AdminVendorInfo = lazy(() => import("../pages/AdminPages/VendorInfo"));
const AdminTelcos = lazy(() => import("../pages/AdminPages/Telcos"));
const AdminTelcoInfo = lazy(() => import("../pages/AdminPages/TelcoInfo"));
const AdminVendorTelco = lazy(() => import("../pages/AdminPages/VendorTelco"));
const AdminFeeSetup = lazy(() => import("../pages/AdminPages/FeeSetup"));
const AdminReports = lazy(() => import("../pages/AdminPages/Reports"));
const AdminSettings = lazy(() => import("../pages/AdminPages/Settings"));
const AdminNewFeeSetup = lazy(() => import("../pages/AdminPages/NewFeeSetup"));
const AdminEditFeeSetup = lazy(() =>import("../pages/AdminPages/EditFeeSetup"));
const AdminTransactionInfo = lazy(() =>import("../pages/AdminPages/TransactionInfo"));

const SuperAdminDashboard = lazy(() =>import("../pages/SuperAdminPages/Dashboard"));
const SuperAdminVendors = lazy(() =>import("../pages/SuperAdminPages/VendorComponents/Vendors"));
const SuperAdminVendorInfo = lazy(() =>import("../pages/SuperAdminPages/VendorInfo"));
const SuperAdminTelcos = lazy(() =>import("../pages/SuperAdminPages/TelcoComponents/Telcos"));
const SuperAdminTelcoInfo = lazy(() =>import("../pages/SuperAdminPages/TelcoInfo"));
const SuperAdminVendorTelco = lazy(() =>import("../pages/SuperAdminPages/VendorTelcoComponents/VendorTelco"));
const SuperAdminFeeSetup = lazy(() =>import("../pages/SuperAdminPages/FeeSetUpComponents/FeeSetup"));
const SuperAdminReports = lazy(() =>import("../pages/SuperAdminPages/Reports"));
const SuperAdminSettings = lazy(() =>import("../pages/SuperAdminPages/Settings"));
const SuperAdminNewFeeSetup = lazy(() =>import("../pages/SuperAdminPages/FeeSetUpComponents/NewFeeSetup"));
const SuperAdminEditFeeSetup = lazy(() =>import("../pages/SuperAdminPages/FeeSetUpComponents/EditFeeSetup"));
const SuperAdminTransactionInfo = lazy(() =>import("../pages/SuperAdminPages/TransactionInfo"));

const SuperSuperAdminSettings = lazy(() =>import("../pages/SuperSuperAdminPages/UserManagement"));
const SuperSuperAuditLog = lazy(() =>import("../pages/SuperSuperAdminPages/AuditLog"));

const routes = [
	{
		path: "/dashboard",
		component: AdminDashboard,
	},
	{
		path: "/vendors",
		component: AdminVendors,
	},
	{
		path: "/vendors/vendor-info",
		component: AdminVendorInfo,
	},
	{
		path: "/telcos",
		component: AdminTelcos,
	},
	{
		path: "/telcos/telco-info",
		component: AdminTelcoInfo,
	},
	{
		path: "/vendor-telco",
		component: AdminVendorTelco,
	},
	{
		path: "/fee-setup",
		component: AdminFeeSetup,
	},
	{
		path: "/fee-setup/new-fee-setup",
		component: AdminNewFeeSetup,
	},
	{
		path: "/fee-setup/edit-fee-setup",
		component: AdminEditFeeSetup,
	},

	{
		path: "/reports",
		component: AdminReports,
	},
	{
		path: "/reports/transaction-info",
		component: AdminTransactionInfo,
	},
	{
		path: "/settings",
		component: AdminSettings,
	},
];

const adminRoutes = [
	{
		path: "/admin/dashboard",
		component: SuperAdminDashboard,
	},
	{
		path: "/admin/vendors",
		component: SuperAdminVendors,
	},
	{
		path: "/admin/vendors/vendor-info",
		component: SuperAdminVendorInfo,
	},

	{
		path: "/admin/telcos",
		component: SuperAdminTelcos,
	},
	{
		path: "/admin/telcos/telco-info",
		component: SuperAdminTelcoInfo,
	},

	{
		path: "/admin/vendor-telco",
		component: SuperAdminVendorTelco,
	},
	{
		path: "/admin/fee-setup",
		component: SuperAdminFeeSetup,
	},
	{
		path: "/admin/fee-setup/new-fee-setup",
		component: SuperAdminNewFeeSetup,
	},
	{
		path: "/admin/fee-setup/edit-fee-setup",
		component: SuperAdminEditFeeSetup,
	},

	{
		path: "/admin/reports",
		component: SuperAdminReports,
	},
	{
		path: "/admin/reports/transaction-info",
		component: SuperAdminTransactionInfo,
	},
	{
		path: "/admin/settings",
		component: SuperAdminSettings,
	},

];

const superAdminRoutes = [
	{
		path: "/super-admin/user-management",
		component: SuperSuperAdminSettings,
	},

	{
		path: "/super-admin/audit-log",
		component: SuperSuperAuditLog,
	}
]

export { routes, adminRoutes, superAdminRoutes };
