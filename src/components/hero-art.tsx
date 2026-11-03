export function HeroArt() {
  return (
    <div className="hero-art" aria-label="Ilustración abstracta: una esfera de conexiones entre ingeniería, lenguaje e inteligencia artificial" role="img">
      <div className="art-topline"><span>EXPLORANDO CONEXIONES</span><span className="art-cross">+</span></div>
      <svg className="orb-art" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="orb-fill" cx=".32" cy=".25" r=".85"><stop stopColor="#e9fbc7"/><stop offset=".5" stopColor="#c5e994"/><stop offset="1" stopColor="#7c9c58"/></radialGradient>
          <radialGradient id="orb-halo"><stop stopColor="#c5dc9e" stopOpacity=".5"/><stop offset="1" stopColor="#c5dc9e" stopOpacity="0"/></radialGradient>
          <linearGradient id="orbit-color"><stop stopColor="#597448" stopOpacity=".1"/><stop offset=".5" stopColor="#385235"/><stop offset="1" stopColor="#597448" stopOpacity=".1"/></linearGradient>
          <clipPath id="orb-clip"><circle cx="300" cy="295" r="171"/></clipPath>
        </defs>
        <circle cx="300" cy="310" r="272" fill="url(#orb-halo)"/>
        <g className="orb-orbits">
          <ellipse cx="300" cy="295" rx="267" ry="79" transform="rotate(-35 300 295)" stroke="#809077" strokeWidth=".8"/>
          <ellipse cx="300" cy="295" rx="238" ry="206" transform="rotate(22 300 295)" stroke="#a1ae96" strokeWidth=".6" strokeDasharray="3 6"/>
          <path d="M55 295H545M300 50V540" stroke="#b6bfae" strokeWidth=".5" strokeDasharray="3 8"/>
        </g>
        <circle cx="300" cy="295" r="171" fill="url(#orb-fill)"/>
        <g clipPath="url(#orb-clip)" stroke="#324b2b" strokeWidth=".7" opacity=".68">
          {Array.from({ length: 29 }, (_, i) => {
            const y = 128 + i * 12;
            return <path key={i} d={`M110 ${y} C195 ${y - 86}, 355 ${y + 120}, 490 ${y - 10}`} />;
          })}
          {Array.from({ length: 25 }, (_, i) => {
            const x = 125 + i * 15;
            return <path key={i} d={`M${x} 100 C${x + 100} 225, ${x - 108} 360, ${x + 13} 490`} />;
          })}
        </g>
        <ellipse cx="300" cy="295" rx="267" ry="79" transform="rotate(-35 300 295)" stroke="url(#orbit-color)" strokeWidth="1.1" strokeDasharray="460 700" strokeDashoffset="-33"/>
        <g fill="#263b29"><circle cx="103" cy="426" r="5"/><circle cx="491" cy="154" r="4"/><circle cx="457" cy="443" r="3"/></g>
        <g fill="#edf5dc" stroke="#596b45"><circle cx="222" cy="187" r="5"/><circle cx="384" cy="352" r="5"/></g>
        <g stroke="#596b45" strokeWidth=".7"><path d="M222 187 173 139H82"/><path d="M384 352 432 385H526"/></g>
        <g fill="#42533c" fontFamily="monospace" fontSize="11" letterSpacing="2"><text x="82" y="129">LENGUAJE</text><text x="437" y="405">TECNOLOGÍA</text></g>
        <circle cx="300" cy="295" r="5" fill="#2f442d"/><circle cx="300" cy="295" r="13" stroke="#2f442d" strokeWidth=".7"/>
      </svg>
      <div className="art-bottomline"><span>HUMANO EN EL ORIGEN.<br/>TECNOLÓGICO EN LA FORMA.</span><span className="art-coordinate">40°25′ N<br/>03°42′ O</span></div>
      <span className="art-side-note">FIG. 01 — UN PUNTO DE ENCUENTRO</span>
    </div>
  );
}
