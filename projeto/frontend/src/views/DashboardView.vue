<template>
  <MainLayout>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Olá, {{ userName }}</h1>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Resumo</v-card-title>
          <v-card-text>
            <p>Bem-vindo ao seu painel.</p>
            <p class="mt-2">
              Use o menu lateral para acessar o CRUD de tarefas.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import MainLayout from '../layouts/MainLayout.vue';

const authStore = useAuthStore();

const userName = computed(
  () => authStore.user?.displayName || authStore.user?.email || 'Usuário'
);
</script>
