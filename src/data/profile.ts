import textos from "../i18n/textos.json" with { type: "json" };

export const profile = {
  name: "Iván Arias Rodríguez",
  email: "ivan.arias.rodriguez@gmail.com",
  linkedin: "https://www.linkedin.com/in/iv%C3%A1n-arias-rodr%C3%ADguez-b13a60/",
  location: textos.experiencia.textradar.lugar.es,
  cv: "/cv-ivan-arias-rodriguez.docx",
};

export const experience = [
  {
    company: "Laboratorio de Inteligencia Artificial en Español",
    role: textos.experiencia.textradar.cargo.es,
    period: "2022 — 2026",
    dates: textos.experiencia.textradar.fechas.es,
    location: textos.experiencia.attic.lugar.es,
    description: textos.experiencia.textradar.descripcion.es,
    tags: [textos.experiencia.textradar.etiqueta1.es, textos.experiencia.textradar.etiqueta2.es, textos.experiencia.textradar.etiqueta3.es, textos.experiencia.textradar.etiqueta4.es],
    mark: "IA",
  },
  {
    company: "Universidad Complutense de Madrid",
    role: textos.experiencia.ucm.cargo.es,
    period: "2017 — 2022",
    dates: textos.experiencia.ucm.fechas.es,
    location: textos.experiencia.ucm.lugar.es,
    description: textos.experiencia.ucm.descripcion.es,
    tags: [textos.experiencia.ucm.etiqueta1.es, textos.experiencia.ucm.etiqueta2.es, textos.experiencia.ucm.etiqueta3.es],
    mark: "UC",
  },
  {
    company: "Nextalia Ventures",
    role: textos.experiencia.nextalia.cargo.es,
    period: "2004 — 2019",
    dates: textos.experiencia.nextalia.fechas.es,
    location: textos.experiencia.nextalia.lugar.es,
    description: textos.experiencia.nextalia.descripcion.es,
    tags: [textos.experiencia.nextalia.etiqueta1.es, textos.experiencia.nextalia.etiqueta2.es, textos.experiencia.nextalia.etiqueta3.es],
    mark: "NV",
  },
  {
    company: "The Attic Labs",
    role: textos.experiencia.attic.cargo.es,
    period: "2011 — 2013",
    dates: textos.experiencia.attic.fechas.es,
    location: "Madrid, España",
    description: textos.experiencia.attic.descripcion.es,
    tags: [textos.experiencia.attic.etiqueta1.es, textos.experiencia.attic.etiqueta2.es, textos.experiencia.attic.etiqueta3.es],
    mark: "AL",
  },
  {
    company: "Nokia",
    role: textos.experiencia.nokia.cargo.es,
    period: "1999 — 2010",
    dates: textos.experiencia.nokia.fechas.es,
    location: textos.experiencia.nokia.lugar.es,
    description: textos.experiencia.nokia.descripcion.es,
    tags: [textos.experiencia.nokia.etiqueta1.es, textos.experiencia.nokia.etiqueta2.es, textos.experiencia.nokia.etiqueta3.es, textos.experiencia.nokia.etiqueta4.es],
    mark: "N",
  },
  {
    company: "Banco de España",
    role: textos.experiencia.bancoEspana.cargo.es,
    period: "1995 — 1999",
    dates: textos.experiencia.bancoEspana.fechas.es,
    location: textos.experiencia.bancoEspana.lugar.es,
    description: textos.experiencia.bancoEspana.descripcion.es,
    tags: [textos.experiencia.bancoEspana.etiqueta1.es, textos.experiencia.bancoEspana.etiqueta2.es],
    mark: "BE",
  },
];

