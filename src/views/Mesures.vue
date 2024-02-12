<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const LastPerfDisplay = defineAsyncComponent(() => import("./LastPerf.vue"));
import Footer from "../components/Footer.vue";
import { performance } from "../assets/mixins/types";
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

let mesures: Ref<performance[]> = ref([]);
const selectedDate = ref();

function menu_choix_date_historique() {
  Result_table_build(selectedDate.value.file); // On reconstruit la table des résultats
}

async function Result_table_build(filename: string) {
  class table_row implements performance {
    url: string;
    cac40: string;
    lh_version: string;
    lh_perf: number;
    lh_accessibility: number;
    lh_bestpractices: number;
    lh_seo: number;
    lh_total: number;
    FCP: number;
    SI: number;
    LCP: number;
    TBT: number;
    CLS: number;
    TTI: number;
    FID: number;
    TTFB: number;
    total_weight: number;
    image_weight: number;
    script_weight: number;
    document_weight: number;
    font_weight: number;
    stylesheet_weight: number;
    thirdParty_weight: number;
    carbon_footprint: string;

    constructor() {
      this.url = "";
      this.cac40 = "";
      this.lh_version = "";
      this.lh_perf = 0;
      this.lh_accessibility = 0;
      this.lh_bestpractices = 0;
      this.lh_seo = 0;
      this.lh_total = 0;
      this.FCP = 0;
      this.SI = 0;
      this.LCP = 0;
      this.TBT = 0;
      this.CLS = 0;
      this.TTI = 0;
      this.FID = 0;
      this.TTFB = 0;
      this.total_weight = 0;
      this.image_weight = 0;
      this.script_weight = 0;
      this.document_weight = 0;
      this.font_weight = 0;
      this.stylesheet_weight = 0;
      this.thirdParty_weight = 0;
      this.carbon_footprint = "";
    }
  }

  // On récupère les mesures à afficher
  fetch("/data/" + filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
      }
      return response.text();
    })
    .then((content) => {
      const jsonData = JSON.parse(content);
      jsonData.sort((a: table_row, b: table_row) => {
        return b.lh_total - a.lh_total;
      });

      mesures.value = jsonData.map(function (d: any) {
        var item = new table_row(); // note the "new" keyword here

        item.url = d.url;
        item.cac40 = d.cac40;
        item.lh_version = d.lh_version;
        item.lh_perf = d.lh_perf;
        item.lh_accessibility = d.lh_accessibility;
        item.lh_bestpractices = d.lh_bestpractices;
        item.lh_seo = d.lh_seo;
        item.lh_total = d.lh_total;
        item.FCP = d.FCP; // en secondes
        item.SI = d.SI; // en secondes
        item.LCP = d.LCP; // en secondes
        item.TBT = d.TBT; // en millisecondes
        item.CLS = d.CLS;
        item.TTI = d.TTI; // en secondes
        item.FID = d.FID; // en millisecondes
        item.TTFB = d.TTFB; // en millisecondes
        item.total_weight = d.total_weight; // en Ko
        item.image_weight = d.image_weight; // en Ko
        item.script_weight = d.script_weight; // en Ko
        item.document_weight = d.document_weight; // en Ko
        item.font_weight = d.font_weight; // en Ko
        item.stylesheet_weight = d.stylesheet_weight; // en Ko
        item.thirdParty_weight = d.thirdParty_weight; // en Ko
        item.carbon_footprint = d.carbon_footprint;

        return item;
      });
    })
    .catch((error) => {
      console.error("Erreur:", error.message);
    });
}

Result_table_build(store.Liste_dates_mesure[0].file); // On construit la table des résultats avec le dernier fichier de mesures (2)
</script>

<template>
  <div class="FlexWrapper_choix">
    <span class="sous-titre">Métriques du : </span>
    <Dropdown
      class="menu"
      v-model="selectedDate"
      :options="store.Liste_dates_mesure"
      optionLabel="date"
      :placeholder="store.Liste_dates_mesure[0].date"
      @update:modelValue="menu_choix_date_historique"
    />
  </div>

  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">
    <LastPerfDisplay v-bind="{ results_table: mesures }" />
  </div>
  <Footer />
</template>

<style>
.FlexWrapper {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 30px;
}

.FlexWrapperMobile {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 10px;
}

.sous-titre {
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: black;
}

.FlexWrapper_choix {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.menu {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 148px;
  border: 0px;
  color: lightgray;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.9;
  letter-spacing: normal;
  text-align: center;
  margin-left: 10px;
  padding-top: 0px;
}
</style>
