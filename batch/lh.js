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
    lh_rank;
    FCP;
    SI;
    LCP;
    TBT;
    CLS;
    TTI;
    FID;
    TTFB;
    total_weight;
    image_weight;
    script_weight;
    document_weight;
    font_weight;
    stylesheet_weight;
    thirdParty_weight;

    constructor() {
      this.error = false;
      this.url = "";
      this.lh_version = "";
      this.lh_perf = 0;
      this.lh_accessibility = 0;
      this.lh_bestpractices = 0;
      this.lh_seo = 0;
      this.lh_rank = 0;
      this.FCP = 0;
      this.SI = 0;
      this.LCP = 0;
      this.TBT = 0;
      this.CLS = 0;
      this.TTI = 0;
      this.FID = 0;
      this.TTFB = 0;
      this.total_weight = 0;
      this.image_weight = 0;
      this.script_weight = 0;
      this.document_weight = 0;
      this.font_weight = 0;
      this.stylesheet_weight = 0;
      this.thirdParty_weight = 0;
    }
  }

  const KPI = new lighthouse_KPI(); // note the "new" keyword here

  for (let index = 0; index < urls.length; index++) {
    // Le forEach ne fonctionne pas : double async en cause, comme dans Botanical ?
    const url = urls[index];
    console.log("Traitement de l'URL n°" + (index + 1).toString() + " -> " + url);
    const runnerResult = await lighthouse(url, options);

    if (runnerResult.lhr.runtimeError) {
      // Une url peut ne pas être crawlable (ex : un PDF) -> LH renvoie alors une erreur qu'il faut traiter
      KPI.error = true;
      
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
      const weights_mix = runnerResult.lhr.audits[`network-requests`].details.items.map(function (d) {
        var item = new weights(); // note the "new" keyword here
        item.transferSize = d.transferSize;
        item.resourceType = d.resourceType;
        item.entity = d.entity;
        return item;
      });

      let totalByteWeight = 0;
      let totalByteDocument = 0;
      let totalByteImage = 0;
      let totalByteScript = 0;
      let totalByteFont = 0;
      let totalByteStylesheet = 0;
      let totalByteThirdparty = 0;
      weights_mix.forEach((item) => {
        totalByteWeight += item.transferSize;
        if (item.resourceType === "Document" && url.includes(item.entity)) {
          totalByteDocument += item.transferSize;
        }
        if (item.resourceType === "Image" && url.includes(item.entity)) {
          totalByteImage += item.transferSize;
        }
        if (item.resourceType === "Script" && url.includes(item.entity)) {
          totalByteScript += item.transferSize;
        }
        if (item.resourceType === "Font" && url.includes(item.entity)) {
          totalByteFont += item.transferSize;
        }
        if (item.resourceType === "Stylesheet" && url.includes(item.entity)) {
          totalByteStylesheet += item.transferSize;
        }
        if (!url.includes(item.entity)) {
          totalByteThirdparty += item.transferSize;
        }
      });

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
      KPI.document_weight = totalByteDocument;
      KPI.image_weight = totalByteImage;
      KPI.script_weight = totalByteScript;
      KPI.font_weight = totalByteFont;
      KPI.stylesheet_weight = totalByteStylesheet;
      KPI.thirdParty_weight = totalByteThirdparty;
    }

    lh_kpi.push(KPI); // On alimente lh_kpi pour chaque URL testée
  }

  await chrome.kill();
  return lh_kpi;
}

export { lighthouseAPI_call };
