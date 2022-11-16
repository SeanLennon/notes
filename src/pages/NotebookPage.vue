<script setup>
import { date, useQuasar } from "quasar";
import Note from "src/stores/models/Note";
import Subject from "src/stores/models/Subject";
import Notebook from "src/stores/models/Notebook";
import { useNotebookStore } from "src/stores/notebook-store";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(["id", "subject_id", "note_id"]);
const $q = useQuasar();
const store = useNotebookStore();
const splitter = ref(20);
const $router = useRouter();

const note = ref(
  store
    .one(props.id)
    ?.subjects.find(
      (sub) => sub.notebook.id == props.id && sub.id == props.subject_id
    )
    ?.notes.find((note) => note.id == props.note_id) || null
);

const notebook = computed(() => store.one(props.id));

function onInsertSubject() {
  $q.dialog({
    message: "Novo Assunto",
    prompt: {
      outlined: true,
      dense: true,
      model: "",
    },
    color: "primary",
    ok: {
      "no-caps": true,
      label: "Confirmar",
      color: "primary",
      unelevated: true,
    },
    cancel: {
      "no-caps": true,
      label: "Cancelar",
      outline: true,
      color: "grey",
    },
    class: ["q-pa-sm"],
  }).onOk((title) => {
    const newSubject = new Subject({
      data: {
        title,
        notebook: {
          id: notebook.value.id,
        },
      },
    });
    notebook.value.subjects.unshift(newSubject);
  });
}

function onInsertNote(index) {
  const newNote = new Note({
    data: {
      subject: {
        id: notebook.value.subjects[index].id,
      },
    },
  });
  notebook.value.subjects[index].notes.unshift(newNote);
  note.value = newNote;
}

function addNoteToEditor(item) {
  note.value = item;
}

function onDeleteNote(item) {
  const subject = notebook.value.subjects.find((x) => x.id == item.subject.id);
  subject.notes.splice(subject.notes.indexOf(item), 1);

  $q.notify({
    type: "positive",
    timeout: 2000,
    color: "primary",
    message: "Nota excluída com sucesso!",
    position: "bottom-right",
  });

  if (note.value && item.id == note.value.id) {
    note.value = null;
  }
}

function renameSubject(item) {
  $q.dialog({
    message: "Renomear Assunto",
    prompt: {
      outlined: true,
      dense: true,
      model: item.title,
    },
    color: "primary",
    ok: {
      "no-caps": true,
      label: "Confirmar",
      color: "primary",
      unelevated: true,
    },
    cancel: {
      "no-caps": true,
      label: "Cancelar",
      outline: true,
      color: "grey",
    },
    class: ["q-pa-sm"],
  }).onOk((title) => {
    item.title = title;
  });
}

function onDeleteSubject(index) {
  // store.trash.push(notebook.value);
  // notebook.value.subjects[index].inTrash = true;
  notebook.value?.subjects.splice(index, 1);
  note.value = null;
  $q.notify({
    type: "positive",
    timeout: 2000,
    color: "primary",
    message: "Assunto excluído com sucesso!",
    position: "bottom-right",
  });
}

function renameNotebook() {
  $q.dialog({
    message: "Renomear Caderno",
    prompt: {
      outlined: true,
      dense: true,
      model: notebook.value.name,
    },
    color: "primary",
    ok: {
      "no-caps": true,
      label: "Confirmar",
      color: "primary",
      unelevated: true,
    },
    cancel: {
      "no-caps": true,
      label: "Cancelar",
      outline: true,
      color: "grey",
    },
    class: ["q-pa-sm"],
  }).onOk((name) => {
    notebook.value.name = name?.trim();
  });
}

function removeNotebook() {
  store.remove(notebook.value);
  $router.replace({ name: "Home" });
}
</script>

