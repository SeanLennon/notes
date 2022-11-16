<script setup>
import { date, uid } from "quasar";
import { useNotebookStore } from "src/stores/notebook-store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const store = useNotebookStore();
const filter = ref("");

const notebooks = computed(() => store.list);
const columns = [
  {
    name: "name",
    required: true,
    label: "NOME",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "subjects",
    required: true,
    label: "ASSUNTOS",
    align: "center",
    field: (row) => row.subjects.length,
    format: (val) => `${val}`,
    sortable: false,
  },

  {
    name: "notes",
    required: true,
    label: "NOTAS",
    align: "center",
    field: (row) => row.subjects.length,
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: "updated",
    required: true,
    label: "ATUALIZADO",
    align: "right",
    field: (row) => row.updated,
    format: (val) => `${val}`,
    sortable: true,
  },
];

function onConsole(target) {
  const notebook = store.list.find(
    (notebook) =>
      notebook.id == target ||
      notebook.subjects.some((sub) => sub.id == target) ||
      notebook.subjects.find((sub) =>
        sub.notes.some((note) => note.id == target)
      )
  );

  const res = {
    name: "Notebook",
    params: {
      id: notebook.id,
      subject_id: notebook.subjects.find((sub) => sub.id == target)?.id || null,
      note_id:
        notebook.subjects?.find((sub) =>
          sub?.notes?.find((note) => note.id == target)
        )?.id || null,
    },
  };
  $router.push(res);
}
</script>

<template>
  <q-scroll-area style="height: calc(100vh - 50px)">
    <q-page padding class="row flex-center content-start q-py-xl">
      <q-table
        :rows="notebooks"
        row-key="name"
        class="col-sm-10 col-md-8"
        :filter="filter"
        :columns="columns"
        no-data-label="Nenhum caderno encontrado"
        no-results-label="Nenhum caderno correspondente encontrado"
      >
        <template #top="props">
          <q-toolbar>
            <q-toolbar-title>CADERNOS</q-toolbar-title>
            <q-input
              v-model="filter"
              outlined
              dense
              color="primary"
              placeholder="Pesquise por nome"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-toolbar>
          <div>{{ notebooks.length }} Cadernos</div>
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td key="name" :props="props">
              <q-btn
                icon="mdi-notebook"
                dense
                :color="$q.dark.isActive ? 'grey-4' : 'grey-8'"
                :label="props.row.name"
                no-caps
                flat
                @click="
                  $router.push({
                    name: 'Notebook',
                    params: {
                      id: props.row.id,
                      subject_id: null,
                      note_id: null,
                    },
                  })
                "
              />
              <q-tree
                :nodes="props.row.subjects"
                node-key="id"
                selected-color="primary"
                label-key="title"
                no-nodes-label="Nenhum assunto encontrado"
                children-key="notes"
                no-selection-unset
                selected
                style="margin-left: 35px"
              >
                <!-- @update:selected="(e) => onConsole(e)" -->
                <template #header-subject="prop">
                  <div
                    @click="
                      $router.push({
                        name: 'Notebook',
                        params: {
                          id: props.row.id,
                          subject_id: prop.node.id,
                          note_id: null,
                        },
                      })
                    "
                  >
                    {{ prop.node.title || "Sem Título" }} (
                    {{ prop.node.notes.length }} notas )
                  </div>
                </template>

                <template #header-note="prop">
                  <div
                    @click="
                      $router.push({
                        name: 'Notebook',
                        params: {
                          id: props.row.id,
                          subject_id: prop.node.subject.id,
                          note_id: prop.node.id,
                        },
                      })
                    "
                  >
                    {{ prop.node.title || "Sem Título" }}
                  </div>
                </template>
              </q-tree>
            </q-td>
            <q-td key="subjects" :props="props">
              {{ props.row.subjects.length }}
            </q-td>
            <q-td key="notes" :props="props">
              {{
                props.row.subjects
                  .map((sub) => sub.notes.length)
                  .reduce((acc, n) => acc + n, 0)
              }}
            </q-td>
            <q-td key="updated" :props="props">
              {{ date.formatDate(props.row.updated, "DD/MM/YYYY HH:mm") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-page>
  </q-scroll-area>
</template>
