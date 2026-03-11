<template>
  <v-app :class="isLoginPage ? 'bg-login' : 'bg-grey-lighten-4'">
    <!-- show the navbar only if not on login page -->
    <AppNavbar v-if="!isLoginPage" />
    <v-main class="mx-3">
      <router-view>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppNavbar from '@/components/shared/AppNavbar.vue';
export default {
  name: 'App',
  components: {
    AppNavbar,
  },
  data: () => ({}),
  computed: {
    isLoginPage() {
      return this.$route.path === '/';
    },
  },
};
</script>

<style>
:root {
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #1E2A40;
}

body {
  background-color: #F4F6F8;
  font-family: inherit;
}

.bg-login {
  background-image: url('@/assets/bg-login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.v-application {
  background-color: #F4F6F8 !important;
}

.v-application .v-main {
  color: #1E2A40;
}

.v-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.v-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease-in-out;
}

.v-btn.v-btn--text {
  color: #0E88D4 !important;
}

.v-card {
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
}

.v-navigation-drawer {
  border-right: 1px solid rgba(26, 77, 143, 0.15);
}

</style>