<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          :title="user?.displayName || 'Usuário'"
          :subtitle="user?.email"
        >
          <template #prepend>
            <v-avatar v-if="user?.photoURL" size="40">
              <v-img :src="user.photoURL" alt="Avatar" />
            </v-avatar>
            <v-avatar v-else size="40">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
        <v-divider />
        <v-list-item
          to="/dashboard"
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
        />
        <v-list-item
          to="/tarefas"
          title="Tarefas"
          prepend-icon="mdi-format-list-checkbox"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Gerenciador de Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn variant="text" @click="logout">
        <v-icon class="mr-2">mdi-logout</v-icon>
        Sair
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const drawer = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>
