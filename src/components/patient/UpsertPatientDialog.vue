<template>
    <div>
        <v-btn v-if="mode === 'add'" style="min-width: 150px;" prepend-icon="mdi mdi-plus-circle-outline"
            color="success" @click="openDialog">
            New Patient
        </v-btn>
        <v-icon v-else color="teal-darken-2" class="me-2" @click="openDialog">
            mdi-pencil
        </v-icon>
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title class="text-h5 bg-primary text-white font-weight-bold">
                    {{ dialogTitle }}
                </v-card-title>
                <v-card-text class="pa-6">
                    <PatientForm :patient="currentPatient" :is-loading="isLoading"
                        :submit-button-text="submitButtonText" @submit="handleSubmit" @cancel="dialog = false" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PatientService from '@/api/PatientService';
import PatientForm from './PatientForm.vue';

const props = defineProps({
    mode: {
        type: String,
        required: true,
        validator: (value) => ['add', 'update'].includes(value),
    },
    patient: {
        type: Object,
        default: () => ({
            firstName: '',
            lastName: '',
            birthDate: null,
            gender: '',
            medicalNumber: '',
            address: '',
            phone: '',
            email: '',
        }),
    },
});

const emit = defineEmits(['patientAdded', 'patientUpdated']);

const dialog = ref(false);
const isLoading = ref(false);
const currentPatient = ref({ ...props.patient });

const dialogTitle = computed(() => props.mode === 'add' ? 'Add New Patient' : 'Update Patient');
const submitButtonText = computed(() => props.mode === 'add' ? 'Save' : 'Update');

const openDialog = () => {
    currentPatient.value = { ...props.patient };
    console.log(currentPatient.value);
    dialog.value = true;
};

const handleSubmit = async (patientData) => {
    isLoading.value = true;
    try {
        if (props.mode === 'add') {
            await PatientService.addNewPatient(patientData);
            emit('patientAdded', patientData);
        } else {
            await PatientService.updatePatient(patientData);
            emit('patientUpdated', patientData);
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error submitting form:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.v-card-title {
    font-size: 1.5rem;
}
</style>