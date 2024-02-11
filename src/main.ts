import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useStore } from "./assets/mixins/store.js";

// Composants graphiques
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css"; // 174k mais nécessaire pour ne pas casser l'UX lors d'une mise à jour de PrimeVue
//import "./saga_blue_core_theme.css"; // 26k : https://forum.primefaces.org/viewtopic.php?t=68367

const main = async () => {
  const app = createApp(App);
  app.use(router).use(PrimeVue);
  // Initialiser Pinia, ajouter le magasin à l'application et initialiser le magasin
  const pinia = createPinia();
  app.use(pinia);
  const store = useStore();
  await store.fetchData(); // await est ici nécessaire pour attendre la récupération de 'Liste_dates_mesure' issue d'un fetch -> D'où l'encapsulation asynchrone du main

  app.mount("#app");
};

main();
