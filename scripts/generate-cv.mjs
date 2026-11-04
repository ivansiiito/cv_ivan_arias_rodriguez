import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// CV editable de dos páginas, generado con elementos estándar de Word.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { profile } = await import(pathToFileURL(path.join(root, 'src/data/profile.ts')));
const output = path.join(root, 'public/cv-ivan-arias-rodriguez.docx');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const xml = s => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${s}`;
const ns = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const relationships = [];
const link = (text, url) => ({ text, url });

function runs(input) {
  return (Array.isArray(input) ? input : [input]).map(item => {
    if (typeof item === 'string') return `<w:r><w:t xml:space="preserve">${esc(item)}</w:t></w:r>`;
    const id = `link${relationships.length + 1}`;
    relationships.push({ id, url: item.url });
    return `<w:hyperlink r:id="${id}"><w:r><w:rPr><w:rStyle w:val="Hyperlink"/></w:rPr><w:t>${esc(item.text)}</w:t></w:r></w:hyperlink>`;
  }).join('');
}
function p(text, style = 'Body', extra = '') {
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${extra}</w:pPr>${runs(text)}</w:p>`;
}
const title = t => p(t, 'Section');
const sub = t => p(t, 'Label');
const item = (name, meta, text) => p(name, 'Role') + p(meta, 'Meta') + p(text, 'Body');
const course = (name, meta) => p(name, 'SmallRole') + p(meta, 'SideBody');

const banner = `<w:tbl><w:tblPr><w:tblW w:w="10206" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="220" w:type="dxa"/><w:left w:w="300" w:type="dxa"/><w:bottom w:w="210" w:type="dxa"/><w:right w:w="300" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="10206"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="10206" w:type="dxa"/><w:shd w:val="clear" w:fill="183B3B"/></w:tcPr>${p('IA   /   INGENIERÍA  ·  LENGUAJE  ·  IA', 'BannerEyebrow')}${p('Iván Arias Rodríguez', 'BannerName')}${p('Liderazgo tecnológico  /  Desarrollo de producto', 'BannerSubtitle')}${p('Ingeniero de telecomunicación · Doctor en Lingüística · MBA', 'BannerDetail')}</w:tc></w:tr></w:tbl>`;

const left1 = [
  title('CONTACTO'),
  p('Madrid, España', 'SideBody'),
  p([link(profile.email, `mailto:${profile.email}`)], 'SideBody'),
  p([link('LinkedIn  ↗', profile.linkedin)], 'SideBody'),
  title('ENFOQUE'),
  p('Ingeniería y lenguaje al servicio de productos útiles.', 'SideIntro'),
  p('Arquitectura de software', 'Tag'),
  p('IA aplicada y PLN', 'Tag'),
  p('Liderazgo cercano', 'Tag'),
  p('Producto digital', 'Tag'),
  title('TECNOLOGÍA'),
  sub('PROGRAMACIÓN'),
  p('Python · JavaScript puro · PHP · expresiones regulares', 'SideBody'),
  sub('IA Y DATOS'),
  p('Embeddings · APIs de OpenAI · modelos en AWS · MariaDB · SQL', 'SideBody'),
  sub('HERRAMIENTAS'),
  p('HTML · CSS · YouTrack · Kanban · Docker (fundamentos)', 'SideBody'),
  p('TensorFlow: formación práctica; uso posterior menos frecuente.', 'SideBody'),
  title('IDIOMAS'),
  p('Español  /  Nativo\nInglés  /  C1 · uso profesional\nPortugués, ruso, francés y finés  /  B1\nItaliano y catalán  /  A2', 'SideBody'),
].join('');

const right1 = [
  title('PERFIL'),
  p('Ingeniero, lingüista y desarrollador con experiencia en I+D, emprendimiento y dirección tecnológica. Disfruto construyendo productos: definiendo la arquitectura, programando y acompañando a las personas que los hacen posibles.', 'Intro'),
  title('EXPERIENCIA  /  SELECCIÓN'),
  item('CTO · TextRadar', '2022—2026  /  LABORATORIO DE IA EN ESPAÑOL', 'Definí la arquitectura, las bases de datos y el enfoque algorítmico; programé gran parte del backend y también frontend. Formé y dirigí un equipo de hasta siete personas.'),
  p('Desarrollamos herramientas de IA para detectar discrepancias entre documentos y automatizar fichas editoriales con envío a DILVE. Organicé el trabajo y comuniqué los avances al CEO y a inversores.', 'Body'),
  item('Investigación y docencia · UCM', '2017—2022  /  FPU · MADRID', 'Investigué representaciones semánticas y el modelo HTM. Impartí Lingüística Computacional y Procesamiento del Lenguaje Natural; realicé una estancia de investigación en Braganza.'),
  item('Cofundador · Nextalia Ventures', '2004—2019  /  BARCELONA', 'Desarrollé backend, bases de datos y herramientas de producción y ventas para latostadora y sus versiones internacionales. Antes participaron en la trayectoria SetaLoca, Primera Piel y LocoLED.'),
  p('CREAR  /  PROGRAMAR  /  ACOMPAÑAR', 'Highlight'),
].join('');

