<template>
    <v-container fluid class="pa-6">
        <v-card class="elevation-2 rounded-lg">
            <v-card-title class="py-4 px-6 bg-primary text-white">
                <v-row class="align-center" no-gutters>
                    <v-col cols="12" sm="6">
                        <h1 class="text-h5 font-weight-bold">My Visits</h1>
                    </v-col>
                    <v-col cols="12" sm="6" class="mt-4 mt-sm-0">
                        <v-row justify="end" align="center" no-gutters>
                            <!-- Legend -->
                            <div class="d-none d-md-flex align-center mr-4">
                                <div class="legend-item mr-3">
                                    <span class="legend-dot scheduled"></span>
                                    <span class="text-caption">Scheduled</span>
                                </div>
                                <div class="legend-item mr-3">
                                    <span class="legend-dot first-visit"></span>
                                    <span class="text-caption">1st Visit</span>
                                </div>
                                <div class="legend-item mr-3">
                                    <span class="legend-dot validated"></span>
                                    <span class="text-caption">Validated</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot cancelled"></span>
                                    <span class="text-caption">Cancelled</span>
                                </div>
                            </div>
                            <!-- Navigation buttons -->
                            <v-btn icon variant="text" color="white" @click="goToPreviousWeek" class="mr-1">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn variant="outlined" color="white" @click="goToToday" class="mx-2">
                                Today
                            </v-btn>
                            <v-btn icon variant="text" color="white" @click="goToNextWeek" class="ml-1">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text class="pa-0">
                <!-- Week header showing date range -->
                <div class="text-center py-3 bg-grey-lighten-4">
                    <span class="text-subtitle-1 font-weight-medium">
                        {{ formatWeekRange(currentWeekStart) }}
                    </span>
                </div>

                <!-- Calendar grid -->
                <div class="calendar-container">
                    <!-- Header row with days -->
                    <div class="calendar-header">
                        <div class="time-column-header"></div>
                        <div v-for="day in weekDays" :key="day.date" class="day-header"
                            :class="{ 'today': isToday(day.date) }">
                            <div class="day-name">{{ day.name }}</div>
                            <div class="day-number" :class="{ 'today-number': isToday(day.date) }">{{ day.number }}
                            </div>
                        </div>
                    </div>

                    <!-- Time slots grid -->
                    <div class="calendar-body">
                        <!-- Time column -->
                        <div class="time-column">
                            <div v-for="hour in displayHours" :key="hour" class="time-slot-label">
                                {{ formatHour(hour) }}
                            </div>
                        </div>

                        <!-- Days columns -->
                        <div class="days-grid">
                            <div v-for="day in weekDays" :key="day.date" class="day-column"
                                :class="{ 'today-column': isToday(day.date) }">
                                <!-- Hour slots for this day -->
                                <div v-for="hour in displayHours" :key="hour" class="hour-slot">
                                </div>
                                <!-- Events for this day -->
                                <div v-for="visit in getVisitsForDay(day.date)" :key="visit.id" class="visit-event"
                                    :style="getEventStyle(visit)" :class="getEventClass(visit)"
                                    @click="openVisitDetail(visit)">
                                    <div class="visit-time">{{ formatVisitTime(visit) }}</div>
                                    <div class="visit-patient">{{ visit.patient.firstName }} {{ visit.patient.lastName
                                        }}</div>
                                    <div class="visit-badges">
                                        <v-icon v-if="visit.isFirstVisit" size="x-small" color="white" class="mr-1">
                                            mdi-star
                                        </v-icon>
                                        <v-icon v-if="visit.status === 'VALIDATED'" size="x-small" color="white">
                                            mdi-check-circle
                                        </v-icon>
                                        <v-icon v-if="visit.status === 'CANCELLED'" size="x-small" color="white">
                                            mdi-cancel
                                        </v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- Visit detail dialog -->
        <v-dialog v-model="showDetailDialog" max-width="600" persistent>
            <v-card v-if="selectedVisit">
                <v-card-title class="py-4 px-6" :class="getDialogHeaderClass(selectedVisit)">
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                            <span>Visit Details</span>
                        </div>
                        <div class="d-flex align-center">
                            <v-chip :color="getStatusChipColor(selectedVisit.status)" variant="flat" size="small"
                                class="mr-2">
                                {{ formatStatus(selectedVisit.status) }}
                            </v-chip>
                            <v-chip v-if="selectedVisit.isFirstVisit" color="orange-darken-1" variant="flat"
                                size="small">
                                <v-icon start size="small">mdi-star</v-icon>
                                First Visit
                            </v-chip>
                        </div>
                    </div>
                </v-card-title>

                <v-card-text class="pa-6">
                    <!-- Patient Info Section -->
                    <div class="info-section mb-4">
                        <div class="section-header mb-3">
                            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                            <span class="text-subtitle-1 font-weight-bold">Patient Information</span>
                        </div>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="info-label">Full Name</div>
                                <div class="info-value">{{ selectedVisit.patient.firstName }} {{
                                    selectedVisit.patient.lastName }}</div>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="info-label">Phone</div>
                                <div class="info-value">
                                    <a :href="'tel:' + selectedVisit.patient.phone" class="text-primary">
                                        {{ formatPhoneNumber(selectedVisit.patient.phone) }}
                                    </a>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="info-label">Address</div>
                                <div class="info-value">{{ selectedVisit.patient.address }}</div>
                            </v-col>
                        </v-row>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <!-- Visit Info Section -->
                    <div class="info-section mb-4">
                        <div class="section-header mb-3">
                            <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                            <span class="text-subtitle-1 font-weight-bold">Visit Schedule</span>
                        </div>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="info-label">Date</div>
                                <div class="info-value">{{ formatDate(selectedVisit.date) }}</div>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="info-label">Time</div>
                                <div class="info-value">{{ selectedVisit.startTime }} - {{ selectedVisit.endTime }}
                                </div>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- Validated Visit Acts Section -->
                    <template v-if="selectedVisit.status === 'VALIDATED' && selectedVisit.acts?.length > 0">
                        <v-divider class="my-4"></v-divider>
                        <div class="info-section">
                            <div class="section-header mb-3">
                                <v-icon color="success" class="mr-2">mdi-check-decagram</v-icon>
                                <span class="text-subtitle-1 font-weight-bold">Performed Acts</span>
                            </div>
                            <v-table density="compact" class="rounded">
                                <thead>
                                    <tr class="bg-grey-lighten-4">
                                        <th>Act</th>
                                        <th class="text-center">Qty</th>
                                        <th class="text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="act in selectedVisit.acts" :key="act.id">
                                        <td>{{ act.act.description }}</td>
                                        <td class="text-center">{{ act.quantity }}</td>
                                        <td class="text-right">{{ formatCurrency(act.priceAtTime * act.quantity) }}</td>
                                    </tr>
                                    <tr class="bg-grey-lighten-5 font-weight-bold">
                                        <td colspan="2">Total</td>
                                        <td class="text-right">{{ formatCurrency(calculateTotal(selectedVisit.acts)) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
                    </template>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" color="grey" @click="closeDetailDialog">
                        Close
                    </v-btn>
                    <v-btn v-if="canValidateVisit(selectedVisit)" color="success" variant="flat"
                        prepend-icon="mdi-check-circle" @click="openValidationDialog">
                        Validate Visit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Validation Dialog -->
        <v-dialog v-model="showValidationDialog" max-width="800" persistent>
            <v-card>
                <v-card-title class="py-4 px-6 bg-success text-white">
                    <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-clipboard-check</v-icon>
                        <span>Validate Visit - {{ selectedVisit?.patient?.firstName }} {{
                            selectedVisit?.patient?.lastName }}</span>
                    </div>
                </v-card-title>

                <v-card-text class="pa-6">
                    <v-form ref="validationFormRef" v-model="isValidationFormValid">
                        <!-- Act Type Selection -->
                        <div class="mb-6">
                            <div class="section-header mb-3">
                                <v-icon color="primary" class="mr-2">mdi-medical-bag</v-icon>
                                <span class="text-subtitle-1 font-weight-bold">Performed Acts</span>
                            </div>

                            <!-- Selected Acts List -->
                            <v-card v-if="validationForm.selectedActs.length > 0" variant="outlined" class="mb-4">
                                <v-table density="compact">
                                    <thead>
                                        <tr class="bg-grey-lighten-4">
                                            <th>Act</th>
                                            <th>Type</th>
                                            <th class="text-center" style="width: 100px;">Qty</th>
                                            <th class="text-right" style="width: 100px;">Unit Price</th>
                                            <th class="text-right" style="width: 100px;">Subtotal</th>
                                            <th class="text-center" style="width: 60px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(selectedAct, index) in validationForm.selectedActs"
                                            :key="selectedAct.actCatalogId">
                                            <td>{{ selectedAct.description }}</td>
                                            <td>
                                                <v-chip size="x-small" color="primary" variant="tonal">
                                                    {{ selectedAct.typeCode }}
                                                </v-chip>
                                            </td>
                                            <td>
                                                <v-text-field v-model.number="selectedAct.quantity" type="number"
                                                    min="1" max="99" density="compact" variant="outlined"
                                                    hide-details class="quantity-input" @update:model-value="() => {
                                                        if (selectedAct.quantity < 1) selectedAct.quantity = 1;
                                                        if (selectedAct.quantity > 99) selectedAct.quantity = 99;
                                                    }">
                                                </v-text-field>
                                            </td>
                                            <td class="text-right">{{ formatCurrency(selectedAct.price) }}</td>
                                            <td class="text-right font-weight-medium">
                                                {{ formatCurrency(selectedAct.price * selectedAct.quantity) }}
                                            </td>
                                            <td class="text-center">
                                                <v-btn icon variant="text" color="error" size="small"
                                                    @click="removeAct(index)">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </tr>
                                        <tr class="bg-success-lighten-5">
                                            <td colspan="4" class="font-weight-bold">Total</td>
                                            <td class="text-right font-weight-bold text-success">
                                                {{ formatCurrency(calculateSelectedActsTotal()) }}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card>

                            <!-- Add Act Button and Selector -->
                            <v-row>
                                <v-col cols="12" md="5">
                                    <v-select v-model="selectedActType" :items="actTypes" item-title="description"
                                        item-value="id" label="Filter by Type" variant="outlined" density="compact"
                                        clearable prepend-inner-icon="mdi-filter-variant"
                                        @update:model-value="filterActCatalog">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" md="7">
                                    <v-autocomplete v-model="selectedActToAdd" :items="filteredActCatalog"
                                        item-title="description" item-value="id" label="Search and add an act"
                                        variant="outlined" density="compact" prepend-inner-icon="mdi-magnify"
                                        no-data-text="No acts found" return-object @update:model-value="addAct">
                                        <template #item="{ props, item }">
                                            <v-list-item v-bind="props" :subtitle="formatCurrency(item.raw.price)">
                                                <template #prepend>
                                                    <v-chip size="x-small" color="primary" variant="tonal"
                                                        class="mr-2">
                                                        {{ item.raw.type.code }}
                                                    </v-chip>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>

                            <v-alert v-if="validationForm.selectedActs.length === 0" type="info" variant="tonal"
                                density="compact" class="mt-2">
                                Please add at least one act to validate this visit.
                            </v-alert>
                        </div>

                        <v-divider class="my-4"></v-divider>

                        <!-- Notes Section -->
                        <div>
                            <div class="section-header mb-3">
                                <v-icon color="primary" class="mr-2">mdi-note-text</v-icon>
                                <span class="text-subtitle-1 font-weight-bold">Visit Report</span>
                            </div>
                            <v-textarea v-model="validationForm.notes" label="Notes / Report"
                                placeholder="Enter any observations, patient condition, or additional notes about this visit..."
                                variant="outlined" rows="4" counter maxlength="1000">
                            </v-textarea>
                        </div>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn variant="text" color="grey" @click="closeValidationDialog">
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" variant="flat" prepend-icon="mdi-check-circle"
                        :disabled="!canSubmitValidation" :loading="isValidating" @click="submitValidation">
                        Confirm Validation
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
            {{ snackbar.message }}
            <template #actions>
                <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks, parseISO, isBefore, isToday as dateFnsIsToday } from 'date-fns';
