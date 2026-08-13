# ENGL 1181 Departmental Skeleton — Review Site

A static site presenting the FYW skeleton proposal for ENGL 1181, built to share with colleagues for feedback. Three complete tracks, each a full set of assignments, readings, and schedules that an instructor could pick up and teach.

**Live:** <https://class.skarlis.org/1181-departmental/>

Served by GitHub Pages from the `main` branch of `skarlis3/classes`. The domain comes from the `CNAME` file at the repo root. **Pushing to `main` publishes.** There is no build step — the HTML is the site.

---

## Audience

This site is **outward-facing**. Colleagues read it. Two consequences:

- No working notes, undecided questions, or personal deliberation. Those stay in the Obsidian vault.
- No commentary evaluating another instructor's course. Tracks B and C are each adapted with permission from a colleague's shell; the site credits that and says nothing critical about the original.

Instructor-facing *guidance* is welcome and is the point — "note to instructors" callouts explaining what an assignment is doing, why a reading sits where it does, and what depends on what.

---

## Source of truth

The site is a **hand-built rendering**, not generated. The content originates in Obsidian:

```
~/MEGA/work-with-claude-code/work-with-claude-vault/1181-Departmental/
    Track A/     Sarah's genre analysis track
    Track B/     digital rhetoric track (trackb-*.md)
    Track C/     rhetoric & AI ethics track (trackc-*.md)
    Rianna/      source material for Track B: the original course shell, extracted
```

Track C's source material sits outside the vault, with the export it came from:
`~/MEGA/work-with-claude-code/classes/1181-departmental/MollisClass/`. That folder also
holds `preview/`, the local read-through build made before Track C went on the site. The
preview is a snapshot, not a second copy to maintain &mdash; the site is now the live version.

Editing the markdown does **not** update the site, and editing the site does **not** update the markdown. Keeping them in sync is manual. The vault version is fuller — it carries the working notes this site deliberately omits.

Track B and Track C markdown filenames are prefixed `trackb-` / `trackc-` in the vault so Obsidian wikilinks stay unambiguous against Track A's identically-named files.

Some vault docs have a paired `*_archive.md` file. Those are append-only: when a section is removed or restructured, the old version is preserved there before the edit. Never edit or reorder an archive file.

---

## File map

Flat directory, Track B pages prefixed `trackb-` and Track C pages `trackc-`. This was chosen over per-track subfolders so that Track A URLs already shared with colleagues keep working.

| File | Track | Source markdown |
|---|---|---|
| `index.html` | — | hub; describes all three tracks |
| `skeleton.html` | A | `Track A/skeleton-draft.md` |
| `units.html` | A | `Track A/units.md` |
| `in-class-topics.html` | A | `Track A/in-class-topics.md` |
| `project-1.html` | A | `Track A/project-1-genre-analysis.md` |
| `project-2.html` | A | `Track A/project-2-multimodal.md` |
| `writing-activities.html` | A | `Track A/writing-activities.md` |
| `final-reflection.html` | A | `Track A/final-reflection.md` |
| `schedule-portfolio.html` | A | `Track A/schedule-16-week-portfolio.md` |
| `schedule-no-portfolio.html` | A | `Track A/schedule-16-week-no-portfolio.md` |
| `grading.html` | A | `Track A/grading.md` |
| `objectives-map.html` | A | `Track A/objectives-map.md` |
| `trackb-skeleton.html` | B | `Track B/trackb-skeleton-draft.md` |
| `trackb-units.html` | B | `Track B/trackb-units.md` |
| `trackb-project-1.html` | B | `Track B/trackb-project-1-conversation-essay.md` |
| `trackb-project-2.html` | B | `Track B/trackb-project-2-digital-rhetoric-essay.md` |
| `trackb-project-3.html` | B | `Track B/trackb-project-3-argument-essay.md` |
| `trackb-writing-activities.html` | B | `Track B/trackb-writing-activities.md` |
| `trackb-readings.html` | B | `Track B/trackb-reading-roles.md` |
| `trackb-final-reflection.html` | B | `Track B/trackb-final-reflection.md` |
| `trackb-schedule.html` | B | `Track B/trackb-schedule-16-week.md` |
| `trackc-skeleton.html` | C | `Track C/trackc-skeleton-draft.md` |
| `trackc-units.html` | C | `Track C/trackc-units.md` |
| `trackc-project-1.html` | C | `Track C/trackc-project-1-group-presentation.md` |
| `trackc-project-2.html` | C | `Track C/trackc-project-2-rhetorical-analysis.md` |
| `trackc-project-3.html` | C | `Track C/trackc-project-3-psa.md` |
| `trackc-writing-activities.html` | C | `Track C/trackc-writing-activities.md` |
| `trackc-readings.html` | C | `Track C/trackc-reading-roles.md` |
| `trackc-schedule.html` | C | `Track C/trackc-schedule-16-week.md` |

Shared assets: `css/style.css`, `js/nav.js`.

---

## The two overview pages

Each track has two top-level pages, and they answer different questions:

- **Skeleton Draft** (`skeleton.html`, `trackb-skeleton.html`, `trackc-skeleton.html`) — what's CORE and what's FLEX. Opens with an "About This Track" summary, then required readings, required major assignments, required minor assignments, then the flex sections. **All three tracks use this exact structure**; keep them parallel.
- **Units** (`units.html`, `trackb-units.html`, `trackc-units.html`) — the class broken into units, each one a major assignment with the readings and activities that feed it, plus a "What Depends on What" section naming the interlocks. Same material as the schedule, cut by assignment rather than by week.

