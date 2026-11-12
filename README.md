# PampamAInd

Landing page de PampamAInd: soporte, web, aplicaciones e inteligencia artificial para profesionales, comercios y pymes, en el campo y en la ciudad.

## Estructura

- `index.html`: la landing completa (HTML + CSS + JS en un solo archivo, sin build).
- `assets/pampamaind-horizontal.png`: logo horizontal.

Basada en el design system PampamAInd de Claude Design (colores noche/trigo/cielo/cuero, tipografías Grenze Gotisch y Source Sans 3).

## Ver en local

Abrí `index.html` en el navegador, o levantá un servidor:

```bash
python3 -m http.server 8000
```

## Pendiente antes de publicar

- Reemplazar los testimonios de ejemplo por testimonios reales (sección "Palabra que se cumple").
- Conectar el envío real del formulario (CRM, Brevo, Formspree…) donde dice `envío real acá` en el script.
- Opcional: agregar GA4 (`gtag`); los eventos `cta_click` y `lead_submit` ya están cableados.
