// Script qui transforme un fichier texte comprenant des URLs en un fichier pseudo.xml
// Ex : https://www.carrefour.com/fr devient <loc>https://www.carrefour.com/fr</loc>
// Il a été réalisé pour Carrefour dont la map n'était pas exploitable, ni en direct, ni via un outil
// Carrefour.txt a été constitué à la main à partir de https://www.carrefour.com/fr/sitemap.xml puis 'node txt_xml.cjs carrefour.txt' -> Création de /data_source/sitemaps/carrefour.xml
// Le fichier .xml généré est alors traité par 'node spot.mjs carrefour.xml', comme les autres fichiers XML statiques

import * as fs1 from "fs";
import { open } from "fs/promises"; // Pour lecture d'un fichier texte ligne à ligne

const filename = process.argv.slice(2).toString();
const filename_sans_extension = filename.substring(0, filename.indexOf(".txt"));

// On lit le fichier texte
const file = await open(filename);

// Création du fichier .xml sur disque
let output = fs1.createWriteStream("./" + filename_sans_extension + ".xml");

for await (const line of file.readLines()) {
  output.write("<loc>" + line + "</loc>\n");
}
output.end();