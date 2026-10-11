# V2.2 asset provenance

Fetched and inspected: 2026-10-09.

## The 19 ecosystem brand icons

The mapping below exactly matches the 19 entries in `shared/content.json` → `ECOSYSTEM`, in the same order. These are downloaded brand SVGs; generic UI icons were not redrawn as brand marks. No runtime CDN is needed.

| Tool | Local public path | Download source |
|---|---|---|
| ChatGPT | `/images/tools/chatgpt.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/openai.svg) |
| Claude | `/images/tools/claude.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/claude-color.svg) |
| Gemini | `/images/tools/gemini.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/gemini-color.svg) |
| DeepSeek | `/images/tools/deepseek.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/deepseek-color.svg) |
| Kimi | `/images/tools/kimi.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/kimi-color.svg) |
| Zhipu AI | `/images/tools/zhipu-ai.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/zhipu-color.svg) |
| Copilot | `/images/tools/copilot.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/githubcopilot.svg) |
| Codex | `/images/tools/codex.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/codex-color.svg) |
| Lovable | `/images/tools/lovable.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/lovable-color.svg) |
| v0 | `/images/tools/v0.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/v0.svg) |
| Google AI Studio | `/images/tools/google-ai-studio.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/aistudio.svg) |
| Devin | `/images/tools/devin.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/devin-color.svg) |
| Railway | `/images/tools/railway.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/railway.svg) |
| Supabase | `/images/tools/supabase.svg` | [SVG](https://cdn.jsdelivr.net/npm/simple-icons@16.34.0/icons/supabase.svg) |
| Netlify | `/images/tools/netlify.svg` | [SVG](https://cdn.jsdelivr.net/npm/simple-icons@16.34.0/icons/netlify.svg) |
| Vercel | `/images/tools/vercel.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/vercel.svg) |
| GitHub | `/images/tools/github.svg` | [SVG](https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.95.1/icons/github.svg) |
| Termux | `/images/tools/termux.svg` | [SVG](https://upload.wikimedia.org/wikipedia/commons/b/b5/Termux.svg) |
| Reqable | `/images/tools/reqable.svg` | [SVG](https://reqable.com/en-US/img/logo.svg) |

### Icon provenance and license notes

- Fifteen icons use Lobe Icons `@lobehub/icons-static-svg` **1.95.1**, distributed under the MIT license. The source collection is https://github.com/lobehub/lobe-icons . The MIT notice is preserved in `docs/asset-licenses/lobe-icons-MIT.txt`.
- ChatGPT uses the familiar OpenAI knot (`openai.svg`). Copilot uses **GitHub Copilot** (`githubcopilot.svg`), consistent with the supplied description of help writing code in an editor. It does not use the unrelated Microsoft Copilot ribbon. Zhipu AI uses the supplied Zhipu brand, rather than silently replacing the content label with Z.ai.
- Supabase and Netlify use Simple Icons **16.34.0**. The collection's CC0 notice is preserved in `docs/asset-licenses/simple-icons-CC0.txt`. Original SVG source paths are retained unchanged. Brand/trademark rights are separate from the icon collection's copyright license.
- Reqable is downloaded directly from the official Reqable website: https://reqable.com/en-US/ . A general logo reuse license was not located; this is an attribution/source record, not a claim that the brand asset is freely licensed.
- Termux is the existing SVG from https://commons.wikimedia.org/wiki/File:Termux.svg , credited there to Termux.com. That page displays both a simple-geometric-shape public-domain notice and a GPLv3 license notice. The source SVG is supplied unchanged; the Termux repository license notice and GPLv3 text are preserved in `docs/asset-licenses/`. No stronger license claim is made here.
- All SVGs were parsed as XML and checked for script elements, event handlers, `foreignObject`, and embedded raster images. All 19 passed.
- Several SVGs are monochrome and contain `currentColor` or implicit black fills. When using them with external `<img>`, a parent text color does not propagate into the SVG. Use a light icon tile or an explicit CSS filter for monochrome assets on a dark surface. Do not invert multicolor brand files.

## User-selected Pinterest imagery

These five JPG files are the original CDN images exposed by the exact pin pages supplied by the user. They were downloaded and visually inspected, with no generated replacements, redrawing, recompression, or changes to the source pixels. Crop/framing should be done in CSS.

| Intended character/image | Local public path | Dimensions | Provenance |
|---|---|---|---|
| Elaina | `/images/anime-v22/elaina.jpg` | 720 × 1200 | [Requested pin](https://www.pinterest.com/pin/1130192469019479631/) · [Returned canonical pin](https://www.pinterest.com/pin/668503138481686362/) · [Original image](https://i.pinimg.com/originals/f6/7f/a7/f67fa711ebbb73927043191f5870c24b.jpg) |
| Hiyori Shiina · sunset | `/images/anime-v22/hiyori.jpg` | 720 × 1175 | [Requested pin](https://www.pinterest.com/pin/846113848787698598/) · [Returned canonical pin](https://www.pinterest.com/pin/846113848787698598/) · [Original image](https://i.pinimg.com/originals/a8/92/0a/a8920aa6de6ca8564ec5e76aece25fc4.jpg) |
| Hiyori Shiina · library alternate | `/images/anime-v22/hiyori-library.jpg` | 1152 × 1728 | [Requested pin](https://www.pinterest.com/pin/1086986060069337973/) · [Returned canonical pin](https://www.pinterest.com/pin/713398397267028599/) · [Original image](https://i.pinimg.com/originals/12/a0/53/12a05348362df7e32cd0a710da37f91f.jpg) |
| Arisu Sakayanagi | `/images/anime-v22/arisu.jpg` | 936 × 1664 | [Requested pin](https://www.pinterest.com/pin/287737863685486930/) · [Returned canonical pin](https://www.pinterest.com/pin/593490057174062873/) · [Original image](https://i.pinimg.com/originals/73/56/88/735688d2b3d2b2cd0d5594346241f1fc.jpg) |
| Arisu + Ayanokoji | `/images/anime-v22/duo.jpg` | 736 × 981 | [Requested pin](https://www.pinterest.com/pin/1090363759772416739/) · [Returned canonical pin](https://www.pinterest.com/pin/1090363759772416739/) · [Original image](https://i.pinimg.com/originals/8f/f4/fe/8ff4fe45bf6378a06033c12e354b63e1.jpg) |

### Pinterest limitations

- Several requested pins return a different canonical pin ID. Both the requested and returned IDs are recorded above; the original image URLs were taken from the fetched page metadata/data, not invented from a filename.
- The library Hiyori alternative returned an inconsistent Pinterest title (`Tsubasa`). The image itself was visually inspected and retained as the user-selected alternate; Pinterest title metadata is not treated as authoritative character identification or artist attribution.
- Pinterest is an aggregator. The original artist, rights holder, and a public redistribution license for these particular images were not verified. These files are user-selected reference assets, not claimed to be original portfolio artwork, official promotional art, public domain, or licensed stock.
- Preserve these source notes when sharing the project. Replacing an image requires changing only the corresponding local public file or the content image path.

## Scope

This asset pass changed only `public/images/tools/`, `public/images/anime-v22/`, and this documentation plus license notices. It did not alter application components, content JSON, routing, APIs, or build configuration.

## Landscape and Open Graph

- `/images/exploration-landscape.webp`: generated landscape, no text, logos, people, or user identity. Used as scenery in hero/journey/orbit. Optimized WebP (~284 KB).
- `/og-image.jpg`: 1200×630 native browser rendering of `docs/design/og-layout.html`, using the same scenery and authentic `pp.webp` / `pp-dev.webp`.
- Personal portrait and avatar are the unchanged existing WebP derivatives; no generated replacement face.
