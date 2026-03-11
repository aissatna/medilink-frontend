<template>
    <component :is="visitsComponent" />
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import SecretaryVisits from '@/components/visit/SecretaryVisits.vue';
import NurseVisits from '@/components/visit/NurseVisits.vue';

const userStore = useUserStore();

const visitsComponent = computed(() => {
    const role = userStore.userInfo.roleName?.toLowerCase();
    if (role === 'nurse') return NurseVisits;
    if (role === 'secretary') return SecretaryVisits;
    return null;
});
</script>