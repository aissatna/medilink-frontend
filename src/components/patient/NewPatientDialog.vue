<template>
    <div>
        <v-btn color="primary" @click="dialog = true">
            New Patient
        </v-btn>
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title class="text-h5 bg-primary text-white font-weight-bold">
                    Add New Patient
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form @submit.prevent="submitForm" ref="form">
                        <v-tabs v-model="activeTab" grow color="primary" align-tabs="center">
                            <v-tab value="personal">Personal Information</v-tab>
                            <v-tab value="contact">Contact Information</v-tab>
                        </v-tabs>
                        <!-- Personal Information Tab -->
                        <v-window v-model="activeTab" class="mt-6">
                            <v-window-item value="personal">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="patient.firstName" :rules="[validationRules.required]"
                                            label="First Name*" placeholder="Enter first name"
                                            prepend-inner-icon="mdi-account" required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="patient.lastName" :rules="[validationRules.required]"
                                            label="Last Name*" placeholder="Enter last name"
                                            prepend-inner-icon="mdi-account" required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-date-input label="Date of Birth*" :value="formattedDateOfBirth"
                                            v-model="patient.birthDate" placeholder="" prepend-icon=""
                                            prepend-inner-icon="$calendar" :rules="[validationRules.required]"
                                            :max="new Date().toISOString().slice(0, 10)" required>
                                        </v-date-input>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select v-model="patient.gender" :items="genderOptions" item-title="title"
                                            item-value="value" :rules="[validationRules.required]" label="Gender*"
                                            placeholder="Select gender" prepend-inner-icon="mdi-gender-male-female"
                                            required>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="patient.medicalNumber"
                                            :rules="[validationRules.required, validationRules.ssn]"
                                            label="Social Security Number*" placeholder="Enter 9-digit SSN"
                                            prepend-inner-icon="mdi-card-account-details" required>
                                            <template v-slot:append>
                                                <v-tooltip text="Enter 9-digit Social Security Number without dashes">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
                                                    </template>
                                                </v-tooltip>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <!-- Contact Information Tab -->
                            <v-window-item value="contact">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="patient.address" :rules="[validationRules.required]"
                                            label="Address*" placeholder="Enter full address"
                                            prepend-inner-icon="mdi-map-marker" required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="patient.phone"
                                            :rules="[validationRules.required, validationRules.phone]"
                                            label="Phone Number*" placeholder="Enter 10-digit phone number"
                                            prepend-inner-icon="mdi-phone" required>
                                            <template v-slot:append>
                                                <v-tooltip text="Enter 10-digit phone number without spaces or dashes">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
                                                    </template>
                                                </v-tooltip>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="patient.email"
                                            :rules="[validationRules.required, validationRules.email]" label="E-mail*"
                                            placeholder="Enter email address" prepend-inner-icon="mdi-email" required>
                                            <template v-slot:append>
                                                <v-tooltip text="Enter a valid email address (e.g., name@example.com)">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
                                                    </template>
                                                </v-tooltip>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                        </v-window>
                    </v-form>
                </v-card-text>
                <v-card-actions class="bg-grey-lighten-3 pa-4">
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="dialog = false" prepend-icon="mdi-close">
                        Cancel
                    </v-btn>
                    <v-btn v-if="activeTab === 'personal'" color="primary" @click="activeTab = 'contact'"
                        prepend-icon="mdi-arrow-right">
                        Next
                    </v-btn>
                    <v-btn v-else color="primary" @click="submitForm" prepend-icon="mdi-check" :loading="isLoading"
                        :disabled="isLoading">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import format from 'date-fns/format';
import PatientService from '@/api/PatientService';

const emit = defineEmits(['patientAdded']);

const validationRules = {
    required: v => !!v || 'This field is required',
    ssn: v => /^\d{9}$/.test(v) || 'SSN must be 9 digits',
    phone: v => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
};

const genderOptions = [
    { title: 'Male', value: 'M' },
    { title: 'Female', value: 'F' },
];

// State management
const dialog = ref(false);
const form = ref(null);
const activeTab = ref('personal');
const isLoading = ref(false);

const formattedDateOfBirth = computed(() => {
    return patient.birthDate ? format(patient.birthDate, 'dd/MM/yyyy') : '';
});

const patient = reactive({
    firstName: '',
    lastName: '',
    birthDate: null,
    gender: '',
    medicalNumber: '',
    address: '',
    phone: '',
    email: '',
});

const resetFormState = () => {
    form.value.reset();
    activeTab.value = 'personal';
    patient.birthDate = null;
};


const submitForm = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        isLoading.value = true;
        try {
            patient.birthDate = formattedDateOfBirth.value;
            await PatientService.addNewPatient(patient);
            resetFormState();
            dialog.value = false;
            emit('patientAdded');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            isLoading.value = false;
        }
    }
};

watch(dialog, (newValue) => {
    if (!newValue) {
        resetFormState();
    }
});

</script>

<style scoped>
.v-window {
    background-color: #f5f5f5;
    border-radius: 0 0 4px 4px;
}

.v-window-item {
    padding: 20px;
}
</style>