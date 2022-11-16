import { defineStore } from "pinia";
import { Notify } from "quasar";
import Notebook from "./models/Notebook";

export const useNotebookStore = defineStore("notebook-store", {
  state: () => ({
    notebooks: [],
    trash: [],
  }),
  getters: {
    list: (state) => state.notebooks,
    one: (state) => (id) =>
      state.notebooks.find((notebook) => notebook.id == id),

    subjects: (state) =>
      state.notebooks.reduce(
        (list, notebook) => list.concat(notebook.subjects),
        []
      ),
  },
  actions: {
    insert(notebook) {
      this.notebooks.unshift(notebook);
    },
    remove(notebook) {
      try {
        this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
        Notify.create({
          position: "bottom-right",
          message: "Caderno excluído com sucesso!",
          color: "primary",
          timeout: 2000,
          type: "positive",
        });
      } catch (error) {
        Notify.create({
          position: "top-right",
          message: error,
          color: "red-4",
          timeout: 2000,
          type: "negative",
        });
      }
    },
  },

  persist: true,
});
