# Baguio Getaway Checklist — Cute Pink & Purple Nailong Edition 🍓💜💛

An interactive, fully editable, and responsive 3-day Baguio City travel itinerary checklist (**December 21–23, 2026**) built strictly with **vanilla HTML, CSS, and JavaScript** (zero frameworks or external dependencies).

## Highlights

- **Swapped Day 1 & Day 2 Schedule**:
  - **Day 1 — December 21, 2026**: Rides • Botanical Garden • Mansion House • Ukay-ukay
  - **Day 2 — December 22, 2026**: Arrival • Downtown Baguio • Night Market
  - **Day 3 — December 23, 2026**: Igorot Stone Kingdom • Pasalubong • Travel home
  - Includes a one-tap **`⇄ Swap Day 1 & 2`** button in case plans shift on the go.
- **Full Inline Checklist Editing & Instant Auto-Save (`localStorage`)**:
  - Toggle **`✏️ Edit Checklist`** in the toolbar (or tap **`✎`** on any individual activity) to edit day dates, day highlights, activity times, titles, descriptions, nested sub-stops, item order (`↑` / `↓`), and packing items.
  - Every keystroke, checkbox toggle, added/removed stop, and note **auto-saves immediately to your browser's `localStorage`** with a live status indicator (`💾 Auto-saved in browser`)—plus **`⟲ Restore Default`** whenever you want the original schedule back.
- **Responsive Across Mobile, Tablet & Desktop**:
  - Touch-friendly hit targets, swipeable mobile day filter tabs, anti-zoom `16px` mobile inputs, and zero horizontal overflow from compact `320px` phones up to desktop monitors.
- **Cute Pink & Purple + Nailong (Milk Dragon) Theme**:
  - Pastel blush & lavender cards, custom Nailong Baguio kawaii stickers, parent/sub-stop indeterminate (`–`) checkbox syncing, and an interactive **Tap Nailong!** mascot cheer button.

## Running Locally

Simply open `index.html` in any modern desktop or mobile browser—no build step or server required!

## Project Structure

- `index.html` — Semantic 3-day Baguio checklist markup
- `styles.css` — Pastel pink & lavender styling, inline editor UI, responsive breakpoints, and print layout
- `script.js` — Vanilla JS controller for inline checklist editing, instant `localStorage` auto-save, progress bar, day swapping, and filters
- `assets/` — Custom Nailong Baguio kawaii sticker illustrations
