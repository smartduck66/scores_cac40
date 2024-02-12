<script setup lang="ts">
import Footer from "../components/Footer.vue";


</script>

<template>
  <div class="text">
    <h1> A propos</h1>
    <br /><br /><br />
    Auditer, améliorer et monitorer le plus régulièrement et automatiquement possible son site web constituent la clé d'un bon référencement par les moteurs de recherche. 
    <br /><br />
    De fait, un site lent, ne respectant pas les standards d'accessibilité ou les bonnes pratiques de développement aura peu de chances de figurer dans les 10 premiers sites affichés lors d'une recherche sur Google. 
    <br /><br />
    Rassurez-vous : une bonne (éco-) conception et un peu de bons sens (pas d'images qui pèsent 5 mo...) vous permettront assez facilement d'obtenir des scores corrects.
    <br /><br />
    Google a mis à disposition des développeurs, depuis plusieurs années, différents outils qui vous aideront à mieux analyser la performance de votre site web.
    <br /><br /> 
    Par exemple, <i>Lighthouse</i> est fourni dans le navigateur Chrome (> Plus d'outils > Outils de développement > Lighthouse), vous permettant de lancer un test "à la volée" sur la page affichée.
    <br /><br />
    Mais, il est assez fastidieux de lancer manuellement ces tests sur plus d'une page, quand vous souhaitez effectuer des comparaisons. Et je suis tombé par hasard, en 2023, sur les travaux de Zach Leatherman.
    <br /><br />
    Le créateur du framework Eleventy avait en effet publié un projet personnel nommé 'speedlify' qui se proposait d'automatiser les appels à l'API Google Lighthouse, via un module NPM dédié nommé 'performance leaderboard'.
    <br /><br />
    Après l'avoir utilisé quelques mois pour mesurer les performances <b>des sites institutionnels</b> de l'emblématique indice CAC40, j'ai souhaité le réécrire en appelant directement l'API en question.
    <br /><br />
    J'ai donc bâti une application en Vue.js, mon framework Javascript de prédilection. Et voici, WebCheck'CAC40 !
    <br /><br />
    Un tableau collationne les 4 métriques principales issues de <i>Lighthouse</i> (performance, accessibilité, Bonnes pratiques, SEO) ainsi que la répartition du poids des pages auditées.
    <br /><br />
    Un clic sur l'une des lignes du tableau vous permet de récupérer des indicateurs encore plus fins, comme le FCP, le SI, le LCP, le TBT ou encore le CLS.
    <br /><br />
    En sus, un affichage de l'empreinte carbone de la page est proposée, via Website Carbon Calculator, en fonction de la disponibilité de l'API.
    <br /><br />
    Cet outil évoluant régulièrement, vous pouvez avantageusement consulter le <i>changelog</i> pour suivre les nouveautés.
    <br /><br />
    Retrouvez davantage d'informations sur la génèse de cet outil en lisant ce billet de
    <a target="_blank" href="https://www.andretonic.fr/posts/webcheckcac40.html" aria-label="la genèse"
      >mon blog personnel.</a
    >
  </div>
  <Footer />
</template>

<style scoped>
a {
  outline: none;
  color: #42b983;
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
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 20px;
}
</style>
