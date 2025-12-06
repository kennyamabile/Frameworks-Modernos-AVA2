<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card max-width="420" class="pa-6">
          <v-card-title class="text-h5 text-center mb-2">
            Entrar no Gerenciador de Tarefas
          </v-card-title>
          <v-card-subtitle class="text-center mb-4">
            Autentique-se com sua conta Google
          </v-card-subtitle>

          <v-card-text>
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ authStore.error }}
            </v-alert>

            <v-btn
              block
              size="large"
              :loading="authStore.loading"
              color="primary"
              @click="login"
            >
              <v-icon class="mr-2">mdi-google</v-icon>
              Entrar com Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  await authStore.signInWithGoogle();
  if (authStore.isAuthenticated) {
    router.push({ name: 'dashboard' });
  }
};
</script>