export const education = [
  { degree: textos.formacion.doctorado.es, school: textos.formacion.ucm.es, period: "2016 — 2022", type: "PhD", description: "Tesis: «El modelo cortical HTM y su aplicación al conocimiento lingüístico». Sobresaliente cum laude con mención internacional.", documents: [{ label: "Anverso", url: "/titulos/doctorado-anverso.png" }, { label: "Reverso", url: "/titulos/doctorado-reverso.png" }] },
  { degree: textos.formacion.fonetica.es, school: textos.formacion.uimp.es, period: "2015 — 2016", type: "MSc", documents: [{ label: "Anverso", url: "/titulos/fonetica-anverso.png" }, { label: "Reverso", url: "/titulos/fonetica-reverso.png" }] },
  { degree: textos.formacion.linguistica.es, school: textos.formacion.ucm.es, period: "2011 — 2015", type: textos.formacion.grado.es, documents: [{ label: "Anverso", url: "/titulos/linguistica-anverso.png" }, { label: "Reverso", url: "/titulos/linguistica-reverso.png" }] },
  { degree: textos.formacion.mba.es, school: textos.formacion.camara.es, period: "2010 — 2011", type: "MBA", documents: [{ label: "Anverso", url: "/titulos/mba-anverso.png" }] },
  { degree: textos.formacion.teleco.es, school: textos.formacion.upm.es, period: "1994 — 2002", type: textos.formacion.ingenieria.es, documents: [{ label: "Anverso", url: "/titulos/telecomunicaciones-anverso.png" }, { label: "Reverso", url: "/titulos/telecomunicaciones-reverso.png" }] },
];

