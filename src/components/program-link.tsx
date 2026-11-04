import { ArrowUpRight } from "lucide-react";

export function ProgramLink({ name, program }: { name: string; program?: { url: string; detail?: string } }) {
  if (!program) return name;
  const label = `Información del programa ${name}${program.detail ? ` (${program.detail})` : ""} (se abre en una pestaña nueva)`;
  return <a className="program-link" href={program.url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>{name} <ArrowUpRight size={16} aria-hidden="true"/></a>;
}
