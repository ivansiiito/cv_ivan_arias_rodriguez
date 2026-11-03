import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

test("desktop: complete content, valid anchors, no browser errors and visual preview", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle(/Iván Arias/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ingeniería.Lenguaje.Inteligencia.");
  await expect(page.locator("main section[id]")).toHaveCount(4);
  for (const href of await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")))) {
    expect(await page.locator(href!).count()).toBe(1);
  }
  await expect(page.locator(".project-card")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  mkdirSync(".local/screenshots", { recursive: true });
  await page.screenshot({ path: ".local/screenshots/desktop.png", fullPage: true, animations: "disabled" });
  await page.screenshot({ path: ".local/screenshots/desktop-hero.png", animations: "disabled" });
  expect(errors).toEqual([]);
});

test("portfolio filters, project pages and next project navigation work", async ({ page }) => {
  await page.goto("/#proyectos");
  await page.getByRole("button", { name: "Lenguaje", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.getByRole("status").first()).toContainText("1 proyecto en lenguaje");
  await page.getByRole("link", { name: "Ver proyecto: El lenguaje como punto de partida" }).click();
  await expect(page).toHaveURL(/proyectos\/linguistica-computacional/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("El lenguaje como punto de partida");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator(".contributions li")).toHaveCount(4);
  await page.screenshot({ path: ".local/screenshots/project.png", fullPage: true, animations: "disabled" });
  await page.getByRole("link", { name: /SIGUIENTE PROYECTO/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Conectar lo que viene");
  await page.getByRole("link", { name: "Volver a proyectos" }).click();
  await page.getByRole("button", { name: "Producto", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Ver proyecto: La Tostadora" }).click();
  await expect(page.getByRole("link", { name: "Visitar La Tostadora" })).toHaveAttribute("href", "https://www.latostadora.com/");
  await page.getByRole("link", { name: "Volver a proyectos" }).click();
  await page.getByRole("button", { name: /Todos/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
});

test("career, languages, download and clipboard expose the real profile", async ({ page, context, request }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator(".languages-details summary").click();
  await expect(page.locator(".languages-grid > div")).toHaveCount(8);
  await expect(page.getByText("C1 · Uso profesional", { exact: true })).toBeVisible();
  const nokia = page.locator(".experience-item").filter({ hasText: "Ingeniero de investigación y desarrollo" });
  await nokia.locator(":scope > summary").click();
  await expect(nokia.locator(".experience-description")).toBeVisible();
  await expect(nokia.locator(".experience-description")).toContainText("Helsinki");
  await page.getByRole("button", { name: "Copiar correo electrónico" }).click();
  await expect(page.getByText("Correo copiado al portapapeles.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("ivan.arias.rodriguez@gmail.com");
  const download = page.waitForEvent("download");
  await page.locator(".hero-actions").getByRole("link", { name: "Descargar CV" }).click();
  expect((await download).suggestedFilename()).toBe("Ivan-Arias-Rodriguez-CV.docx");
  const cv = await request.get("/cv-ivan-arias-rodriguez.docx");
  expect(cv.status()).toBe(200);
  expect(cv.headers()["content-type"]).toContain("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  expect((await cv.body()).subarray(0, 4)).toEqual(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});

test("mobile: navigation, Escape, reading order and overflow at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).not.toBeVisible();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.getByRole("navigation").getByRole("link", { name: "Formación" }).click();
  await expect(page).toHaveURL(/#formacion/);
  await expect(page.getByRole("navigation")).not.toBeVisible();
  for (const width of [320, 360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ path: ".local/screenshots/mobile.png", fullPage: true, animations: "disabled" });
  await page.screenshot({ path: ".local/screenshots/mobile-hero.png", animations: "disabled" });
  await page.goto("/proyectos/la-tostadora");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("keyboard, reduced motion, accessibility and honest missing-page behavior", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  expect(await page.locator(".orb-art").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  await page.goto("/proyectos/la-tostadora");
  const detailResult = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(detailResult.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  const response = await page.goto("/esta-pagina-no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
});
