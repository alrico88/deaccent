# deaccent

Fold accented and diacritic characters to their Latin-ASCII base letters.
Zero dependencies, one small file, dual ESM + CJS.

Port of the classic WordPress-style `remove_diacritics` string map, rebuilt
with native Unicode handling: `String.prototype.normalize("NFD")` plus
combining-mark stripping covers accented letters natively, and a small map
handles what decomposition can't (ligatures like `Æ`, `Œ`, eth `ð`, thorn
`þ`, sharp s `ß`, and friends).

Requires ES2021 (`String.prototype.replaceAll`): Node 15+, modern browsers.

```ts
import { fold } from "deaccent";

fold("Hèllo wörld"); // "Hello world"
fold("Đakovo đak", "sr_RS"); // "DJakovo djak"
```

## API

```ts
fold(input: string, locale?: string): string
```

Pass a locale for special-case rules:

| Locale(s)                                          | Rule                                   | Example                                  |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| `de_DE`, `de_DE_formal`, `de_CH`, `de_CH_informal` | `Ä`→`Ae`, `Ö`→`Oe`, `Ü`→`Ue`, `ß`→`ss` | `fold("Ärger", "de_DE")` → `"Aerger"`    |
| `da_DK`                                            | `Æ`→`Ae`, `Ø`→`Oe`, `Å`→`Aa`           | `fold("Århus", "da_DK")` → `"Aarhus"`    |
| `sr_RS`, `bs_BA`                                   | `Đ`→`DJ`                               | `fold("Đakovo", "sr_RS")` → `"DJakovo"`  |
| `ca`                                               | `l·l`→`ll`                             | `fold("paral·lel", "ca")` → `"parallel"` |

Locale matching is case-insensitive and accepts `-` or `_` separators
(`de-de`, `DE_DE`, `da_DK`…). Without a locale, umlauts fold to single
letters (`Ä`→`A`).

Without a matching rule set, every locale falls back to plain folding.

## What it handles natively

Everything that decomposes under NFD folds for free: Latin-1 accented
letters, Latin Extended-A/B, Vietnamese precomposed characters, and stacked
diacritics like `Ǻ` or `Ǟ`. The replacement map only covers the 34
characters Unicode cannot decompose (ligatures, `Đ`, `Ł`, `ø`, `€`…).

## Development

```bash
vp install   # dependencies
vp test      # unit tests (vitest)
vp check     # format, lint, type check
vp pack      # build dual ESM + CJS to dist/
```

## License

MIT
