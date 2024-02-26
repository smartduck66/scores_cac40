<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const Chart = defineAsyncComponent(() => import("../components/PageWeightChart.vue"));
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const props = defineProps(["results_table"]);

const max_width = window.innerWidth < 1920 ? window.innerWidth - 15 : 1200; // On détermine la taille maximum du tableau des résultats

class weighs_mix {
  value: number;
  name: string;

  constructor() {
    this.value = 0;
    this.name = "";
  }
}

const open = ref(false); //gestion de la fenêtre modale
const URL = ref();
const FCP = ref();
const FCP_color = ref();
const SI = ref();
const SI_color = ref();
const LCP = ref();
const LCP_color = ref();
const TBT = ref();
const TBT_color = ref();
const CLS = ref();
const CLS_color = ref();
const TTI = ref();
const TTI_color = ref();
const FID = ref();
const FID_color = ref();
const TTFB = ref();
const TTFB_color = ref();
const page_weight = ref();
const weights: Ref<weighs_mix[] | undefined> = ref(undefined);

function couleur_indicateur_lighthouse(KPI: number, seuil1: number, seuil2: number): string {
  // Détermination de la criticité d'une valeur en fonction de seuils passés en paramètres
  let calculated_color = "";
  if (KPI <= seuil1) {
    calculated_color = "#00FF00"; // vert
  }
  if (KPI > seuil1 && KPI <= seuil2) {
    calculated_color = "#FFA500"; // orange
  }
  if (KPI > seuil2) {
    calculated_color = "#FF0000"; // rouge
  }
  return calculated_color;
}

const onRowSelect_WebSite = async (event: any) => {
  open.value = true; // Affichage de la modale
  URL.value = event.data.cac40;
  FCP.value = event.data.FCP;
  FCP_color.value = couleur_indicateur_lighthouse(FCP.value, 1.8, 3);
  SI.value = event.data.SI;
  SI_color.value = couleur_indicateur_lighthouse(SI.value, 3.4, 5.8);
  LCP.value = event.data.LCP;
  LCP_color.value = couleur_indicateur_lighthouse(LCP.value, 2.5, 4);
  TBT.value = event.data.TBT;
  TBT_color.value = couleur_indicateur_lighthouse(TBT.value, 200, 600);
  CLS.value = event.data.CLS;
  CLS_color.value = couleur_indicateur_lighthouse(CLS.value, 0.1, 0.25);
  TTI.value = event.data.TTI;
  TTI_color.value = couleur_indicateur_lighthouse(TTI.value, 3.8, 7.3);
  FID.value = event.data.FID;
  FID_color.value = couleur_indicateur_lighthouse(FID.value, 130, 250);
  TTFB.value = event.data.TTFB;
  TTFB_color.value = couleur_indicateur_lighthouse(TTFB.value, 800, 1800);
  page_weight.value = event.data.total_weight;
  weights.value = [
    { value: event.data.media_weight, name: "media" },
    { value: event.data.image_weight, name: "image" },
    { value: event.data.script_weight, name: "script" },
    { value: event.data.font_weight, name: "font" },
    { value: event.data.other_weight, name: "other" },
    { value: event.data.stylesheet_weight, name: "style" },
    { value: event.data.document_weight, name: "document" },
    { value: event.data.thirdParty_weight, name: "3rd party" },
  ];
};
</script>

