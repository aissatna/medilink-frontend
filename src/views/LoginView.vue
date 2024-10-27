<template>
  <!-- Snackbar for notifications -->
  <AppSnackbar v-model:show="snackbar.show" :text="snackbar.text" :color="snackbar.color" />

  <v-container class="fill-height login-wrapper " fluid>
    <v-row class="align-centre justify-center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-12 pa-6 rounded-lg">
          <v-card-title class="text-center mb-6">
            <v-img :src="logoUrl" alt="MediLink Logo" contain height="80" class="mb-4" />
            <div class="text-h6 font-weight-light">Your Gateway to Personalized Healthcare</div>
          </v-card-title>
          <v-form @submit.prevent="handleLogin" ref="loginForm">
            <v-card-text>
              <v-text-field v-model="userCredentials.email" label="Email" name="email" prepend-inner-icon="mdi-email"
                type="email" :rules="[validationRules.required, validationRules.email]" required
                class="mb-4 input-field" />
              <v-text-field v-model="userCredentials.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'"
                label="Password" name="password" prepend-inner-icon="mdi-lock"
                @click:append-inner="togglePasswordVisibility" :rules="[validationRules.required]" required
                class="mb-2 input-field" />
              <div class="text-right mb-6">
                <a @click.prevent="handleForgotPassword"
                  class="text-decoration-none text-blue-darken-4 forgot-password">Forgot
                  Password ?
                </a>
              </div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn size="large" type="submit" :loading="loading" :disabled="loading" class="bg-primary px-8 ">
                Login
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- forgotPasswordDialog -->
  <v-dialog v-model="forgotPasswordDialog.show" max-width="500px">
    <v-card>
      <v-card-title>Forgot Password</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleForgotPasswordSubmit" ref="forgotPasswordForm">
          <v-text-field v-model="forgotPasswordDialog.email" label="Email" type="email" prepend-inner-icon="mdi-email"
            :rules="[validationRules.required, validationRules.email]" required class="mb-2"></v-text-field>
          <v-card-actions class="justify-center">
            <v-btn type="submit" :loading="forgotPasswordDialog.loading" class="bg-primary px-3 ">
              Reset Password
            </v-btn>
          </v-card-actions>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { validationRules } from '@/utils/validationRules';
import AuthService from '@/api/services/AuthService';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import AppSnackbar from '@/components/shared/AppSnackbar.vue';


const images = require.context('../assets', true, /\.png$/);
const logoUrl = images('./logo.png');

const userStore = useUserStore();
const authStore = useAuthStore();

const router = useRouter();
const loginForm = ref(null);
const forgotPasswordForm = ref(null);
const showPassword = ref(false);
const loading = ref(false);
const snackbar = reactive({
  show: false,
  text: '',
  color: '',
});

const userCredentials = reactive({
  email: '',
  password: '',
});

const forgotPasswordDialog = reactive({
  show: false,
  email: '',
  loading: false,
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleForgotPassword = () => {
  forgotPasswordDialog.show = true;
};
const showSnackbar = (text, color) => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

const handleLogin = async () => {
  const validation = await loginForm.value?.validate();
  if (validation?.valid) {
    loading.value = true;
    try {
      const { data } = await AuthService.signIn(userCredentials);
      await onLoginSuccess(data.accessToken);
    } catch (error) {
      console.error('Login error:', error);
      showSnackbar('Invalid email or password', 'error');
    } finally {
      loading.value = false;
    }
  } else {
    showSnackbar('Please correct the highlighted errors', 'error');
  }
};

async function onLoginSuccess(accessToken) {
  authStore.setToken(accessToken);
  try {
    await userStore.getUserInfo();
    await router.push('/home');
  } catch (error) {
    console.error('Error retrieving user information:', error);
  }
}

const handleForgotPasswordSubmit = async () => {
  const validation = await forgotPasswordForm.value?.validate();
  if (validation?.valid) {
    forgotPasswordDialog.loading = true;
    try {
      await AuthService.resetPassword(forgotPasswordDialog.email);
      showSnackbar('A new password has been sent to your email', 'success');
      forgotPasswordDialog.show = false;
    } catch (error) {
      console.error('Password reset error:', error);
      showSnackbar('Failed to send a new password. Please try again.', 'error');
    } finally {
      forgotPasswordDialog.loading = false;
    }
  } else {
    showSnackbar('Please enter a valid email address', 'error');
  }
};

</script>

<style scoped>
.forgot-password {
  cursor: pointer;
}
</style>