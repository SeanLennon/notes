<script setup>
import { useNotebookStore } from "src/stores/notebook-store";
import { computed } from "vue";

const store = useNotebookStore();
const trashs = computed(() => store.list);
</script>

<template>
  <q-page>
    <q-scroll-area style="height: calc(100vh - 50px)" class="hide-scrollbar">
      <pre>
        {{ trashs }}
      </pre>
    </q-scroll-area>
  </q-page>
</template>
