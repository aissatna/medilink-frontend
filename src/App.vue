<template>
  <v-app class="bg-grey-lighten-4">
    <!-- show the navbar only if not on login page -->
    <AppNavbar v-if="showNavbar" />
    <v-main fluid class="mx-4">
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
  data: () => ({

  }),
  computed: {
    showNavbar() {
      return this.$route.path !== '/';
    },
  },
};
</script>
