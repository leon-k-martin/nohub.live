# nohub – Live Act Artist Website

## Artist Profile
**nohub** is a live act performing improvised club music.
**Genres:** House, Techno, Funk, Boogie, Broken Beats, Breakbeat

**Philosophy:** Everything is improvised on the fly. The connection with the audience is at the heart of every performance — nohub often plays within the crowd, creating music that responds to the audience's energy in real-time.

---

## Content & Assets

### 🎵 Live Sets (Audio)

**Display Strategy:** Feature the most recent set prominently (embedded player). Older sets are accessible via expandable "Archive" section grouped by year.

#### ⭐ Featured (Current Vibe)
| Year | Set | Source |
|------|-----|--------|
| 2025 | Fusion 2025 | [SoundCloud](https://soundcloud.com/nohub/nohub-live-fusion-2025) |

#### 📦 Archive (Expandable/Collapsible)
| Year | Set | Source |
|------|-----|--------|
| 2023 | Kallisto (Elara Stage) | [SoundCloud](https://soundcloud.com/kallistofestival/nohub-live-elara-stage-kallisto-2023) |
| 2023 | Breakbeat Mountain (1210FM) | [SoundCloud](https://soundcloud.com/1210fm/launch-series-001-breakbeat-mountain) |

### 🎬 Video Content

**Display Strategy:** Show recent snippets/clips prominently. Older YouTube videos accessible via "Explore Archive" link or collapsible section, grouped by year.

#### ⭐ Featured Snippets (Current Vibe)
| Type | Location | Notes |
|------|----------|-------|
| Short Clips | `static/video/snippets/*.mp4` | Looping background or hover-triggered |

#### 📦 YouTube Archive (Grouped by Year)
**2024+** *(add new videos here)*
- *(none yet)*

**2023**
- https://www.youtube.com/watch?v=McWz_L10aUA
- https://www.youtube.com/watch?v=w6I10gvcvpQ

**2022 & Earlier**
- https://youtu.be/iQVpR-VGitM
- https://youtu.be/h6Z-tvN8gfY
- https://youtu.be/eFdRehwaJ1w
- https://youtu.be/jmCqDL-_eKg
- Breakbeat Mountain: https://www.youtube.com/watch?v=Gd1uykzClKg&t=3092s

### 📸 Photos
Location: `static/img/photos/*.jpeg`
Naming: `foto1.jpeg`, `foto2.jpeg`, etc. (add new photos with incrementing numbers)

### 📄 Booking Materials
| Item | Location | Action |
|------|----------|--------|
| Tech Rider PDF | `static/pdf/techrider.pdf` | Download button |
| Contact | nohub.live@proton.me | mailto: link or contact form |

### 🖼️ Branding Assets
Location: `static/img/`
- `nohub banner.png` (dark background)
- `nohub banner white hg.png` (light background)
- `nohub_frame mit subline.png` (frame with tagline)
- `nohub_favicon.ico` (favicon)

---

## Website Architecture

### Framework: Single-Page HTML (Vanilla JS + CSS)
**Why:** Lightweight, fast, no build step needed, easy to host anywhere (Netlify, GitHub Pages, etc.)

### Page Structure (Scroll Sections)
```
┌─────────────────────────────────────────┐
│  HERO                                   │
│  - Banner/logo with frame               │
│  - Tagline/subline                      │
│  - Interactive synth keyboard (playful) │
└─────────────────────────────────────────┘
          ↓ scroll
┌─────────────────────────────────────────┐
│  LISTEN                                 │
│  - Featured set embed (latest/best)     │
│  - "Explore Archive" → expands to show  │
│    older sets grouped by year           │
└─────────────────────────────────────────┘
          ↓ scroll
┌─────────────────────────────────────────┐
│  WATCH                                  │
│  - Featured video snippets (recent)     │
│  - "More Videos" → expands to YouTube   │
│    archive grouped by year              │
└─────────────────────────────────────────┘
          ↓ scroll
┌─────────────────────────────────────────┐
│  GALLERY                                │
│  - Photo collage (tilted, scattered)    │
│  - Click to enlarge or trigger sound    │
└─────────────────────────────────────────┘
          ↓ scroll
┌─────────────────────────────────────────┐
│  BOOK                                   │
│  - Short bio/pitch text                 │
│  - Tech Rider download button           │
│  - Contact email / simple form          │
│  - Social links (SoundCloud, etc.)      │
└─────────────────────────────────────────┘
```

---

## Design Direction

### Visual Style: "Screen-Printed / Handmade"
Inspired by the nohub frame logo — like a hand-printed flyer or DIY zine.

- **Color palette:** 
  - Yellow `#E8D84E` — background (paper texture)
  - Blue `#3D4B9A` — primary text and headings
  - Red `#C13A3A` — accents, dashed borders, arrows
  - Exception: Synth keyboard keeps toy piano colors (vibrant rainbow)
  
- **Typography:** 
  - Monospace or pixel fonts with screen-printed imperfections
  - Slight rotations, offsets for hand-printed feel
  - Text can have subtle "ink bleed" or rough edges
  
- **Layout quirks:**
  - Dashed red borders (like the frame)
  - Tilted elements (2-5° rotations)
  - NO glows, NO gradients — flat colors only
  - Paper/cardboard texture background
  - Red arrows as decorative elements

### Interactive Elements
1. **Synth Keyboard** (core feature)
   - Styled like a toy piano or glockenspiel — colorful rainbow keys (exception to yellow/blue/red palette)
   - Plays pitched pad samples from `static/audio/pads/`
   - Uses Web Audio API with pitch shifting via `playbackRate` (semitone ratios)
   - Gain envelope for attack/release
   - Triggers random photo display on keypress
   - Visual feedback: key bounce, color flash
   - Tilted keys (`transform: rotate(-5deg)`), drop shadows

2. **Floating/Draggable Elements**
   - Photos or icons that can be dragged around
   - Elements that drift slowly across the screen

3. **Sound on Hover/Click**
   - Photos trigger short sound samples
   - Buttons make satisfying UI sounds

4. **Video Snippets**
   - Play on hover (muted)
   - Click for sound + fullscreen

---

## Technical Implementation

### File Structure
```
/
├── index.html          # Single page
├── style.css           # All styles
├── script.js           # Interactivity
├── static/
│   ├── img/
│   │   ├── *.png       # Branding assets
│   │   └── photos/     # *.jpeg (foto1, foto2, ...)
│   ├── audio/
│   │   └── pads/       # *.wav pad samples
│   ├── video/
│   │   └── snippets/   # *.mp4 clips
│   └── pdf/
│       └── techrider.pdf
└── favicon.ico
```

**Extensibility:** Add new photos, audio, or video by dropping files into the appropriate folder. Code should dynamically discover and display all assets.

### Performance Considerations
- Lazy load images and videos
- Compress video snippets (720p max, H.264)
- Use WebP for photos where possible
- Audio files: keep short, compress to ~128kbps

### Hosting Recommendation
- **Netlify** or **GitHub Pages** (free, fast, easy deploy)
- Custom domain: nohub.online (or similar)

---

## Content Copywriting (Draft)

### Hero Tagline Options
- "Improvised club music. No plan. All vibe."
- "Live. Improvised. In the crowd."
- "Making it up as we go."

### Booking Section Text
> **Book nohub for your event**
> Improvised live sets that respond to your crowd's energy.
> House, techno, funk, breakbeat — whatever the night needs.
>
> 📄 [Download Tech Rider](static/pdf/techrider.pdf)
> 📧 [nohub.live@proton.me](mailto:nohub.live@proton.me)

---

## TODO / Next Steps
- [ ] Curate photo selection (add/remove as needed)
- [ ] Optimize video snippets (compress, trim)
- [ ] Add more pad samples for synth variety
- [x] Design favicon (mini logo) → `static/img/nohub_favicon.ico`
- [ ] Write final tagline copy
- [ ] Build HTML/CSS/JS prototype
- [ ] Test on mobile devices
- [ ] Deploy to hosting

## Growing the Site
- **Photos:** Add `fotoN.jpeg` to `static/img/photos/`
- **Audio:** Add `*.wav` to `static/audio/pads/`
- **Videos:** Add `*.mp4` to `static/video/snippets/`
- **Sets:** Update SoundCloud/YouTube links in this plan
- Code should auto-discover new assets without hardcoded counts

---

## Inspiration & References
- Early 2000s Flash sites (minus the Flash)
- Geocities aesthetic
- Warp Records artist pages
- Resident Advisor artist profiles (for content structure)
