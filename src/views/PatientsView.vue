<template>
    <v-container fluid class="pa-6">
        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbarVisible" :timeout="3000" :color="snackbarColor" location="top" rounded="pill">
            {{ snackbarMessage }}
            <template v-slot:actions>
                <v-btn color="white" text @click="snackbarVisible = false">Close</v-btn>
            </template>
        </v-snackbar>
        <v-card class="elevation-2 rounded-lg">
            <v-card-title class="py-4 px-6 bg-primary text-white">
                <v-row class="align-start" no-gutters>
                    <v-col cols="12" sm="6">
                        <h1 class="text-h5 font-weight-bold">Patients Management</h1>
                    </v-col>
                    <v-col cols="12" sm="6" class="mt-4 mt-sm-0">
                        <v-row justify="end" no-gutters>
                            <v-col cols="auto" class="mr-2 mb-2">
                                <UpsertPatientDialog mode="add" @patientAdded="onPatientAdded" />
                            </v-col>
                            <v-col cols="auto" class="mr-2 mb-2">
                                <v-btn color="white" variant="outlined" @click="exportPatients"
                                    prepend-icon="mdi-export-variant" class="action-btn">
                                    Export Patients
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text class="pa-6">
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="search" label="Search patients" prepend-inner-icon="mdi-magnify"
                            variant="outlined" density="comfortable" hide-details clearable></v-text-field>
                    </v-col>
                </v-row>
                <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="patientItems"
                    :items-length="totalItems" :loading="loading" @update:options="loadItems" :search="search"
                    item-value="id" show-expand hover :items-per-page-options="pageSizes"
                    class="mt-4 elevation-1 rounded-lg text-body-1">

                    <template #[`item.phone`]="{ item }">
                        {{ formatPhoneNumber(item.phone) }}
                    </template>

                    <!-- Actions column template -->
                    <template #[`item.actions`]="{ item }">
                        <div class="d-flex">
                            <UpsertPatientDialog mode="update" :patient="item" @patientUpdated="onPatientUpdated" />
                            <DeletePatientDialog @patientDeleted="onPatientDeleted" :patient="item" />
                        </div>
                    </template>
                    <!-- Expanded row template -->
                    <template #expanded-row="{ item }">
                        <td :colspan="headers.length">
                            <v-card flat class="ma-2 pa-2 bg-grey-lighten-4">
                                <v-row>
                                    <v-col cols="4">
                                        <strong>Email:</strong> {{ item.email }}
                                    </v-col>
                                    <v-col cols="4">
                                        <strong>Address:</strong> {{ item.address }}
                                    </v-col>
                                    <v-col cols="4">
                                        <strong>Visits:</strong> {{ item.visits }}
                                    </v-col>
                                </v-row>
                            </v-card>
                        </td>
                    </template>
                </v-data-table-server>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import DeletePatientDialog from '@/components/patient/DeletePatientDialog.vue';
import UpsertPatientDialog from '@/components/patient/UpsertPatientDialog.vue';
import PatientService from '@/api/PatientService';
import { pageSizes } from '@/utils/constants';
import { ref, watch } from 'vue';

// Constants
const DEFAULT_SORT_KEY = 'firstName';
const DEFAULT_SORT_ORDER = 'asc';

// State management
const search = ref('');
const patientItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(5);

// Snackbar
const snackbarVisible = ref(false);
const snackbarMessage = ref('');

// Table headers
const headers = [
    { title: '', key: 'data-table-expand', sortable: false },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'First Name', key: 'firstName', sortable: true },
    { title: 'Last Name', key: 'lastName', sortable: true },
    { title: 'Medical Number', key: 'medicalNumber', sortable: true },
    { title: 'Birth Date', key: 'birthDate', sortable: true },
    { title: 'Phone', key: 'phone', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
];


const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};
async function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true;

    // Sorting parameters, using default if none are provided
    const sortParams = sortBy.length
        ? [{ key: sortBy[0].key, order: sortBy[0].order }]
        : [{ key: DEFAULT_SORT_KEY, order: DEFAULT_SORT_ORDER }];

    try {
        // Fetch data from the API
        const response = await PatientService.getPatients(page - 1, itemsPerPage, sortParams, search.value);
        patientItems.value = response.data.content;
        totalItems.value = response.data.totalItems;

    } catch (error) {
        console.error('Error loading patients:', error);
    } finally {
        loading.value = false;
    }
}

// Watch for search changes and reload items
watch(search, () => {
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
});

// When a new patient is added, reload the items
const onPatientAdded = () => {
    snackbarMessage.value = 'Patient added successfully!';
    snackbarVisible.value = true;
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a patient is deleted, reload the items
const onPatientDeleted = () => {
    snackbarMessage.value = 'Patient deleted successfully!';
    snackbarVisible.value = true;
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a patient is updated, reload the items
const onPatientUpdated = () => {
    snackbarMessage.value = 'Patient updated successfully!';
    snackbarVisible.value = true;
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

const exportPatients = async () => {
    try {
        await PatientService.exportPatients();
        snackbarMessage.value = 'Patients exported successfully by email !';
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error exporting patients:', error);
        snackbarMessage.value = 'Error exporting patients. Please try again.';
        snackbarVisible.value = true;
    }
};
</script>
<style scoped>
.bg-primary {
    background-color: var(--v-primary-base);
}

.action-btn {
    height: 40px;
    width: 180px;
}
</style>
