<template>
    <nav>
        <v-app-bar>
            <v-toolbar color="teal-lighten-3" elevation="8">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-items class="ml-5">
                    <v-img :width="180" :src="logoUrl" alt="MediLink logo"></v-img>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-btn class="ml-3" to="/" text outlined color="teal darken-3">
                    <span class="pr-2">Logout</span>
                    <v-icon icon="mdi mdi-exit-to-app"></v-icon>
                </v-btn>
            </v-toolbar>
        </v-app-bar>
        <!-- Navigation Drawer -->
        <v-navigation-drawer v-model="drawer" color="teal-lighten-3" app>
            <v-list dense>
                <v-list-item v-for="(link, index) in userLinks" :key="index" :prepend-icon="link.icon"
                    :title="link.title" :value="link.value" :to="link.route"
                    :class="{ active: currentRoute === link.route }" @mouseover="hovered = index"
                    @mouseleave="hovered = null" class="text-uppercase item-link">
                </v-list-item>
            </v-list>
            <!-- Avatar -->
            <template v-slot:append>
                <div class="mb-3">
                    <v-divider :thickness="2"></v-divider>
                    <v-list dense>
                        <v-list-item :prepend-avatar="avatarUrl" subtitle="sandra_a88@gmail.com" title="Sandra Adams">
                            <span class="text-subtitle-1 text-capitalize">{{ userRole }}</span>
                        </v-list-item>
                    </v-list>
                </div>
            </template>
        </v-navigation-drawer>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue';

const drawer = ref(false);
const hovered = ref(null);
const userRole = ref('secretary');

const links = [
    { title: 'HOME', icon: 'mdi mdi-home-outline', value: 'Home', route: "/home" },
    { title: 'PATIENTS', icon: 'mdi mdi-account-heart-outline', value: 'Patients', route: "/patients" },
    { title: 'NURSES', icon: 'mdi mdi-account-group', value: 'Nurses', route: "/nurses" },
    { title: 'VISITS', icon: 'mdi mdi-calendar-check', value: 'Visits', route: "/visits" },
    { title: 'ACCOUNT', icon: 'mdi mdi-account', value: 'Account', route: "/account" },
];

// images
const images = require.context('../assets', true, /\.png$/);
const avatarUrl = images('./avatar.png');
const logoUrl = images('./logo.png');


const userLinks = computed(() => {
    if (userRole.value === 'nurse') {
        return links.filter(link => link.title !== 'PATIENTS' && link.title !== 'NURSES');
    }
    return links;
});

</script>

<style scoped>
/* Sign Out Button Styling */
.v-btn {
    border: 1px solid teal;
    background-color: white;
    color: teal;
}

.v-btn:hover {
    background-color: teal;
    color: white !important;
}

/* Hover Effect on Menu Items */
.item-link:hover {
    background-color: #87cac3 !important;
    cursor: pointer;
}

.v-list-item :deep(.v-avatar.v-avatar--density-default) {
    border: 1px solid teal !important;
}

.v-list-item :deep(.v-avatar.v-avatar--size-default) {
    height: 50px !important;
    width: 50px !important;
}
</style>
