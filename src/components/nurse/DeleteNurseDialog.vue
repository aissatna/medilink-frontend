<template>
    <v-icon size="large" color="red-lighten-1" @click="dialog = true">mdi-delete</v-icon>
    <v-dialog v-model="dialog" max-width="500">
        <v-card class="rounded-lg">
            <v-card-title class="text-h5 bg-red-lighten-1 text-white pa-4">
                Delete Nurse?
            </v-card-title>
            <v-card-text class="pt-6 pb-4 px-4">
                <div class="d-flex">
                    <v-avatar color="red-lighten-1" size="40" class="mr-4">
                        <v-icon color="white" size="28">mdi-alert</v-icon>
                    </v-avatar>
                    <div>
                        <p class="text-body-1 mb-2">
                            Are you sure you want to permanently delete <b>{{ nurseName }}</b>'s nurse record?
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
import NurseService from '@/api/services/NurseService';

const props = defineProps({
    nurse: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['nurseDeleted']);

const dialog = ref(false);
const isLoading = ref(false);

const nurseName = computed(() => {
    return props.nurse ? `${props.nurse.firstName} ${props.nurse.lastName}` : 'this nurse';
});


const confirmDelete = async () => {
    isLoading.value = true;
    try {
        await NurseService.deleteNurse(props.nurse.id);
        emit('nurseDeleted');
        closeDialog();
    } catch (error) {
        console.error('Error deleting nurse:', error);
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
