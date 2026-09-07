// ============================================================
// Consola POPUPS — servidor (modo dev / standalone)
// Node puro, almacenamiento en archivo. Sirve el front en "/"
// y una API con el mismo contrato que usará Supabase en prod.
// ============================================================
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8125;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const INDEX_FILE = path.join(__dirname, 'public', 'index.html');
const CONSOLE_PIN = process.env.CONSOLE_PIN || '2468'; // PIN del equipo

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 500);
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const clone = (v) => JSON.parse(JSON.stringify(v));

// ---------- seed inicial (apps reales declaradas con el estándar) ----------
function seed() {
  const app = (f) => ({
    slug: f.slug, name: f.name, tagline: f.tagline || '', category: f.category || '',
    status: f.status || 'idea', version: f.version || '', versionDate: f.versionDate || '',
    urls: f.urls || { site: '', admin: '', repo: '', docs: '' },
    supabaseRef: f.supabaseRef || '', brand: f.brand || { color: '' },
    createdAt: now(), updatedAt: now(),
    releases: [], notes: []
  });
  return {
    superPin: CONSOLE_PIN,
    apps: [
      app({
        slug: 'appi', name: 'APPI', category: 'gestion', status: 'produccion',
        version: '543.0.0', versionDate: '2026-09-07',
        urls: { site: 'https://somospopups.github.io/appi/', admin: '', repo: 'https://github.com/Somospopups/appi', docs: 'https://github.com/Somospopups/appi/blob/main/README.md' },
        supabaseRef: 'tqwnjfnaywjmyfplvatm', brand: { color: '' },
        tagline: 'PWA local-first para planificación mensual, presupuesto, equipo, garantías, contactos, notas, historial y gestión de referidos.'
      }),
      app({
        slug: 'mi-tienda', name: 'Mi-Tienda', category: 'ecommerce', status: 'demo',
        version: '0.1.0', versionDate: '2026-09-07',
        urls: { site: 'https://somospopups.github.io/Mi-Tienda/', admin: '', repo: 'https://github.com/Somospopups/Mi-Tienda', docs: '' },
        supabaseRef: '', brand: { color: '#D9633C' },
        tagline: 'Tienda online con panel de gestión completo para comercios.'
      })
    ],
    members: [{ id: uid(), email: 'somospopups@gmail.com', name: 'Equipo POPUPS', role: 'owner', active: true, createdAt: now() }],
    activity: [{ id: uid(), at: now(), actor: 'sistema', action: 'consola.iniciada', detail: 'Consola POPUPS creada con el estándar de apps.' }]
  };
}

function load() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (_) { const s = seed(); save(s); return s; }
}
function save(db) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 1));
  fs.renameSync(tmp, DATA_FILE);
}
function logActivity(db, actor, action, detail) {
  db.activity.unshift({ id: uid(), at: now(), actor, action, detail: detail || null });
  if (db.activity.length > 300) db.activity.length = 300;
}

// ---------- resumen público de una app ----------
const ESTADOS = { idea: 'idea', en_desarrollo: 'en_desarrollo', demo: 'demo', produccion: 'produccion', mantenimiento: 'mantenimiento', pausada: 'pausada', retirada: 'retirada' };
function pubApp(a, withDetail) {
  const base = {
    slug: a.slug, name: a.name, tagline: a.tagline, category: a.category,
    status: ESTADOS[a.status] ? a.status : 'idea',
    version: a.version, versionDate: a.versionDate,
    urls: a.urls || {}, supabaseRef: a.supabaseRef || '', brand: a.brand || {},
    updatedAt: a.updatedAt, createdAt: a.createdAt,
    releasesCount: (a.releases || []).length
  };
  if (withDetail) { base.releases = (a.releases || []).slice().reverse(); base.notes = (a.notes || []).slice().reverse(); }
  return base;
}

