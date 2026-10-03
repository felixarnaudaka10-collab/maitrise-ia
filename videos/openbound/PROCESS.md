# Vidéo OpenBound — lancement 12 s (HyperFrames)

Rendu : `renders/openbound.mp4` · 1920×1080 · 30 fps · 12 s · 3,1 Mo · rendu en 26 s.

## Déroulé
| Temps | Scène | Contenu |
|---|---|---|
| 0–2,2 s | Intro | Logo + « OpenBound » + « La prospection en pilote automatique » |
| 2,2–4,5 s | 01 Pilote automatique | Carte « Pilote auto · 07:00 » : SIRENE +25 → enrichissement 22 → séquence 25 → « Zéro clic » |
| 4,5–6,8 s | 02 Coach live | Appel en cours, onde audio, objection prix + souffleur |
| 6,8–9,2 s | 03 Prospects enrichis | Compteur 914 + 3 entreprises fictives avec Tél. / Email ✓ |
| 9,2–12 s | Fin | « Vous appelez. Le reste tourne tout seul. » + « Essayez gratuitement → » + closeia.vercel.app |

## Charte
Copiée depuis `closeia/src/app/globals.css` (fond `#eef1fa`, accent `#4d6bf5`, Inter). Logo : `closeia/public/marque/app-openbound-1024.png`.
Vert des badges assombri en `#0e7e52` pour passer le contraste WCAG AA.

## Refaire / modifier
```bash
cd videos/openbound
npx hyperframes check                          # lint + mise en page + contraste
npx hyperframes snapshot --at 1.4,3.9,6.1,8.4,11.2
npx hyperframes render --output renders/openbound.mp4 --fps 30
```
Tout le texte et le timing sont dans `index.html` (une seule timeline GSAP).
GSAP et les polices sont en local (`assets/`, `fonts/`) : le proxy cloud bloque les CDN.

## Installation (une fois par machine)
Node 22+, FFmpeg, whisper-cpp, `npx hyperframes skills`, `npx hyperframes browser ensure`, puis `npx hyperframes doctor`.
