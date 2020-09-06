import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/users/Login.vue';
import store from '../store';

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
// 页面刷新时，重新赋值token
if (localStorage.getItem('token')) {
  store.commit('BIND_LOGIN', localStorage.getItem('token'));
}

// 全局导航钩子
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.requireLogin) {
    if (store.getters.token) {
      if (Object.keys(from.query).length === 0) {
        next();
      } else {
        const { redirect } = from.query;
        if (to.path === redirect) {
          next();
        } else {
          next({ path: redirect });
        }
      }
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router;
