// Script qui transforme un fichier texte comprenant des URLs en un fichier pseudo.xml
// Ex : https://www.carrefour.com/fr devient <loc>https://www.carrefour.com/fr</loc>
// Il a été réalisé pour Carrefour dont la map n'était pas exploitable, ni en direct, ni via un outil
// Carrefour.txt a été constitué à la main à partir de https://www.carrefour.com/fr/sitemap.xml puis 'node txt_xml.cjs carrefour.txt' -> Création de /data_source/sitemaps/carrefour.xml
// Le fichier .xml généré est alors traité par 'node spot.mjs carrefour.xml', comme les autres fichiers XML statiques

const fs = require("fs");

const filename = process.argv.slice(2).toString();
const filename_sans_extension = filename.substring(0, filename.indexOf(".txt"));
const lineReader = require("readline").createInterface({
  // Nouveau package depuis Node 4.0.0 qui facilite la lecture d'un fichier ligne à ligne
  input: require("fs").createReadStream(filename),
});

let urls = [];

lineReader.on("line", function (line_read) {
  urls.push(line_read);
});

lineReader.on("close", function () {
  // Création du fichier .xml sur disque
  let output = fs.createWriteStream("./data_source/sitemaps/" + filename_sans_extension + ".xml");
  for (let i = 0; i < urls.length; i++) {
    output.write(urls[i] + "\n");
  }
  output.end();
});
