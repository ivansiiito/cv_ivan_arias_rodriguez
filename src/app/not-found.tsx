import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main id="contenido" className="not-found"><span className="section-kicker">404 — UN CAMINO POR EXPLORAR</span><h1>Esta conexión<br/>aún no existe.</h1><p>La página que buscas no está aquí. Volvamos al punto de partida.</p><Link className="button button-dark" href="/"><ArrowLeft size={18}/> Volver al inicio</Link></main>;
}
