#!/usr/bin/env node
/**
 * cms-sync.mjs
 * 
 * Escanea el Storefront en busca de llamadas a getCmsMedia() y t()
 * con anotaciones de CMS y actualiza packages/cms-config/schema.json
 * para que el Admin panel refleje todos los slots disponibles.
 *
 * Anotaciones soportadas (en comentario justo antes de la llamada):
 *   // @cms-group "Nombre del Grupo"  @cms-label "Etiqueta Legible"  @cms-type gallery
 *   const img = await getCmsMedia('mi_slot', '/default.jpg')
 *
 *   // @cms-group "Home"  @cms-label "Título Principal"
 *   const title = t('heroTitle')
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const STOREFRONT_DIR = join(ROOT, 'apps', 'storefront');
const SCHEMA_PATH = join(ROOT, 'packages', 'cms-config', 'schema.json');

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Recorre recursivamente un directorio devolviendo rutas de archivos .ts/.tsx */
function walkDir(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      // Ignorar node_modules, .next, etc.
      if (!['node_modules', '.next', '.turbo', 'dist'].includes(name)) {
        walkDir(full, files);
      }
    } else if (['.ts', '.tsx'].includes(extname(name))) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Extrae anotaciones CMS de una línea de comentario.
 * Soporta: @cms-group "X"  @cms-label "Y"  @cms-type gallery|single
 */
function parseAnnotation(line) {
  const groupMatch  = line.match(/@cms-group\s+"([^"]+)"/);
  const labelMatch  = line.match(/@cms-label\s+"([^"]+)"/);
  const typeMatch   = line.match(/@cms-type\s+(\w+)/);
  return {
    group: groupMatch?.[1] ?? null,
    label: labelMatch?.[1] ?? null,
    type:  typeMatch?.[1]  ?? null,
  };
}

/** Extrae todos los slots de getCmsMedia de un archivo */
function extractMediaSlots(content, relPath) {
  const lines = content.split('\n');
  const found = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Buscar llamada a getCmsMedia('key', ...)
    const mediaMatch = line.match(/getCmsMedia\(\s*['"`]([^'"`]+)['"`]/);
    if (!mediaMatch) continue;

    const key = mediaMatch[1];
    // Buscar anotación en la línea anterior (o hasta 3 líneas atrás)
    let annotation = { group: null, label: null, type: null };
    for (let back = 1; back <= 3; back++) {
      const prev = lines[i - back];
      if (!prev) break;
      const trimmed = prev.trim();
      if (!trimmed.startsWith('//') && !trimmed.startsWith('*')) break;
      const parsed = parseAnnotation(trimmed);
      if (parsed.group || parsed.label || parsed.type) {
        annotation = parsed;
        break;
      }
    }

    found.push({
      key,
      label: annotation.label ?? keyToLabel(key),
      group: annotation.group ?? 'Auto-descubiertos',
      type:  annotation.type  ?? (key.includes('slider') || key.includes('gallery') ? 'gallery' : 'single'),
      source: 'auto',
      file: relPath,
    });
  }
  return found;
}

/** Convierte una clave snake_case en un label legible */
function keyToLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  console.log('\n🔍 CMS Sync: Escaneando Storefront...');

  // Leer esquema actual — strip BOM por si PowerShell escribió el archivo con UTF-8 BOM
  const rawSchema = readFileSync(SCHEMA_PATH, 'utf-8').replace(/^\uFEFF/, '')
  const schema = JSON.parse(rawSchema);
  const existingKeys = new Set(
    schema.mediaSlots.flatMap(g => g.items.map(i => i.key))
  );

  // 2. Escanear archivos del Storefront
  const files = walkDir(STOREFRONT_DIR);
  let allFound = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    if (!content.includes('getCmsMedia')) continue;
    const rel = relative(STOREFRONT_DIR, file).replace(/\\/g, '/');
    allFound.push(...extractMediaSlots(content, rel));
  }

  // 3. Detectar nuevos (no existentes en el esquema)
  const newSlots = allFound.filter(s => !existingKeys.has(s.key));

  if (newSlots.length === 0) {
    console.log('✅ No hay nuevos slots. El esquema está actualizado.\n');
    return;
  }

  // 4. Agrupar los nuevos slots y agregarlos al esquema
  const groupMap = {};
  for (const slot of newSlots) {
    if (!groupMap[slot.group]) groupMap[slot.group] = [];
    groupMap[slot.group].push({
      key:    slot.key,
      label:  slot.label,
      type:   slot.type,
      source: 'auto',
      file:   slot.file,
    });
  }

  for (const [groupName, items] of Object.entries(groupMap)) {
    // Si el grupo ya existe en el esquema, agregar ahí
    const existing = schema.mediaSlots.find(g => g.group === groupName);
    if (existing) {
      existing.items.push(...items);
    } else {
      // Crear nuevo grupo
      schema.mediaSlots.push({
        group: groupName,
        source: 'auto',
        items,
      });
    }
    console.log(`  📦 Grupo "${groupName}": ${items.length} slot(s) nuevo(s) → ${items.map(i => i.key).join(', ')}`);
  }

  // 5. Actualizar version timestamp
  schema._lastSync = new Date().toISOString();

  // 6. Guardar
  writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2), 'utf-8');
  console.log(`\n✅ schema.json actualizado con ${newSlots.length} slot(s) nuevo(s).\n`);
}

run();
