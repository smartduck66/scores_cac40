// State Management avec Pinia (futur vuex5)
import { defineStore } from "pinia";

// Responsive
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);

export const useStore = defineStore("storeId", {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // Formatage valeurs
      euros_0: Intl.NumberFormat("fr", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
      euros_2: Intl.NumberFormat("fr", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }),
      milliers_0: Intl.NumberFormat("fr", {
        style: "decimal",
        maximumFractionDigits: 0,
      }),
      milliers_2: Intl.NumberFormat("fr", {
        style: "decimal",
        maximumFractionDigits: 2,
      }),
      pourcent_2: Intl.NumberFormat("fr", {
        style: "percent",
        maximumFractionDigits: 2,
      }),

      // Définition des breakpoints responsive
      // 'sm': 640, 'md': 768, 'lg': 1024,'xl': 1280, '2xl': 1536,
      sm: breakpoints.smaller("sm"),
      md: breakpoints.between("sm", "md"),
      lg: breakpoints.between("md", "lg"),
      xl: breakpoints.between("lg", "xl"),
      xxl: breakpoints.between("xl", "2xl"),
      xxxl: breakpoints["2xl"],
      Liste_dates_mesure: null,
    };
  },

  actions: {
    async fetchData() {
      // Initialisation de la liste des mesures, en provenance du fichier mesures.json créé par le batch perf.cjs
      // Cette action est appelée de main.ts : impossible de le faire directement dans store.js
      class dates_historique {
        date;
        file;

        constructor() {
          this.date = "";
          this.file = "";
        }
      }
      try {
        const response = await fetch("/mesures.json");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const results = await response.json();

        this.Liste_dates_mesure = results.map(function (d) {
          let item = new dates_historique(); // note the "new" keyword here
          const timestamp = d.substring(0, d.indexOf(".json"));
          item.date = new Date(Number(timestamp)).toLocaleDateString("fr-FR");
          item.file = d;
          return item;
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error.message);
      }
    },
  },
});
