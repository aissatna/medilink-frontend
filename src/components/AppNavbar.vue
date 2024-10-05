<template>
    <nav>
        <v-app-bar>
            <v-toolbar color="teal-lighten-5" elevation="8">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <v-btn class="ml-3" to="/" text>
                    <span class="pr-2 text-grey-darken-3">Sign Out</span>
                    <v-icon icon="mdi mdi-exit-to-app"></v-icon>
                </v-btn>
            </v-toolbar>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" color="teal-lighten-3">
            <v-list>
                <v-list-item v-for="(link, index) in links" :key="index" :prepend-icon="link.icon" :title="link.title"
                    :value="link.value" :to="link.route">
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

    </nav>
</template>

<script setup>
import { ref } from 'vue';
const drawer = ref(false);

const links = [
    { title: 'Home', icon: 'mdi mdi-home-outline', value: 'Home', route: "/home" },
    { title: 'Patients', icon: 'mdi mdi-account-heart-outline', value: 'Patients', route: "/patients" },
    { title: 'Nurses', icon: 'mdi mdi-account-group', value: 'Nurses', route: "/nurses" },
    { title: 'Visits', icon: 'mdi mdi-calendar-check', value: 'Visits', route: "/visits" },
    { title: 'Account', icon: 'mdi mdi-account', value: 'Account', route: "/account" },
];

</script>

<style scoped></style>