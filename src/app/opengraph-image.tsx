import { ImageResponse } from "next/og";

export const alt = "Iván Arias Rodríguez — Ingeniería, lenguaje e inteligencia artificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", padding: "65px 80px", background: "#f7f8f2", color: "#26372b", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 28 }}>Iván Arias Rodríguez.</div><div style={{ display: "flex", flexDirection: "column", marginTop: 45, fontSize: 86, letterSpacing: -4, lineHeight: 1.05 }}><span>Ingeniería. Lenguaje.</span><span style={{ color: "#71855d" }}>Inteligencia.</span></div><div style={{ display: "flex", marginTop: 48, fontSize: 25 }}>Ingeniero de telecomunicación · Doctor en Lingüística</div><div style={{ display: "flex", marginTop: 22, fontSize: 20, color: "#6c7565" }}>Iván Arias Rodríguez · Madrid, España</div><div style={{ position: "absolute", right: 80, bottom: 65, display: "flex", width: 110, height: 110, borderRadius: "50%", background: "#cef09d", alignItems: "center", justifyContent: "center", fontSize: 64 }}>↗</div></div>, size);
}
