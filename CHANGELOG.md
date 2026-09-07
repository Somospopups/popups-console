# Changelog

## v0.1.0 · 2026-09-07
- Consola POPUPS base: catálogo de apps (APPI y Mi-Tienda declaradas con el estándar), fichas con detalle, registro de versiones, notas internas, equipo y bitácora.
- Login del equipo (PIN), canal compatible con previews (GET a `/`) y modo standalone con persistencia en archivo.
- Pendiente Fase 1 completa: migrar a Supabase + publicar (ver plan de la consola).

## v0.2.0 · 2026-09-07
- Versión standalone (GitHub Pages): la consola funciona 100% en el navegador con datos locales (localStorage) — misma interfaz y funciones.
- Publicada online en https://somospopups.github.io/popups-console/

## v0.3.0 · 2026-09-07
- **Administración incrustada**: botón "◈ Admin" en cada tarjeta (y en la ficha) que abre el panel de la app dentro de la consola (iframe), con opción "Abrir en pestaña". APPI → su app (candado 🔒); Mi-Tienda → su panel #admin.
