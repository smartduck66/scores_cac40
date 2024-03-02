# WebCheck'CAC40

> Calcul des indicateurs LightHouse sur les sites de l'indice boursier français CAC40<br>
> Démonstrateur : https://webcheckcac40.andretonic.fr/<br>
> Librement inspiré des travaux de Zach Leatherman (https://github.com/zachleat/speedlify)<br>
> Framework utilisé : Vue 3 + Typescript + Vite<br>
> Derniers travaux : voir changelog.vue<br>


## Description des répertoires principaux de l'application

- batch : contient les deux scripts nécessaires à la construction des fichiers json alimentant l'application<br>
    - perf.mjs (aucun paramètre à passer) : ce script calcule les indicateurs lighthouse des pages d'accueil des sites du CAC40 
    - spot.mjs (aucun paramètre à passer) : ce script lit le fichier sitemaps.txt qui doit contenir la ou les sitemaps des sites à auditer. Un fichier xml sans URL (ex : 3ds.xml) indique que la sitemap a été générée avec un crawler externe (du type Screaming Frog SEO spider) et est stockée dans le répertoire /sitemaps
- public
- src


## Modules NPM nécessaires à l'application

- Google Lighthouse : npm i lighthouse (utilisé dans /batch/lh.js)
- Chrome Launcher : npm i chrome-launcher (utilisé dans /batch/lh.js)
- Vue Router : npm i vue-router@4
- Types Babel : npm i -D @babel/types
- VueUse : npm i @vueuse/core (utilitaires)
- PrimeVue : npm i primevue (composants graphiques)
- AutoImport PrimeVue : npm i unplugin-vue-components -D (pour éviter les déclarations manuelles d'importation des composants)
- Pinia : npm i pinia (gestion des états)
- Sharp : npm install sharp (package utilisé dans le script webp.cjs pour transformer en masse les images png/jpg en webp)


## Traitements batchs (à lancer du répertoire /batch)

- node perf.mjs : calcul des indicateurs Lighthouse sur l'ensemble des pages d'accueil des sites du CAC40 
- node spot.mjs : mesure 'spot' des indicateurs Lighthouse sur la profondeur d'un seul site (100 pages)
