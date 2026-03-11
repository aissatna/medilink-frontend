import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import AccountView from '@/views/AccountView.vue';
import NursesView from '@/views/NursesView.vue';
import PatientsView from '@/views/PatientsView.vue';
import VisitsView from '@/views/VisitsView.vue';
import SecretariesView from '@/views/SecretariesView.vue';
import CabinetView from '@/views/CabinetView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

/**
 * Route configuration with security meta data
 * 
 * meta.requiresAuth: boolean - Route requires authentication
 * meta.roles: string[] - Roles allowed to access this route (empty = all authenticated roles)
 * meta.isPublic: boolean - Route accessible without authentication
 */
const routes = [
  // Public Routes
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { 
      isPublic: true,
      requiresAuth: false,
    },
  },

  // Private Routes - Accessible to all authenticated users
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { 
      requiresAuth: true,
      roles: ['director', 'secretary', 'nurse'],
    },
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { 
      requiresAuth: true,
      roles: ['director', 'secretary', 'nurse'],
    },
  },

  // Private Routes - Role-restricted access
  {
    path: '/nurses',
    name: 'nurses',
    component: NursesView,
    meta: { 
      requiresAuth: true,
      roles: ['secretary'],
    },
  },
  {
    path: '/patients',
    name: 'patients',
    component: PatientsView,
    meta: { 
      requiresAuth: true,
      roles: ['secretary'],
    },
  },
  {
    path: '/visits',
    name: 'visits',
    component: VisitsView,
    meta: { 
      requiresAuth: true,
      roles: ['secretary', 'nurse'],
    },
  },
  {
    path: '/secretaries',
    name: 'secretaries',
    component: SecretariesView,
    meta: { 
      requiresAuth: true,
      roles: ['director'],
    },
  },
  {
    path: '/cabinet',
    name: 'cabinet',
    component: CabinetView,
    meta: { 
      requiresAuth: true,
      roles: ['director'],
    },
  },

  // 404 Route - Catch-all for unknown routes
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      requiresAuth: true,
      roles: ['director', 'secretary', 'nurse'],
      isPublic: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

/**
 * Global Navigation Guard
 * Checks authentication and permissions before each navigation
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  // Check authentication by verifying token exists directly
  const isAuthenticated = !!authStore.accessToken && authStore.accessToken.length > 0;
  const userRole = userStore.userInfo?.roleName?.toLowerCase() || '';

  // Public route - accessible without authentication
  if (to.meta.isPublic) {
    // If user is already logged in and tries to access login, redirect to home
    if (isAuthenticated && to.name === 'login') {
      return next({ name: 'home' });
    }
    return next();
  }

  // Private route - check authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Not authenticated - redirect to login with requested route as query
      return next({ 
        name: 'login', 
        query: { redirect: to.fullPath }, 
      });
    }

    // Check role permissions if specified (skip if role not yet loaded)
    const allowedRoles = to.meta.roles || [];
    if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
      // Role not authorized - redirect to home
      console.warn(`[Router Guard] Access denied: role "${userRole}" not authorized for "${to.path}"`);
      return next({ name: 'home' });
    }
  }

  // All checks passed - proceed with navigation
  next();
});

export default router;
