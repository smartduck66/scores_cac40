// ANCIEN MODULE qui utilisait https://github.com/zachleat/performance-leaderboard
// Mesure 'spot' des indicateurs Lighthouse sur la profondeur d'un seul site
// A faire 'tourner' à la demande. Ex : node spot.mjs https://france.arcelormittal.com/sitemap.xml
// robots.txt peut également fournir l'URL de la sitemap si elle n'est pas évidente à trouver
// Sinon, un outil comme https://www.xml-sitemaps.com/ permet de générer un fichier sitemap.xml avec 500 urls -> Ils sont stockés dans /data_source/sitemaps
// ou l'outil Screaming Frog SEO spider, application Windows
// ******************************************************************

import * as fs1 from "fs";

// Tiré de https://github.com/zachleat/performance-leaderboard
//const PerfLeaderboard = require("performance-leaderboard");
import runLighthouse from "performance-leaderboard";

function extractDomainWithoutExtension(url) {
  // Supprimer le protocole s'il est présent
  url = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Extraire le nom de domaine
  var domain = url.split("/")[0];

  // Supprimer l'extension du nom de domaine
  domain = domain.replace(/\.[^.]+$/, "");

  return domain;
}

(async function () {
  const sitemap = process.argv.slice(2).toString();
  const directoryDataPath = "./data_source/spot/";
  const directoryDataPublicPath = "../public/spot/";
  const timestamp = Date.now();
  const filename = extractDomainWithoutExtension(sitemap) + ".json"; // ex : france.arcelormittal.json
  var startTime = performance.now();

  // On fetch le fichier sitemap.xml du site visé et on extrait l'ensemble des URLs repérées par les balises <loc></loc> (ex : 260 occurences pour ArcelorMittal le 9/2/24)
  var xml;
  var regex = /<loc>(.*?)<\/loc>/g;
  if (sitemap.includes("http")) {
    //const { statusCode, headers, trailers, body } = await request(sitemap);
    //const xml = await body.text()
    const res = await fetch(sitemap);
    xml = await res.text();
  } else {
    xml = fs1.readFileSync("./data_source/sitemaps/" + sitemap, "utf8"); // ex: node spot.mjs bouygues.xml
  }
  const results = xml.match(regex);
  //console.log(results);
  let urls = [];

  // On considère toutefois que 50 URLs est un nombre suffisamment significatif pour calculer des métriques moyennes sur un site donné -> Temps de calcul approximatif : 20 à 50'
  const increment = Math.round(results.length / 50); // ~50 URLs conservées, dont la page d'accueil traditionnellement plus 'lourde'
  for (let index = 0; index < results.length; index += increment) {
    const d = results[index];
    urls.push(d.substring(d.indexOf(">") + 1, d.indexOf("</loc>")));
  }

  // Create the options object (not required)
  const options = {
    axePuppeteerTimeout: 30000, // 30 seconds
    writeLogs: true, // Store audit data
    logDirectory: ".log", // Default audit data files stored at `.log`
    readFromLogDirectory: false, // Skip tests with existing logs
    // onlyCategories: ["performance", "accessibility"],
    chromeFlags: ["--headless"],
    freshChrome: "site", // or "run"
    launchOptions: {}, // Puppeteer launch options
  };

  // Run each site 3 times with default options
  // Or run each site 5 times with default options
  // console.log( await PerfLeaderboard(urls, 5) );
  // Or run each site 5 times with custom options
  // console.log( await PerfLeaderboard(urls, 5, options) );

  // ******************************************************************************************************************************************************************************
  // Step #1 : création du fichier source par le module 'performance leaderboard' (Répertoire /data_source/spot)
  fs1.writeFileSync(directoryDataPath + filename, JSON.stringify(await runLighthouse(urls), null, 2)); // Création du json final sur disque

  // ******************************************************************************************************************************************************************************
  // Step #2 : création du fichier avec les SEULES données formatées affichées par le navigateur web (Répertoire ../public/data/spot)
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

  const content = fs1.readFileSync(directoryDataPath + filename, "utf8");
  const jsonData = JSON.parse(content);
  var mesures = new spot(); // note the "new" keyword here
  let poids = 0;
  let perf = 0;
  let accessibility = 0;
  let bp = 0;
  let seo = 0;
  let total = 0;

  mesures.sitemap_url = sitemap;
  mesures.cac40 = extractDomainWithoutExtension(sitemap);
  mesures.timestamp = timestamp;
  mesures.nb_total_url = urls.length;

  await jsonData.map(async (d) => {
    // Une 'unknown error' peut être notifiée dans le fichier json construit par PerfLeaderboard -> Les mesures sont donc inexistantes...
    try {
      // Le async est nécessaire dès qu'un await est présent dans le map
      poids += d.weight.total;
      perf += d.lighthouse.performance;
      accessibility += d.lighthouse.accessibility;
      bp += d.lighthouse.bestPractices;
      seo += d.lighthouse.seo;
      total += d.lighthouse.total;
    } catch (error) {
      mesures.nb_total_url--; // ... On décrémente le nombre d'URLs pour ne pas fausser la moyenne finale
    }
  });

  mesures.poids_moyen_page = poids / mesures.nb_total_url / 1024; // en Ko
  mesures.lh_perf_moyen = Math.round((perf / mesures.nb_total_url) * 100);
  mesures.lh_accessibility_moyen = Math.round((accessibility / mesures.nb_total_url) * 100);
  mesures.lh_bestpractices_moyen = Math.round((bp / mesures.nb_total_url) * 100);
  mesures.lh_seo_moyen = Math.round((seo / mesures.nb_total_url) * 100);
  mesures.lh_total_moyen = mesures.lh_perf_moyen + mesures.lh_accessibility_moyen + mesures.lh_bestpractices_moyen + mesures.lh_seo_moyen;

  fs1.writeFileSync(directoryDataPublicPath + filename, JSON.stringify(mesures, null, 2)); // Création du json final sur disque

  // ******************************************************************************************************************************************************************************
  // Step #3 : construction du fichier spot.json contenant l'ensemble des fichiers du répertoire, qui sera lu à partir du browser

  // Lecture des fichiers dans le répertoire
  fs1.readdir(directoryDataPublicPath, (err, files) => {
    if (err) {
      console.error("Erreur de lecture du répertoire", err);
      return;
    }

    // Création du json final dans le répertoire \public, les noms de fichiers étant triés en ordre alphabétique
    fs1.writeFileSync(
      "../public/spot.json",
      JSON.stringify(
        files.sort((a, b) => a.localeCompare(b)),
        null,
        2
      )
    );
  });

  // ******************************************************************************************************************************************************************************
  var endTime = performance.now();
  console.log(`La constitution des données a pris ${Math.round((endTime - startTime) / 60000)} minutes`);
})();
