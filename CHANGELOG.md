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

## v0.4.2 · 2026-09-07
- **Corrección visual definitiva del Panel APPI**: eliminados todos los fondos blancos remanentes (tarjetas de KPIs y contenedores) que quedaban con texto claro encima — ahora todo usa el fondo oscuro del tema. Diálogos forzados al tema oscuro y campos de texto claros con placeholder visible.

## v0.5.0 · 2026-09-07
- **La administración vive dentro de cada tarjeta** (se eliminó la pestaña "Panel APPI" del navegador superior).
- Cada app al abrirse muestra su propio menú: Información · Versiones · Notas · Panel externo (las apps nuevas lo tienen automáticamente).
- La tarjeta de APPI abre el panel de administración nativo con las pestañas del admin real: **Hoy · Solicitudes · Cuentas · Más** (Hoy: KPIs, próximos vencimientos, últimos pagos; Más: WhatsApp, ingresos mensuales, sesión).
- Catálogo más limpio: las tarjetas cerradas muestran estado, versión y fecha; todo lo demás se abre adentro.

## v0.6.0 · 2026-09-07
- **Retorno a la versión original del panel POPUPS** (catálogo puro: tarjetas, fichas, equipo y actividad). Se retiran los experimentos de paneles insertados en tarjetas y en la barra superior; quedan conservados en el historial de git para retomarlos cuando definamos el diseño correcto juntos.

## v0.7.0 · 2026-09-07
- **Botón "◈ ADMINISTRACIÓN" en la ficha de cada app**: abre el panel de manejo de esa app desde la consola.
  - APPI: panel nativo de administración real (Resumen · Solicitudes · Cuentas · Ingresos · Configuración) conectado al backend de APPI (la clave no se guarda; sesión con renovación automática).
  - Apps con URL de admin definida: su panel se abre adentro (con opción "Abrir en pestaña").
  - Apps sin panel aún: aviso claro para configurarlo en "Editar ficha".

## v0.8.0 · 2026-09-07
- **Acciones de la ficha alineadas en grilla pareja** (Administración, Editar, Registrar versión, Nota, Pausar y Eliminar quedan parejos; se elimina el desfase de "Eliminar").
- **Registro de versiones automático**: la consola lee el `popups.app.json` (estándar) de cada app en su repo de GitHub y, si detecta una versión nueva, la registra sola en Versiones (con aviso ⚡). Verifica al entrar a la consola y al abrir la pestaña Apps (cada 10 min como máximo). El botón "+ Registrar versión" queda como registro manual.

## v0.8.1 · 2026-09-07
- La verificación automática de versiones corre siempre al recargar la consola (además de cada 10 min en la pestaña Apps).

## v0.9.0 · 2026-09-07
- **La Administración de cada app se ejecuta dentro del mismo popup de la ficha**: el popup no se cierra; su contenido pasa a Administración (APPI nativo, o el panel de la app en iframe) con el botón "‹ Volver a la ficha". Los formularios del panel ya no cierran el popup de fondo.

## v0.10.0 · 2026-09-07
- **Administración de APPI = la app real con piel POPUPS**: el botón "◈ ADMINISTRACIÓN" de la ficha de APPI abre ahora la aplicación APPI real (https://somospopups.github.io/appi/?skin=popups) dentro del mismo popup, con **todos sus apartados exactamente iguales** (Hoy · Solicitudes · Cuentas · Más) y únicamente la paleta de colores del popup de POPUPS (fondo oscuro, verdes de acento).
- La piel POPUPS es un archivo propio del repo de APPI (`skin-popups.js`) que solo se activa con el parámetro `?skin=popups`; sin él la app de los distribuidores se ve y funciona igual que siempre.
- La sesión de administrador se guarda una sola vez (candado 🔒 dentro de la app); en las próximas aperturas APPI entra directo al panel.
- **Limpieza**: se eliminó de la consola el antiguo módulo nativo de APPI embebido (código, diálogo y estilos asociados, ~41 KB), que duplicaba el panel con una réplica propia. La consola queda más liviana y ordenada.

## v0.11.0 · 2026-09-07
- **"◈ ADMINISTRACIÓN" de APPI lleva directo al panel real**: al presionarlo, la consola navega (misma pestaña) a la app APPI, que entra sola al panel de administrador cuando ya hay sesión de admin guardada.
- Se retira el iframe embebido con piel POPUPS: APPI queda **exactamente como está** (sus propios colores y apartados, sin parámetros ni archivos extra).
- El resto de las apps mantienen su administración dentro del popup de la ficha, como hasta ahora.

## v0.12.0 · 2026-09-07
- **Estándar de administración por app (adiós excepciones)**: el botón "◈ ADMINISTRACIÓN" ahora decide solo cómo abrir el panel de cada app, declarado en su ficha o en su `popups.app.json`:
  - `direct` → navega a la app real (panel propio grande, caso APPI).
  - `embed` → muestra el panel dentro del popup de la ficha (caso Mi-Tienda, que ahora abre directo su panel `#admin`).
  - `none` → aviso de configurarlo (nunca más un botón muerto).
  - `auto` (por defecto) → la consola deduce sola: APPI navega · Mi-Tienda abre `#admin` · si hay URL de panel la muestra · si no, aviso.
- Formulario "Nueva app / Editar ficha" con selector de administración. Una app nueva **nace conectada** con solo declarar cómo se administra.

## v0.13.0 · 2026-09-07
- **Panel POPUPS de clientes (productos vendidos a dueños)** — modo `clientes` (ej. Mi-Tienda):
  - El botón "◈ ADMINISTRACIÓN" de Mi-Tienda abre el panel de POPUPS: tiendas vendidas con su dueño, estado (activa/suspendida), vencimiento y link propio.
  - Acciones: **＋ Vender tienda nueva** (crea el link del dueño), **💳 +30 días** (registrar pago), **🔒 Bloquear / 🔓 Desbloquear** (impago), **🗑 Baja** (el link deja de funcionar).
  - Vencimiento automático: si una tienda vence y no paga, pasa sola a suspendida.
- **Puerta en Mi-Tienda v0.2.0**: cada dueño entra con su link `?tienda=juan` y, si está bloqueada, la página entera muestra el cartel de suspendida (no vende ni edita). Al pagar, vuelve sola.
- El panel del dueño (editar su tienda) queda adentro de Mi-Tienda, con su link; POPUPS ya no necesita entrar ahí.

## v0.13.1 · 2026-09-07
- Al vender una tienda nueva ahora se puede cargar el **nombre de la empresa / local** además del dueño (opcional). La empresa se muestra destacada en el panel y el link se arma con su nombre (si no hay, usa el del dueño).
- Las tiendas demo ya tienen empresa: Panadería La Espiga (Juan) y Boutique Mariela (Mariela).
