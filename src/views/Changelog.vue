<script setup lang="ts">
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="text">
    <h1>Changelog</h1>
    <br />
    <br />
    <h4>Décembre 2024</h4>
    <ul>
      <li>Moyenne annuelle de la note globale accessible dans 'Historique'</li>
    </ul>
    <br />
    <h4>Septembre 2024</h4>
    <ul>
      <li>Implémentation des composants graphiques PrimeVue v4</li>
    </ul>
    <br />
    <h4>Mars 2024</h4>
    <ul>
      <li>Passage de l'application en Open Source, licence MIT</li>
    </ul>
    <br />
    <h4>Février 2024</h4>
    <ul>
      <li>Mise en production v1.0</li>
      <li>Remplacement de Google Analytics par GoatCounter, script plus léger et suffisant pour les analyses d'audience</li>
      <li>Nouvelle fonctionnalité 'SPOT' qui permet d'obtenir les métriques moyennes calculées sur 100 pages de chaque site suivi</li>
      <li>Modification d'URL (.fr -> .com, pour le site institutionnel) : Michelin, Legrand</li>
      <li>Remplacement du module 'performance leaderboard' de Zach Leatherman par un appel direct à l'API Google Lighthouse</li>
      <li>Remplacement du module graphique Apache Echarts par le module chart.js wrappé par PrimeVue (gain en poids)</li>
      <li>Amélioration du calcul du poids d'une page transférée en retravaillant les éléments renvoyés par l'API Lighthouse (19/2) </li>
    </ul>
    <br />
    <h4>Janvier 2024</h4>
    <ul>
      <li>Initialisation du projet de refonte de speedlify CAC40 (framework 11ty), afin d'être plus autonome</li>
      <li>Choix de la technologie : Vue.js reste privilégié, même si un framework 'statique' (nuxt, astro...) aurait également pu convenir</li>
      <li>Le module NPM développé par Zack Leatherman, performance-leaderboard, est utilisé pour appeler les API Lighthouse de Google</li>
      <li>Ecriture d'un script node.js qui l'instancie, et génère un fichier JSON horodaté de mesures des sites du CAC40</li>
      <li>Autres modules externes embarqués : vue-router, pinia, vue-use, prime-vue, sharp, eCharts/vue-echarts</li>
      <li>Principales fonctions développées : le tableau central des métriques, le graphe historique, les pages 'Changelog' et 'A Propos'</li>
    </ul>
    <br />

    <br />
    <br />
  </div>
  <Footer />
</template>

<style scoped>
.text {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 70px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 20px;
}
a {
  outline: none;
  color: grey;
  text-decoration: none;
  padding: 2px 1px 0;
}
.Home {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
}
</style>
