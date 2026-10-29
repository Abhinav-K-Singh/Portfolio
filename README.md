# Abhinav Kumar Singh | Portfolio

A responsive Cloud Data Engineer portfolio with a data-driven **Project Lab** for work, hobby and study projects.

## Files
- `index.html`: home page (about, Medallion pipeline, experience, skills, featured projects, contact)
- `projects.html`: Project Lab, filterable by category with search
- `project.html`: one template that renders every project's detail page (`project.html?id=<project-id>`)
- `projects-data.js`: **the only file you edit to add or change projects**
- `projects.js`: renders cards and pages from the data (no content inside)
- `new_project.py`: optional helper that adds a project entry for you
- `styles.css`, `script.js`: styling and interactions
- `Abhinav_Kumar_Singh_Resume.pdf`: resume download (keep beside `index.html`)

## Add a project (hobby, study or work)
Option A, with the helper:
```
python3 new_project.py "Weather ETL" --category hobby --stack "Python,SQL"
```
It inserts a ready-to-fill entry into `projects-data.js`. Open that file, replace the placeholder text, save.

Option B, by hand: copy the `TEMPLATE` block at the top of `projects-data.js`, paste it above the `ADD NEW PROJECTS ABOVE THIS LINE` marker, and fill it in.

Each entry gets its own card in the Project Lab and its own detail page automatically. Set `featured: true` to show it on the home page too (the first four featured projects appear). `category` is `work`, `hobby` or `study`; `status` is `shipped`, `in-progress` or `archived`. Links must start with `http://` or `https://`.

## Update the resume content
Home-page text lives in `index.html`; the skills table is the `tools` list in `script.js`. Replace the PDF with the same file name to update the download.

## Only you can edit it
This is a static site with no login and no editing screen, so visitors can only read it. Changes happen by editing these files and republishing. To keep it that way, host it from a repository only you can push to (for example a private-to-write GitHub repo served with GitHub Pages) and keep your hosting account protected with two-factor authentication.

## Run locally
Open `index.html` in a browser, or use VS Code Live Server. The Google Fonts import needs an internet connection; system font fallbacks are included.

## Notes
- Your theme choice (light/dark) is remembered across pages.
- The pipeline animation on the home page is a portfolio demonstration only. It does not execute a real data pipeline.
- Project dates are optional; projects with a date sort newest first, and the helper adds the current month.