Track C departs from the pattern in one way: it has **no Final Reflection page**, because the
original course distributes reflection across the three projects rather than ending with a
capstone. That's a deliberate difference, flagged on the hub and the skeleton page, not an
omission to fill in.

## Track names

Both the label and the descriptor are used together throughout — page titles, headings, sidebar, hub.

- **Track A — Genres in Your Field** (genre analysis)
- **Track B — Digital Lives**
- **Track C — Rhetoric & AI Ethics** — *working title.* If it changes, it changes in eight page titles, `nav.js`, `index.html`, and the skeleton page's `<h1>`.

---

## Navigation

`js/nav.js` builds the sidebar at load. Every page ships an empty `<nav id="sidebar">` and the script fills it.

It picks which navigation to render from the filename:

- filename starts with a registered prefix (`trackb-`, `trackc-`) → that track's navigation, in full
- `index.html` → just the track names, linking to each track's skeleton page
- anything else → Track A navigation, in full

Track A owns the unprefixed filenames, so it is the fallback rather than a prefix match. Every
track added after it needs an entry in the `PREFIXES` list.

A horizontal rule (`.sidebar-rule`) sits under the Home link so it reads as separate from whichever track's navigation follows.

The hub deliberately shows only the track names. The full page list expands once a reader is inside a track, so the sidebar isn't a wall of links on arrival. Track pages get a "Switch Tracks" cross-link at the bottom of the sidebar, styled as a bordered accent button (`.other-track` / `.other-track-title`) so it reads as a distinct control rather than another nav item.

**Adding a page means editing `nav.js`.** A new HTML file will not appear in the sidebar on its own. Add it to the `items` array of the right group in the track's object.

**Adding a whole track** means: pick a filename prefix, add a track object in the shape of `TRACK_C`, add it to the `TRACKS` array, add its prefix to `PREFIXES`, and add a section to `index.html`. The sidebar's hub list and its "Switch Tracks" cross-links are both derived from `TRACKS`, so neither needs editing — that was hand-written for two tracks and generalized when Track C arrived.

The file map is now flat with three prefixes. Moving to per-track subfolders would be tidier but breaks Track A URLs already shared with colleagues; if it ever happens, leave redirect stubs at the old paths.

---

## Page template

Every page is the same shell. Copy an existing page and replace the `<title>` and the contents of `<main>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Name — Track B: Digital Lives</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <button type="button" id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation" aria-controls="sidebar" aria-expanded="false">&#9776; Menu</button>
  <div id="sidebar-overlay" class="sidebar-overlay" aria-hidden="true"></div>
  <div class="layout">
    <nav id="sidebar" class="sidebar" aria-label="Site navigation"></nav>
    <main class="main">
      <h1>Page Name</h1>
      <!-- content -->
    </main>
  </div>
  <script src="js/nav.js"></script>
</body>
</html>
```

One `<h1>` per page, headings descending without skips.

---

## Available components

Defined in `css/style.css`. Don't hand-set colors in the HTML — contrast is governed by the stylesheet.

**Callouts**

```html
<div class="callout tip">
  <p class="callout-label">Note to instructors</p>
  <p>…</p>
</div>

<div class="callout req">
  <p>…</p>
</div>
```

- `.callout.tip` — blue, for orientation and instructor guidance
- `.callout.req` — green, for requirements and hard constraints
- `.callout-label` is optional and picks up the callout's border color

**CORE / FLEX tags**

```html
<span class="tag core">CORE</span>
<span class="tag flex">FLEX</span>
```

Used inline in schedule and reading lists. CORE = required, needs departmental approval to change. FLEX = adjustable.

**Tokens** are CSS custom properties on `:root` — `--bg`, `--surface`, `--text`, `--link`, `--accent`, plus `--tip-*`, `--req-*`, `--note-*`, and `--tag-*-bg`. Change a color there, not in a page.

---

## Accessibility

Requirements for anything added here:

- WCAG AA minimum, AAA where reachable (7:1 normal text, 4.5:1 large)
- Semantic `<ul>` / `<ol>` / `<li>` — never indented paragraphs standing in for lists
- **Never `<table>` for layout.** Real tabular data uses CSS grid with ARIA roles (`role="table"`, `role="row"`, `role="cell"`) and an `aria-label`
- Proper heading hierarchy, no skipped levels
- Meaningful link text — not "click here"
- Descriptive `alt` on images
- Interactive targets at least 24px
- The mobile menu toggle manages `aria-expanded`; the sidebar overlay is `aria-hidden`; Escape closes the panel

---

## Publishing

```bash
cd ~/Websites_work/classes
git pull origin main
# edit
git add 1181-departmental/
git commit -m "…"
git push origin main
```

Pages rebuilds in a minute or two. Check the live URL rather than trusting the local file — the local copy resolves relative paths differently.

---

## Keeping chapter references current

Reading lists cite the departmental OER textbook by number (`3.5 Academic Writing as a Genre`). **Those numbers move** as the Pressbooks port continues — chapters have already been renumbered once, which silently broke references on the Track A pages until they were caught.

Current textbook: <https://macomb.pressbooks.pub/engl1181/>

Whenever the textbook's table of contents changes, re-check the reading lists in `skeleton.html`, `writing-activities.html`, both Track A schedules, `trackb-skeleton.html`, `trackb-readings.html`, `trackb-schedule.html`, `trackc-skeleton.html`, `trackc-readings.html`, and `trackc-schedule.html`.

Tracks B and C mitigate this: readings are defined by **role** ("the data reading," "your group's article") rather than title, so a text can be swapped without touching an assignment sheet. Only `trackb-readings.html` and `trackc-readings.html` name actual texts.

Site convention: reading lines are prefixed `Reading:` or `Readings:` so a bare chapter number never opens a bullet.