import { formatPhoneNumber } from '@/utils/formatters';

// ==================== STATE ====================
const currentWeekStart = ref(getMonday(new Date()));
const showDetailDialog = ref(false);
const showValidationDialog = ref(false);
const selectedVisit = ref(null);
const isValidating = ref(false);
const isValidationFormValid = ref(false);
const validationFormRef = ref(null);

// Snackbar
const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
});

// Validation form data
const validationFormData = ref({
    selectedActs: [],
    notes: '',
});
const validationForm = computed({
    get: () => validationFormData.value,
    set: (val) => validationFormData.value = val,
});

// Act selection
const selectedActType = ref(null);
const selectedActToAdd = ref(null);

// ==================== CONSTANTS ====================
const START_HOUR = 8;
const END_HOUR = 16;
const displayHours = computed(() => {
    const hours = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        hours.push(i);
    }
    return hours;
});

// ==================== FAKE DATA (to be replaced by API calls) ====================

// Visit status enum matching backend
const VisitStatus = {
    SCHEDULED: 'SCHEDULED',
    CANCELLED: 'CANCELLED',
    VALIDATED: 'VALIDATED',
};

// Act Types (referential data from act_types table)
const actTypes = ref([
    { id: 1, code: 'INJ', description: 'Injections' },
    { id: 2, code: 'PAN', description: 'Wound Care' },
    { id: 3, code: 'PRE', description: 'Blood Tests' },
    { id: 4, code: 'PER', description: 'Infusions' },
    { id: 5, code: 'SUR', description: 'Post-Surgery Care' },
    { id: 6, code: 'HYG', description: 'Hygiene Care' },
]);

