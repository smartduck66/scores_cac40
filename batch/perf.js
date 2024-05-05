// Calcul des indicateurs Lighthouse sur les pages d'accueil des sites du CAC40
// A faire 'tourner' hebdomadairement
// ***********************************************************************************************

import { lighthouseAPI_call } from "./lh.js";
import * as fs1 from "fs";

function extractDomainWithoutExtension(url) {
  // Supprimer le protocole s'il est présent
  url = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Extraire le nom de domaine
  let domain = url.split("/")[0];

  // Supprimer l'extension du nom de domaine
  domain = domain.replace(/\.[^.]+$/, "");

  return domain;
}

async function fetchCO2(url) {
  return new Promise((resolve) => {
    // Exemple : https://api.websitecarbon.com/site?url=https%3A%2F%2Fwww.wholegraindigital.com%2F
    const appelAPI = "https://api.websitecarbon.com/site?url=" + encodeURIComponent(url);
    fetch(appelAPI)
      .then((response) => {
        if (!response.ok) {
          //throw new Error(`Erreur d'accès à l'API WebSiteCarbon : ${response.statusText}`);
          resolve("---"); // Si l'API n'est pas accessible, on affichera 3 tirets
        }
        return response.text();
      })
      .then((content) => {
        const jsonData = JSON.parse(content);
        const co2 = jsonData.rating + " (" + jsonData.statistics.co2.grid.grams.toFixed(2).toString() + "g)";
        resolve(co2);
      })
      .catch((error) => {
        console.error("Erreur de récupération du json issu de WebCarbonSite :", error.message);
      });
  });
}

