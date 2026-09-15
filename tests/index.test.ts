import { describe, expect, test } from "vite-plus/test";
import { fold, default as foldDefault } from "../src/index.ts";

describe("basic folding", () => {
  test("strips Spanish accents", () => {
    expect(fold("áéíóúñÁÉÍÓÚÑ")).toBe("aeiounAEIOUN");
  });

  test("strips French and Portuguese accents", () => {
    expect(fold("Crème brûlée à la mode")).toBe("Creme brulee a la mode");
    expect(fold("são páulo")).toBe("sao paulo");
  });

  test("strips Vietnamese diacritics", () => {
    expect(fold("Hà Nội")).toBe("Ha Noi");
    expect(fold("Việt Nam")).toBe("Viet Nam");
    expect(fold("đường")).toBe("duong");
  });

  test("strips Czech, Polish and Nordic diacritics", () => {
    expect(fold("Dvořák")).toBe("Dvorak");
    expect(fold("Żółć")).toBe("Zolc");
    expect(fold("smörgåsbord")).toBe("smorgasbord");
  });

  test("expands ligatures and special letters", () => {
    expect(fold("Œuf œuf")).toBe("OEuf oeuf");
    expect(fold("Ĳsselmeerĳ")).toBe("IJsselmeerij");
    expect(fold("Ærø")).toBe("AEro");
    expect(fold("þorn Ð Đ")).toBe("thorn D D");
    expect(fold("ß Straße")).toBe("s Strase");
  });

  test("maps currency symbols like the original", () => {
    expect(fold("€100 £5")).toBe("E100 5");
  });

  test("leaves plain ASCII untouched", () => {
    expect(fold("abc XYZ 123 !?")).toBe("abc XYZ 123 !?");
  });

  test("handles empty string", () => {
    expect(fold("")).toBe("");
  });

  test("keeps emoji and astral chars intact", () => {
    expect(fold("héllo 🎉 mundo")).toBe("hello 🎉 mundo");
  });
});

describe("locale rules", () => {
  test("german default folds umlauts to single letters", () => {
    expect(fold("ÄÖÜäöüß")).toBe("AOUaous");
  });

  test("german locale expands umlauts and sharp s", () => {
    expect(fold("ÄÖÜäöüß Straße", "de_DE")).toBe("AeOeUeaeoeuess Strasse");
  });

  test("german locale variants share the same rules", () => {
    const expected = "AeOeUeaeoeuess";
    expect(fold("ÄÖÜäöüß", "de_DE_formal")).toBe(expected);
    expect(fold("ÄÖÜäöüß", "de_CH")).toBe(expected);
    expect(fold("ÄÖÜäöüß", "de_CH_informal")).toBe(expected);
  });

  test("danish locale expands Æ Ø Å", () => {
    expect(fold("Æble øl Åhus", "da_DK")).toBe("Aeble oel Aahus");
    expect(fold("Æble øl Åhus")).toBe("AEble ol Ahus");
  });

  test("serbian and bosnian expand D with stroke", () => {
    expect(fold("Đakovo đak", "sr_RS")).toBe("DJakovo djak");
    expect(fold("Đakovo đak", "bs_BA")).toBe("DJakovo djak");
    expect(fold("Đakovo đak")).toBe("Dakovo dak");
  });

  test("catalan middle-dot gemination", () => {
    expect(fold("paral·lel", "ca")).toBe("parallel");
    expect(fold("paral·lel")).toBe("paral·lel");
  });

  test("locale matching is case-insensitive and accepts dashes", () => {
    expect(fold("ÄÖÜäöüß", "DE_DE")).toBe("AeOeUeaeoeuess");
    expect(fold("ÄÖÜäöüß", "de-de")).toBe("AeOeUeaeoeuess");
  });

  test("unknown locale falls back to plain folding", () => {
    expect(fold("ÄÖÜ", "es_ES")).toBe("AOU");
  });
});

describe("exports", () => {
  test("default export matches named export", () => {
    expect(foldDefault("héllo", "de_DE")).toBe(fold("héllo", "de_DE"));
  });
});
