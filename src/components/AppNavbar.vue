<template>
    <nav>
        <v-app-bar elevation="2" class="app-bar">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
            <!-- cabinet info -->
            <!-- TODO : get date from the back  -->
            <div class="d-flex align-center ml-4 text-black">
                <v-icon icon="mdi-office-building" color="teal" class="mr-2"></v-icon>
                <span class="text-subtitle-2 font-weight-medium mr-4">Cabinet Name</span>
                <v-icon icon="mdi-map-marker" color="teal" class="mr-2"></v-icon>
                <span class="text-subtitle-2">123 Medical Street, City</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn to="/" color="primary" variant="outlined" class="logout-btn">
                <span class="mr-2">Logout</span>
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" class="navigation-drawer" elevation="4">
            <v-list>
                <v-list-item class="drawer-header">
                    <div class="logo-wrapper">
                        <v-img :width="140" :src="logoUrl" alt="MediLink logo"></v-img>
                    </div>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="(link, index) in userLinks" :key="index" :to="link.route"
                    :active="$route.path === link.route" active-color="white" class="my-2">
                    <template v-slot:prepend>
                        <v-icon :icon="link.icon"></v-icon>
                    </template>
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>
            </v-list>

            <template v-slot:append>
                <v-divider></v-divider>
                <div class="user-profile pa-4">
                    <div class="user-avatar-wrapper mb-3">
                        <v-avatar size="80">
                            <v-img :src="avatarUrl"></v-img>
                        </v-avatar>
                    </div>
                    <div class="user-info text-center">
                        <div class="text-h6">Sandra Adams</div>
                        <div class="text-subtitle-2 text-medium-emphasis">sandra_a88@gmail.com</div>
                        <div class="text-caption text-uppercase font-weight-medium mt-1">{{ userRole }}
                        </div>
                    </div>
                </div>
            </template>
        </v-navigation-drawer>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue';

const drawer = ref(false);

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
.app-bar {
    background: linear-gradient(to right, var(--primary-color), var(--primary-light));
    color: white;
    padding: 0 16px;
}

.logout-btn {
    border-radius: 8px;
    padding: 0 16px;
}

.navigation-drawer {
    background-color: #4CAF50;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.drawer-header {
    padding: 16px;
    background-color: var(--primary-color);
}

.logo-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

.user-profile {
    background-color: var(--background-color);
    border-top: 1px solid #E5E5E5;
    padding: 16px;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-profile {
    background-color: var(--background-color);
    border-top: 1px solid #E5E5E5;
    padding: 16px;
}

.user-avatar-wrapper {
    display: flex;
    justify-content: center;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Add a subtle shadow to the avatar for depth */
.v-avatar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Add a hover effect to the avatar */
.v-avatar:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}
</style>