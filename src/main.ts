import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useStore } from "./assets/mixins/store.js";

// Composants graphiques : migration vers PrimeVue 4.0 le 9 juillet 2024
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
//import "primeicons/primeicons.css"; // Remplacé en insérant directement les fichiers C:\Users\andre\source\_web\pharaon\node_modules\primeicons\raw-svg dans \src\assets\svg

const main = async () => {
  const app = createApp(App);
  app.use(router).use(PrimeVue, {
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: "system",
        cssLayer: false,
      },
    },
  });
  // Initialiser Pinia, ajouter le magasin à l'application et initialiser le magasin
  const pinia = createPinia();
  app.use(pinia);
  const store = useStore();
  await store.fetchData(); // await est ici nécessaire pour attendre la récupération de 'Liste_dates_mesure' issue d'un fetch -> D'où l'encapsulation asynchrone du main

  app.mount("#app");
};

main();
