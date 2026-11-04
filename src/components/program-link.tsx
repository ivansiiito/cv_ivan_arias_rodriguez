import { ArrowUpRight } from "lucide-react";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

export function ProgramLink({ name, program, locale = "es" }: { name: string; program?: { url: string; detail?: string }; locale?: Locale }) {
  if (!program) return name;
  const details = [textos.formacion.folleto, textos.formacion.plan, textos.formacion.mbaEdicion, textos.formacion.planTeleco, textos.formacion.mlops];
  const detail = details.find(item => item.es === program.detail);
  const label = `${translate(textos.formacion.informacion, locale)} ${name}${program.detail ? ` (${detail ? translate(detail, locale) : program.detail})` : ""} ${translate(textos.certificados.nuevaVentana, locale)}`;
  return <a className="program-link" href={program.url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>{name} <ArrowUpRight size={16} aria-hidden="true"/></a>;
}
