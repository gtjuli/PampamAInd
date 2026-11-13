# PampamAInd

Landing de PampamAInd · *Tu mirada crea.* Plataforma local de asistencia editorial, en beta privada.

Sitio estático en HTML, CSS y JavaScript vanilla, sin frameworks ni build.

## Estructura

```
index.html      la landing: recorrida en 5 capítulos + camino nuevo, plataforma y contacto
style.css       estilos, escena fija y animaciones de los personajes
app.js          recorrida según el scroll: posiciones del gaucho y la dama, ocaso, sol, pausa
assets/         personajes por piezas (cuerpo, mano, pollera), bandera, sol, marca y fuentes
consultora/     la landing anterior de la consultora (soporte, web, aplicaciones e IA)
```

Las fuentes (Grenze Gotisch e IM Fell English) van locales en `assets/fuentes/`, con su licencia OFL.

## Ver en local

```bash
python3 -m http.server 8000
```

Después abrí http://localhost:8000.

## Pendientes

- **Formulario de contacto:** está deshabilitado y dice "en preparación". Todavía no recibe ni envía datos.
- **Landing de la consultora:** quedó en `/consultora/`. Decidir si se mantiene, se enlaza o se borra.
