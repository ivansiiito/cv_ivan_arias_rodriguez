import { readFile } from "node:fs/promises";

const source = process.argv[2] || new URL("../src/i18n/textos.json", import.meta.url);
const texts = JSON.parse(await readFile(source, "utf8"));
const languages = ["ca", "en", "fr", "it", "pt", "fi", "ru"];
const problems = [];

function check(node, path = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    problems.push(`${path.join(".")}: sección o texto inválido`);
    return;
  }
  if (Object.hasOwn(node, "es")) {
    if (typeof node.es !== "string" || !node.es.trim()) problems.push(`${path.join(".")}: falta el texto español`);
    for (const language of languages) {
      if (typeof node[language] !== "string" || !node[language].trim()) {
        problems.push(`${path.join(".")}: falta la traducción ${language}`);
      } else if (node.traducidoDesde?.[language] !== node.es) {
        problems.push(`${path.join(".")}: la traducción ${language} necesita revisión`);
      }
    }
    return;
  }
  for (const [key, child] of Object.entries(node)) check(child, [...path, key]);
}

check(texts);
if (problems.length) {
  console.error(`Traducciones pendientes:\n${problems.map(problem => `- ${problem}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Las traducciones registradas están completas y actualizadas.");
}
