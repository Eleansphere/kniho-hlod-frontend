export const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'main-layout', 
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { title: 'Home', icon: 'home', badge: null },
      },
      {
        path: 'books',
        name: 'Books', 
        component: () => import('@/components/tabs/Books.vue'),
        meta: {
          title: 'Knihy',
          icon: 'pi pi-book',
          badge: 3,
        },
      },
      {
        path: 'loans',
        name: 'Loans',
        component: () => import('@/components/tabs/Loans.vue'),
        meta: {
          title: 'Výpujčky',
          icon: 'pi pi-address-book', 
          badge: 2,
        },
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