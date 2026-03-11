<template>
    <nav>
        <v-app-bar elevation="2" class="py-0 px-4" color="surface" height="68">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
            <!-- cabinet info -->
            <div class="d-flex align-center ml-4 text-primary-dark">
                <v-icon icon="mdi-office-building" color="primary" class="mr-2"></v-icon>
                <span class="text-subtitle-2 font-weight-medium mr-4">{{ userStore.userInfo.cabinetName }}</span>
                <v-icon icon="mdi-map-marker" color="teal" class="mr-2"></v-icon>
                <span class="text-subtitle-2">{{ userStore.userInfo.cabinetAddress }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="handleSignOut" color="primary" variant="elevated" class="button-cta">
                <span class="mr-2">Logout</span>
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" class="drawer" elevation="4" color="surface" width="300">
            <v-list>
                <v-list-item class="pa-3">
                    <div class="d-flex justify-center w-100">
                        <v-img :width="140" :src="logoUrl" alt="MediLink logo"></v-img>
                    </div>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="(link, index) in links" :key="index" :to="link.route"
                    :class="[{ 'active-link': $route.path === link.route }, 'my-2']" color="primary" variant="text">
                    <template v-slot:prepend>
                        <v-icon :icon="link.icon" class="mr-2"></v-icon>
                    </template>
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <v-divider></v-divider>
                <div class="user-profile">
                    <div class="d-flex justify-center mb-3">
                        <router-link to="/account">
                            <v-avatar size="80" :color="userStore.userInfo.photoUrl ? undefined : 'primary'">
                                <v-img v-if="userStore.userInfo.photoUrl" :src="userStore.userInfo.photoUrl"
                                    :alt="`${userStore.userInfo.firstName} ${userStore.userInfo.lastName}`"></v-img>
                                <span v-else class="text-h5 white--text">{{
                                    getInitials(userStore.userInfo.firstName, userStore.userInfo.lastName)
                                    }}</span>
                            </v-avatar>
                        </router-link>
                    </div>
                    <div class="d-flex flex-column align-center text-center">
                        <div class="text-h6">{{ userStore.userInfo.firstName }} {{ userStore.userInfo.lastName }}</div>
                        <div class="text-subtitle-2 text-medium-emphasis">{{ userStore.userInfo.email }}</div>
                        <div class="text-caption text-uppercase font-weight-medium mt-1">
                            {{ userStore.userInfo.roleName }}
                        </div>
                    </div>
                </div>
            </template>
        </v-navigation-drawer>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
import userLinks from '@/utils/userLinks';
import { getInitials } from '@/utils/formatters';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

const userStore = useUserStore();
const authStore = useAuthStore();
const drawer = ref(false);
const links = userLinks(userStore.userInfo.roleName);

// images
const images = require.context('../../assets', true, /\.png$/);
const logoUrl = images('./logo.png');

// Handle logout
async function handleSignOut() {
    authStore.logout();
}

</script>

<style scoped>
.drawer {
    background-color: #F8FBFF;
    color: #1E2A40;
}

.user-profile {
    border-top: 1px solid rgba(26, 77, 143, 0.15);
    padding: 16px;
    margin-top: 8px;
}

.v-avatar {
    border: 2px solid #1A4D8F;
}

.v-avatar:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

.button-cta {
    border-radius: 10px;
    font-weight: 700;
    text-transform: none;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.active-link {
    background-color: #E1EEFF;
    color: #0E88D4 !important;
    border-radius: 8px;
}

.v-list-item {
    font-weight: 600;
    border-radius: 8px;
}
</style>