// Descripciones de los programas; los enlaces a los diplomas verifican los certificados personales.
export const educationPrograms: Record<string, { url: string; detail?: string }> = {
  "Doctorado en Lingüística Teórica y Aplicada": { url: "https://www.ucm.es/doctorado/doctoradolinguistica/" },
  "Máster en Fonética y Fonología · Tecnologías del habla": { url: "https://wapps001.uimp.es/uxxiconsultas/ficheros/5/27502P02N_MFF_DEF.pdf", detail: "folleto de la UIMP de 2015, PDF" },
  "Grado en Lingüística y Lenguas Aplicadas": { url: "https://www.ucm.es/linguistica/plan-de-estudios-antiguo-2011-2019-1", detail: "plan de estudios 2011-2019" },
  "Máster en Administración y Dirección de Empresas": { url: "https://www.camaragranada.org/evento/formacion/escuela-de-direccion/master-en-direccion-y-administracion-de-empresas-mba-1653998639", detail: "edición posterior, 2022-2023" },
  "Ingeniería de Telecomunicación · Telemática": { url: "https://www.upm.es/Estudiantes/Estudios_Titulaciones/EstudiosOficialesGrado/ArticulosRelacionados?fmt=detail&id=6a309cf067910210VgnVCM10000009c7648a____", detail: "plan de estudios de 1994" },
  "Deep Learning Specialization": { url: "https://www.coursera.org/specializations/deep-learning" },
  "DeepLearning.AI TensorFlow Developer Professional Certificate": { url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice" },
  "Machine Learning Engineering for Production (MLOps)": { url: "https://www.deeplearning.ai/the-batch/introducing-the-machine-learning-engineering-for-production-mlops-specialization", detail: "presentación original de la especialización" },
};

export const programmingExperience = ["Python", "JavaScript", "PHP"];

export const nokiaReferences = [
  { type: "RFC · 2006", title: "RFC 4460: SCTP Specification Errata and Issues", detail: "Coautor · IETF", url: "https://www.rfc-editor.org/rfc/rfc4460" },
  { type: "Patente · 2007", title: "Method for sending connection-oriented or connectionless data", detail: "Coinventor · EP1512259B1", url: "https://patents.google.com/patent/EP1512259B1/en" },
];

export const publications = [
  { year: "2022", type: "Capítulo de libro", title: "Creación de un lexicón masivo del español a partir del Wikcionario y del Diccionario de la Lengua Española de la RAE", authors: "Iván Arias Rodríguez", source: "El devenir de la lingüística y la cultura · Dykinson, pp. 526–554", url: "https://zenodo.org/records/14945877/files/ebooks_978-84-1377-927-0_v2%20%281%29.pdf?download=1" },
  { year: "2021", type: "Artículo", title: "Un estudio empírico con Sketch Engine sobre la interfaz sintáctico-pragmática para la identificación de la estructura temática intraoracional en español", authors: "Elena del Olmo Suárez e Iván Arias Rodríguez", source: "Revista de Humanidades Digitales, n.º 6, pp. 129–150", url: "https://revistas.uned.es/index.php/RHD/article/download/30965/24318" },
  { year: "2019", type: "Artículo", title: "ILSA (Ingeniería de Lenguajes Software y Aplicaciones), UCM: Investigación en Repositorios de Objetos Educativos en Dominios Especializados", authors: "Iván Arias Rodríguez, Joaquín Gayoso Cabada, Ana M.ª Fernández-Pampillón Cesteros, Manuel Márquez Cruz, Elena del Olmo Suárez, Antonio Sarasa Cabezuelo y José Luis Sierra Rodríguez", source: "IE Comunicaciones, n.º 30, pp. 90–103", url: "https://dialnet.unirioja.es/descarga/articulo/7232123.pdf" },
];

export const phoneticsPublications = [
  { year: "2016", type: "Artículo", title: "Cálculo de frecuencias de aparición de fonemas y alófonos en español actual utilizando un transcriptor automático", authors: "Iván Arias Rodríguez", source: "Loquens, vol. 3, n.º 1, e029 · DOI: 10.3989/loquens.2016.029", url: "https://doi.org/10.3989/loquens.2016.029" },
];

export const certifications = [
  { title: "Machine Learning Engineering for Production (MLOps)", type: "Especialización · 4 cursos", scan: "/titulos/coursera-mlops.jpeg", date: "5 de julio de 2023", url: "https://coursera.org/share/7a0adc699e246c66a78f1ba572bf89ff", details: "Cuatro cursos sobre aprendizaje automático en producción, ciclo de vida de datos, pipelines y despliegue de modelos." },
  { title: "DeepLearning.AI TensorFlow Developer Professional Certificate", type: "Especialización · 4 cursos", scan: "/titulos/coursera-tensorflow.jpeg", date: "23 de noviembre de 2022", url: "https://coursera.org/share/a2e70da6a217a0b8fe2054e4ec43406a", details: "Cuatro cursos sobre TensorFlow, redes convolucionales, procesamiento del lenguaje natural y series temporales." },
  { title: "Deep Learning Specialization", type: "Especialización · 5 cursos", scan: "/titulos/coursera-deep-learning.jpeg", date: "10 de noviembre de 2022", url: "https://coursera.org/share/a5eed1417ee0aa8872590d4c4da0ff24", details: "Cinco cursos sobre redes neuronales, optimización, redes convolucionales y modelos de secuencia, con aplicaciones en Python y TensorFlow." },
];

export const languages = [
  ["Español", "Lengua materna"],
  ["Inglés", "C1 · Uso profesional"],
  ["Portugués", "B1"],
  ["Ruso", "B1"],
  ["Francés", "B1"],
  ["Finés", "B1"],
  ["Italiano", "A2"],
  ["Catalán", "A2"],
];

export type Project = {
  slug: string;
  title: string;
  category: "Producto" | "Lenguaje" | "Ingeniería";
  company: string;
  period: string;
  summary: string;
  role: string;
  intro: string;
  contributions: string[];
  tags: string[];
  visual: "commerce" | "language" | "network" | "toucan" | "textradar";
  externalUrl?: string;
  externalLabel?: string;
};

// Añade aquí nuevos proyectos con una URL real o una ficha de trabajo documentada.
// Las fichas actuales resumen experiencia del PDF; no atribuyen resultados no documentados.
export const projects: Project[] = [
  {
    slug: "textradar",
    title: textos.proyectos.textradar.title.es,
    category: "Producto",
    company: "Laboratorio de Inteligencia Artificial en Español",
    period: "2022 — 2026",
    summary: textos.proyectos.textradar.summary.es,
    role: textos.proyectos.textradar.role.es,
    intro: textos.proyectos.textradar.intro.es,
    contributions: [textos.proyectos.textradar.contributions1.es, textos.proyectos.textradar.contributions2.es, textos.proyectos.textradar.contributions3.es, textos.proyectos.textradar.contributions4.es, textos.proyectos.textradar.contributions5.es],
    tags: [textos.proyectos.textradar.tags1.es, textos.proyectos.textradar.tags2.es, textos.proyectos.textradar.tags3.es, textos.proyectos.textradar.tags4.es],
    visual: "textradar",
  },
  {
    slug: "toucan",
    title: textos.proyectos.toucan.title.es,
    category: "Producto",
    company: "The Attic Labs",
    period: "2011 — 2013",
    summary: textos.proyectos.toucan.summary.es,
    role: textos.proyectos.toucan.role.es,
    intro: textos.proyectos.toucan.intro.es,
    contributions: [textos.proyectos.toucan.contributions1.es, textos.proyectos.toucan.contributions2.es, textos.proyectos.toucan.contributions3.es, textos.proyectos.toucan.contributions4.es, textos.proyectos.toucan.contributions5.es],
    tags: [textos.proyectos.toucan.tags1.es, textos.proyectos.toucan.tags2.es, textos.proyectos.toucan.tags3.es, textos.proyectos.toucan.tags4.es],
    visual: "toucan",
  },
  {
    slug: "la-tostadora",
    title: textos.proyectos.tostadora.title.es,
    category: "Producto",
    company: "Nextalia Ventures",
    period: "2004 — 2019",
    summary: textos.proyectos.tostadora.summary.es,
    role: textos.proyectos.tostadora.role.es,
    intro: textos.proyectos.tostadora.intro.es,
    contributions: [textos.proyectos.tostadora.contributions1.es, textos.proyectos.tostadora.contributions2.es, textos.proyectos.tostadora.contributions3.es, textos.proyectos.tostadora.contributions4.es, textos.proyectos.tostadora.contributions5.es],
    tags: [textos.proyectos.tostadora.tags1.es, textos.proyectos.tostadora.tags2.es, textos.proyectos.tostadora.tags3.es, textos.proyectos.tostadora.tags4.es],
    visual: "commerce",
    externalUrl: "https://www.latostadora.com/",
    externalLabel: textos.proyectos.tostadora.externalLabel.es,
  },
  {
    slug: "linguistica-computacional",
    title: textos.proyectos.linguistica.title.es,
    category: "Lenguaje",
    company: "Universidad Complutense de Madrid",
    period: "2017 — 2022",
    summary: textos.proyectos.linguistica.summary.es,
    role: textos.proyectos.linguistica.role.es,
    intro: textos.proyectos.linguistica.intro.es,
    contributions: [textos.proyectos.linguistica.contributions1.es, textos.proyectos.linguistica.contributions2.es, textos.proyectos.linguistica.contributions3.es, textos.proyectos.linguistica.contributions4.es],
    tags: [textos.proyectos.linguistica.tags1.es, textos.proyectos.linguistica.tags2.es, textos.proyectos.linguistica.tags3.es, textos.proyectos.linguistica.tags4.es],
    visual: "language",
    externalUrl: "https://produccioncientifica.ucm.es/documentos/62b68f44730a524af85b3544",
    externalLabel: textos.proyectos.linguistica.externalLabel.es,
  },
  {
    slug: "redes-y-sistemas-moviles",
    title: textos.proyectos.redes.title.es,
    category: "Ingeniería",
    company: "Nokia · Helsinki",
    period: "1999 — 2010",
    summary: textos.proyectos.redes.summary.es,
    role: textos.proyectos.redes.role.es,
    intro: textos.proyectos.redes.intro.es,
    contributions: [textos.proyectos.redes.contributions1.es, textos.proyectos.redes.contributions2.es, textos.proyectos.redes.contributions3.es, textos.proyectos.redes.contributions4.es],
    tags: [textos.proyectos.redes.tags1.es, textos.proyectos.redes.tags2.es, textos.proyectos.redes.tags3.es, textos.proyectos.redes.tags4.es],
    visual: "network",
  },
];
