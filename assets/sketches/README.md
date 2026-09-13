# Sketches

Drop new drawings in this folder.

## Naming

Number them in sequence, continuing from the last one:

```
sketch1.jpg   ← already here
...
sketch8.jpg   ← already here
sketch9.jpg   ← your next one
sketch10.jpg
```

`.jpg`, `.png` and `.webp` all work.

## What happens automatically

The gallery probes for the next files in the sequence, so a new
`sketch9.jpg` **shows up on the site on its own** — no code change needed.
It appears at the end of the gallery with a placeholder title
(`Untitled 09`) and no metadata.

## Giving it a real title

To replace the placeholder title, description, medium, size, date and
notes, add an entry to the `SKETCHES` table in `Hero Scroll.dc.html`
(search for `SKETCHES = [`). Copy the shape of an existing entry:

```js
{ src: "assets/sketches/sketch9.jpg", title: "Streets", side: "a familiar<br />place.",
  desc: "One line, in your own voice.",
  medium: "Ink on paper", size: "A4", date: "12 Jun 2026",
  notes: "Whatever you want to remember about drawing it." },
```

Order in that table is the order in the gallery.

## Square-ish crops read best

Cards show the image as a square (`aspect-ratio: 1`), centred. The full
uncropped image is what opens in the modal, so nothing is lost — but a
roughly square photo of the drawing loses the least in the grid.
