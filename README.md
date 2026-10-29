# Hanime.tv — Mangayomi JavaScript source

This folder contains a starter extension for Mangayomi:

- `anime_index.json` — repository index to import into Mangayomi.
- `hanime.js` — JavaScript source implementing popular, latest, search, details, and video lookup.

## Important playback note

Hanime.tv has removed public stream URLs from its public API according to a current third-party integration notice. This source does **not** bypass login or authentication, so catalog/search may work while playback may return no playable streams unless Hanime.tv exposes them to the current session again.

This source is intended for adults (18+) only. Follow Hanime.tv's terms and applicable local law.

## Make a working URL

The JSON cannot be accessed from a public URL until the files are hosted in your GitHub repository. The `sourceCodeUrl` has been customized to your username, `Kungking12`.

1. Create a **public** GitHub repository named `hanime-mangayomi`.
2. Upload both `anime_index.json` and `hanime.js` to the repository root.
3. The `sourceCodeUrl` in `anime_index.json` is already set to `Kungking12`; commit the files as-is.
4. In Mangayomi, open **More → Settings → Browse** (or the repository import menu in your version) and add this URL:

   `https://raw.githubusercontent.com/Kungking12/hanime-mangayomi/main/anime_index.json`

5. Then refresh the repository and install **Hanime.tv**.

If the app says the repository cannot be read, check that the repository is public and both files are in the root folder.
