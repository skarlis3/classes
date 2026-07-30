# ENGL 1181 Departmental Skeleton — Review Site

A static site presenting the FYW skeleton proposal for ENGL 1181, built to share with colleagues for feedback. Two complete tracks, each a full set of assignments, readings, and schedules that an instructor could pick up and teach.

**Live:** <https://class.skarlis.org/1181-departmental/>

Served by GitHub Pages from the `main` branch of `skarlis3/classes`. The domain comes from the `CNAME` file at the repo root. **Pushing to `main` publishes.** There is no build step — the HTML is the site.

---

## Audience

This site is **outward-facing**. Colleagues read it. Two consequences:

- No working notes, undecided questions, or personal deliberation. Those stay in the Obsidian vault.
- No commentary evaluating another instructor's course. Track B is adapted with permission from a colleague's shell; the site credits that and says nothing critical about the original.

Instructor-facing *guidance* is welcome and is the point — "note to instructors" callouts explaining what an assignment is doing, why a reading sits where it does, and what depends on what.

---

## Source of truth

The site is a **hand-built rendering**, not generated. The content originates in Obsidian:

```
~/MEGA/work-with-claude-code/work-with-claude-vault/1181-Departmental/
    Track A/     Sarah's genre analysis track
    Track B/     digital rhetoric track (trackb-*.md)
    Rianna/      source material: the original course shell, extracted
```

Editing the markdown does **not** update the site, and editing the site does **not** update the markdown. Keeping them in sync is manual. The vault version is fuller — it carries the working notes this site deliberately omits.

Track B markdown filenames are prefixed `trackb-` in the vault so Obsidian wikilinks stay unambiguous against Track A's identically-named files.

---

## File map

Flat directory, Track B pages prefixed `trackb-`. This was chosen over per-track subfolders so that Track A URLs already shared with colleagues keep working.

| File | Track | Source markdown |
|---|---|---|
| `index.html` | — | hub; describes both tracks |
| `skeleton.html` | A | `Track A/skeleton-draft.md` |
| `project-1.html` | A | `Track A/project-1-genre-analysis.md` |
| `project-2.html` | A | `Track A/project-2-multimodal.md` |
| `writing-activities.html` | A | `Track A/writing-activities.md` |
| `final-reflection.html` | A | `Track A/final-reflection.md` |
| `schedule-portfolio.html` | A | `Track A/schedule-16-week-portfolio.md` |
| `schedule-no-portfolio.html` | A | `Track A/schedule-16-week-no-portfolio.md` |
| `grading.html` | A | `Track A/grading.md` |
| `objectives-map.html` | A | `Track A/objectives-map.md` |
| `trackb-skeleton.html` | B | `Track B/trackb-skeleton-draft.md` |
| `trackb-project-1.html` | B | `Track B/trackb-project-1-conversation-essay.md` |
| `trackb-project-2.html` | B | `Track B/trackb-project-2-digital-rhetoric-essay.md` |
| `trackb-project-3.html` | B | `Track B/trackb-project-3-argument-essay.md` |
| `trackb-writing-activities.html` | B | `Track B/trackb-writing-activities.md` |
| `trackb-readings.html` | B | `Track B/trackb-reading-roles.md` |
| `trackb-final-reflection.html` | B | `Track B/trackb-final-reflection.md` |
| `trackb-schedule.html` | B | `Track B/trackb-schedule-16-week.md` |

Shared assets: `css/style.css`, `js/nav.js`.

---

## Track names

Both the label and the descriptor are used together throughout — page titles, headings, sidebar, hub.

- **Track A — Genres in Your Field** (genre analysis)
- **Track B — Digital Rhetoric & Social Media**

---

## Navigation

`js/nav.js` builds the sidebar at load. Every page ships an empty `<nav id="sidebar">` and the script fills it.

It picks which navigation to render from the filename:

- filename starts with `trackb-` → Track B navigation
- `index.html` → both tracks, flat
- anything else → Track A navigation

Track pages also get an "Other Track" cross-link at the bottom of the sidebar.

**Adding a page means editing `nav.js`.** A new HTML file will not appear in the sidebar on its own. Add it to the `items` array of the right group in `TRACK_A` or `TRACK_B`.

**Adding a whole track** means: pick a filename prefix, add a `TRACK_C`-style object, add the prefix test to `activeTrack()`, extend the hub's both-tracks branch in `renderSidebar()`, and add a section to `index.html`. At three or more tracks, moving to per-track subfolders is probably worth the URL breakage — add redirect stubs at the old paths if so.

---

## Page template

Every page is the same shell. Copy an existing page and replace the `<title>` and the contents of `<main>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Name — Track B: Digital Rhetoric &amp; Social Media</title>
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
cd ~/MEGA/GithubPages/skarlis3/classes
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

Whenever the textbook's table of contents changes, re-check the reading lists in `skeleton.html`, `writing-activities.html`, both Track A schedules, `trackb-skeleton.html`, `trackb-readings.html`, and `trackb-schedule.html`.

Track B mitigates this: readings are defined by **role** ("the data reading," "the reflection reading") rather than title, so a text can be swapped without touching an assignment sheet. Only `trackb-readings.html` names actual texts.

Site convention: reading lines are prefixed `Reading:` or `Readings:` so a bare chapter number never opens a bullet.
