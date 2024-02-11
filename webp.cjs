// Inspiration : https://sharp.pixelplumbing.com/
// Utilisation : node webp.cjs

const sharp = require("sharp");
const fs = require("fs");

const outputFolder = "./public/img/";
const inputFolder = "./img_source/";

const files = fs.readdirSync(inputFolder);

files.map(async function (file_to_convert) {
  await sharp(inputFolder + file_to_convert).toFile(outputFolder + file_to_convert.substring(0, file_to_convert.indexOf(".")) + ".webp");
});

console.log("Fichiers images transformés au format webp");