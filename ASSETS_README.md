# Assets Guide (Auto-Sync)

Workflow
1) Drop images into `public/assets` using the folders below.
2) Run `npm run sync:assets`.
3) Refresh the browser.

Folder Structure
Whole projects (project pages):
- `public/assets/projects/<slug>/slider/before.<ext>`
- `public/assets/projects/<slug>/slider/after.<ext>`
- `public/assets/projects/<slug>/before-gallery/01.<ext>, 02.<ext>, ...`
- `public/assets/projects/<slug>/after-gallery/01.<ext>, 02.<ext>, ...`

Collections (work galleries):
- `public/assets/collections/roofing/<id>/01.<ext>, 02.<ext>, ...`
- `public/assets/collections/installation/<id>/01.<ext>, 02.<ext>, ...`
- `public/assets/collections/painting/<id>/01.<ext>, 02.<ext>, ...`

Allowed extensions: `.jpg` `.jpeg` `.png` `.webp`
Gallery ordering: numeric by filename (01, 02, 03...). Non-numeric files are ignored.

Examples
Project (slug: grape-street):
- `public/assets/projects/grape-street/slider/before.jpeg`
- `public/assets/projects/grape-street/slider/after.jpeg`
- `public/assets/projects/grape-street/before-gallery/01.jpeg`
- `public/assets/projects/grape-street/after-gallery/01.jpeg`

Collection (roofing id: re-roof):
- `public/assets/collections/roofing/re-roof/01.jpeg`
- `public/assets/collections/roofing/re-roof/02.jpeg`

Add a Whole Project (Checklist)
1) Create the folders under `public/assets/projects/<slug>/`.
2) Add the slider images and gallery images using numeric filenames.
3) Add the new project text (title, summary, services) in `src/data/work.js`.
4) Run `npm run sync:assets` and refresh.

Add a Collection Item (Checklist)
1) Add the new item (id/label/tag) in `src/data/work.js`.
2) Create the folder `public/assets/collections/<category>/<id>/` and drop images.
3) Run `npm run sync:assets` and refresh.
