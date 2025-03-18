<template>
    <v-form @submit.prevent="submitForm" ref="form">
        <v-tabs v-model="activeTab" grow color="primary" align-tabs="center">
            <v-tab value="personal">Personal Information</v-tab>
            <v-tab value="contact">Contact Information</v-tab>
        </v-tabs>
        <v-window v-model="activeTab" class="mt-6">
            <v-window-item class="pa-5" value="personal">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="nurseData.firstName" :rules="[validationRules.required]"
                            label="First Name*" placeholder="Enter first name" prepend-inner-icon="mdi-account"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="nurseData.lastName" :rules="[validationRules.required]"
                            label="Last Name*" placeholder="Enter last name" prepend-inner-icon="mdi-account"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model="nurseData.gender" :items="genderOptions" item-title="title"
                            item-value="value" :rules="[validationRules.required]" label="Gender*"
                            placeholder="Select gender" prepend-inner-icon="mdi-gender-male-female" required></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-file-input v-model="avatarFile"
                            :rules="[validationRules.avatarSize, validationRules.avatarType]" accept="image/*"
                            label="Avatar" prepend-icon="mdi-camera" @update:model-value="previewAvatar"></v-file-input>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center" v-if="avatarPreview">
                        <v-img :src="avatarPreview" max-width="120" max-height="120" contain></v-img>
                    </v-col>
                </v-row>
            </v-window-item>
            <v-window-item class="pa-5" value="contact">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="nurseData.phone"
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
                        <v-text-field v-model="nurseData.email"
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
import { genderOptions } from '@/utils/constants';
import { validationRules } from '@/utils/validationRules';
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    nurse: {
        type: Object,
        default: () => ({
            firstName: '',
            lastName: '',
            gender: '',
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

const form = ref(null);
const activeTab = ref('personal');
const nurseData = reactive({ ...props.nurse });
const avatarFile = ref(null);
const avatarPreview = ref(null);

// Initialize avatar preview with existing photo URL when in update mode
watch(() => props.nurse, (newValue) => {
    Object.assign(nurseData, newValue);
    // Set the avatar preview if the nurse has a photoUrl
    if (newValue.photoUrl) {
        avatarPreview.value = newValue.photoUrl;
    }
}, { immediate: true, deep: true });

const previewAvatar = (fileOrFiles) => {
    const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;
    console.log(file);
    if (file && file instanceof File) {
        avatarPreview.value = URL.createObjectURL(file);
    } else {
        avatarPreview.value = null;
    }
};

const submitForm = async () => {
    const validation = await form.value?.validate();
    if (validation?.valid) {
        const formData = new FormData();

        // Add all nurse data fields to the FormData
        for (const [key, value] of Object.entries(nurseData)) {
            formData.append(key, value);
        }

        // Add the avatar file if selected
        if (avatarFile.value) {
            formData.append('image', avatarFile.value);
        }

        emit('submit', formData);
    }
};
</script>

<style scoped>
.v-tab {
    font-weight: bold;
}

.v-window {
    background-color: rgb(var(--v-theme-bgColor));
    border-radius: 0 0 4px 4px;
}
</style>
