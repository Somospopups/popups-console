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

## v0.4.0 · 2026-09-07
- **Administración nativa de APPI dentro de la Consola** (sin entrar a la app): pestaña "Panel APPI".
  - Conexión con la cuenta de administración de POPUPS (la clave no se guarda; solo la sesión, con renovación automática).
  - Resumen: ingresos del mes y totales, cuentas activas, en prórroga, vencidas y solicitudes pendientes.
  - Solicitudes de acceso: aprobar eligiendo membresía inicial (prueba/meses/permanente) con contraseña temporal + envío por WhatsApp, o rechazar.
  - Cuentas: alta directa, +1 mes, prórroga, registrar pagos, acceso permanente, modo prueba 5 días, editar personas, nueva contraseña, activar/bloquear, eliminar.
  - Ingresos: consolidado mensual y detalle de pagos (24 meses).
  - Configuración: WhatsApp de contacto.
  - Los botones "◈ Admin" de APPI abren este panel nativo (ya no el iframe).

## v0.4.1 · 2026-09-07
- **Legibilidad del Panel APPI**: todo el panel adaptado al tema oscuro de la consola (textos, tarjetas, tablas, diálogos, botones y formularios con contraste correcto). Campos de texto claros para escribir cómodo.
