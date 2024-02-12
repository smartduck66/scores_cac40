<script setup lang="ts">
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const props = defineProps(["filename"]);

class spot {
  sitemap_url;
  cac40;
  timestamp;
  nb_total_url;
  poids_moyen_page;
  lh_perf_moyen;
  lh_accessibility_moyen;
  lh_bestpractices_moyen;
  lh_seo_moyen;
  lh_total_moyen;

  constructor() {
    this.sitemap_url = "";
    this.cac40 = "";
    this.timestamp = 0;
    this.nb_total_url = 0;
    this.poids_moyen_page = 0;
    this.lh_perf_moyen = 0;
    this.lh_accessibility_moyen = 0;
    this.lh_bestpractices_moyen = 0;
    this.lh_seo_moyen = 0;
    this.lh_total_moyen = 0;
  }
}

function couleur_indicateur_lighthouse(KPI: number, seuil1: number, seuil2: number): string {
  // Détermination de la criticité d'une valeur en fonction de seuils passés en paramètres
  let calculated_color = "";
  if (KPI >= seuil2) {
    calculated_color = "success"; // vert
  }
  if (KPI >= seuil1 && KPI < seuil2) {
    calculated_color = "warning"; // orange
  }
  if (KPI < seuil1) {
    calculated_color = "danger"; // rouge
  }
  return calculated_color;
}

const mesures_lh: Ref<spot | undefined> = ref(undefined);
const all_green = ref(false);

// On récupère les valeurs de la carte
fetch("/spot/" + props.filename)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
    }
    return response.text();
  })
  .then((content) => {
    const jsonData = JSON.parse(content);
    mesures_lh.value = jsonData;
    if (jsonData.lh_perf_moyen >= 90 && jsonData.lh_accessibility_moyen >= 90 && jsonData.lh_bestpractices_moyen >= 90 && jsonData.lh_seo_moyen >= 90) {
      all_green.value = true;
    }
  })
  .catch((error) => {
    console.error("Erreur:", error.message);
  });
</script>

<template>
  <Card class="card" v-if="mesures_lh" :style="all_green ? { 'background-color': '#eef9f1' } : { 'background-color': 'blank' }">
    <template #header>
      <div class="my_grid">
        <div class="c-item-1">
          {{ mesures_lh.cac40 }}
        </div>
        <div class="c-item-2">
          <span class="card-content">[{{ new Date(Number(mesures_lh.timestamp)).toLocaleDateString("fr-FR") }} - {{ mesures_lh.nb_total_url }} URLs]</span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="my_grid_lh">
        <div class="c-lh-1">
          <Badge :value="mesures_lh.lh_total_moyen" size="xlarge" :severity="couleur_indicateur_lighthouse(mesures_lh.lh_total_moyen, 200, 359)"></Badge>
        </div>
        <div class="c-lh-2">
          <Badge :value="mesures_lh.lh_perf_moyen" size="large" :severity="couleur_indicateur_lighthouse(mesures_lh.lh_perf_moyen, 50, 89)"></Badge>
          <div class="KPI">Perf.</div>
        </div>
        <div class="c-lh-3">
          <Badge
            :value="mesures_lh.lh_accessibility_moyen"
            size="large"
            :severity="couleur_indicateur_lighthouse(mesures_lh.lh_accessibility_moyen, 50, 89)"
          ></Badge>
          <div class="KPI">A11ty</div>
        </div>
        <div class="c-lh-4">
          <Badge
            :value="mesures_lh.lh_bestpractices_moyen"
            size="large"
            :severity="couleur_indicateur_lighthouse(mesures_lh.lh_bestpractices_moyen, 50, 89)"
          ></Badge>
          <div class="KPI">BP</div>
        </div>
        <div class="c-lh-5">
          <Badge :value="mesures_lh.lh_seo_moyen" size="large" :severity="couleur_indicateur_lighthouse(mesures_lh.lh_seo_moyen, 50, 89)"></Badge>
          <div class="KPI">SEO</div>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="card-footer">Poids moyen d'une page : {{ store.milliers_2.format(mesures_lh.poids_moyen_page / 1024) }} Mo</span>
    </template>
  </Card>
</template>

<style scoped>
.card {
  width: 340px;
  height: auto;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 10px;
  padding-left: 10px;
}

.card-content {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: grey;
  margin-left: -15px;
  margin-top: -20px;
}

.KPI {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: grey;
  margin-top: -14px;
}
.card-footer {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: black;

}
.my_grid {
  display: grid;
  grid-template-columns: 180px auto;
  grid-template-rows: 40px;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: left;
}
.c-item-2 {
  grid-column: 2;
  justify-content: right;
  padding-right: 10px;
  padding-top: 22px;
}
.my_grid_lh {
  display: grid;
  grid-template-columns: 60px, repeat(4, 50px);
  grid-template-rows: 70px;
  grid-gap: 5px;
  margin-left: -5px;
  margin-bottom:20px;
}

[class^="c-lh"] {
  display: inline-grid;
  justify-content: center;
}

.c-lh-1 {
  grid-column: 1;
}
.c-lh-2 {
  grid-column: 2;
}
.c-lh-3 {
  grid-column: 3;
}
.c-lh-4 {
  grid-column: 4;
}
.c-lh-5 {
  grid-column: 5;
}
</style>
