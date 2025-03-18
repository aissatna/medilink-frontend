<template>
    <!-- Snackbar for notifications -->
    <AppSnackbar v-model:show="snackbar.show" :text="snackbar.text" :color="snackbar.color" location="top" />
    <v-container fluid class="pa-6">
        <v-card class="elevation-2 rounded-lg">
            <v-card-title class="py-4 px-6 bg-primary text-white">
                <v-row class="align-start" no-gutters>
                    <v-col cols="12" sm="6">
                        <h1 class="text-h5 font-weight-bold">Nurses Management</h1>
                    </v-col>
                    <v-col cols="12" sm="6" class="mt-4 mt-sm-0">
                        <v-row justify="end" no-gutters>
                            <v-col cols="auto" class="mr-2 mb-2">
                                <UpsertNurseDialog mode="add" @nurseAdded="onNurseAdded" />
                            </v-col>
                            <v-col cols="auto" class="mr-2 mb-2">
                                <v-btn color="white" variant="outlined" @click="exportNurses"
                                    prepend-icon="mdi-export-variant" class="action-btn">
                                    Export Nurses
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text class="pa-6">
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="search" label="Search nurses" prepend-inner-icon="mdi-magnify"
                            variant="outlined" density="comfortable" hide-details clearable></v-text-field>
                    </v-col>
                </v-row>
                <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="nurseItems"
                    :items-length="totalItems" :loading="loading" @update:options="loadItems" :search="search"
                    item-value="id" hover :items-per-page-options="pageSizes"
                    class="mt-4 elevation-1 rounded-lg text-body-1">

                    <template #[`item.image`]="{ item }">
                        <v-avatar size="36" :color="item.photoUrl ? undefined : 'primary'">
                            <v-img v-if="item.photoUrl" :src="item.photoUrl"
                                :alt="`${item.firstName} ${item.lastName}`"></v-img>
                            <span v-else class="text-h6 white--text">{{ getInitials(item.firstName, item.lastName)
                            }}</span>
                        </v-avatar>
                    </template>

                    <template #[`item.phone`]="{ item }">
                        {{ formatPhoneNumber(item.phone) }}
                    </template>

                    <!-- Actions column template -->
                    <template #[`item.actions`]="{ item }">
                        <div class="d-flex">
                            <UpsertNurseDialog mode="update" :nurse="item" @nurseUpdated="onNurseUpdated" />
                            <DeleteNurseDialog @nurseDeleted="onNurseDeleted" :nurse="item" />
                        </div>
                    </template>
                </v-data-table-server>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import AppSnackbar from '@/components/shared/AppSnackbar.vue';
import DeleteNurseDialog from '@/components/nurse/DeleteNurseDialog.vue';
import UpsertNurseDialog from '@/components/nurse/UpsertNurseDialog.vue';
import NurseService from '@/api/services/NurseService';
import { pageSizes } from '@/utils/constants';
import { formatPhoneNumber, getInitials } from '@/utils/formatters';

// Constants
const DEFAULT_SORT_KEY = 'firstName';
const DEFAULT_SORT_ORDER = 'asc';

// State management
const search = ref('');
const nurseItems = ref([]);
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
    { title: '', key: 'image', sortable: false },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'First Name', key: 'firstName', sortable: true },
    { title: 'Last Name', key: 'lastName', sortable: true },
    { title: 'Phone', key: 'phone', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
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
        const response = await NurseService.getNurses(page - 1, itemsPerPage, sortParams, search.value);
        nurseItems.value = response.data.content;
        totalItems.value = response.data.totalItems;

    } catch (error) {
        console.error('Error loading nurses:', error);
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

// When a new nurse is added, reload the items
const onNurseAdded = () => {
    console.log("onNurseAdded");
    showSnackbar('Nurse added successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a nurse is deleted, reload the items
const onNurseDeleted = () => {
    console.log("onNurseDeleted");
    showSnackbar('Nurse deleted successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

// When a nurse is updated, reload the items
const onNurseUpdated = () => {
    console.log("onNurseUpdated");
    showSnackbar('Nurse updated successfully!');
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
    });
};

const exportNurses = async () => {
    try {
        await NurseService.exportNurses(search.value);
        showSnackbar('Nurses exported successfully by email!');
    } catch (error) {
        console.error('Error exporting nurses:', error);
        showSnackbar('Error exporting nurses. Please try again.', 'error');
    }
};


</script>

<style scoped>
.action-btn {
    height: 40px;
    width: 180px;
}
</style>