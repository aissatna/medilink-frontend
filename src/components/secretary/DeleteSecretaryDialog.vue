<template>
    <v-icon size="large" color="red-lighten-1" @click="dialog = true">mdi-delete</v-icon>
    <v-dialog v-model="dialog" max-width="500">
        <v-card class="rounded-lg">
            <v-card-title class="text-h5 bg-red-lighten-1 text-white pa-4">
                Delete Secretary?
            </v-card-title>
            <v-card-text class="pt-6 pb-4 px-4">
                <div class="d-flex">
                    <v-avatar color="red-lighten-1" size="40" class="mr-4">
                        <v-icon color="white" size="28">mdi-alert</v-icon>
                    </v-avatar>
                    <div>
                        <p class="text-body-1 mb-2">
                            Are you sure you want to permanently delete <b>{{ secretaryName }}</b>'s secretary record?
                        </p>
                        <p class="text-body-2 text-medium-emphasis">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="closeDialog" class="mr-4" :ripple="false">
                    Cancel
                </v-btn>
                <v-btn color="error-darken-1" variant="flat" @click="confirmDelete" :ripple="false" :loading="isLoading"
                    :disabled="isLoading">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

import { ref, computed } from 'vue';
import SecretaryService from '@/api/services/SecretaryService';

const props = defineProps({
    secretary: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['secretaryDeleted']);

const dialog = ref(false);
const isLoading = ref(false);

const secretaryName = computed(() => {
    return props.secretary ? `${props.secretary.firstName} ${props.secretary.lastName}` : 'this secretary';
});


const confirmDelete = async () => {
    isLoading.value = true;
    try {
        await SecretaryService.deleteSecretary(props.secretary.id);
        emit('secretaryDeleted');
        closeDialog();
    } catch (error) {
        console.error('Error deleting secretary:', error);
        isLoading.value = false;
    } finally {
        isLoading.value = false;
    }
};

const closeDialog = () => {
    dialog.value = false;
};

</script>
<style scoped></style>