<template>
  <q-page>
    <q-splitter
      v-model="splitter"
      :limits="[$q.screen.xl ? 20 : 30, 30]"
      style="height: calc(100vh -50px)"
    >
      <template #before>
        <!-- Header Notebook -->

        <q-item class="q-pt-md">
          <q-item-section>
            <q-item-label class="text-weight-medium text-h5">
              <q-badge
                class="no-padding"
                color="transparent"
                :class="$q.dark.isActive ? 'text-grey-2' : 'text-grey-8'"
              >
                <q-icon name="mdi-calendar" class="q-pr-xs" />
                {{ date.formatDate(notebook?.updated, "ddd, DD MMM YYYY") }}
              </q-badge>
              <q-item-label :lines="1">
                {{ notebook?.name }}
              </q-item-label>
            </q-item-label>
          </q-item-section>
          <q-item-section avatar top>
            <q-btn icon="more_horiz" flat round dense>
              <q-menu auto-close>
                <q-item dense clickable @click="renameNotebook">
                  <q-item-section class="text-weight-medium">
                    Renomear Caderno
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item dense clickable @click="removeNotebook">
                  <q-item-section class="text-red-4 text-weight-medium">
                    Excluir Caderno
                  </q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>
              {{ notebook?.subjects.length || 0 }} Assuntos
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              label="+ Assunto"
              no-caps
              color="primary"
              unelevated
              @click="onInsertSubject"
            />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-scroll-area style="height: calc(100vh - 185px)">
          <q-tree
            ref="tree"
            :nodes="notebook?.subjects || []"
            node-key="id"
            selected-color="primary"
            label-key="title"
            class="q-pa-sm hide-scrollbar"
            no-nodes-label="Ainda não há assuntos criados"
            children-key="notes"
            no-selection-unset
            :selected="false"
            default-expand-all
          >
            <!-- Subjects -->
            <template #header-subject="prop">
              <q-list
                dense
                class="fit"
                :class="$q.dark.isActive ? 'text-grey-2' : 'text-grey-9'"
              >
                <q-item
                  class="fit"
                  :class="
                    prop?.node?.notes.find((x) => x.id == note?.id)
                      ? 'bg-primary rounded-borders'
                      : ''
                  "
                >
                  <q-item-section side>
                    <q-icon
                      :name="prop.node.icon"
                      :color="
                        note?.subject?.id == prop.key
                          ? 'grey-4'
                          : note?.subject?.id != prop.key && $q.dark.isActive
                          ? 'grey-4'
                          : 'grey-8'
                      "
                    />
                  </q-item-section>

                  <q-item-section
                    class="q-py-xs"
                    :class="
                      prop?.node?.notes.find((x) => x.id == note?.id) &&
                      !$q.dark.isActive
                        ? 'text-grey-2'
                        : 'text-grey-8'
                        ? prop?.node?.notes.find((x) => x.id == note?.id) &&
                          $q.dark.isActive
                        : 'text-grey-2'
                    "
                    @click="prop?.tree.setExpanded(prop.key, !prop.expanded)"
                  >
                    <q-item-label class="text-overline">
                      {{ prop?.node?.title || "Sem título" }}
                    </q-item-label>
                    <q-item-label class="text-caption">
                      {{ prop?.node?.notes.length }} Notas
                    </q-item-label>
                  </q-item-section>

                  <q-item-section thumbnail>
                    <q-btn
                      flat
                      icon="more_horiz"
                      round
                      dense
                      :color="
                        prop?.node?.id == note?.subject?.id
                          ? 'grey-4'
                          : $q.dark.isActive
                          ? 'grey-4'
                          : 'grey-8'
                      "
                    >
                      <q-menu auto-close :offset="[0, 0]">
                        <q-list class="text-weight-medium" dense>
                          <q-item
                            clickable
                            @click="
                              () => {
                                onInsertNote(
                                  prop?.tree?.nodes?.indexOf(prop.node)
                                );
                                prop?.tree?.setExpanded(prop.key, true);
                              }
                            "
                          >
                            <q-item-section> Adicionar nota </q-item-section>
                          </q-item>
                          <q-item clickable @click="renameSubject(prop.node)">
                            <q-item-section> Renomear assunto </q-item-section>
                          </q-item>

                          <q-separator />

                          <q-item
                            clickable
                            @click="
                              () => {
                                onDeleteSubject(
                                  prop?.tree?.nodes?.indexOf(prop.node)
                                );
                              }
                            "
                          >
                            <q-item-section class="text-red-4">
                              Excluír Assunto?
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>

            <!-- Notes -->
            <template #header-note="prop">
              <q-list
                dense
                class="fit q-pl-sm cursor-pointer"
                :class="
                  note == prop?.node
                    ? 'bg-primary text-white rounded-borders'
                    : ''
                "
              >
                <q-item>
                  <q-item-section thumbnail>
                    <q-icon
                      :name="prop?.node?.icon"
                      :color="
                        note == prop?.node && $q.dark.isActive
                          ? 'grey-2'
                          : note != prop?.node && !$q.dark.isActive
                          ? 'grey-8'
                          : 'grey-2'
                      "
                    />
                  </q-item-section>

                  <q-item-section
                    @click="addNoteToEditor(prop.node)"
                    class="q-py-xs"
                  >
                    <q-item-label class="text-overline">
                      {{ prop.node.title || "Sem título" }}
                    </q-item-label>
                    <q-item-label class="text-caption">
                      {{ prop.node.description }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section thumbnail>
                    <q-btn
                      icon="more_horiz"
                      dense
                      flat
                      round
                      :color="
                        prop?.key == note?.id && $q.dark.isActive
                          ? 'grey-4'
                          : prop?.key == note?.id && !$q.dark.isActive
                          ? 'grey-4'
                          : $q.dark.isActive
                          ? 'grey-4'
                          : 'grey-8'
                      "
                    >
                      <q-menu auto-close :offset="[0, 0]">
                        <q-list class="text-weight-medium" dense>
                          <q-item clickable @click="onDeleteNote(prop.node)">
                            <q-item-section class="text-red-4">
                              Excluir Nota
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-tree>
        </q-scroll-area>
      </template>

      <template #after>
        <q-page v-if="note">
          <div class="q-pa-md">
            <q-item dense class="no-padding">
              <q-item-section class="text-caption">
                <q-badge color="transparent" class="q-gutter-x-xs no-padding">
                  <template #default>
                    <q-icon name="mdi-calendar" />
                    <q-item-label>
                      Atualizado em:
                      {{
                        date.formatDate(
                          note.updated,
                          "dddd, DD MMMM YYYY HH:mm"
                        )
                      }}
                    </q-item-label>
                  </template>
                </q-badge>
              </q-item-section>
            </q-item>

            <q-input
              :debounce="1000"
              v-model="note.title"
              input-class="text-h4"
              borderless
              placeholder="Sem Título"
              @update:model-value="
                (title) => {
                  note.title = title.trim();
                  note.updated = date.formatDate(
                    Date.now(),
                    'YYYY/MM/DD HH:mm'
                  );
                }
              "
            />
            <q-input
              :debounce="1000"
              v-model="note.description"
              input-class="text-h6"
              placeholder="Sem Descrição"
              borderless
              @update:model-value="
                (description) => {
                  note.description = description.trim();
                  note.updated = date.formatDate(
                    Date.now(),
                    'YYYY/MM/DD HH:mm'
                  );
                }
              "
            />
          </div>

          <q-separator />

          <q-scroll-area style="height: calc(100vh - 229px)">
            <q-editor
              flat
              square
              v-model="note.content"
              placeholder="Comece por aqui"
              content-class="q-py-xl q-px-lg"
              :toolbar-bg="$q.dark.isActive ? 'dark' : 'white'"
              :content-style="{ maxHeight: '100%' }"
              @update:model-value="
                () =>
                  (note.updated = date.formatDate(
                    Date.now(),
                    'YYYY/MM/DD HH:mm'
                  ))
              "
            >
            </q-editor>
          </q-scroll-area>
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>

<style lang="scss">
.q-editor {
  position: relative;
}
.q-editor__toolbar {
  position: fixed;
  width: 100%;
  // background-color: $dark;
}
</style>
