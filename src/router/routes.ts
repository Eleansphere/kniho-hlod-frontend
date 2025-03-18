export const routes = [
    {
        path: '/',
        name: 'main-layout',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/pages/HomePage.vue'),
              meta: { title: 'Home', icon: 'home',badge: null},
            },
            {
                path: 'notifications',
                name: 'Notifications',
                component: () => import('@/components/AddBookEntry.vue'),
                meta: {
                    title: 'Notifikace',
                    icon: 'pi pi-address-book',
                    badge: 3
                }
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('@/pages/UserPage.vue'),
                meta: {
                    title: 'Uživatel',
                    icon: 'pi pi-user',
                    badge: null
                }
            },
          {
            path: 'books',
            name: 'Books',
            component: () => import('@/pages/BooksPage.vue'),
            meta: {
              title: 'Knihy',
              icon: 'pi pi-book',
              badge: 3
            }
          },
          {
            path: 'loans',
            name: 'Loans',
            component: () => import('@/pages/LoansPage.vue'),
            meta: {
              title: 'Výpujčky',
              icon: 'pi pi-address-book',
              badge: 2
            }
          }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue')
    },
    {
        path: '/:catchAll(.*)*',
        component: () => import('@/pages/ErrorNotFound.vue')
    }
];
