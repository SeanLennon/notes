<script setup>
import { date, uid } from "quasar";
import { useNotebookStore } from "src/stores/notebook-store";
import { computed, ref } from "vue";
import Note from "src/stores/models/Note";
import Notebook from "src/stores/models/Notebook";
import Subject from "src/stores/models/Subject";

const store = useNotebookStore();
const tab = ref(1);

const notebooks = computed(() =>
  store.notebooks
    .map(
      (notebook) =>
        new Notebook({
          data: notebook,
        })
    )
    .filter((_, index) => index < 15)
);

const subjects = computed(() =>
  store.notebooks
    .flatMap((notebook) => notebook.subjects)
    .reduce((list, subject) => list.concat(new Subject({ data: subject })), [])
    .filter((_, index) => index < 15)
);

const notes = computed(() =>
  store.notebooks
    .reduce((acc, notebook) => acc.concat(notebook.subjects), [])
    .reduce((acc, subject) => {
      return acc.concat(
        subject.notes.map((note) => {
          return {
            ...new Note({ data: note }),
            notebook: { id: subject.notebook.id },
          };
        })
      );
    }, [])
    .filter((_, index) => index < 15)
);
</script>

<template>
  <q-scroll-area style="height: calc(100vh - 50px)">
    <q-page
      class="row justify-center items-start content-start"
      style="height: calc(100vh - 50px)"
    >
      <q-card
        class="col-12 row flex-center"
        style="height: 300px"
        :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'"
        flat
        square
      >
        <div class="col-sm-10 col-md-8 text-uppercase text-weight-medium">
          {{ date.formatDate(Date.now(), "dddd, DD MMMM YYYY") }}
        </div>
      </q-card>

      <q-card class="col-sm-10 col-md-8" style="margin-top: -100px">
        <q-item-label heade class="text-weight-bold q-pa-md">
          RECENTES
        </q-item-label>

        <q-tabs
          v-model="tab"
          align="left"
          indicator-color="primary"
          active-color="primary"
          narrow-indicator
          no-caps
        >
          <q-tab :name="1" label="Cadernos" />
          <q-tab :name="2" label="Assuntos" />
          <q-tab :name="3" label="Notas" />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          transition-next="fade"
          transition-prev="fade"
        >
          <q-tab-panel :name="1" style="height: 320px" class="no-padding">
            <q-scroll-area class="full-height">
              <q-list
                class="row no-wrap q-gutter-x-md q-pa-md"
                v-if="notebooks.length > 0"
              >
                <q-card
                  v-for="notebook in notebooks"
                  :key="notebook?.id"
                  style="height: 280px; width: 200px"
                >
                  <q-item
                    :to="{
                      name: 'Notebook',
                      params: {
                        id: notebook.id,
                        subject_id: null,
                        note_id: null,
                      },
                    }"
                    clickable
                    class="column justify-between items-start q-py-md"
                    style="height: 280px"
                  >
                    <q-item-label class="text-weight-bold">
                      {{ notebook.name }}
                    </q-item-label>
                    <q-space />
                    <q-item-label class="text-weight-medium">
                      {{ notebook.getSubjectsCount() }} Assuntos
                    </q-item-label>
                    <q-item-label class="text-weight-normal" caption>
                      {{
                        notebook.getUpdatedDateTimeFormated("DD MMM YY HH:mm")
                      }}
                    </q-item-label>
                  </q-item>
                </q-card>
              </q-list>
              <q-list v-else class="flex flex-center">
                <div class="q-py-xl">
                  Nenhum <span class="text-bold">Caderno</span> encontrado
                </div>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel :name="2" style="height: 320px" class="no-padding">
            <q-scroll-area class="full-height">
              <q-list
                class="row no-wrap q-gutter-x-md q-pa-md"
                v-if="subjects.length > 0"
              >
                <q-card
                  v-for="subject in subjects"
                  :key="subject?.id"
                  style="height: 280px; width: 200px"
                >
                  <q-item
                    :to="{
                      name: 'Notebook',
                      params: {
                        id: subject.notebook.id,
                        subject_id: subject.id,
                        note_id: subject.notes[0]?.id || null,
                      },
                    }"
                    clickable
                    class="column justify-between items-start q-py-md"
                    style="height: 280px"
                  >
                    <q-item-label class="text-weight-bold">
                      {{ subject.title }}
                    </q-item-label>
                    <q-item-label class="text-weight-bold">
                      {{ subject.getNotesCount() }} Notas
                    </q-item-label>
                    <q-space />
                    <q-item-label class="text-weight-medium">
                      {{ store.one(subject.notebook.id).name }}
                    </q-item-label>
                    <q-item-label class="text-weight-normal" caption>
                      {{ subject.getUpdatedDateTimeFormated("DD MMM YY") }}
                    </q-item-label>
                  </q-item>
                </q-card>
              </q-list>
              <q-list v-else class="flex flex-center">
                <div class="q-py-xl">
                  Nenhum <span class="text-bold">Assunto</span> encontrado
                </div>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel :name="3" style="height: 320px" class="no-padding">
            <q-scroll-area class="full-height">
              <q-list
                class="row no-wrap q-gutter-x-md q-pa-md"
                v-if="notes.length > 0"
              >
                <q-card
                  v-for="note in notes"
                  :key="note?.id"
                  style="height: 280px; width: 200px"
                >
                  <q-item
                    :to="{
                      name: 'Notebook',
                      params: {
                        id: note.notebook?.id,
                        subject_id: note.subject?.id,
                        note_id: note.id,
                      },
                    }"
                    clickable
                    class="column justify-between items-start q-py-md"
                    style="height: 280px"
                  >
                    <q-item-label class="text-weight-bold">
                      {{ note.title || "Sem Título" }}
                    </q-item-label>
                    <q-item-label class="text-weight-medium q-pb-md">
                      {{ note.description || "Sem Descrição" }}
                    </q-item-label>

                    <div
                      class="text-weight-medium ellipsis-3-lines"
                      v-html="note.content"
                    ></div>
                    <q-space />

                    <q-item-label class="text-weight-medium">
                      {{ store.one(note.notebook.id)?.name }}
                    </q-item-label>
                    <q-item-label class="text-weight-normal" caption>
                      {{ date.formatDate(note.updated, "DD MMM YY") }}
                    </q-item-label>
                  </q-item>
                </q-card>
              </q-list>
              <q-list v-else class="flex flex-center">
                <div class="q-py-xl">
                  Nenhuma <span class="text-bold">Nota</span> encontrda
                </div>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-page>
  </q-scroll-area>
</template>
