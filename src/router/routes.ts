export const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('@/layouts/AppLayout.vue'),
        children: [
          { path: '', redirect: '/home/overview' },
          {
            path: 'overview',
            name: 'overview',
            component: () => import('@/components/tabs/overview/Overview.vue'),
          },
          {
            path: 'loans',
            name: 'loans',
            component: () => import('@/components/tabs/loans/Loans.vue'),
          },
          {
            path: 'books',
            name: 'books',
            component: () => import('@/components/tabs/books/Books.vue'),
          },
          {
            path: 'account',
            name: 'account',
            component: () => import('@/components/tabs/account/AccountAccordion.vue'),
          },
          {
            path: 'admin',
            name: 'admin',
            component: () => import('@/components/tabs/Administrator.vue'),
            meta: { requiresRole: 'admin' },
          },
          {
            path: 'notifications',
            name: 'notifications',
            component: () => import('@/pages/NotificationsPage.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];
