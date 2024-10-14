<template>
    <v-form @submit.prevent="submitForm" ref="form">
        <v-tabs v-model="activeTab" grow color="primary" align-tabs="center">
            <v-tab value="personal">Personal Information</v-tab>
            <v-tab value="contact">Contact Information</v-tab>
        </v-tabs>
        <v-window v-model="activeTab" class="mt-6">
            <v-window-item value="personal">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="patientData.firstName" :rules="[validationRules.required]"
                            label="First Name*" placeholder="Enter first name" prepend-inner-icon="mdi-account"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="patientData.lastName" :rules="[validationRules.required]"
                            label="Last Name*" placeholder="Enter last name" prepend-inner-icon="mdi-account"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="patientData.birthDate"
                            :rules="[validationRules.required, validationRules.date]" label="Date of Birth*"
                            placeholder="DD/MM/YYYY" prepend-inner-icon="mdi-calendar" @input="formatDate" required>
                            <template v-slot:append>
                                <v-tooltip text="Enter date in DD/MM/YYYY format">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
                                    </template>
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model="patientData.gender" :items="genderOptions" item-title="title"
                            item-value="value" :rules="[validationRules.required]" label="Gender*"
                            placeholder="Select gender" prepend-inner-icon="mdi-gender-male-female" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="patientData.medicalNumber"
                            :rules="[validationRules.required, validationRules.ssn]" label="Social Security Number*"
                            placeholder="Enter 9-digit SSN" prepend-inner-icon="mdi-card-account-details" required>
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
            <v-window-item value="contact">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="patientData.address" :rules="[validationRules.required]" label="Address*"
                            placeholder="Enter full address" prepend-inner-icon="mdi-map-marker"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="patientData.phone"
                            :rules="[validationRules.required, validationRules.phone]" label="Phone Number*"
                            placeholder="Enter 10-digit phone number" prepend-inner-icon="mdi-phone" required>
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
                        <v-text-field v-model="patientData.email"
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
        <v-card-actions class="bg-grey-lighten-3 pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="$emit('cancel')" prepend-icon="mdi-close">
                Cancel
            </v-btn>
            <v-btn v-if="activeTab === 'personal'" color="primary" @click="activeTab = 'contact'"
                prepend-icon="mdi-arrow-right">
                Next
            </v-btn>
            <v-btn v-else color="primary" type="submit" prepend-icon="mdi-check" :loading="isLoading"
                :disabled="isLoading">
                {{ submitButtonText }}
            </v-btn>
        </v-card-actions>
    </v-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    patient: {
        type: Object,
        default: () => ({
            firstName: '',
            lastName: '',
            birthDate: '',
            gender: '',
            medicalNumber: '',
            address: '',
            phone: '',
            email: '',
        }),
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    submitButtonText: {
        type: String,
        default: 'Save',
    },
});

const emit = defineEmits(['submit', 'cancel']);

const validationRules = {
    required: v => !!v || 'This field is required',
    ssn: v => /^\d{9}$/.test(v) || 'SSN must be 9 digits',
    phone: v => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    date: v => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(v) || 'Date must be in DD/MM/YYYY format',
};

const genderOptions = [
    { title: 'Male', value: 'M' },
    { title: 'Female', value: 'F' },
];

const form = ref(null);
const activeTab = ref('personal');
const patientData = reactive({ ...props.patient });

watch(() => props.patient, (newValue) => {
    Object.assign(patientData, newValue);
}, { deep: true });

const formatDate = () => {
    let value = patientData.birthDate.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
        value = value.slice(0, 5) + '/' + value.slice(5);
    }

    patientData.birthDate = value;
};

const submitForm = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        emit('submit', { ...patientData });
    }
};
</script>

<style scoped>
.v-tab {
    font-weight: bold;
}

.v-window {
    background-color: #f5f5f5;
    border-radius: 0 0 4px 4px;
}

.v-window-item {
    padding: 20px;
}
</style>