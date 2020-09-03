import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/users/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Home,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/users/Register.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
