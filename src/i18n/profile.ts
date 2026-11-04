import { education, experience, languages, projects } from "@/data/profile";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

const experienceKeys: Record<string, keyof typeof textos.experiencia> = {
  "Laboratorio de Inteligencia Artificial en Español": "textradar",
  "Universidad Complutense de Madrid": "ucm",
  "Nextalia Ventures": "nextalia",
  "The Attic Labs": "attic",
  "Nokia": "nokia",
  "Banco de España": "bancoEspana",
};

export function localizedExperience(locale: Locale) {
  return experience.map(item => {
    const entry = textos.experiencia[experienceKeys[item.company]];
    if (!entry) return item;
    return {
      ...item,
      role: translate(entry.cargo, locale),
      dates: translate(entry.fechas, locale),
      location: translate(entry.lugar, locale),
      description: translate(entry.descripcion, locale),
      tags: Object.entries(entry)
        .filter(([key]) => /^etiqueta\d+$/.test(key))
        .sort(([a], [b]) => Number(a.slice(8)) - Number(b.slice(8)))
        .map(([, value]) => translate(value, locale)),
    };
  });
}

const projectKeys: Record<string, keyof typeof textos.proyectos> = {
  "textradar": "textradar",
  "toucan": "toucan",
  "la-tostadora": "tostadora",
  "linguistica-computacional": "linguistica",
  "redes-y-sistemas-moviles": "redes",
};

export function localizedProjects(locale: Locale) {
  return projects.map(item => {
    const entry = textos.proyectos[projectKeys[item.slug]];
    if (!entry) return item;
    const list = (prefix: string) => Object.entries(entry)
      .filter(([key]) => new RegExp(`^${prefix}\\d+$`).test(key))
      .sort(([a], [b]) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)))
      .map(([, value]) => translate(value, locale));
    return {
      ...item,
      title: translate(entry.title, locale),
      role: translate(entry.role, locale),
      summary: translate(entry.summary, locale),
      intro: translate(entry.intro, locale),
      contributions: list("contributions"),
      tags: list("tags"),
      externalLabel: "externalLabel" in entry ? translate(entry.externalLabel, locale) : item.externalLabel,
    };
  });
}

const degrees = ["doctorado", "fonetica", "linguistica", "mba", "teleco"] as const;
const schools = ["ucm", "uimp", "ucm", "camara", "upm"] as const;

export function localizedEducation(locale: Locale) {
  return education.map((item, index) => ({
    ...item,
    originalDegree: item.degree,
    degree: translate(textos.formacion[degrees[index]], locale),
    school: translate(textos.formacion[schools[index]], locale),
    type: item.type === "Grado" ? translate(textos.formacion.grado, locale)
      : item.type === "Ingeniería" ? translate(textos.formacion.ingenieria, locale) : item.type,
  }));
}

const languageKeys = ["espanol", "ingles", "portugues", "ruso", "frances", "fines", "italiano", "catalan"] as const;

export function localizedLanguages(locale: Locale) {
  return languages.map(([name, level], index) => [
    translate(textos.idiomas[languageKeys[index]], locale) || name,
    level === "Lengua materna" ? translate(textos.idiomas.materna, locale)
      : level === "C1 · Uso profesional" ? translate(textos.idiomas.profesional, locale) : level,
  ]);
}
