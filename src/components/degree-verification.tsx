import { ArrowUpRight } from "lucide-react";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

export function DegreeVerification({ locale = "es" }: { locale?: Locale }) {
  return <a href="https://sede.educacion.gob.es/registrotitulos/mostrarAutorizacion.action?ticket=31ba10bda670b653d68268b7ef87fefc04bede6d" target="_blank" rel="noopener noreferrer">{translate(textos.certificados.verificar, locale)} <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> {translate(textos.certificados.nuevaVentana, locale)}</span></a>;
}
