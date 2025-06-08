import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next)=>{

//   //token here

//   if(to.meta.requiresAuth && !isAuthenticated){
//     next('/login')
//   }
//   else if(to.path ==='/login' && isAuthenticated){
//     next('/home');
//   }
//   else{
//     next()
//   }
// })

export default router;