(async function () {
  const directoryDataPublicPath = "../public/data/";
  const filename = Date.now().toString() + ".json";
  var startTime = performance.now();

  // A checker sur https://www.boursier.com/indices/composition/cac-40-FR0003500008,FR.html
  // Sa composition est révisée tous les trimestres à la clôture du 3ème vendredi des mois de mars, juin, septembre et décembre.
  // Sur les 40 valeurs officielles, seule Hermes (https://www.hermes.com/fr/fr) ne se laisse pas crawler à cause d'une sécurité
  let urls = [
    "https://www.airliquide.com/fr",
    "https://www.airbus.com",
    "https://www.alstom.com/fr",
    "https://france.arcelormittal.com",
    "https://www.axa.com/fr/",
    "https://group.bnpparibas.com",
    "https://www.bouygues.com",
    "https://www.capgemini.com/fr-fr/",
    "https://www.carrefour.com/fr",
    "https://www.credit-agricole.com",
    "https://www.danone.com/fr.html",
    "https://www.3ds.com/fr/",
    "https://www.edenred.com/fr",
    "https://www.engie.com",
    "https://www.essilorluxottica.com/fr",
    "https://www.eurofins.com/",
    "https://www.kering.com/fr/",
    "https://www.legrandgroup.com/fr",
    "https://www.loreal.com/fr/",
    "https://www.lvmh.fr",
    "https://www.michelin.com",
    "https://www.orange.com/fr",
    "https://www.pernod-ricard.com/fr",
    "https://www.publicisgroupe.com/fr",
    "https://www.renaultgroup.com",
    "https://www.safran-group.com/fr",
    "https://www.saint-gobain.com/fr",
    "https://www.sanofi.fr/fr/",
    "https://www.se.com/fr/fr/",
    "https://www.societegenerale.com/fr",
    "https://www.stellantis.com/fr",
    "https://www.st.com/content/st_com/en.html",
    "https://www.teleperformance.com/fr-fr/",
    "https://www.thalesgroup.com/fr",
    "https://totalenergies.com/fr",
    "https://www.urw.com/fr-FR",
    "https://www.veolia.com/fr",
    "https://www.vinci.com",
    "https://www.vivendi.com/",
  ];

  // ******************************************************************************************************************************************************************************
  // Step #1 : création du fichier avec les SEULES données formatées affichées par le navigateur web (Répertoire ../public/data)
  class table_row {
    url;
    cac40;
    lh_version;
    lh_perf;
    lh_accessibility;
    lh_bestpractices;
    lh_seo;
    lh_total;
    FCP;
    SI;
    LCP;
    TBT;
    CLS;
    TTI;
    FID;
    TTFB;
    total_weight;
    media_weight;
    image_weight;
    script_weight;
    font_weight;
    other_weight;
    stylesheet_weight;
    document_weight;
    thirdParty_weight;
    carbon_footprint;

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
      this.media_weight = 0;
      this.image_weight = 0;
      this.script_weight = 0;
      this.font_weight = 0;
      this.other_weight = 0;
      this.stylesheet_weight = 0;
      this.document_weight = 0;
      this.thirdParty_weight = 0;
      this.carbon_footprint = "";
    }
  }

  const jsonData = await lighthouseAPI_call(urls);
  let valeur_cac40 = [];

  console.log("Appel de l'API WebsiteCarbon pour chaque valeur du CAC40...");
  const mesures = await Promise.all(
    // Le Promise.all est nécessaire pour 'attendre' les 'await'
    jsonData.map(async (d) => {
      // Le async est nécessaire dès qu'un await est présent dans le map
      let item = new table_row(); // note the "new" keyword here
      // On ne vérifie pas 'd.error', comme cela est fait dans spot.mjs car on estime que les pages d'accueil des sites du CAC40 sont toujours crawlables par LH
      item.url = d.url;
      item.cac40 = extractDomainWithoutExtension(d.url);
      valeur_cac40.push(item.cac40); // Pour le fichier historique.json
      item.lh_version = d.lh_version;
      item.lh_perf = Math.round(d.lh_perf * 100);
      item.lh_accessibility = Math.round(d.lh_accessibility * 100);
      item.lh_bestpractices = Math.round(d.lh_bestpractices * 100);
      item.lh_seo = Math.round(d.lh_seo * 100);
      item.lh_total = item.lh_perf + item.lh_accessibility + item.lh_bestpractices + item.lh_seo;
      item.FCP = d.FCP / 1000; // en secondes
      item.SI = d.SI / 1000; // en secondes
      item.LCP = d.LCP / 1000; // en secondes
      item.TBT = d.TBT; // en millisecondes
      item.CLS = d.CLS;
      item.TTI = d.TTI / 1000; // en secondes
      item.FID = d.FID; // en millisecondes
      item.TTFB = d.TTFB; // en millisecondes
      item.total_weight = Math.round(d.total_weight / 1024); // en Ko
      item.media_weight = Math.round(d.media_weight / 1024); // en Ko
      item.image_weight = Math.round(d.image_weight / 1024); // en Ko
      item.script_weight = Math.round(d.script_weight / 1024); // en Ko
      item.font_weight = Math.round(d.font_weight / 1024); // en Ko
      item.other_weight = Math.round(d.other_weight / 1024); // en Ko
      item.stylesheet_weight = Math.round(d.stylesheet_weight / 1024); // en Ko
      item.document_weight = Math.round(d.document_weight / 1024); // en Ko
      item.thirdParty_weight = Math.round(d.thirdParty_weight / 1024); // en Ko
      item.carbon_footprint = await fetchCO2(d.url);

      return item;
    })
  );
  fs1.writeFileSync(directoryDataPublicPath + filename, JSON.stringify(mesures, null, 2)); // Création du json final sur disque

  // ******************************************************************************************************************************************************************************
  // Step #2 : construction du fichier mesures.json contenant l'ensemble des fichiers du répertoire, qui sera lu à partir du browser

  // Lecture des fichiers dans le répertoire
  fs1.readdir(directoryDataPublicPath, (err, files) => {
    if (err) {
      console.error("Erreur de lecture du répertoire", err);
      return;
    }

    // Création du json final dans le répertoire \public, les noms de fichiers étant triés en ordre chronologique descendant
    fs1.writeFileSync(
      "../public/mesures.json",
      JSON.stringify(
        files.sort((a, b) => b.localeCompare(a)),
        null,
        2
      )
    );

    // ******************************************************************************************************************************************************************************
    // Step #3 : construction du dataset historique 'historique.json' (inclus dans le fs1.readdir pour éviter des problèmes de synchronisation...)
    class graph_data {
      name;
      type;
      data;

      constructor() {
        this.name = "";
        this.type = "";
        this.data = [];
      }
    }

    const ListFiles_to_read_chronologicalOrder = JSON.parse(fs1.readFileSync("../public/mesures.json", "utf8")).reverse(); // Car le fichier mesures.json est destiné à l'affichage... par ordre chronologique inverse
    let dataset = [];

    for (let url of urls) {
      let item = new graph_data(); // note the "new" keyword here
      item.name = extractDomainWithoutExtension(url); // 'nom' de la société du CAC40 (ex : axa, bouygues, michelin...)
      item.type = "line";

      // On ouvre chaque fichier de mesures pour récupérer la valeur lh_total rattachée à chaque valeur du CAC40 afin de construire une array du type [400, 395, 380]
      let lh_total = [];

      ListFiles_to_read_chronologicalOrder.forEach((filename) => {
        try {
          const data = fs1.readFileSync(directoryDataPublicPath + filename, "utf8");
          const jsonData = JSON.parse(data);

          const resultat = jsonData.find((element) => element.url.includes(item.name)); // On cherche l'occurence du fichier json dont l'URL contient le 'nom' de la société du CAC40
          if (resultat) {
            const performance = resultat.lh_total;
            lh_total.push(performance);
          } else {
            console.log("Aucune occurrence trouvée pour :", url);
          }
        } catch (err) {
          console.error("Erreur lors de la lecture du fichier :", err);
        }
      });

      item.data = lh_total;
      dataset.push(item);
    }
    fs1.writeFileSync("../public/historique.json", JSON.stringify(dataset, null, 2)); // Création du json final sur disque
  });

  // ******************************************************************************************************************************************************************************
  var endTime = performance.now();
  console.log(`La constitution des données a pris ${Math.round((endTime - startTime) / 60000)} minutes`);
})();
