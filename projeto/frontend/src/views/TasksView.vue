<template>
  <MainLayout>
    <v-row>
      <v-col
        cols="12"
        class="d-flex justify-space-between align-center mb-4"
      >
        <h1 class="text-h5">Tarefas</h1>
        <v-btn color="primary" @click="openCreate">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Nova tarefa
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>

        <v-data-table
          :items="tasks"
          :headers="headers"
          :loading="loading"
          loading-text="Carregando..."
          item-key="id"
        >
          <template #item.done="{ item }">
            <v-chip :color="item.done ? 'success' : 'warning'" size="small">
              {{ item.done ? 'Concluída' : 'Pendente' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="editTask(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingTask ? 'Editar tarefa' : 'Nova tarefa' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="isFormValid">
            <v-text-field
              v-model="form.title"
              label="Título"
              :rules="[rules.required]"
              required
            />
            <v-textarea
              v-model="form.description"
              label="Descrição"
              rows="3"
            />
            <v-switch
              v-model="form.done"
              label="Concluída?"
              color="primary"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!isFormValid"
            @click="save"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir tarefa</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a tarefa
          <strong>{{ taskToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="remove">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import { useTasksStore } from '../stores/tasks';

const tasksStore = useTasksStore();

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Título', value: 'title' },
  { title: 'Descrição', value: 'description' },
  { title: 'Status', value: 'done' },
  { title: 'Ações', value: 'actions', sortable: false }
];

const dialog = ref(false);
const deleteDialog = ref(false);
const editingTask = ref(null);
const taskToDelete = ref(null);
const formRef = ref(null);
const isFormValid = ref(false);
const saving = ref(false);
const deleting = ref(false);

const form = ref({
  title: '',
  description: '',
  done: false
});

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
};

const tasks = computed(() => tasksStore.tasks);
const loading = computed(() => tasksStore.loading);
const error = computed(() => tasksStore.error);

onMounted(() => {
  tasksStore.fetchTasks();
});

const openCreate = () => {
  editingTask.value = null;
  form.value = { title: '', description: '', done: false };
  dialog.value = true;
};

const editTask = (task) => {
  editingTask.value = task;
  form.value = {
    title: task.title,
    description: task.description,
    done: task.done
  };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const save = async () => {
  if (!formRef.value) return;

  const result = await formRef.value.validate();
  const valid = typeof result === 'object' ? result.valid : result;

  if (!valid) return;

  saving.value = true;
  try {
    if (editingTask.value) {
      await tasksStore.updateTask(editingTask.value.id, form.value);
    } else {
      await tasksStore.createTask(form.value);
    }
    dialog.value = false;
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar tarefa.');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (task) => {
  taskToDelete.value = task;
  deleteDialog.value = true;
};

const remove = async () => {
  if (!taskToDelete.value) return;
  deleting.value = true;
  try {
    await tasksStore.deleteTask(taskToDelete.value.id);
    deleteDialog.value = false;
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir tarefa.');
  } finally {
    deleting.value = false;
  }
};
</script>