const sessions = new Map();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let method = (req.method || 'GET').toUpperCase();
  let p = url.pathname;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const json = (code, obj) => { res.statusCode = code; res.end(JSON.stringify(obj)); };
  const err = (code, msg) => json(code, { error: msg });

  let body = {};
  try {
    const chunks = [];
    for await (const c of req) { chunks.push(c); if (Buffer.concat(chunks).length > 2e6) throw Error('too large'); }
    body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString() || '{}') : {};
  } catch (e) { return err(400, 'Formulario inválido.'); }

  // Canal raíz (previews que solo permiten GET a "/")
  if (url.searchParams.get('__api') === '1') {
    const apiPath = url.searchParams.get('path') || '';
    if (!apiPath.startsWith('/')) return err(400, 'Ruta inválida.');
    const rawBody = url.searchParams.get('b');
    try { body = rawBody ? JSON.parse(rawBody) : {}; } catch (_) { return err(400, 'Formulario inválido.'); }
    const m = String(url.searchParams.get('m') || 'GET').toUpperCase();
    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(m)) method = m;
    p = new URL(apiPath, 'http://x').pathname;
  }

  const db = load();
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const authed = token && sessions.get(token) === 'console';
  const needsAuth = p.startsWith('/api/') && p !== '/api/login';
  if (needsAuth && !authed) return err(401, 'Sesión inválida. Volvé a ingresar.');

  // ---- front ----
  if (p === '/' && method === 'GET') {
    if ((req.headers.accept || '').indexOf('text/html') === -1) return json(200, { name: 'Consola POPUPS', apps: db.apps.map((a) => pubApp(a)) });
    try {
      const html = fs.readFileSync(INDEX_FILE, 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(html);
    } catch (e) { return err(500, 'Falta public/index.html'); }
  }

  // ---- login ----
  if (p === '/api/login' && method === 'POST') {
    if (clean(body.pin, 30) !== db.superPin) return err(401, 'PIN incorrecto.');
    const t = crypto.randomBytes(24).toString('hex');
    sessions.set(t, 'console');
    logActivity(db, 'equipo', 'auth.login', {});
    save(db);
    return json(200, { token: t });
  }

  const mApp = p.match(/^\/api\/apps\/([^/]+)$/);
  const mSub = p.match(/^\/api\/apps\/([^/]+)\/(releases|notes)$/);

  // ---- apps ----
  if (p === '/api/apps' && method === 'GET') return json(200, { apps: db.apps.map((a) => pubApp(a)) });
  if (p === '/api/apps' && method === 'POST') {
    const slug = clean(body.slug, 60).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug || slug.length < 2) return err(400, 'Elegí un slug válido (ej. mi-app).');
    if (db.apps.some((a) => a.slug === slug)) return err(409, 'Ese slug ya existe.');
    const app = {
      slug, name: clean(body.name, 60) || slug, tagline: clean(body.tagline, 120),
      category: clean(body.category, 40), status: ESTADOS[body.status] ? body.status : 'idea',
      version: clean(body.version, 20) || '0.0.0', versionDate: clean(body.versionDate, 10) || now().slice(0, 10),
      urls: {
        site: clean(body.urls && body.urls.site, 300), admin: clean(body.urls && body.urls.admin, 300),
        repo: clean(body.urls && body.urls.repo, 300), docs: clean(body.urls && body.urls.docs, 300)
      },
      supabaseRef: clean(body.supabaseRef, 60), brand: { color: /^#[0-9a-f]{6}$/i.test(body.brandColor || '') ? body.brandColor : '' },
      createdAt: now(), updatedAt: now(), releases: [], notes: []
    };
    db.apps.push(app);
    logActivity(db, 'equipo', 'app.creada', { slug, name: app.name });
    save(db);
    return json(201, { app: pubApp(app, true) });
  }
  if (mApp && method === 'GET') {
    const a = db.apps.find((x) => x.slug === decodeURIComponent(mApp[1]));
    if (!a) return err(404, 'App no encontrada.');
    return json(200, { app: pubApp(a, true) });
  }
  if (mApp && method === 'PATCH') {
    const a = db.apps.find((x) => x.slug === decodeURIComponent(mApp[1]));
    if (!a) return err(404, 'App no encontrada.');
    const oldStatus = a.status;
    const b = body;
    if (b.name != null) a.name = clean(b.name, 60) || a.name;
    if (b.tagline != null) a.tagline = clean(b.tagline, 120);
    if (b.category != null) a.category = clean(b.category, 40);
    if (b.status != null && ESTADOS[b.status]) a.status = b.status;
    if (b.version != null) a.version = clean(b.version, 20);
    if (b.versionDate != null) a.versionDate = clean(b.versionDate, 10);
    if (b.supabaseRef != null) a.supabaseRef = clean(b.supabaseRef, 60);
    if (b.urls) {
      a.urls = {
        site: clean(b.urls.site != null ? b.urls.site : a.urls.site, 300),
        admin: clean(b.urls.admin != null ? b.urls.admin : a.urls.admin, 300),
        repo: clean(b.urls.repo != null ? b.urls.repo : a.urls.repo, 300),
        docs: clean(b.urls.docs != null ? b.urls.docs : a.urls.docs, 300)
      };
    }
    if (b.brandColor != null) a.brand.color = /^#[0-9a-f]{6}$/i.test(b.brandColor) ? b.brandColor : a.brand.color;
    a.updatedAt = now();
    if (b.status != null && b.status !== oldStatus) logActivity(db, 'equipo', 'app.estado', { slug: a.slug, desde: oldStatus, hacia: a.status });
    else logActivity(db, 'equipo', 'app.editada', { slug: a.slug });
    save(db);
    return json(200, { app: pubApp(a, true) });
  }
  if (mApp && method === 'DELETE') {
    const slug = decodeURIComponent(mApp[1]);
    const i = db.apps.findIndex((x) => x.slug === slug);
    if (i < 0) return err(404, 'App no encontrada.');
    db.apps.splice(i, 1);
    logActivity(db, 'equipo', 'app.eliminada', { slug });
    save(db);
    return json(200, { ok: true });
  }
  if (mSub && method === 'POST') {
    const a = db.apps.find((x) => x.slug === decodeURIComponent(mSub[1]));
    if (!a) return err(404, 'App no encontrada.');
    if (mSub[2] === 'releases') {
      const version = clean(body.version, 20);
      if (!version) return err(400, 'Ingresá la versión.');
      const release = { id: uid(), version, summary: clean(body.summary, 500), actor: clean(body.actor, 60) || 'equipo', at: now() };
      a.releases.push(release);
      a.version = version;
      a.versionDate = now().slice(0, 10);
      a.updatedAt = now();
      logActivity(db, release.actor, 'app.release', { slug: a.slug, version });
      save(db);
      return json(201, { release });
    }
    if (mSub[2] === 'notes') {
      const note = { id: uid(), author: clean(body.author, 60) || 'equipo', body: clean(body.body, 2000), at: now() };
      if (!note.body) return err(400, 'Escribí la nota.');
      a.notes.push(note);
      a.updatedAt = now();
      save(db);
      return json(201, { note });
    }
  }

  // ---- equipo / actividad ----
  if (p === '/api/members' && method === 'GET') return json(200, { members: db.members });
  if (p === '/api/members' && method === 'POST') {
    const email = clean(body.email, 160).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return err(400, 'Email inválido.');
    if (db.members.some((m) => m.email === email)) return err(409, 'Ese email ya está en el equipo.');
    const member = { id: uid(), email, name: clean(body.name, 120), role: ['owner', 'admin', 'dev', 'support'].includes(body.role) ? body.role : 'dev', active: true, createdAt: now() };
    db.members.push(member);
    logActivity(db, 'equipo', 'miembro.agregado', { email, role: member.role });
    save(db);
    return json(201, { member });
  }
  if (p === '/api/activity' && method === 'GET') return json(200, { activity: db.activity.slice(0, 80) });
  if (p === '/api/health') return json(200, { ok: true });

  return err(404, 'Ruta no encontrada.');
});

server.listen(PORT, '0.0.0.0', () => console.log(`Consola POPUPS escuchando en http://0.0.0.0:${PORT}`));
