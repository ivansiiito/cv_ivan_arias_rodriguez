"use client";

import { useRef, useState, type PointerEvent } from "react";

const brands = [
  { name: "Universidad Politécnica de Madrid", src: "/logos/upm.svg", size: [300, 150], crop: [21, 21, 258, 108] },
  { name: "Banco de España", src: "/logos/banco-espana.svg", size: [113, 25], crop: [0, 0, 113, 25] },
  { name: "Nokia", src: "/logos/nokia.svg", size: [313, 53], crop: [0, 0, 313, 53] },
  { name: "Teknillinen korkeakoulu", src: "/logos/tkk.png", size: [369, 269], crop: [5, 3, 362, 257] },
  { name: "SetaLoca", src: "/logos/setaloca.jpg", size: [482, 636], crop: [0, 0, 482, 636] },
  { name: "latostadora", src: "/logos/latostadora.png", size: [206, 31], crop: [0, 0, 206, 31] },
  { name: "Cámara de Comercio de Granada", src: "/logos/camara-granada.svg", size: [300, 102], crop: [1, 3, 298, 96] },
  { name: "Universidad Complutense de Madrid", src: "/logos/ucm.jpg", size: [1577, 406], crop: [0, 0, 1577, 406] },
  { name: "Toucan", src: "/logos/toucan.jpg", size: [1357, 768], crop: [0, 0, 1357, 768] },
  { name: "Instituto Politécnico de Bragança", src: "/logos/braganca.svg", size: [986, 181], crop: [0, 0, 986, 181] },
  { name: "Text Radar", src: "/logos/textradar-transparent.png", size: [340, 225], crop: [16, 9, 310, 205] },
];

export function CareerBrands() {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; time: number; scroll: number; animation?: Animation } | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !trackRef.current) return;
    const animation = trackRef.current.getAnimations().find(item => item.effect?.getTiming().duration === 85000);
    dragRef.current = { x: event.clientX, time: Number(animation?.currentTime ?? 0), scroll: event.currentTarget.scrollLeft, animation };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || !trackRef.current) return;
    const delta = event.clientX - drag.x;
    if (drag.animation) {
      const cycleWidth = trackRef.current.scrollWidth / 2;
      if (cycleWidth > 0) drag.animation.currentTime = ((drag.time - delta / cycleWidth * 85000) % 85000 + 85000) % 85000;
    } else {
      event.currentTarget.scrollLeft = drag.scroll - delta;
    }
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }
  return <div className="career-strip"><div className="container career-strip-inner">
    <span className="career-strip-label">UN CAMINO CONSTRUIDO EN</span>
    <div className={`career-marquee${dragging ? " is-dragging" : ""}`} tabIndex={0} role="region" aria-label="Organizaciones de mi trayectoria" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragStart={event => event.preventDefault()}>
      <div ref={trackRef} className={`career-track${paused ? " is-paused" : ""}`}>
        {[0, 1].map(copy => <div className="career-brands" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {brands.map(brand => <div className="career-brand" key={brand.name}>{brand.name === "SetaLoca"
            ? <div className="setaloca-horizontal" role={copy === 0 ? "img" : undefined} aria-label={copy === 0 ? "SetaLoca" : undefined}>
                <svg className="setaloca-mascot" viewBox="95 12 270 380" aria-hidden="true"><image href={brand.src} width="482" height="636"/></svg>
                <svg className="setaloca-wordmark" viewBox="110 405 250 190" aria-hidden="true"><image href={brand.src} width="482" height="636"/></svg>
              </div>
            : <svg className="career-logo-crop" viewBox={brand.crop.join(" ")} role={copy === 0 ? "img" : undefined} aria-label={copy === 0 ? brand.name : undefined} aria-hidden={copy === 1 ? true : undefined} style={{ width: Math.min(150, 64 * brand.crop[2] / brand.crop[3]), aspectRatio: `${brand.crop[2]} / ${brand.crop[3]}` }}><image href={brand.src} width={brand.size[0]} height={brand.size[1]} /></svg>}</div>)}
        </div>)}
      </div>
    </div>
    <button type="button" className="career-pause" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Reanudar" : "Pausar"}<span className="sr-only"> desplazamiento de logos</span></button>
  </div></div>;
}
