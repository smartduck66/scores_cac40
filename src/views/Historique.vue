<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const Chart = defineAsyncComponent(() => import("../components/HistoChart.vue"));
import Footer from "../components/Footer.vue";
import { ref } from "vue";

let dataset = ref([]);
class graph_data {
  label: string;
  data: number[];
  moy: number;

  constructor() {
    this.label = "";
    this.data = [];
    this.moy = 0;
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
      let item = new graph_data(); // note the "new" keyword here
      item.label = d.name;
      item.data = d.data;
      item.moy = Math.round((d.data.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) / d.data.length) * 100) / 100;
      return item;
    });
    dataset.value.sort((a: graph_data, b: graph_data) => {
      return b.moy - a.moy;
    });
  })
  .catch((error) => {
    console.error("Erreur:", error.message);
  });
</script>

<template>
  <div v-if="dataset.length > 0">
    <Chart v-bind="{ values: dataset, width: max_width, height: 680 }" />
    <br>
    <Card :style="{ width: '360px' }">
      <template #title>
        <span class="sous-titre1">Moyennes des performances globales</span>
      </template>
      <template #content>
        <DataTable :value="dataset" scrollable stripedRows size="large" class="row" dataKey="id">
          <Column field="label" header="Valeur" style="padding-top: 0.5em; padding-bottom: 0.5em; padding-left: 0.5em"></Column>
          <Column header="Rang" style="text-align: right; padding-left: 2em; padding-right: 2em">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="moy" sortable header="Moy." style="text-align: right; padding-left: 0.5em; padding-right: 1em"></Column>
        </DataTable>
      </template>
    </Card>
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

.sous-titre1 {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: italic;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  padding-left: 0.5em;
  color: black;
}

.sous-titre2 {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: italic;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: grey;
  margin-bottom: 10px;
}

.row {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: black;
}
</style>
