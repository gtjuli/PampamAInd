# PampamAInd

Landing de PampamAInd · *Mitad campo, mitad ciudad.* Consultora tecnológica para profesionales, comercios y pymes sin área de sistemas.

Versión **Landing v3 · Corporativo × marca**: estructura corporativa (referencias: Accenture, Acsys, Genit y Hostinger) con la identidad PampamAInd: noche, trigo, pergamino, semitono y un toque de gótica. Sitio estático en HTML, CSS y JavaScript vanilla, sin frameworks ni build.

## Estructura

```
index.html
css/styles.css     tokens del tema Noche, componentes y secciones
js/main.js         header sticky, menú overlay, pestañas, aparición al hacer scroll
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
- **Logo:** el header usa el solo logotipo a color sobre placa pergamino (`assets/logo-wordmark.png`) y el footer la versión principal (`assets/logo-principal.jpg`), como indica el manual para fondos oscuros. Pasar a SVG cuando exista la versión vectorial.
- **og:image:** falta una imagen para compartir en redes (1200×630, con URL absoluta).
