<script>
import { uid, useQuasar } from "quasar";
import Notebook from "src/stores/models/Notebook";
import { useNotebookStore } from "src/stores/notebook-store";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const store = useNotebookStore();
    const leftDrawerOpen = ref(true);
    const $q = useQuasar();
    const $router = useRouter();

    function onCreateNotebook() {
      $q.dialog({
        message: "Novo Caderno",
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
      }).onOk((name) => {
        const notebook = new Notebook({
          data: {
            name: name,
          },
        });
        store.insert(notebook);
        $router.push({
          name: "Notebook",
          params: { id: notebook.id, subject_id: uid() },
        });
      });
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      onCreateNotebook,
    };
  },
});
</script>
<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-weight-medium"> NOTES </q-toolbar-title>

        <q-btn
          :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
          dense
          round
          flat
          @click="$q.dark.toggle()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="desktop" mini bordered>
      <q-list class="text-center">
        <q-tabs vertical active-color="primary" indicator-color="transparent">
          <!-- <q-btn icon="person" round size="lg" /> -->
          <q-btn
            icon="fa fa-add"
            color="primary"
            class="q-my-md"
            round
            @click="onCreateNotebook"
          />
          <q-separator />
          <q-route-tab icon="mdi-home" to="/" exact active-class="primary">
            <q-tooltip
              anchor="center right"
              transition-hide="fade"
              transition-show="fade"
            >
              Início
            </q-tooltip>
          </q-route-tab>
          <q-route-tab
            icon="mdi-notebook"
            :to="{ name: 'Notebooks' }"
            exact
            active-class="primary"
          >
            <q-tooltip
              anchor="center right"
              transition-hide="fade"
              transition-show="fade"
            >
              Cadernos
            </q-tooltip>
          </q-route-tab>
        </q-tabs>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
