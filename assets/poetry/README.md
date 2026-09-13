# Poetry

Two different things live here, depending on what you're adding.

## 1. A new poem (the text itself)

Poem text is **not** a file in this folder — it lives in the `POEMS` table
in `Hero Scroll.dc.html` (search for `POEMS = [`), because the site renders
it as real selectable type rather than a picture of words.

Add an entry:

```js
{ title: "Quiet Rooms", date: "14 Jun 2026",
  excerpt: "Some places don't need voices, just presence…",
  aside: "A line for<br />the margin.",
  body: "First line of the poem,\nsecond line.\n\nA blank line makes\na new stanza." },
```

- `\n` is a line break, `\n\n` is a stanza break.
- `excerpt` is what shows on the card in the collection.
- `aside` is the small handwritten note beside the poem in the modal.
- The counter (`03 / 06`) updates itself.

If you'd rather just send me the poems, paste them in chat and I'll add them.

## 2. A photo of a notebook page

Those *are* files, and they go here:

```
book1.jpg   ← already here
book2.jpg   ← already here
book3.jpg
book4.jpg
book5.jpg   ← your next one
```

These are used as scanned-page imagery around the poetry section.
Landscape photos of an open spread work best — they're shown uncropped.
