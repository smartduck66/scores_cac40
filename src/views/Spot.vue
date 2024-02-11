<script setup lang="ts">
import Footer from "../components/Footer.vue";
import Card_LH from "../components/Lighthouse_spot.vue";
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

let liste_fichiers_spot: Ref<string[]> = ref([]);

const max_width = window.innerWidth - 15; // On détermine la taille maximum de l'affichage des cards

// On récupère le dataset
fetch("/spot.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
    }
    return response.text();
  })
  .then((content) => {
    const jsonData = JSON.parse(content);

    liste_fichiers_spot.value = jsonData;
  })
  .catch((error) => {
    console.error("Erreur:", error.message);
  });
</script>

<template>
  <div v-if="liste_fichiers_spot.length > 0">
    <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }" :style="{ width: max_width }">
      <div v-for="item in liste_fichiers_spot">
        <Card_LH v-bind="{ filename: item }" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.FlexWrapper {
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 30px;
  margin-top:30px;
  margin-bottom: 20px;
}

.FlexWrapperMobile {
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