// Act Catalog (referential data from act_catalogs table)
const actCatalog = ref([
    { id: 1, description: 'Intramuscular injection', price: 4.50, type: { id: 1, code: 'INJ' } },
    { id: 2, description: 'Subcutaneous injection', price: 4.50, type: { id: 1, code: 'INJ' } },
    { id: 3, description: 'Intravenous injection', price: 6.30, type: { id: 1, code: 'INJ' } },
    { id: 4, description: 'Insulin injection', price: 4.50, type: { id: 1, code: 'INJ' } },
    { id: 5, description: 'Simple wound dressing', price: 6.30, type: { id: 2, code: 'PAN' } },
    { id: 6, description: 'Complex wound dressing', price: 12.60, type: { id: 2, code: 'PAN' } },
    { id: 7, description: 'Burn dressing', price: 12.60, type: { id: 2, code: 'PAN' } },
    { id: 8, description: 'Suture removal', price: 6.30, type: { id: 2, code: 'PAN' } },
    { id: 9, description: 'Blood sample collection', price: 6.30, type: { id: 3, code: 'PRE' } },
    { id: 10, description: 'Glycemia test', price: 3.15, type: { id: 3, code: 'PRE' } },
    { id: 11, description: 'IV infusion setup', price: 9.45, type: { id: 4, code: 'PER' } },
    { id: 12, description: 'IV infusion monitoring (per hour)', price: 6.30, type: { id: 4, code: 'PER' } },
    { id: 13, description: 'Catheter care', price: 6.30, type: { id: 5, code: 'SUR' } },
    { id: 14, description: 'Drain management', price: 9.45, type: { id: 5, code: 'SUR' } },
    { id: 15, description: 'Post-operative wound check', price: 6.30, type: { id: 5, code: 'SUR' } },
    { id: 16, description: 'Full body wash', price: 12.60, type: { id: 6, code: 'HYG' } },
    { id: 17, description: 'Partial hygiene care', price: 6.30, type: { id: 6, code: 'HYG' } },
]);

