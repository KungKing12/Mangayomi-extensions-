# Hanime.tv — Mangayomi JavaScript source

This folder contains a starter extension for Mangayomi:

- `anime_index.json` — repository index to import into Mangayomi.
- `hanime.js` — JavaScript source implementing popular, latest, search, details, and video lookup.

## Important playback note

Hanime.tv has removed public stream URLs from its public API according to a current third-party integration notice. This source does **not** bypass login or authentication, so catalog/search may work while playback may return no playable streams unless Hanime.tv exposes them to the current session again.

This source is intended for adults (18+) only. Follow Hanime.tv's terms and applicable local law.

## Make a working URL

The JSON cannot be given a permanent public URL until both files are hosted. The `sourceCodeUrl` currently uses a placeholder username.

1. Create a **public** GitHub repository named `hanime-mangayomi`.
2. Upload both `anime_index.json` and `hanime.js` to the repository root.
3. Edit `anime_index.json` and replace `YOUR_GITHUB_USERNAME` in `sourceCodeUrl` with your GitHub username, then commit the change.
4. In Mangayomi, open **More → Settings → Browse** (or the repository import menu in your version) and add this URL:

   `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/hanime-mangayomi/main/anime_index.json`

5. Replace `YOUR_GITHUB_USERNAME` in that URL with your actual GitHub username. Then refresh the repository and install **Hanime.tv**.

If the app says the repository cannot be read, check that the repository is public and both files are in the root folder.
