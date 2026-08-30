# Editing the website data

Every major section is driven by JSON. Routine updates should not require editing HTML.

- `profile.json` — biography, roles, education, links, research interests
- `news.json` — recent news items, newest first
- `publications.json` — publications and monographs
- `research.json` — themes, projects, collaborators
- `students.json` — supervision by degree plus thesis examination
- `grants.json` — research grants, mobility grants, awards
- `resources.json` — tools, datasets, treebanks, models, grammars
- `teaching.json` — courses and training
- `talks.json` — keynotes and invited talks
- `service.json` — leadership, academic service, editorial work, open source and community work
- `sources.json` — provenance / source notes

## JSON rules

1. Keep commas between array items.
2. Use double quotes around text.
3. Do not leave a comma after the final item in an array/object.
4. Dates in `news.json` should preferably use `YYYY-MM-DD`.
5. For publications, set `featured` to `true` to make a paper eligible for the home-page selection.

You can validate a JSON file at any standard JSON validator before pushing it to GitHub.
