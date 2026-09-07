# 🚀 DESPLIEGUE A PRODUCCIÓN — Consola POPUPS

Guía para publicar la Consola POPUPS de verdad (cuando el equipo lo decida), siguiendo el patrón de appi: **Supabase (datos) + hosting estático (front)**.

> Estado actual (07/09/2026): la consola corre **en desarrollo** (Node + archivo local). Para producción hay que migrar los datos a Supabase y publicar el front. Esto requiere **una cuenta de Supabase del equipo** — son ~5 minutos, gratis, y acá está el paso a paso.

---

## Fase A · Crear el proyecto Supabase (5 min, gratis, sin tarjeta)

1. Andá a **https://supabase.com/dashboard** y creá la cuenta (o entrá si POPUPS ya tiene una — appi usa el proyecto `tqwnjfnaywjmyfplvatm`).
2. **New project** → nombre: `popups-console` → elegí la región más cercana (South America / sa-east-1 si aparece) → **Database password**: creá una y guardala en el gestor de contraseñas de POPUPS → **Create new project** (tarda ~2 min).
3. Cuando esté creado, desde el proyecto: **Project Settings → API** → copiá:
   - `Project URL` (https://XXXX.supabase.co)
   - `anon public key`
   Guardalos para el paso C.

## Fase B · Crear las tablas

1. En el proyecto, andá a **SQL Editor** → New query.
2. Pegá el contenido de `sql/consola.sql` de este repo (esquema v1: `apps`, `app_releases`, `app_notes`, `team_members`, `activity_log` + RLS).
3. **Run**. Debería decir success. (Se puede re-ejecutar sin romper nada.)

## Fase C · Conectar el front a Supabase

El front actual usa `/api/*` local. Para producción se conecta directo a Supabase:

1. Crear en el repo un archivo `config.js` (no versionarlo) con:

```js
window.SUPABASE = { url: "https://XXXX.supabase.co", anonKey: "eyJ..." };
```

2. Implementar en el front las llamadas REST equivalentes a los endpoints actuales (mismo contrato: apps, releases, notes, members, activity) usando la API REST de Supabase (`/rest/v1/...` con `apikey` + `Authorization`). El login del equipo pasa a email+mágico o PIN con RLS según se decida.
3. Probar local apuntando a Supabase, y luego publicar el front (paso D).

## Fase D · Publicar el front (elegir hosting)

**Opción 1 · GitHub Pages (como appi):**
1. En el repo `Somospopups/popups-console`: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
2. Queda en `https://somospopups.github.io/popups-console/`.

**Opción 2 · Netlify (como el sitio de POPUPS):**
1. https://app.netlify.com → **Add new site → Import an existing project → GitHub** → elegir `popups-console` → Deploy.
2. Queda en `https://popups-console.netlify.app` (se puede renombrar: Site settings → Change site name).

## Fase E · Acceso y seguridad

- El acceso es del **equipo POPUPS** (no público). Recomendado: activar **Supabase Auth** con magic link por email para los miembros (tabla `team_members` con RLS), o mantener PIN del equipo cambiando `CONSOLE_PIN` en el entorno del hosting.
- Nunca versionar claves. Si el repo es público, la `anon key` es pública por diseño (la seguridad la da RLS), pero el PIN/secret del equipo va en variable de entorno.

## Fase F · Automatizar (cuando haya más apps)

- Workflow de GitHub que lea los `popups.app.json` de los repos de `Somospopups` y haga upsert en `apps` → **las apps nuevas aparecen solas** (Fase 2 del plan).
- Notificación de releases desde los deploys de cada app (patrón appi).

---

## Checklist final

- [ ] Cuenta Supabase del equipo creada (https://supabase.com)
- [ ] Proyecto `popups-console` creado + `sql/consola.sql` ejecutado
- [ ] `config.js` con URL + anon key (fuera del repo)
- [ ] Front publicado (GitHub Pages o Netlify) y probado el login del equipo
- [ ] Catálogo mostrando APPI y Mi-Tienda
