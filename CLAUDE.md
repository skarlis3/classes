# classes Site Repo

Shared home for pages that don't belong to one course site. Published by GitHub Pages from `main` at
<https://class.skarlis.org/>; the domain comes from the `CNAME` at the repo root. There is no build step —
the HTML is the site, and pushing to `main` publishes.

**Remote:** `git@github.com-work:skarlis3/classes.git`. The `-work` SSH alias is the `skarlis3` account;
plain `github.com` authenticates as sarahlizz3 on this machine and is rejected.

⚠️ **This is the real clone.** `~/MEGA/GithubPages/skarlis3/classes/` is a file-only copy with no `.git`.
Older notes point at it; don't edit there.

## What's in here

- `1181-departmental/` — the FYW skeleton review site, three tracks. **It has its own `README.md`, and that
  is the file to read before editing any of it** — page template, components, the nav script, the track
  naming, and how the pages relate to the Obsidian markdown they came from.
- `calendar/`, `team-names/` — small standalone tools.

## Log every change to this repo

Changes here get written up at `~/MEGA/work-with-claude-code/classes/1181-departmental/changelog/` for the
skeleton site. **One HTML file per date, named `YYYY-MM-DD.html`**, plus an `index.html` listing them all
with a short summary each. Add both in the same session as the change — the reasoning is what the log is
for, and it evaporates fast. Full spec in `work-with-claude-code/classes/CLAUDE.md` under "Class Website
Change Logs."

## Write in full sentences

Every sentence needs a subject and a verb. **This is a live failure mode, named 13 Aug 2026** after it
turned up across several unrelated projects: recent models drift into a clipped, promotional register even
in plain documents.

The tell is the **verbless headline fragment** — *"Three projects plus a final reflection, scaffolded by
nine writing activities."* That is a caption, not a sentence. Write *"There are three projects and a final
reflection. Nine writing activities scaffold them."*

Same problem in other clothes: em-dash appositives standing in for clauses; bulleted lists of fragments
where prose belongs; bolded lead-ins that replace the verb (*"**Project 2: Rhetorical Analysis** — 1,000
words on one article"*). Bullets are for genuinely parallel enumerable items, and even then each bullet
should be a complete sentence unless it is a bare name, number, or label.

Applies to page copy, planning docs, READMEs, and change logs alike. Does not apply to tables, headings,
filenames, or short labels.

Related but distinct: **no marketing copy** — don't sell the course back to students, don't write
atmospheric openers, don't explain what a reading is *doing* for the class on a student-facing page. That
rule is about not saying it at all; this one is about how to write what does belong. Full statement of both:
`~/MEGA/work-with-claude-code/CLAUDE.md`, under Communication Style.
