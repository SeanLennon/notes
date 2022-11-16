import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { createORM } from "pinia-orm";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  pinia.use(piniaPluginPersistedstate);
  // pinia.use(createORM());

  return pinia;
});
