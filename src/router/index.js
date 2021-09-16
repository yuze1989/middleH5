import Vue from 'vue';
import VueRouter from 'vue-router';
import speechArt from '../views/speechArt.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'speechArt',
    component: speechArt,
    meta: {
      tabbarshow: true,
    },
  },
  {
    path: '/material',
    name: 'material',
    meta: {
      tabbarshow: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */'../views/material.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
