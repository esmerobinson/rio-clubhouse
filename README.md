# The Rio Clubhouse — 2026

Interest registration questionnaire. Hosted on GitHub Pages.

## Folder structure

```
rio-clubhouse/
├── index.html
├── css/style.css
├── js/main.js
├── images/
│   ├── copacabana.jpg
│   ├── leme.jpg
│   ├── ipanema.jpg
│   ├── santa-teresa.jpg
│   └── botafogo.jpg
├── apps-script/Code.gs
└── README.md
```

---

## 1. Add your images

Drop these five files into the `images/` folder:
`copacabana.jpg`, `leme.jpg`, `ipanema.jpg`, `santa-teresa.jpg`, `botafogo.jpg`

Keep each image under 500 KB. To resize quickly on Mac: open in Preview → Tools → Adjust Size → set width to 1200px → Export as JPEG at 70% quality.

---

## 2. Set up the Google Apps Script (one-time)

1. Go to [script.google.com](https://script.google.com) and click **New project**
2. Delete any existing code, then paste the entire contents of `apps-script/Code.gs`
3. Create a Google Sheet: go to [sheets.google.com](https://sheets.google.com), make a new blank sheet, call it anything (e.g. *Rio Clubhouse Responses*)
4. Back in Apps Script: click **Project Settings** (cog icon) → paste the Sheet's URL or ID — actually, the script uses `SpreadsheetApp.getActiveSpreadsheet()`, so you need to **bind it to the sheet**:
   - In Apps Script, click **File → Save**, then **Resources → Advanced Google services** is not needed
   - Instead: click the **≡ (hamburger)** → **Project Settings** — no binding needed if you open the script from within the Sheet
   - **Easier path**: from your Google Sheet, click **Extensions → Apps Script**. This opens a bound script. Paste `Code.gs` there.
5. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** → copy the Web App URL (looks like `https://script.google.com/macros/s/ABC.../exec`)
6. Open `js/main.js` and replace `'YOUR_APPS_SCRIPT_URL_HERE'` with that URL

---

## 3. Local dev server

You need a local server (not just opening the file) because the Leaflet map and fetch calls require HTTP.

**Option A — Python (no install needed, macOS has it):**
```bash
cd /Users/esme/Documents/coding/rio-clubhouse
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080)

**Option B — VS Code Live Server extension:**
Install the *Live Server* extension, right-click `index.html` → *Open with Live Server*. Auto-reloads on save.

---

## 4. Deploy to GitHub Pages

1. Create a new **public** repo on GitHub (e.g. `rio-clubhouse`)
2. In Terminal, from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/rio-clubhouse.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root) → Save**
4. After ~60 seconds, your site is live at:
   `https://YOUR_USERNAME.github.io/rio-clubhouse/`

That URL is shareable immediately — no custom domain needed.

---

## 5. After a form submission

Responses appear in real time in the Google Sheet under the **Responses** tab, one row per submission, with a timestamp and every answer clearly labelled.
