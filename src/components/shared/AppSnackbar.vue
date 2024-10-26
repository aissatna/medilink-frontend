<template>
    <v-snackbar v-model="localShow" :color="color" :location="position" rounded="pill" :timeout="timeout">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="white" text @click="closeSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue';

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
    position: {
        type: String,
        default: 'bottom',
        validator: (value) => ['top', 'bottom', 'left', 'right', 'center'].includes(value),
    },
    timeout: {
        type: Number,
        default: 3000,
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

const closeSnackbar = () => {
    localShow.value = false;
};
</script>