const filteredActCatalog = ref([...actCatalog.value]);

// Visits data (to be replaced by API call)
const visits = ref([
    {
        id: 1,
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '08:30',
        endTime: '09:30',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: true,
        patient: {
            id: 1,
            firstName: 'Marie',
            lastName: 'Dupont',
            address: '12 Rue de la Paix, 75001 Paris',
            phone: '0612345678',
        },
        acts: [],
    },
    {
        id: 2,
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '10:00',
        endTime: '11:00',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: false,
        patient: {
            id: 2,
            firstName: 'Jean',
            lastName: 'Martin',
            address: '45 Avenue des Champs, 75008 Paris',
            phone: '0698765432',
        },
        acts: [],
    },
    {
        id: 3,
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '14:00',
        endTime: '15:00',
        status: VisitStatus.VALIDATED,
        isFirstVisit: false,
        patient: {
            id: 3,
            firstName: 'Sophie',
            lastName: 'Bernard',
            address: '78 Boulevard Haussmann, 75009 Paris',
            phone: '0654321098',
        },
        acts: [
            { id: 1, act: { id: 9, description: 'Blood sample collection' }, quantity: 1, priceAtTime: 6.30 },
            { id: 2, act: { id: 10, description: 'Glycemia test' }, quantity: 1, priceAtTime: 3.15 },
        ],
    },
    {
        id: 4,
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: true,
        patient: {
            id: 4,
            firstName: 'Pierre',
            lastName: 'Leroy',
            address: '23 Rue du Commerce, 75015 Paris',
            phone: '0687654321',
        },
        acts: [],
    },
    {
        id: 5,
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '11:30',
        endTime: '12:30',
        status: VisitStatus.CANCELLED,
        isFirstVisit: false,
        patient: {
            id: 5,
            firstName: 'Claire',
            lastName: 'Moreau',
            address: '56 Rue de Rivoli, 75004 Paris',
            phone: '0632109876',
        },
        acts: [],
    },
    {
        id: 6,
        date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        startTime: '08:00',
        endTime: '09:00',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: false,
        patient: {
            id: 6,
            firstName: 'Antoine',
            lastName: 'Petit',
            address: '89 Avenue Montaigne, 75008 Paris',
            phone: '0678901234',
        },
        acts: [],
    },
    {
        id: 7,
        date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
        startTime: '13:00',
        endTime: '14:30',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: true,
        patient: {
            id: 7,
            firstName: 'Isabelle',
            lastName: 'Roux',
            address: '34 Rue de Clichy, 75009 Paris',
            phone: '0645678901',
        },
        acts: [],
    },
    {
        id: 8,
        date: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
        startTime: '10:00',
        endTime: '11:00',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: false,
        patient: {
            id: 8,
            firstName: 'Michel',
            lastName: 'Girard',
            address: '67 Rue La Fayette, 75010 Paris',
            phone: '0623456789',
        },
        acts: [],
    },
    // Past visits for testing validation
    {
        id: 9,
        date: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        status: VisitStatus.SCHEDULED,
        isFirstVisit: false,
        patient: {
            id: 9,
            firstName: 'Francois',
            lastName: 'Blanc',
            address: '15 Rue de Rivoli, 75001 Paris',
            phone: '0611223344',
        },
        acts: [],
    },
]);

