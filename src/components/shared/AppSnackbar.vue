<template>
    <v-snackbar v-model="localShow" :color="snackbarColor" :location="position" rounded="pill" :timeout="timeout">
        <div class="d-flex align-center" style="gap: 8px;">
            <v-icon v-if="snackbarIcon" size="20">{{ snackbarIcon }}</v-icon>
            <span>{{ text }}</span>
        </div>
        <template v-slot:actions>
            <v-btn color="white" text @click="closeSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const COLOR_MAP = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    default: 'primary',
};

const ICON_MAP = {
    success: 'mdi-check-circle-outline',
    error: 'mdi-alert-circle-outline',
    warning: 'mdi-alert-outline',
    info: 'mdi-information-outline',
    default: 'mdi-bell-outline',
};

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: 'success',
    },
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['success', 'error', 'warning', 'info', 'default'].includes(value),
    },
    position: {
        type: String,
        default: 'top-right',
        validator: (value) => ['top', 'bottom', 'left', 'right', 'center', 'top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value),
    },
    timeout: {
        type: Number,
        default: 3500,
    },
});

const emit = defineEmits(['update:show']);

const localShow = ref(props.show);

watch(() => props.show, (newValue) => {
    localShow.value = newValue;
});

watch(localShow, (newValue) => {
    if (!newValue) {
        emit('update:show', false);
    }
});

const snackbarColor = computed(() => {
    return props.type && COLOR_MAP[props.type] ? COLOR_MAP[props.type] : props.color || COLOR_MAP.default;
});

const snackbarIcon = computed(() => {
    return ICON_MAP[props.type] || ICON_MAP.default;
});

const closeSnackbar = () => {
    localShow.value = false;
};
</script>