<template>
  <div v-if="props.results_table.length > 0">
    <Card :style="{ 'max-width': max_width + 'px' }">
      <template #title>
        <span class="sous-titre1">Lighthouse v{{ props.results_table[0].lh_version }} - Détails en cliquant sur une ligne</span>
      </template>
      <template #content>
        <DataTable
          :value="props.results_table"
          scrollable
          stripedRows
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          size="large"
          :tableStyle="{ 'min-width': '70rem'}"
          selectionMode="single"
          :metaKeySelection="false"
          dataKey="id"
          @rowSelect="onRowSelect_WebSite"
        >
          <Column field="url" header="URL testée" style="padding-top: 0.5em; padding-bottom: 0.5em; padding-left: 0.5em"></Column>
          <Column header="Rang" style="text-align: right; padding-left: 2em; padding-right: 2em">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column
            field="lh_total"
            sortable
            header="Note Globale"
            style="color: black; background-color: #eef9f1; text-align: center; padding-left: 0.5em; padding-right: 1em; font-weight: 600"
          ></Column>
          <Column field="lh_perf" sortable header="Performance" style="text-align: right; padding-left: 0.5em; padding-right: 1em"></Column>
          <Column field="lh_accessibility" sortable header="Accessibilité" style="text-align: right; padding-left: 0.5em; padding-right: 1em"></Column>
          <Column field="lh_bestpractices" sortable header="Bonnes pratiques" style="text-align: right; padding-left: 0em; padding-right: 1em"></Column>
          <Column field="lh_seo" sortable header="SEO" style="text-align: right; padding-left: 2em; padding-right: 1em"></Column>
          <Column field="total_weight" sortable header="Poids (ko)" style="text-align: right; padding-left: 1em; padding-right: 1em"></Column>
          <Column field="carbon_footprint" header="Empreinte CO2" style="text-align: center; padding-left: 1em; padding-right: 1em"></Column>
        </DataTable>
      </template>
    </Card>
  </div>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="../assets/img/close.png" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        <div class="sous-titre2">{{ URL }} : KPIs & mix poids page ({{ store.milliers_2.format(page_weight) }} ko)</div>
        <div class="my_grid">
          <div class="c-item-1">
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint" aria-label="FCP">FCP</a>
              <span> (First Contentful Paint) : </span>
            </div>
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/speed-index" aria-label="SI">SI</a>
              <span> (Speed Index) : </span>
            </div>
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint" aria-label="LCP">LCP</a>
              <span> (Largest Contentful Paint) : </span>
            </div>
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time" aria-label="TBT">TBT</a>
              <span> (Total Blocking Time) : </span>
            </div>
            <div>
              <a target="_blank" href="https://web.dev/articles/cls" aria-label="CLS">CLS</a>
              <span> (Cumulative Layout Shift) : </span>
            </div>
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/interactive" aria-label="TTI">TTI</a>
              <span> (Time To Interactive) : </span>
            </div>
            <div>
              <a target="_blank" href="https://developer.chrome.com/docs/lighthouse/performance/lighthouse-max-potential-fid" aria-label="FID">Max FID</a>
              <span> (First Input Delay) : </span>
            </div>
            <div>
              <a target="_blank" href="https://web.dev/articles/ttfb" aria-label="TTFB">TTFB</a>
              <span> (Time To First Byte) : </span>
            </div>
          </div>
          <div class="c-item-2">
            <div>{{ store.milliers_2.format(FCP) + " s" }}</div>
            <div>{{ store.milliers_2.format(SI) + " s" }}</div>
            <div>{{ store.milliers_2.format(LCP) + " s" }}</div>
            <div>{{ store.milliers_2.format(TBT) + " ms" }}</div>
            <div>{{ store.milliers_2.format(CLS) }}</div>
            <div>{{ store.milliers_2.format(TTI) + " s" }}</div>
            <div>{{ store.milliers_2.format(FID) + " ms" }}</div>
            <div>{{ store.milliers_2.format(TTFB) + " ms" }}</div>
          </div>
          <div class="c-item-3">
            <div :style="{ 'background-color': FCP_color, color: FCP_color }">FCP</div>
            <div :style="{ 'background-color': SI_color, color: SI_color }">SI</div>
            <div :style="{ 'background-color': LCP_color, color: LCP_color }">LCP</div>
            <div :style="{ 'background-color': TBT_color, color: TBT_color }">TBT</div>
            <div :style="{ 'background-color': CLS_color, color: CLS_color }">CLS</div>
            <div :style="{ 'background-color': TTI_color, color: TTI_color }">TTI</div>
            <div :style="{ 'background-color': FID_color, color: FID_color }">FID</div>
            <div :style="{ 'background-color': TTFB_color, color: TTFB_color }">TTFB</div>
          </div>
        </div>
        <Chart v-bind="{ values: weights }" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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

.modal {
  position: fixed;
  z-index: 999;
  top: 7%;
  left: 41.5%;
  margin-left: -150px;
  width: 360px;
  height: 570px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: white;
  border: 4px solid;
}

.FlexWrapper_modal {
  width: 320px;
  height: 510px;
  flex-grow: 0;
  display: flex;
  margin-left: 15px;
  margin-top: -5px;
  flex-direction: column;
  justify-content: flex-start;
  color: black;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
}
img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 3px 0px 0px 310px;
  object-fit: contain;
}
.my_grid {
  display: grid;
  margin-bottom: 10px;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  width: 200px;
  justify-content: left;
}
.c-item-2 {
  grid-column: 2;
  width: 70px;
  text-align: right;
}
.c-item-3 {
  grid-column: 3;
  width: auto;
  text-align: right;
}
</style>