const left2 = [
  title('FORMACIÓN'),
  course('Doctorado en Lingüística', 'UCM · 2016—2022\nCum laude · mención internacional'),
  course('Máster en Fonética y Fonología', 'CSIC · UIMP · 2015—2016'),
  course('Grado en Lingüística y Lenguas Aplicadas', 'UCM · 2011—2015'),
  course('MBA', 'Cámara de Comercio de Granada · 2010—2011'),
  course('Ingeniería de Telecomunicación', 'UPM, Madrid · 1994—1999\nTeknillinen Korkeakoulu, Helsinki · 1999—2002'),
  title('FORMACIÓN ONLINE'),
  course('Deep Learning', 'DeepLearning.AI · 5 cursos · 2022'),
  course('TensorFlow Developer', 'DeepLearning.AI · 4 cursos · 2022'),
  course('Machine Learning Engineering for Production', 'DeepLearning.AI · 4 cursos · 2023'),
].join('');

const right2 = [
  title('EXPERIENCIA  /  CONTINUACIÓN'),
  item('Cofundador · The Attic Labs', '2011—2013  /  MADRID', 'Participé en la concepción de Toucan, un sistema de entretenimiento inalámbrico a bordo. Me ocupé de la web, el diseño gráfico y la arquitectura de la solución.'),
  item('Ingeniero de I+D · Nokia', '1999—2010  /  HELSINKI', 'Investigación, estandarización e implementación de protocolos de red, con participación en la IETF y desarrollo de SCTP y Symbian. Trabajo en conectividad WLAN y móvil, ICE/STUN/TURN y pruebas para Maemo/MeeGo.'),
  item('Operaciones de caja · Banco de España', '1995—1999  /  BARCELONA', 'Operaciones de pagos e ingresos con entidades bancarias comerciales; formación básica en contabilidad y derecho.'),
  title('CÓMO TRABAJO'),
  p('Me gusta liderar desde la cercanía y el ejemplo, organizar el trabajo con tableros Kanban y seguir participando en el código y las pruebas. Reconozco el buen trabajo, acompaño al equipo cuando se bloquea y apoyo su crecimiento profesional.', 'Body'),
  title('ÁREAS DE INTERÉS'),
  p('Productos con inteligencia artificial · Investigación aplicada · Procesamiento del lenguaje · Arquitectura de software · Equipos pequeños y multidisciplinares.', 'Body'),
  p('Madrid  /  Remoto o híbrido', 'Highlight'),
].join('');

