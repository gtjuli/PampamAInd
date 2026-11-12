# PampamAInd

Landing de PampamAInd · *Mitad campo, mitad ciudad.* Consultora tecnológica para profesionales, comercios y pymes sin área de sistemas.

Versión **Landing v2 · Moderno × medieval**, tema "Noche". Sitio estático en HTML, CSS y JavaScript vanilla, sin frameworks ni build.

## Estructura

```
index.html
css/styles.css     tokens del tema Noche, componentes y secciones
js/main.js         header sticky, menú overlay, reveal, texto que se enciende, parallax
assets/            logo, favicon (y acá van las fotos cuando estén)
```

## Ver en local

```bash
python3 -m http.server 8000
```

Después abrí http://localhost:8000.

## Pendientes (TODO en el código)

- **Mail de contacto:** `hola@pampamaind.com` es un placeholder y hay que confirmarlo.
- **Fotos:** el hero, Quiénes somos y Servicios usan placeholders de color. Cuando existan, agregar a `assets/`:
  - `hero.jpg`
  - `equipo.jpg`, `trabajo.jpg`
  - `servicio-1.jpg` … `servicio-4.jpg`

  En `index.html` hay un comentario TODO en cada lugar donde va un `<img>`.
- **Logo SVG:** se usa `assets/logo-monocromatico.png`, el negativo en blanco del design system. Reemplazarlo por `logo-monocromatico.svg` cuando exista la versión vectorial.
- **og:image:** falta una imagen para compartir en redes (1200×630, con URL absoluta).
