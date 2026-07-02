# Rupee Theory

A premium responsive personal finance education website built with plain HTML, CSS, and JavaScript.

## Included

- Five responsive pages with light and dark themes
- Eight-card searchable and filterable finance journal
- Original finance editorial artwork
- Searchable glossary with alphabetical filters
- Interactive SIP calculator with animated results and chart
- EmailJS-ready contact form with validation and spam protection
- Testimonials, learning resources, newsletter, FAQ, and animated statistics

## Run locally

You can open `index.html` directly in a browser. For the best local experience, run a simple static server from this folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```text
Rupee Theory Tools/
|-- index.html
|-- investment-basics.html
|-- sip-calculator.html
|-- stock-market-terms.html
|-- contact.html
|-- assets/
|   |-- css/styles.css
|   `-- js/main.js
`-- README.md
```

The newsletter form currently shows an in-browser confirmation. The contact form is wired for EmailJS; follow `EMAILJS_SETUP.md` and add the three account values in `assets/js/emailjs-config.js` before publishing.
