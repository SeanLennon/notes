const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },

      {
        name: "Notebook",
        path: "/notebook/:id/subject/:subject_id?/:note_id?",
        component: () => import("pages/NotebookPage.vue"),
        props: true,
      },

      {
        name: "Notebooks",
        path: "/notebooks",
        component: () => import("pages/NotebooksPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
