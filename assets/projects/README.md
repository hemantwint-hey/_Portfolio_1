# Project images

Screenshots for the "Things I've Built" section on the developer page.

## Naming

One file per project card, numbered left to right:

```
project1.png   ← E-Commerce Backend
project2.png   ← Intelligent Decision System
project3.png   ← third card
project4.png   ← if you add a fourth card
```

`.png`, `.jpg` and `.webp` all work — the site tries each extension, so
`project1.jpg` is fine if that's what you have.

## What happens automatically

Each card looks for its image and shows it as soon as the file exists.
Until then the card shows a quiet "No screenshot yet" placeholder instead
of a broken image, so the site never looks broken mid-upload.

## Sizing

Cards crop to **16:10**, filling the frame from the centre. A wide
screenshot (a browser window, a terminal, an architecture diagram) fits
without losing anything important. Anything tall and narrow will get
cropped hard at the top and bottom.

Roughly 1600×1000 or larger keeps it sharp on high-density screens.
