import europePaths from "../data/europe-paths.json";
import type { CSSProperties } from "react";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";
import { JourneyQuestions } from "./journey-questions";

// Natural Earth 1:110m; city markers use longitude and latitude.
const mercator = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
const project = (longitude: number, latitude: number) => ({
  x: (longitude + 26) / 72 * 500 + 40,
  y: 75 + (mercator(72) - mercator(latitude)) / (mercator(72) - mercator(34)) * 360,
});
const cities = [
  { name: "Helsinki", lon: 24.9384, lat: 60.1699, dx: 10, dy: -10 },
  { name: "Київ", lon: 30.5234, lat: 50.4501, dx: 10, dy: -9 },
  { name: "Barcelona", lon: 2.1734, lat: 41.3851, dx: 9, dy: -9 },
  { name: "Bragança", lon: -6.7567, lat: 41.8061, dx: -10, dy: -14, anchor: "end" },
  { name: "Madrid", lon: -3.7038, lat: 40.4168, dx: -10, dy: 13, anchor: "end" },
  { name: "Granada", lon: -3.5986, lat: 37.1773, dx: 9, dy: 18 },
] as const;
const whyQuestions = [
  "¿Por qué?", "Why?", "Miksi?", "Per què?", "Porquê?", "Zergatik?", "Por que?",
  "Pourquoi ?", "Warum?", "Perché?", "Pse?", "Ինչո՞ւ", "Niyə?", "Чаму?",
  "Zašto?", "Защо?", "Γιατί;", "Hvorfor?", "Prečo?", "Zakaj?", "Miks?",
  "რატომ?", "Miért?", "Cén fáth?", "Af hverju?", "Неліктен?", "Kāpēc?",
  "Kodėl?", "Firwat?", "Зошто?", "Għaliex?", "De ce?", "Waarom?",
  "Dlaczego?", "Proč?", "Почему?", "Зашто?", "Varför?", "Neden?", "Чому?",
];
const howQuestions = [
  "¿Cómo?", "Com?", "Como?", "Nola?", "How?", "Comment ?", "Come?", "Wie?",
  "Hoe?", "Hvordan?", "Hur?", "Miten?", "Kuidas?", "Hvernig?", "Conas?",
  "Kā?", "Kaip?", "Jak?", "Ako?", "Kako?", "Како?", "Как?", "Як?",
  "Πώς;", "Si?", "Cum?", "Hogyan?", "Kif?", "Nasıl?", "Necə?", "Ինչպե՞ս",
  "როგორ?", "Қалай?",
];
const questions = whyQuestions.flatMap((question, index) =>
  howQuestions[index] ? [question, howQuestions[index]] : [question],
);

export function HeroArt({ locale = "es" }: { locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const points = cities.map(city => ({ ...city, ...project(city.lon, city.lat) }));
  const rotatePoint = (x: number, y: number) => {
    const angle = 8 * Math.PI / 180;
    const scale = 1.22;
    return { x: 290 + scale * ((x - 290) * Math.cos(angle) - (y - 255) * Math.sin(angle)), y: 250 + scale * ((x - 290) * Math.sin(angle) + (y - 255) * Math.cos(angle)) };
  };
  return (
    <div className="hero-art" role="img" aria-label={t(textos.mapa.accesible)}>
      <div className="art-topline"><span>{t(textos.mapa.encabezado)}</span><span className="art-cross">+</span></div>
      <JourneyQuestions questions={questions}/>
      <svg className="journey-art" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <defs>
          <clipPath id="europe-window"><rect x="5" y="30" width="590" height="435" rx="4"/></clipPath>
          <linearGradient id="land-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dfeacc"/><stop offset="1" stopColor="#c4d8a8"/></linearGradient>
        </defs>
        <g clipPath="url(#europe-window)">
          <g stroke="#c9d4bd" strokeWidth=".6" opacity=".6">
            {[140, 240, 340, 440, 540].map(x => <path key={x} d={`M${x} 70V440`}/>)}
            {[140, 220, 300, 380].map(y => <path key={y} d={`M40 ${y}H540`}/>)}
          </g>
          <g transform="translate(290 250) scale(1.22) rotate(8) translate(-290 -255)">
          {europePaths.map((path, i) => <path key={i} d={path} fill="url(#land-gradient)" stroke="#a7ba98" strokeWidth=".7" fillRule="evenodd"/>)}
          </g>
        </g>
        {points.map((source, index) => {
          const start = rotatePoint(source.x, source.y);
          return <g key={source.name} className="journey-connection-wave" style={{ "--wave-delay": `${index * 3}s` } as CSSProperties}>
            <circle className="journey-city-pulse" cx={start.x} cy={start.y} r="11"/>
            {points.filter(target => target.name !== source.name).map(target => {
              const end = rotatePoint(target.x, target.y);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2 - Math.min(18, Math.abs(start.x - end.x) * .08);
              const path = `M${start.x} ${start.y} Q${midX} ${midY} ${end.x} ${end.y}`;
              const maskId = `trail-${index}-${target.name}`;
              return <g key={target.name}>
                <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
                  <path className="journey-trail-mask" d={path} pathLength="100"/>
                </mask>
                <path d={path} mask={`url(#${maskId})`}/>
              </g>;
            })}
          </g>;
        })}
        {points.map(city => {
          const position = rotatePoint(city.x, city.y);
          return <g key={city.name} className="journey-city">
            <circle cx={position.x} cy={position.y} r="7" fill="#edf4e2" stroke="#617e52"/><circle cx={position.x} cy={position.y} r="2.8" fill="#304b31"/>
            <text x={position.x + city.dx} y={position.y + city.dy} textAnchor={"anchor" in city ? city.anchor : "start"}>{city.name}</text>
          </g>;
        })}
        <g className="journey-disciplines">
          <path d="M95 505 H505" stroke="#bccbb2"/>
          <circle cx="112" cy="505" r="4"/><circle cx="300" cy="505" r="4"/><circle cx="488" cy="505" r="4"/>
          <text x="112" y="528" textAnchor="middle">{t(textos.mapa.ingenieria)}</text>
          <text x="300" y="528" textAnchor="middle">{t(textos.mapa.lenguaje)}</text>
          <text x="488" y="528" textAnchor="middle">{t(textos.mapa.ia)}</text>
        </g>
      </svg>
      <div className="art-bottomline"><span>{t(textos.mapa.lema1)}<br/>{t(textos.mapa.lema2)}</span></div>
    </div>
  );
}
