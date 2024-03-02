// Mesure 'spot' des indicateurs Lighthouse sur la profondeur d'un site : node spot.mjs
// Le fichier sitemaps.txt doit comporter la ou les URLs à scanner - A faire 'tourner' à la demande
// robots.txt peut également fournir l'URL d'une sitemap si elle n'est pas évidente à trouver
// Sinon, un outil comme https://www.xml-sitemaps.com/ permet de générer un fichier sitemap.xml avec 500 urls -> Ils sont stockés dans /data_source/sitemaps
// ou l'outil Screaming Frog SEO spider, application Windows
// ***********************************************************************************************

import { lighthouseAPI_call } from "./lh.js";
import * as fs1 from "fs";
import { open } from "fs/promises"; // Pour lecture d'un fichier texte ligne à ligne

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
  var startTime = performance.now();
  const directoryDataPublicPath = "../public/spot/";
  const timestamp = Date.now();

  // On lit le fichier contenant la ou les sitemaps à auditer
  const sitemaps = await open("./sitemaps.txt");

  for await (const url of sitemaps.readLines()) {
    const sitemap_to_audit = url;
    const filename = extractDomainWithoutExtension(sitemap_to_audit) + ".json"; // ex : france.arcelormittal.json

    // On fetch le fichier sitemap.xml du site visé et on extrait l'ensemble des URLs repérées par les balises <loc></loc> (ex : 260 occurences pour ArcelorMittal le 9/2/24)
    var xml;
    var regex = /<loc>(.*?)<\/loc>/g;
    if (sitemap_to_audit.includes("http")) {
      const res = await fetch(sitemap_to_audit);
      xml = await res.text();
    } else {
      xml = fs1.readFileSync("./sitemaps/" + sitemap_to_audit, "utf8"); // ex: pour bouygues.xml
    }
    const results = xml.match(regex);
    //console.log(results);
    let urls = [];

    // On prend les 100 premières URLs de la sitemap à auditer - Temps moyen de calcul : 15'
    const nb_urls = (results.length >= 100) ? 100 : results.length; // GUARD
    for (let index = 0; index < nb_urls; index++) {
      const d = results[index];
      urls.push(d.substring(d.indexOf(">") + 1, d.indexOf("</loc>")));
    }

    // ******************************************************************************************************************************************************************************
    // Step #1 : création du fichier avec les SEULES données formatées affichées par le navigateur web (Répertoire ../public/data/spot)
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
      }
    }

    const jsonData = await lighthouseAPI_call(urls);

    var mesures = new spot(); // note the "new" keyword here
    let poids = 0;
    let perf = 0;
    let accessibility = 0;
    let bp = 0;
    let seo = 0;

    mesures.sitemap_url = sitemap_to_audit;
    mesures.cac40 = extractDomainWithoutExtension(sitemap_to_audit);
    mesures.timestamp = timestamp;
    mesures.nb_total_url = urls.length;

    jsonData.map((d) => {
      // Une erreur peut être notifiée dans le fichier json construit par l'API Lighthouse -> Les mesures sont donc inexistantes...
      if (d.error) {
        mesures.nb_total_url--; // ... On décrémente alors le nombre d'URLs pour ne pas fausser la moyenne finale
      } else {
        poids += d.total_weight;
        perf += d.lh_perf;
        accessibility += d.lh_accessibility;
        bp += d.lh_bestpractices;
        seo += d.lh_seo;
      }
    });

    if (mesures.nb_total_url) {
      mesures.poids_moyen_page = poids / mesures.nb_total_url / 1024; // en Ko
      mesures.lh_perf_moyen = Math.round((perf / mesures.nb_total_url) * 100);
      mesures.lh_accessibility_moyen = Math.round((accessibility / mesures.nb_total_url) * 100);
      mesures.lh_bestpractices_moyen = Math.round((bp / mesures.nb_total_url) * 100);
      mesures.lh_seo_moyen = Math.round((seo / mesures.nb_total_url) * 100);
      mesures.lh_total_moyen = mesures.lh_perf_moyen + mesures.lh_accessibility_moyen + mesures.lh_bestpractices_moyen + mesures.lh_seo_moyen;

      fs1.writeFileSync(directoryDataPublicPath + filename, JSON.stringify(mesures, null, 2)); // Création du json final sur disque
    } else {
      console.log("Le nombre de mesures pour '" + mesures.cac40 + "' est nul. On conserve donc le fichier json actuel stocké dans le répertoire /public/spot.");
    }
  }

  // ******************************************************************************************************************************************************************************
  // Step #2 : construction du fichier spot.json contenant l'ensemble des fichiers du répertoire, qui sera lu à partir du browser

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
