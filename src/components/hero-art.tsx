import europePaths from "../data/europe-paths.json";
import type { CSSProperties } from "react";

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
const questions = [
  "¿Por qué?", "Why?", "Miksi?", "Per què?", "Porquê?", "Zergatik?", "Por que?",
  "Pourquoi ?", "Warum?", "Perché?", "Pse?", "Ինչո՞ւ", "Niyə?", "Чаму?",
  "Zašto?", "Защо?", "Γιατί;", "Hvorfor?", "Prečo?", "Zakaj?", "Miks?",
  "რატომ?", "Miért?", "Cén fáth?", "Af hverju?", "Неліктен?", "Kāpēc?",
  "Kodėl?", "Firwat?", "Зошто?", "Għaliex?", "De ce?", "Waarom?",
  "Dlaczego?", "Proč?", "Почему?", "Зашто?", "Varför?", "Neden?", "Чому?",
];

export function HeroArt() {
  const points = cities.map(city => ({ ...city, ...project(city.lon, city.lat) }));
  const rotatePoint = (x: number, y: number) => {
    const angle = 8 * Math.PI / 180;
    const scale = 1.22;
    return { x: 290 + scale * ((x - 290) * Math.cos(angle) - (y - 255) * Math.sin(angle)), y: 250 + scale * ((x - 290) * Math.sin(angle) + (y - 255) * Math.cos(angle)) };
  };
  return (
    <div className="hero-art" role="img" aria-label="Mapa de Europa con Madrid, Barcelona, Helsinki, Kiev, Braganza y Granada; ingeniería, lenguaje e inteligencia artificial como disciplinas conectadas.">
      <div className="art-topline"><span>UNA TRAYECTORIA CONECTADA</span><span className="art-cross">+</span></div>
      <div className="journey-questions" aria-hidden="true">
        {questions.map((question, index) => {
          const x = (index * 37 + 17) % 101;
          const y = (index * 61 + 29) % 101;
          const angle = ((index * 137 + 41) % 360) * Math.PI / 180;
          const style = {
            animationDuration: `${questions.length * 4}s`,
            animationDelay: `${index * 4}s`,
            "--question-x": `${10 + x * .42}%`,
            "--question-y": `${12 + y * .65}%`,
            "--drift-x": `${Math.cos(angle) * 8}px`,
            "--drift-y": `${Math.sin(angle) * 8}px`,
          } as CSSProperties;
          return <span key={question} style={style}>{question}</span>;
        })}
      </div>
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
          <text x="112" y="528" textAnchor="middle">INGENIERÍA</text>
          <text x="300" y="528" textAnchor="middle">LENGUAJE</text>
          <text x="488" y="528" textAnchor="middle">INTELIGENCIA ARTIFICIAL</text>
        </g>
      </svg>
      <div className="art-bottomline"><span>Cada lugar, una pieza.<br/>Cada lengua, una nueva pregunta.</span></div>
    </div>
  );
}
