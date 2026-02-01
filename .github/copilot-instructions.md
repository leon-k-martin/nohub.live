# Copilot Instructions – nohub.online

## Project Overview
Single-page artist website for **nohub**, a live act performing improvised club music (house, techno, funk, breakbeat). The site should be playful, interactive, and evoke early 2000s web aesthetics ("Neo-Y2K").

**Source of truth:** [website-plan.md](../website-plan.md) contains the complete spec, content inventory, and design direction.

## Architecture
- **Framework:** Vanilla HTML + CSS + JavaScript (no build step)
- **Structure:** One-pager with scroll sections: Hero → Listen → Watch → Gallery → Book
- **Hosting target:** Static hosting (Netlify, GitHub Pages)
- **Package manager:** Use `uv` for Python dependencies (venv at `.venv/`)

## Key Assets & Locations
| Asset | Path |
|-------|------|
| Branding (banners, logo frame) | `static/img/` |
| Photos | `static/img/photos/*.jpeg` |
| Audio pads | `static/audio/pads/*.wav` |
| Video snippets | `static/video/snippets/*.mp4` |
| Tech rider PDF | `static/pdf/techrider.pdf` |

**Adding new content:** Simply drop files into the appropriate folder. Code should dynamically discover assets rather than hardcode counts.

## Design Conventions
- **Colors:** Primary palette from brand frame — yellow `#E8D84E` (background), blue `#3D4B9A` (text/accents), red `#C13A3A` (accents/borders). Synth keyboard is the exception: toy piano colors allowed.
- **Typography:** Screen-printed look with slight imperfections — use fonts like `'Courier New'` or pixel fonts, with subtle rotation/offset for hand-printed feel
- **Background:** Yellow paper texture (from `nohub_frame mit subline.png`)
- **Layout quirks:** Dashed red borders, tilted elements, hand-drawn feel, NO glows or gradients
- **Interactivity:** Sound on click/hover, draggable elements, video hover-to-play

## Do Not
- Add build tools, bundlers, or frameworks unless explicitly requested
- Remove the interactive synth keyboard—it's core to the site's identity
- Use generic stock imagery—only use provided assets in `static/`