// ==================== HELPER FUNCTIONS ====================
function getMonday(date) {
    return startOfWeek(date, { weekStartsOn: 1 });
}

// ==================== COMPUTED ====================
const weekDays = computed(() => {
    const days = [];
    for (let i = 0; i < 5; i++) {
        const date = addDays(currentWeekStart.value, i);
        days.push({
            date: date,
            name: format(date, 'EEE'),
            number: format(date, 'd'),
        });
    }
    return days;
});

const canSubmitValidation = computed(() => {
    return validationForm.value.selectedActs.length > 0;
});

// ==================== METHODS ====================
function formatWeekRange(startDate) {
    const endDate = addDays(startDate, 4);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
}

function formatHour(hour) {
    return `${hour.toString().padStart(2, '0')}:00`;
}

function formatDate(dateString) {
    return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatStatus(status) {
    const statusMap = {
        'SCHEDULED': 'Scheduled',
        'CANCELLED': 'Cancelled',
        'VALIDATED': 'Validated',
    };
    return statusMap[status] || status;
}

function isToday(date) {
    return isSameDay(date, new Date());
}

function goToPreviousWeek() {
    currentWeekStart.value = subWeeks(currentWeekStart.value, 1);
}

function goToNextWeek() {
    currentWeekStart.value = addWeeks(currentWeekStart.value, 1);
}

function goToToday() {
    currentWeekStart.value = getMonday(new Date());
}

function getVisitsForDay(date) {
    return visits.value.filter(visit => {
        const visitDate = parseISO(visit.date);
        return isSameDay(visitDate, date);
    });
}

function getEventStyle(visit) {
    const [startHour, startMinutes] = visit.startTime.split(':').map(Number);
    const [endHour, endMinutes] = visit.endTime.split(':').map(Number);

    const topOffset = (startHour - START_HOUR) * 60 + startMinutes;
    const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes);
    const pixelsPerMinute = 60 / 60;

    return {
        top: `${topOffset * pixelsPerMinute}px`,
        height: `${Math.max(duration * pixelsPerMinute - 4, 30)}px`,
    };
}

