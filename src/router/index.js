import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import AccountView from '@/views/AccountView.vue';
import NursesView from '@/views/NursesView.vue';
import PatientsView from '@/views/PatientsView.vue';
import VisitsView from '@/views/VisitsView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
  },
  {
    path: '/nurses',
    name: 'nurses',
    component: NursesView,
  },
  {
    path: '/patients',
    name: 'patients',
    component: PatientsView,
  },
  {
    path: '/visits',
    name: 'visits',
    component: VisitsView,
  },






];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
