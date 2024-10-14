<template>
    <!-- Snackbar on patient actions -->
    <v-snackbar v-model="snackbarVisible" :timeout="3000" color="success" location="right top"
        @click:outside="snackbarVisible = false">
        {{ snackbarMessage }}
        <template v-slot:actions>
            <v-btn color="white" @click="snackbarVisible = false">Close</v-btn>
        </template>
    </v-snackbar>
    <h1 class="subheading text-grey-darken-4 my-2">Patients View</h1>
    <v-container>
        <v-card flat>
            <v-card-title class="bg-teal-lighten-4">
                <v-row>
                    <v-col xs="12" md="6">
                        <v-text-field v-model="search" density="compact" label="Search by name, medical number..."
                            prepend-inner-icon="mdi-magnify" min-width="300" max-width="450" variant="solo-filled"
                            hide-details single-line rounded="pill">
                        </v-text-field>
                    </v-col>
                    <v-col xs="12" md="6" class="d-flex justify-end">
                        <v-btn color="primary" class="mr-2" style="min-width: 150px;" @click="exportPatients"
                            prepend-icon="mdi mdi-export-variant">
                            Export
                        </v-btn>
                        <UpsertPatientDialog mode="add" @patientAdded="onPatientAdded" />
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="patientItems"
                :items-length="totalItems" :loading="loading" @update:options="loadItems" :search="search"
                item-value="id" show-expand hover :items-per-page-options="pageSizes" class="text-body-1">
                <!-- Actions column template -->
                <template #[`item.actions`]="{ item }">
                    <UpsertPatientDialog mode="update" :patient="item" @patientUpdated="onPatientUpdated" />
                    <DeletePatientDialog @patientDeleted="onPatientDeleted" :patient="item" />
                </template>
                <!-- Expanded row template -->
                <template #[`expanded-row`]="{ item }">
                    <tr class="text-center">
                        <td colspan="8">
                            <v-row>
                                <v-col cols="4">
                                    <strong>Email: </strong> {{ item.email }}
                                </v-col>
                                <v-col cols="4">
                                    <strong>Phone: </strong> {{ item.phone }}
                                </v-col>

                                <v-col cols="4">
                                    <strong>Address: </strong> {{ item.address }}
                                </v-col>
                            </v-row>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
        </v-card>
    </v-container>
</template>

<script setup>
import DeletePatientDialog from '@/components/patient/DeletePatientDialog.vue';
import UpsertPatientDialog from '@/components/patient/UpsertPatientDialog.vue';
import PatientService from '@/api/PatientService';
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
    { title: '', key: 'data-table-expand', sortable: false }, // Expand arrow column
    { title: 'First Name', key: 'firstName', sortable: true }, // Sort directly by key
    { title: 'Last Name', key: 'lastName', sortable: true },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'Medical Number', key: 'medicalNumber', sortable: true },
    { title: 'Birth Date', key: 'birthDate', sortable: true },
    { title: 'Visits', key: 'visits', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false }, // No sorting for actions
];

// Page size options
const pageSizes = [
    { value: 5, title: '5' },
    { value: 10, title: '10' },
    { value: 20, title: '20' },
    { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
];


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

<style scoped></style>
