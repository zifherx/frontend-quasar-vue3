const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
    },
    {
        path: "/dashboard",
        component: () => import("layouts/CoreLayout.vue"),
        meta: { requireAuth: true },
        children: [
            {
                name: "Dashboard",
                path: "",
                component: () => import("pages/dashboard/DashboardPage.vue"),
            },
            {
                name: 'Dashboard Ventas',
                path: '/dashboard/ventas',
                component: () => import('pages/dashboard/DashboardVentasPage.vue')
            },
            {
                name: 'Dashboard CRM',
                path: '/dashboard/crm',
                component: () => import('pages/dashboard/DashboardCRMPage.vue')
            },
            // Settings
            {
                name: 'Configuración',
                path: '/administrative/settings',
                component: () => import('pages/administrativo/config/initPage.vue')
            },
            // Usuarios
            {
                name: 'Lista de Usuarios',
                path: '/administrative/users',
                component: () => import('pages/administrativo/users/listUsuarios.vue')
            },
            // Roles
            {
                name: 'Lista de Roles',
                path: '/administrative/roles',
                component: () => import('pages/administrativo/roles/listRoles.vue')
            },
            // Permisos
            {
                name: 'Lista de Permisos',
                path: '/administrative/license',
                component: () => import('pages/administrativo/permisos/listPermisos.vue')
            },
            // Vendedores
            {
                name: 'Lista de Vendedores',
                path: '/administrative/sellers',
                component: () => import('pages/administrativo/sellers/listSellers.vue')
            },
            /* Finanzas */
            // Divisas
            {
                name: 'Divisas',
                path: '/finances/divisas',
                component: () => import('pages/finanzas/divisas/initPage.vue')
            },
            // Tipo Cambio
            {
                name: 'Tipo de Cambio',
                path: '/finances/divisas/tcambio',
                component: () => import ('pages/finanzas/divisas/tipoCambio/listTipoCambio.vue')
            }
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
    },
];

export default routes;
