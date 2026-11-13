# PampamAInd

Landing de PampamAInd · *Tecnología con trato personal.* Consultora tecnológica para profesionales, comercios y pymes sin área de sistemas.

La base es la landing de la recorrida de los personajes; los textos hablan de la consultora y los colores son los del design system (noche, trigo, cielo, cuero, crema, pergamino y tintes de apoyo).

Sitio estático en HTML, CSS y JavaScript vanilla, sin frameworks ni build.

## Estructura

```
index.html      la landing: recorrida en 5 capítulos (encuentro, escuchamos, proponemos, resolvemos, acompañamos) + para quién, servicios, quiénes somos y contacto
style.css       estilos, escena fija y animaciones de los personajes
app.js          recorrida según el scroll: posiciones del gaucho y la dama, ocaso, sol, pausa
assets/         personajes por piezas (cuerpo, mano, pollera), bandera, sol, marca y fuentes
consultora/     la landing anterior de la consultora (soporte, web, aplicaciones e IA)
```

Las fuentes del manual (Grenze Gotisch para titulares, Source Sans 3 para textos) van locales en `assets/fuentes/`, en woff2 y con su licencia OFL.

## Ver en local

```bash
python3 -m http.server 8000
```

Después abrí http://localhost:8000.

## Pendientes

- **Formulario de contacto:** en `app.js`, completar `FORM_ENDPOINT` con el endpoint de un servicio de formularios (por ejemplo Formspree). Mientras esté vacío, el formulario arma el correo con los datos y abre el programa de correo de la persona.
- **Correo de contacto:** `hola@pampamaind.com` (en `FALLBACK_EMAIL`) es un placeholder y hay que confirmarlo.
- **Landing anterior:** quedó en `/consultora/`. Decidir si se mantiene o se borra.
