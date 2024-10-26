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
import AppNavbar from '@/components/AppNavbar.vue';
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

<style scoped>
.bg-login {
  background-image: url('@/assets/bg-login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

}
</style>