<template>
    <div>
        <v-btn v-if="mode === 'add'" class="action-btn" color="white" variant="outlined"
            prepend-icon="mdi mdi-plus-circle-outline" olor="white" @click="openDialog">
            New Nurse
        </v-btn>
        <v-icon v-else size="large" color="teal-darken-2" class="me-2" @click="openDialog">
            mdi-pencil
        </v-icon>
        <v-dialog v-model="dialog" max-width="800px" transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="text-h5 bg-primary text-white font-weight-bold">
                    {{ dialogTitle }}
                </v-card-title>
                <v-card-text class="pa-6">
                    <NurseForm :nurse="currentNurse" :is-loading="isLoading" :submit-button-text="submitButtonText"
                        @submit="handleSubmit" @cancel="dialog = false" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NurseService from '@/api/services/NurseService';
import NurseForm from './NurseForm.vue';

const props = defineProps({
    mode: {
        type: String,
        required: true,
        validator: (value) => ['add', 'update'].includes(value),
    },
    nurse: {
        type: Object,
        default: () => ({
            firstName: '',
            lastName: '',
            gender: '',
            phone: '',
            email: '',
        }),
    },
});

const emit = defineEmits(['nurseAdded', 'nurseUpdated']);

const dialog = ref(false);
const isLoading = ref(false);
const currentNurse = ref({ ...props.nurse });

const dialogTitle = computed(() => props.mode === 'add' ? 'Add New Nurse' : 'Update Nurse');
const submitButtonText = computed(() => props.mode === 'add' ? 'Save' : 'Update');

const openDialog = () => {
    // Make a deep copy of the nurse object to avoid reference issues
    currentNurse.value = JSON.parse(JSON.stringify(props.nurse));
    // Ensure photoUrl is properly copied
    if (props.nurse.photoUrl) {
        currentNurse.value.photoUrl = props.nurse.photoUrl;
    }
    dialog.value = true;
};

const handleSubmit = async (nurseData) => {
    isLoading.value = true;
    try {
        if (props.mode === 'add') {
            // For adding a new nurse, keep the existing implementation
            const formData = new FormData();

            // Create a nurseDTO object with the form data
            const nurseDTO = {
                firstName: nurseData.get('firstName'),
                lastName: nurseData.get('lastName'),
                gender: nurseData.get('gender'),
                phone: nurseData.get('phone'),
                email: nurseData.get('email'),
            };

            // Append nurseDTO as a JSON string
            formData.append('nurseDTO', new Blob([JSON.stringify(nurseDTO)], { type: 'application/json' }));

            // Append the image file if it exists
            const imageFile = nurseData.get('image');
            if (imageFile instanceof File) {
                formData.append('image', imageFile);
            }

            await NurseService.addNewNurse(formData);
            emit('nurseAdded');
        } else {
            // For updating an existing nurse
            const nurseId = props.nurse.id;

            // Create a nurseDTO object with the form data
            const nurseDTO = {
                firstName: nurseData.get('firstName'),
                lastName: nurseData.get('lastName'),
                gender: nurseData.get('gender'),
                phone: nurseData.get('phone'),
                email: nurseData.get('email'),
                avatarUpdated: nurseData.has('image'),
            };

            // Create a new FormData object for the request
            const formData = new FormData();

            // Append nurseDTO as a JSON string
            formData.append('nurseDTO', new Blob([JSON.stringify(nurseDTO)], { type: 'application/json' }));

            // Append the image file if it exists
            const imageFile = nurseData.get('image');
            if (imageFile instanceof File) {
                formData.append('image', imageFile);
            }

            await NurseService.updateNurse(nurseId, formData);
            emit('nurseUpdated');
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error submitting form:', error);
        if (error.response && error.response.status === 413) {
            // Show error message for payload too large
            alert('The image file is too large. Please use a smaller image (less than 10MB).');
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.action-btn {
    height: 40px;
    width: 180px;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.3s ease-in-out;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
    transform: translateY(100%);
}
</style>
