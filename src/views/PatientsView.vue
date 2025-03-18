<template>
    <!-- Snackbar for notifications -->
    <AppSnackbar v-model:show="snackbar.show" :text="snackbar.text" :color="snackbar.color" location="top" />

    <v-container fluid class="pa-6">
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
import AppSnackbar from '@/components/shared/AppSnackbar.vue';
import DeletePatientDialog from '@/components/patient/DeletePatientDialog.vue';
import UpsertPatientDialog from '@/components/patient/UpsertPatientDialog.vue';
import PatientService from '@/api/services/PatientService';
import { pageSizes } from '@/utils/constants';
import { formatPhoneNumber } from '@/utils/formatters';
import { ref, watch, reactive } from 'vue';

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
const snackbar = reactive({
    show: false,
    text: '',
    color: 'success',
});

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

const showSnackbar = (text, color = 'success') => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
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
    showSnackbar('Patient added successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a patient is deleted, reload the items
const onPatientDeleted = () => {
    showSnackbar('Patient deleted successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a patient is updated, reload the items
const onPatientUpdated = () => {
    showSnackbar('Patient updated successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

const exportPatients = async () => {
    try {
        await PatientService.exportPatients(search.value);
        showSnackbar('Patients exported successfully by email!');
    } catch (error) {
        console.error('Error exporting patients:', error);
        showSnackbar('Error exporting patients. Please try again.', 'error');
    }
};
</script>
<style scoped>
.action-btn {
    height: 40px;
    width: 180px;
}
</style>
