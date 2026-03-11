<template>
  <v-container fluid class="fill-height pa-8 not-found-wrapper">
    <v-row align="center" justify="center" class="text-center fill-height">
      <v-col cols="12" md="10" lg="8">
        <v-card class="elevation-8 rounded-xl pa-8 not-found-card" color="surface">
          <v-card-title class="text-h3 font-weight-bold mb-3" style="color: #1A4D8F;">404 - Page not found</v-card-title>
          <v-card-subtitle class="text-body-1 mb-3" style="color: #37415F;">Sorry, we couldn't find a page for <strong>{{ $route.fullPath }}</strong>.</v-card-subtitle>
          <v-card-text class="text-body-2 mb-6" style="color: #54607a;">Check your URL, or use the menu to return to a valid section. This page helps prevent navigation dead-ends in the application.</v-card-text>

          <v-row justify="center" class="mt-4" no-gutters>
            <v-col cols="auto" class="mr-2">
              <v-btn color="primary" class="font-weight-bold" @click="$router.push({ name: 'home' })">
                Go to Home
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="secondary" variant="outlined" @click="$router.push({ name: 'account' })">
                My Account
              </v-btn>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Nothing special here
</script>

<style scoped>
.not-found-wrapper {
  background: linear-gradient(160deg, #f7f9fc 0%, #eef4fb 100%);
  min-height: calc(100vh - 64px);
}
.not-found-card {
  border: 1px solid #d8e3f4;
  background: #ffffff;
  min-height: 320px;
}
.not-found-card .v-card-title,
.not-found-card .v-card-subtitle,
.not-found-card .v-card-text {
  text-align: center;
}
</style>
