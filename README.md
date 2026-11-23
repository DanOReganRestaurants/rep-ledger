# Rep Ledger

A gym programming and tracking web app: programmes for size or strength, set logging, progression prompts, rest timer, goals and progress charts.

It is a static site with no server. All training data stays on the device that uses it (browser storage). Use **History → Download backup** to keep a copy or move to a new phone, and **Restore from backup** to bring it back.

## Hosting on GitHub Pages

1. Put every file in this folder at the top level of a public repository.
2. In the repository, open **Settings → Pages**, set **Source** to "Deploy from a branch", pick **main** and **/ (root)**, and save.
3. After a minute the app is live at `https://<your-username>.github.io/<repository-name>/`.

## Installing on a phone

Open the address in Safari (iPhone) or Chrome (Android) and choose **Add to Home Screen**. It then opens full screen and works without signal.

## Files

- `index.html` – the whole app
- `sw.js` – offline cache
- `manifest.webmanifest`, `icon-*.png` – home-screen name and icons

To publish a new version, replace `index.html` (and bump `CACHE` in `sw.js` if the icons or manifest change). Phones pick up the update the second time the app is opened.
