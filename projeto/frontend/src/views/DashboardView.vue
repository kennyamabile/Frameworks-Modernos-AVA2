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
            <p class="mt-4 mb-0 text-subtitle-2">
              Total de Tarefas: {{ totalTasks }} | Concluídas: {{ completedTasks }} | Pendentes:
              {{ pendingTasks }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Percentuais</v-card-title>
          <v-card-text>
            <p>
              Concluídas: <strong>{{ donePct.toFixed(1) }}%</strong> — Não concluídas:
              <strong>{{ notDonePct.toFixed(1) }}%</strong>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" v-if="tasksStore.loading">
        <v-skeleton-loader type="card, card, card, card" />
      </v-col>

      <template v-else>
        <v-col cols="12" v-if="totalTasks === 0">
          <v-alert type="info" variant="tonal">
            Nenhuma tarefa para exibir gráficos ainda.
          </v-alert>
        </v-col>

        <template v-else>
          <v-col cols="12" md="6" xl="3">
            <v-card class="h-100">
              <v-card-title>Gráfico de barras</v-card-title>
              <v-card-text>
                <div class="chart-wrapper">
                  <Bar :data="chartData" :options="barLineOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="3">
            <v-card class="h-100">
              <v-card-title>Gráfico de linhas</v-card-title>
              <v-card-text>
                <div class="chart-wrapper">
                  <Line :data="chartData" :options="barLineOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="3">
            <v-card class="h-100">
              <v-card-title>Gráfico de pizza</v-card-title>
              <v-card-text>
                <div class="chart-wrapper">
                  <Pie :data="chartData" :options="pieDoughnutOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="3">
            <v-card class="h-100">
              <v-card-title>Gráfico de rosca</v-card-title>
              <v-card-text>
                <div class="chart-wrapper">
                  <Doughnut :data="chartData" :options="pieDoughnutOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </template>
    </v-row>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import { useAuthStore } from '../stores/auth';
import { useTasksStore } from '../stores/tasks';
import MainLayout from '../layouts/MainLayout.vue';

Chart.register(...registerables);

const authStore = useAuthStore();
const tasksStore = useTasksStore();

onMounted(() => {
  if (!tasksStore.loading && tasksStore.tasks.length === 0) {
    tasksStore.fetchTasks();
  }
});

const userName = computed(
  () => authStore.user?.displayName || authStore.user?.email || 'Usuário'
);

const totalTasks = computed(() => tasksStore.tasks.length);
const completedTasks = computed(
  () => tasksStore.tasks.filter((task) => task.done).length
);
const pendingTasks = computed(() => totalTasks.value - completedTasks.value);

const percentage = (count) =>
  totalTasks.value === 0
    ? 0
    : Number(((count / totalTasks.value) * 100).toFixed(1));

const donePct = computed(() => percentage(completedTasks.value));
const notDonePct = computed(() => percentage(pendingTasks.value));

const chartData = computed(() => {
  const labels = ['Concluídas', 'Pendentes'];
  const colors = ['#2e7d32', '#D3D3D3'];

  return {
    labels,
    datasets: [
      {
        label: 'Percentual',
        data: [donePct.value, notDonePct.value],
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }
    ]
  };
});

const barLineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y ?? context.parsed}%`
      }
    }
  }
}));

const pieDoughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.formattedValue}%`
      }
    }
  }
}));
</script>

<style scoped>
.chart-wrapper {
  height: 260px;
}
</style>