function twoColumns(left, right) {
  return `<w:tbl><w:tblPr><w:tblW w:w="10206" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="200" w:type="dxa"/><w:left w:w="220" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="220" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="3500"/><w:gridCol w:w="6706"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc><w:tcPr><w:tcW w:w="3500" w:type="dxa"/><w:shd w:val="clear" w:fill="EDF4E9"/><w:vAlign w:val="top"/></w:tcPr>${left}</w:tc><w:tc><w:tcPr><w:tcW w:w="6706" w:type="dxa"/><w:vAlign w:val="top"/></w:tcPr>${right}</w:tc></w:tr></w:tbl>`;
}
const secondBanner = `<w:tbl><w:tblPr><w:tblW w:w="10206" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="110" w:type="dxa"/><w:left w:w="300" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="300" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="10206"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:shd w:val="clear" w:fill="183B3B"/></w:tcPr>${p('IVÁN ARIAS RODRÍGUEZ   /   TRAYECTORIA Y FORMACIÓN', 'BannerEyebrow')}</w:tc></w:tr></w:tbl>`;
const pageBreak = `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
const body = banner + twoColumns(left1, right1) + pageBreak + secondBanner + twoColumns(left2, right2);
const document = xml(`<w:document ${ns}><w:body>${body}<w:sectPr><w:footerReference w:type="default" r:id="footer"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="760" w:right="850" w:bottom="720" w:left="850" w:header="360" w:footer="360"/></w:sectPr></w:body></w:document>`);
const size = n => `<w:sz w:val="${n}"/><w:szCs w:val="${n}"/>`;
const color = hex => `<w:color w:val="${hex}"/>`;
const style = (id, para, run) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${id}"/><w:basedOn w:val="Normal"/><w:pPr>${para}</w:pPr><w:rPr>${run}</w:rPr></w:style>`;
const sp = (before, after) => `<w:spacing w:before="${before}" w:after="${after}" w:line="265" w:lineRule="auto"/>`;
const styles = xml(`<w:styles ${ns}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>${size(22)}${color('263A3A')}<w:lang w:val="es-ES"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>${sp(0, 80)}<w:widowControl/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
${style('BannerEyebrow',sp(0,65),'<w:b/>'+size(19)+color('C9EF83'))}
${style('BannerName',sp(0,55),'<w:b/>'+size(57)+color('FFFFFF'))}
${style('BannerSubtitle',sp(0,45),'<w:b/>'+size(25)+color('FFFFFF'))}
${style('BannerDetail',sp(0,0),size(21)+color('D5E6DD'))}
${style('Section',sp(150,90)+'<w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="10" w:space="4" w:color="A4D85B"/></w:pBdr>','<w:b/>'+size(21)+color('246B62'))}
${style('Intro',sp(0,110),size(23)+color('183B3B'))}
${style('Body',sp(0,100),size(22))}
${style('Role',sp(100,10)+'<w:keepNext/>','<w:b/>'+size(24)+color('183B3B'))}
${style('Meta',sp(0,55)+'<w:keepNext/>','<w:b/>'+size(19)+color('B15842'))}
${style('Label',sp(100,20)+'<w:keepNext/>','<w:b/>'+size(19)+color('246B62'))}
${style('SideBody',sp(0,75),size(21)+color('324C46'))}
${style('SideIntro',sp(0,100),'<w:b/>'+size(22)+color('183B3B'))}
${style('Tag',sp(35,40)+'<w:shd w:val="clear" w:fill="DAEABD"/><w:ind w:left="100" w:right="100"/>','<w:b/>'+size(20)+color('26574B'))}
${style('SmallRole',sp(80,10)+'<w:keepNext/>','<w:b/>'+size(21)+color('183B3B'))}
${style('Highlight',sp(160,50)+'<w:shd w:val="clear" w:fill="E4F1C7"/><w:ind w:left="120" w:right="120"/>','<w:b/>'+size(21)+color('24594F'))}
<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr>${color('145F5C')}<w:u w:val="single"/></w:rPr></w:style></w:styles>`);
const footer = xml(`<w:ftr ${ns}><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="10206"/></w:tabs></w:pPr><w:r><w:rPr>${size(18)}${color('59746C')}</w:rPr><w:t>IVÁN ARIAS RODRÍGUEZ  ·  CURRÍCULUM</w:t><w:tab/><w:t xml:space="preserve"> </w:t></w:r><w:fldSimple w:instr="PAGE"/></w:p></w:ftr>`);
const rel = (id, type, target, ext = false) => `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${esc(target)}"${ext ? ' TargetMode="External"' : ''}/>`;
const rels = content => xml(`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${content}</Relationships>`);
const entries = {
  '[Content_Types].xml': xml('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'),
  '_rels/.rels': rels(rel('document', 'officeDocument', 'word/document.xml') + '<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'),
  'word/document.xml': document,
  'word/styles.xml': styles,
  'word/footer1.xml': footer,
  'word/_rels/document.xml.rels': rels(rel('styles','styles','styles.xml') + rel('footer','footer','footer1.xml') + relationships.map(x => rel(x.id,'hyperlink',x.url,true)).join('')),
  'docProps/core.xml': xml(`<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Currículum · ${esc(profile.name)}</dc:title><dc:creator>${esc(profile.name)}</dc:creator><dc:language>es-ES</dc:language></cp:coreProperties>`),
};
const crcTable = Array.from({ length: 256 }, (_, c) => { for (let j=0;j<8;j++) c=(c&1)?0xEDB88320^(c>>>1):c>>>1; return c>>>0; });
const crc32 = data => { let c=0xFFFFFFFF; for(const b of data)c=crcTable[(c^b)&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; };
const locals=[], central=[]; let offset=0;
for(const [name, value] of Object.entries(entries)) {
  const n=Buffer.from(name), data=Buffer.from(value), crc=crc32(data);
  const hdr=Buffer.alloc(30); hdr.writeUInt32LE(0x04034b50); hdr.writeUInt16LE(20,4); hdr.writeUInt16LE(0x800,6); hdr.writeUInt32LE(crc,14); hdr.writeUInt32LE(data.length,18); hdr.writeUInt32LE(data.length,22); hdr.writeUInt16LE(n.length,26);
  locals.push(hdr,n,data);
  const c=Buffer.alloc(46); c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20,4); c.writeUInt16LE(20,6); c.writeUInt16LE(0x800,8); c.writeUInt32LE(crc,16); c.writeUInt32LE(data.length,20); c.writeUInt32LE(data.length,24); c.writeUInt16LE(n.length,28); c.writeUInt32LE(offset,42);
  central.push(c,n); offset+=hdr.length+n.length+data.length;
}
const directory=Buffer.concat(central), end=Buffer.alloc(22);
end.writeUInt32LE(0x06054b50); end.writeUInt16LE(Object.keys(entries).length,8); end.writeUInt16LE(Object.keys(entries).length,10); end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
fs.writeFileSync(output, Buffer.concat([...locals,directory,end]));
console.log(`CV creado: ${path.relative(root,output)} (${fs.statSync(output).size} bytes)`);
