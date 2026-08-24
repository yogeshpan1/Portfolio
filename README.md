# Yogesh Pant — Portfolio

Personal portfolio of Yogesh Pant, full-stack developer and ML engineer from
Kathmandu, Nepal. F1 telemetry energy, a web-slinger keeping watch over the
project grid, and a contact form that actually works.

**Live:** https://yogeshpan1.github.io/Portfolio/

## What is in here

- `public/` — the whole frontend. Plain HTML/CSS/JS, no framework, no build step.
  - Live Kathmandu clock in the top bar
  - GitHub stats fetched live (cached in localStorage for an hour)
  - Project cards rendered from data in `public/js/projects.js`
  - The web-slinger is original inline SVG, not a copied asset
- `server.js` — Express backend for the contact form: input validation,
  sanitization, honeypot spam trap, per-IP rate limiting, Helmet security
  headers with a strict CSP. Messages are stored to `data/messages.jsonl` and
  emailed too if SMTP is configured.

## Run it

Frontend alone: open `public/index.html`, or serve it statically.

Full stack:

```bash
npm install
npm start          # http://localhost:3000
```

Optional SMTP (copy `.env.example` to `.env` first) — without it, messages are
still saved locally, just not emailed.

## Deploy

- **Static (GitHub Pages):** push as-is, serve from `/public` or move its
  contents to root. The contact form gracefully falls back to a mailto link
  when the backend isn't there.
- **Full stack:** any Node host (Render, Railway, a VPS). Set the env vars
  from `.env.example`.

## Contact

yogeshpant911@gmail.com · [github.com/yogeshpan1](https://github.com/yogeshpan1)
· [linkedin.com/in/yogeshpant1](https://www.linkedin.com/in/yogeshpant1/)
