<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const Chart = defineAsyncComponent(() => import("../components/HistoChart.vue"));
import Footer from "../components/Footer.vue";
import { ref } from "vue";

let dataset = ref([]);
class graph_data {
  label: string;
  data: number[];

  constructor() {
    this.label = "";
    this.data = [];
  }
}

const max_width = window.innerWidth < 1920 ? window.innerWidth - 15 : 1200; // On détermine la taille maximum du tableau des résultats

// On récupère le dataset
fetch("/historique.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
    }
    return response.text();
  })
  .then((content) => {
    const jsonData = JSON.parse(content);

    dataset.value = jsonData.map(function (d: any) {
      var item = new graph_data(); // note the "new" keyword here
      item.label = d.name;
      item.data = d.data;
      return item;
    });
  })
  .catch((error) => {
    console.error("Erreur:", error.message);
  });
</script>

<template>
  <div v-if="dataset.length > 0">
    <Chart v-bind="{ values: dataset, width: max_width, height: 500 }" />
    <Footer />
  </div>
</template>

<style scoped>
.Historique {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 50px;
}
</style>
