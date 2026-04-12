/**
 * Lee seed_data_feria_incos.md y escribe prisma/seed-data.json
 * Ejecutar: node prisma/parse-seed-md.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdPath = path.join(root, 'seed_data_feria_incos.md');
const outPath = path.join(__dirname, 'seed-data.json');

const md = fs.readFileSync(mdPath, 'utf8');

function parseTableSection(afterHeading, untilHeading) {
  const start = md.indexOf(afterHeading);
  const end = untilHeading ? md.indexOf(untilHeading, start + 1) : md.length;
  const chunk = end === -1 ? md.slice(start) : md.slice(start, end);
  const lines = chunk.split('\n').filter((l) => l.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (/^\|[\s-]+\|$/.test(line.replace(/\|/g, '|'))) continue;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length === 0) continue;
    rows.push(cells);
  }
  return rows;
}

const carreras = parseTableSection('## 1. CARRERAS', '## 2.').map((c) => ({
  id: Number(c[0]),
  codigo: c[1],
  nombre: c[2],
}));

const criterios = parseTableSection('## 2. CRITERIOS', '## 3.').map((c) => ({
  id: Number(c[0]),
  codigo: c[1],
  nombre: c[2],
  descripcion: c[3],
  puntaje_maximo: Number(c[4]),
}));

const docentes = parseTableSection('## 3. DOCENTES', '## 4.').map((c) => ({
  id: Number(c[0]),
  usuario: c[1],
  nombre_completo: c[2],
  carrera_id: Number(c[3]),
  email: c[4],
}));

const jurados = parseTableSection('## 4. JURADOS', '## 5.').map((c) => ({
  id: Number(c[0]),
  usuario: c[1],
  nombre_completo: c[2],
  institucion: c[3],
  email: c[4],
}));

function parseEstudiantesBlocks() {
  const blocks = [
    ['### 5.1', '### 5.2'],
    ['### 5.2', '### 5.3'],
    ['### 5.3', '### 5.4'],
    ['### 5.4', '### 5.5'],
    ['### 5.5', '### 5.6'],
    ['### 5.6', '## 6.'],
  ];
  const all = [];
  for (const [a, b] of blocks) {
    const rows = parseTableSection(a, b);
    for (const c of rows) {
      all.push({
        id: Number(c[0]),
        usuario: c[1],
        nombre_completo: c[2],
        carrera_id: Number(c[3]),
      });
    }
  }
  return all;
}

const estudiantes = parseEstudiantesBlocks();

function parseProyectosBlocks() {
  const headers = [
    ['### 6.1', '### 6.2'],
    ['### 6.2', '### 6.3'],
    ['### 6.3', '### 6.4'],
    ['### 6.4', '### 6.5'],
    ['### 6.5', '### 6.6'],
    ['### 6.6', '## 7.'],
  ];
  const all = [];
  for (const [a, b] of headers) {
    const rows = parseTableSection(a, b);
    for (const c of rows) {
      all.push({
        id: Number(c[0]),
        codigo: c[1],
        titulo: c[2].replace(/\s+/g, ' ').trim(),
        carrera_id: Number(c[3]),
        docente_id: Number(c[4]),
        est1_id: Number(c[5]),
        est2_id: Number(c[6]),
      });
    }
  }
  return all;
}

const proyectos = parseProyectosBlocks();

const data = {
  carreras,
  criterios,
  docentes,
  jurados,
  estudiantes,
  proyectos,
};

fs.writeFileSync(outPath, JSON.stringify(data, null, 0), 'utf8');
console.log('Wrote', outPath, {
  carreras: carreras.length,
  criterios: criterios.length,
  docentes: docentes.length,
  jurados: jurados.length,
  estudiantes: estudiantes.length,
  proyectos: proyectos.length,
});
