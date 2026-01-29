<template>
    <div>
        <v-btn v-if="mode === 'add'" class="action-btn" color="white" variant="outlined"
            prepend-icon="mdi mdi-plus-circle-outline" olor="white" @click="openDialog">
            New Secretary
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
                    <SecretaryForm :secretary="currentSecretary" :is-loading="isLoading"
                        :submit-button-text="submitButtonText" @submit="handleSubmit" @cancel="dialog = false" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SecretaryService from '@/api/services/SecretaryService';
import SecretaryForm from './SecretaryForm.vue';

const props = defineProps({
    mode: {
        type: String,
        required: true,
        validator: (value) => ['add', 'update'].includes(value),
    },
    secretary: {
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

const emit = defineEmits(['secretaryAdded', 'secretaryUpdated']);

const dialog = ref(false);
const isLoading = ref(false);
const currentSecretary = ref({ ...props.secretary });

const dialogTitle = computed(() => props.mode === 'add' ? 'Add New Secretary' : 'Update Secretary');
const submitButtonText = computed(() => props.mode === 'add' ? 'Save' : 'Update');

const openDialog = () => {
    // Make a deep copy of the secretary object to avoid reference issues
    currentSecretary.value = JSON.parse(JSON.stringify(props.secretary));
    // Ensure photoUrl is properly copied
    if (props.secretary.photoUrl) {
        currentSecretary.value.photoUrl = props.secretary.photoUrl;
    }
    dialog.value = true;
};

const handleSubmit = async (secretaryData) => {
    isLoading.value = true;
    try {
        if (props.mode === 'add') {
            // For adding a new secretary, keep the existing implementation
            const formData = new FormData();

            // Create a secretaryDTO object with the form data
            const secretaryDTO = {
                firstName: secretaryData.get('firstName'),
                lastName: secretaryData.get('lastName'),
                gender: secretaryData.get('gender'),
                phone: secretaryData.get('phone'),
                email: secretaryData.get('email'),
            };

            // Append secretaryDTO as a JSON string
            formData.append('secretaryDTO', new Blob([JSON.stringify(secretaryDTO)], { type: 'application/json' }));

            // Append the image file if it exists
            const imageFile = secretaryData.get('image');
            if (imageFile instanceof File) {
                formData.append('image', imageFile);
            }

            await SecretaryService.addNewSecretary(formData);
            emit('secretaryAdded');
        } else {
            // For updating an existing secretary
            const secretaryId = props.secretary.id;

            // Create a secretaryDTO object with the form data
            const secretaryDTO = {
                firstName: secretaryData.get('firstName'),
                lastName: secretaryData.get('lastName'),
                gender: secretaryData.get('gender'),
                phone: secretaryData.get('phone'),
                email: secretaryData.get('email'),
                avatarUpdated: secretaryData.has('image'),
            };

            // Create a new FormData object for the request
            const formData = new FormData();

            // Append secretaryDTO as a JSON string
            formData.append('secretaryDTO', new Blob([JSON.stringify(secretaryDTO)], { type: 'application/json' }));

            // Append the image file if it exists
            const imageFile = secretaryData.get('image');
            if (imageFile instanceof File) {
                formData.append('image', imageFile);
            }

            await SecretaryService.updateSecretary(secretaryId, formData);
            emit('secretaryUpdated');
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