function getEventClass(visit) {
    const classes = [];

    if (visit.status === VisitStatus.VALIDATED) {
        classes.push('validated');
    } else if (visit.status === VisitStatus.CANCELLED) {
        classes.push('cancelled');
    } else if (visit.isFirstVisit) {
        classes.push('first-visit');
    }

    return classes;
}

function getDialogHeaderClass(visit) {
    if (visit.status === VisitStatus.VALIDATED) {
        return 'bg-success text-white';
    } else if (visit.status === VisitStatus.CANCELLED) {
        return 'bg-grey text-white';
    } else if (visit.isFirstVisit) {
        return 'bg-orange-darken-1 text-white';
    }
    return 'bg-primary text-white';
}

function getStatusChipColor(status) {
    const colors = {
        'SCHEDULED': 'info',
        'VALIDATED': 'success',
        'CANCELLED': 'grey',
    };
    return colors[status] || 'grey';
}

function formatVisitTime(visit) {
    return `${visit.startTime} - ${visit.endTime}`;
}

function canValidateVisit(visit) {
    if (!visit || visit.status !== VisitStatus.SCHEDULED) {
        return false;
    }

    const visitDate = parseISO(visit.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Can only validate if visit date is today or in the past
    return isBefore(visitDate, today) || dateFnsIsToday(visitDate);
}

function calculateTotal(acts) {
    return acts.reduce((sum, act) => sum + (act.priceAtTime * act.quantity), 0);
}

function calculateSelectedActsTotal() {
    return validationForm.value.selectedActs.reduce((sum, act) => sum + (act.price * act.quantity), 0);
}

// ==================== DIALOG HANDLERS ====================
function openVisitDetail(visit) {
    selectedVisit.value = visit;
    showDetailDialog.value = true;
}

function closeDetailDialog() {
    showDetailDialog.value = false;
    selectedVisit.value = null;
}

function openValidationDialog() {
    validationForm.value = {
        selectedActs: [],
        notes: '',
    };
    selectedActType.value = null;
    filteredActCatalog.value = [...actCatalog.value];
    showValidationDialog.value = true;
}

function closeValidationDialog() {
    showValidationDialog.value = false;
}

// ==================== ACT MANAGEMENT ====================
function filterActCatalog(typeId) {
    if (!typeId) {
        filteredActCatalog.value = [...actCatalog.value];
    } else {
        filteredActCatalog.value = actCatalog.value.filter(act => act.type.id === typeId);
    }
}

function addAct(act) {
    if (!act) return;

    // Check if act already exists
    const existingIndex = validationForm.value.selectedActs.findIndex(a => a.actCatalogId === act.id);
    if (existingIndex >= 0) {
        // Increment quantity
        validationForm.value.selectedActs[existingIndex].quantity++;
    } else {
        // Add new act
        validationForm.value.selectedActs.push({
            actCatalogId: act.id,
            description: act.description,
            typeCode: act.type.code,
            price: act.price,
            quantity: 1,
            notes: '',
        });
    }

    // Reset selector
    selectedActToAdd.value = null;
}

function removeAct(index) {
    validationForm.value.selectedActs.splice(index, 1);
}

// ==================== SUBMIT VALIDATION ====================
async function submitValidation() {
    if (!canSubmitValidation.value) return;

    isValidating.value = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update visit locally (will be replaced by API response)
        const visitIndex = visits.value.findIndex(v => v.id === selectedVisit.value.id);
        if (visitIndex >= 0) {
            visits.value[visitIndex].status = VisitStatus.VALIDATED;
            visits.value[visitIndex].acts = validationForm.value.selectedActs.map((act, index) => ({
                id: index + 1,
                act: { id: act.actCatalogId, description: act.description },
                quantity: act.quantity,
                priceAtTime: act.price,
                notes: act.notes,
            }));

            // Update selected visit for detail dialog
            selectedVisit.value = { ...visits.value[visitIndex] };
        }

        showSnackbar('Visit validated successfully!', 'success');
        closeValidationDialog();

    } catch (error) {
        console.error('Error validating visit:', error);
        showSnackbar('Error validating visit. Please try again.', 'error');
    } finally {
        isValidating.value = false;
    }
}

