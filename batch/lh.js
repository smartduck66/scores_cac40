// Appel direct de l'API Google Lighthouse - Remplacement de performance Leaderboard écrit par Zach Leatherman
// Derniers travaux : 12/2/2024
// ***********************************************************************************************************

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

async function lighthouseAPI_call(urls) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = { output: "json", port: chrome.port };

  // Définition de l'objet retourné par cette fonction
  let lh_kpi = [];

  class lighthouse_KPI {
    error;
    url;
    lh_version;
    lh_perf;
    lh_accessibility;
    lh_bestpractices;
    lh_seo;
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

    constructor() {
      this.error = false;
      this.url = "";
      this.lh_version = "";
      this.lh_perf = 0;
      this.lh_accessibility = 0;
      this.lh_bestpractices = 0;
      this.lh_seo = 0;
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
    }
  }

  for (let index = 0; index < urls.length; index++) {
    // Le forEach ne fonctionne pas : double async en cause, comme dans Botanical ?
    const url = urls[index];
    console.log("Traitement de l'URL n°" + (index + 1).toString() + " -> " + url);
    const runnerResult = await lighthouse(url, options);

    const KPI = new lighthouse_KPI(); // note the "new" keyword here

    if (runnerResult.lhr.runtimeError) {
      // Une url peut ne pas être crawlable (ex : un PDF) -> LH renvoie alors une erreur qu'il faut traiter
      KPI.error = true;
      //console.log(runnerResult)
      console.log("Lh.js : erreur présente dans le fichier runnerResult généré par l'API Lighthouse");
    } else {
      // Inspection de l'ensemble des requêtes réseau afin de déterminer la taille des images, scripts, document, fontes, css et 3rd party
      class weights {
        transferSize;
        resourceType;
        entity;

        constructor() {
          this.transferSize = 0;
          this.resourceType = "";
          this.entity = "";
        }
      }

      // `.lhr` is the Lighthouse Result as a JS object
      // https://github.com/GoogleChrome/lighthouse/blob/main/docs/understanding-results.md
      const weights_mix = runnerResult.lhr.audits[`resource-summary`].details.items.map(function (d) {
        var item = new weights(); // note the "new" keyword here
        item.transferSize = d.transferSize;
        item.resourceType = d.resourceType;
        item.entity = d.entity;
        return item;
      });

      // On recalcule le poids total car LHR ne prend pas en compte les modules tierce partie dans le total transféré au browser
      const totalByteWeight = weights_mix.reduce((acc, objet) => acc + objet.transferSize, 0) - weights_mix[0].transferSize;

      // Complétude de l'objet
      KPI.error = false;
      KPI.url = runnerResult.lhr.finalDisplayedUrl;
      KPI.lh_version = runnerResult.lhr.lighthouseVersion;
      KPI.lh_perf = runnerResult.lhr.categories.performance.score;
      KPI.lh_accessibility = runnerResult.lhr.categories.accessibility.score;
      KPI.lh_bestpractices = runnerResult.lhr.categories[`best-practices`].score;
      KPI.lh_seo = runnerResult.lhr.categories.seo.score;
      KPI.FCP = runnerResult.lhr.audits[`first-contentful-paint`].numericValue;
      KPI.SI = runnerResult.lhr.audits[`speed-index`].numericValue;
      KPI.LCP = runnerResult.lhr.audits[`largest-contentful-paint`].numericValue;
      KPI.TBT = runnerResult.lhr.audits[`total-blocking-time`].numericValue;
      KPI.CLS = runnerResult.lhr.audits[`cumulative-layout-shift`].numericValue;
      KPI.TTI = runnerResult.lhr.audits[`interactive`].numericValue;
      KPI.FID = runnerResult.lhr.audits[`max-potential-fid`].numericValue;
      KPI.TTFB = runnerResult.lhr.audits[`server-response-time`].numericValue;
      KPI.total_weight = totalByteWeight;
      KPI.media_weight = weights_mix[1].transferSize;
      KPI.image_weight = weights_mix[2].transferSize;
      KPI.script_weight = weights_mix[3].transferSize;
      KPI.font_weight = weights_mix[4].transferSize;
      KPI.other_weight = weights_mix[5].transferSize;
      KPI.stylesheet_weight = weights_mix[6].transferSize;
      KPI.document_weight = weights_mix[7].transferSize;
      KPI.thirdParty_weight = weights_mix[8].transferSize;
    }

    lh_kpi.push(KPI); // On alimente lh_kpi pour chaque URL testée
  }

  await chrome.kill();
  return lh_kpi;
}

export { lighthouseAPI_call };
