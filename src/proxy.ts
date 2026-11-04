import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/locale";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const segment = request.nextUrl.pathname.split("/")[1];
  headers.set("x-page-locale", isLocale(segment) ? segment : "es");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/", "/(ca|en|fr|it|pt|fi|ru)/:path*", "/proyectos/:path*"] };