function showSnackbar(message, color = 'success') {
    snackbar.value = {
        show: true,
        message,
        color,
    };
}
</script>

<style scoped>
.calendar-container {
    overflow-x: auto;
}

.calendar-header {
    display: flex;
    border-bottom: 2px solid #e0e0e0;
    background-color: #fafafa;
}

.time-column-header {
    width: 60px;
    min-width: 60px;
    flex-shrink: 0;
}

.day-header {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 12px 8px;
    border-left: 1px solid #e0e0e0;
}

.day-header.today {
    background-color: #e3f2fd;
}

.day-name {
    font-size: 12px;
    text-transform: uppercase;
    color: #666;
    font-weight: 500;
}

.day-number {
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.day-number.today-number {
    background-color: #1976D2;
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
}

.calendar-body {
    display: flex;
    position: relative;
}

.time-column {
    width: 60px;
    min-width: 60px;
    flex-shrink: 0;
    border-right: 1px solid #e0e0e0;
}

.time-slot-label {
    height: 60px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 11px;
    color: #666;
    padding-top: 2px;
}

.days-grid {
    display: flex;
    flex: 1;
}

.day-column {
    flex: 1;
    min-width: 120px;
    position: relative;
    border-left: 1px solid #e0e0e0;
}

.day-column.today-column {
    background-color: #f5f9ff;
}

.hour-slot {
    height: 60px;
    border-bottom: 1px solid #f0f0f0;
}

.hour-slot:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.01);
}

/* Visit event styles */
.visit-event {
    position: absolute;
    left: 4px;
    right: 4px;
    background: #1565C0;
    color: white;
    border-radius: 6px;
    padding: 6px 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 1;
}

.visit-event:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2;
}

.visit-event.first-visit {
    background: #E65100;
}

.visit-event.validated {
     background: #2E7D32;
}

.visit-event.cancelled {
    background: #616161;
    opacity: 0.7;
}

.visit-time {
    font-weight: 600;
    font-size: 10px;
    opacity: 0.9;
}

.visit-patient {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.visit-badges {
    display: flex;
    align-items: center;
    margin-top: 2px;
}

/* Legend styles */
.legend-item {
    display: flex;
    align-items: center;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    margin-right: 4px;
}

.legend-dot.scheduled {
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
}

.legend-dot.first-visit {
    background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.legend-dot.validated {
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.legend-dot.cancelled {
    background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
}

/* Info section styles */
.info-section {
    background-color: #fafafa;
    border-radius: 8px;
    padding: 16px;
}

.section-header {
    display: flex;
    align-items: center;
}

.info-label {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.info-value {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

/* Quantity input */
.quantity-input {
    max-width: 70px;
}

.quantity-input :deep(.v-field__input) {
    text-align: center;
    padding: 0 4px;
}

/* Responsive */
@media (max-width: 600px) {
    .day-header {
        min-width: 80px;
    }

    .visit-event {
        padding: 4px 6px;
        font-size: 10px;
    }
}
</style>