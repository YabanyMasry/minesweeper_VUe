import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
    props: (route) => ({
      rows: parseInt(route.query.rows) || 10,
      cols: parseInt(route.query.cols) || 10,
      mines: parseInt(route.query.mines) || 10,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;