# K. Sarveswaran — Academic Website Rebuild

A framework-free academic personal website built with **HTML5, CSS3 and vanilla JavaScript**. Content is separated from presentation into JSON files so routine updates can be made without editing HTML.

## What is included

- Home page with current academic profile and recent news
- Research themes and projects
- Searchable/filterable publication list
- Research-student supervision page (PhD, MPhil, MA/MSc/Master's, MEd, MA, BA, BSc)
- Grants, fellowships, mobility support and awards
- Tools, datasets, treebanks, models and grammars
- Teaching
- Keynotes and invited talks
- Academic service, editorial work, conference organisation, open source and community leadership
- Web CV + June 2026 PDF CV
- Source/provenance page
- Sitemap and robots.txt
- Legacy URL preservation: `publication.html`, `grants.html`, `resources.html`, `teaching.html`, `services.html`

## Update content

Most edits happen in `/data/*.json`. See `/data/README.md`.

Example — add a news item to the top of `data/news.json`:

```json
{
  "date": "2026-09-10",
  "title": "New research update",
  "summary": "One or two sentences.",
  "tags": ["Tamil", "NLP"],
  "url": "https://example.org/"
}
```

## Preview locally

Because browsers normally block `fetch()` from `file://` URLs, preview it through a small local web server rather than double-clicking `index.html`. For example, from the website folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. This is only for local preview; the deployed website itself remains HTML/CSS/JS.

## Deploy to GitHub Pages

Replace the contents of the `sarves.github.io` repository with the contents of this folder, commit, and push. GitHub Pages will serve the site directly.

## Data still requiring your input

The rebuild contains verified PhD, MPhil, Master's and MEd supervision records found in the available CV. A complete consolidated list of **MA, BA and BSc supervised students** could not be verified from the public sources / available CV, so those arrays are intentionally empty rather than guessed. Add them to `data/students.json`.

The supplied PDF CV is the June 2026 version. Website content is updated through 31 August 2026; replace the PDF when you have a newer CV.

## Academic sections worth keeping

The information architecture intentionally adds sections that were weak or missing in the old site: research students, current projects, invited talks, editorial/service activity, conference/workshop organisation, international appointments, open research resources, collaboration links, and source/provenance notes.
