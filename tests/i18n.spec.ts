import { test, expect } from "@playwright/test";

test("language selector preserves page and anchor and sets the document language", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/#formacion");
  await page.locator(".language-selector summary").click();
  await page.locator(".language-options").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en#formacion$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Engineering.Language.Intelligence.");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.goto("/en/proyectos/linguistica-computacional");
  await expect(page.locator(".language-art")).toContainText("meaning");
  await page.locator(".language-selector summary").click();
  await page.locator(".language-options").getByRole("link", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/proyectos\/linguistica-computacional$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  expect(errors).toEqual([]);
});

test("English remains usable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("an unknown English page keeps the English interface", async ({ page }) => {
  await page.goto("/en/no-existe");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/en");
});

test("all eight languages are listed in order and their routes and project links work", async ({ page }) => {
  await page.goto("/");
  await page.locator(".language-selector summary").click();
  await expect(page.locator(".language-options a")).toHaveText(["Español", "Català", "English", "Français", "Italiano", "Português", "Suomi", "Русский"]);
  for (const lang of ["ca", "en", "fr", "it", "pt", "fi", "ru"]) {
    await page.goto(`/${lang}/#proyectos`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator(".project-card").first().locator(".project-cover")).toHaveAttribute("href", `/${lang}/proyectos/textradar`);
    await page.goto(`/${lang}/proyectos/textradar`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".project-back")).toHaveAttribute("href", `/${lang}/#proyectos`);
    await page.setViewportSize({ width: 320, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow in ${lang}`).toBe(true);
    await page.setViewportSize({ width: 1280, height: 800 });
  }
});
