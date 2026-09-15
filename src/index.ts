/**
 * Characters that String.prototype.normalize("NFD") cannot decompose, mapped
 * to their Latin-ASCII replacement.
 */
const SPECIALS: Record<string, string> = {
  ª: "a",
  º: "o",
  Æ: "AE",
  æ: "ae",
  Œ: "OE",
  œ: "oe",
  Ĳ: "IJ",
  ĳ: "ij",
  Ð: "D",
  ð: "d",
  Þ: "TH",
  þ: "th",
  ß: "s",
  Ø: "O",
  ø: "o",
  Đ: "D",
  đ: "d",
  Ħ: "H",
  ħ: "h",
  ı: "i",
  ĸ: "k",
  Ŀ: "L",
  ŀ: "l",
  Ł: "L",
  ł: "l",
  ŉ: "n",
  Ŋ: "N",
  ŋ: "n",
  Ŧ: "T",
  ŧ: "t",
  ſ: "s",
  ɑ: "a",
  "€": "E",
  "£": "",
};

const SPECIALS_RE = new RegExp(`[${Object.keys(SPECIALS).join("")}]`, "gu");

const MARKS_RE = /\p{M}/gu;

const GERMAN_RULES: Record<string, string> = {
  Ä: "Ae",
  ä: "ae",
  Ö: "Oe",
  ö: "oe",
  Ü: "Ue",
  ü: "ue",
  ß: "ss",
};

const DANISH_RULES: Record<string, string> = {
  Æ: "Ae",
  æ: "ae",
  Ø: "Oe",
  ø: "oe",
  Å: "Aa",
  å: "aa",
};

const SERBIAN_RULES: Record<string, string> = {
  Đ: "DJ",
  đ: "dj",
};

const LOCALE_RULES: Record<string, Record<string, string>> = {
  de_de: GERMAN_RULES,
  de_de_formal: GERMAN_RULES,
  de_ch: GERMAN_RULES,
  de_ch_informal: GERMAN_RULES,
  da_dk: DANISH_RULES,
  sr_rs: SERBIAN_RULES,
  bs_ba: SERBIAN_RULES,
};

const SEQUENCE_RULES: Record<string, Record<string, string>> = {
  ca: { l·l: "ll" },
};

/**
 * Fold diacritics to their Latin-ASCII base letters.
 *
 * Uses native Unicode decomposition (NFD + mark stripping) for accented
 * letters, plus a small replacement map for characters that do not decompose
 * (ligatures, eth, thorn, etc.).
 *
 * @param input - The string to fold.
 * @param locale - Optional locale code for special rules, e.g. `de_DE`,
 *   `de_DE_formal`, `de_CH`, `de_CH_informal`, `da_DK`, `ca`, `sr_RS`, `bs_BA`.
 *   Locale matching is case-insensitive.
 */
export function fold(input: string, locale?: string): string {
  const key = locale?.toLowerCase().replace(/-/g, "_");
  let str = input;

  if (key) {
    const sequences = SEQUENCE_RULES[key];
    if (sequences) {
      for (const [from, to] of Object.entries(sequences)) {
        str = str.replaceAll(from, to);
      }
    }
    const rules = LOCALE_RULES[key];
    if (rules) {
      for (const [from, to] of Object.entries(rules)) {
        str = str.replaceAll(from, to);
      }
    }
  }

  str = str.normalize("NFD").replace(MARKS_RE, "");
  return str.replace(SPECIALS_RE, (c) => SPECIALS[c]!);
}

export default fold;
