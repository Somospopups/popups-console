# Consola POPUPS

Panel central del equipo POPUPS para ver y administrar **todas las aplicaciones** de la empresa (APPI, Mi-Tienda y las futuras): estado del ciclo de vida, versión, links y acceso al panel de cada una.

App de POPUPS — cumple el estándar: `popups.app.json` + `CHANGELOG.md` (ver `popups-estandar/ESTANDAR-APP-POPUPS.md`).

## Cómo correrla (desarrollo)

```bash
node server.js          # puerto 8125 (configurable con PORT=…)
# PIN del equipo por defecto: 2468 (cambiable con CONSOLE_PIN=…)
```

- Front: `public/index.html` (diseño POPUPS, sin dependencias).
- Datos: `data/db.json` (se crea solo con seed inicial). En producción se migra a Supabase (ver plan).
- El front habla con `/api/*` y tiene un canal alternativo `GET /?__api=1…` para entornos que solo permiten GET a la raíz (previews).

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/login` | Login del equipo (PIN) → token |
| GET/POST | `/api/apps` | Listar / crear app |
| GET/PATCH/DELETE | `/api/apps/:slug` | Detalle / editar / eliminar |
| POST | `/api/apps/:slug/releases` | Registrar versión (actualiza `version`) |
| POST | `/api/apps/:slug/notes` | Nota interna |
| GET/POST | `/api/members` | Equipo |
| GET | `/api/activity` | Bitácora |
