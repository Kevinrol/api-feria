import 'dotenv/config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

// const __dirname = path.dirname(path.resolve('prisma/seed.ts'));

type SeedJson = {
  carreras: { id: number; codigo: string; nombre: string }[];
  criterios: {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    puntaje_maximo: number;
  }[];
  docentes: {
    id: number;
    usuario: string;
    nombre_completo: string;
    carrera_id: number;
    email: string;
  }[];
  jurados: {
    id: number;
    usuario: string;
    nombre_completo: string;
    institucion: string;
    email: string;
  }[];
  estudiantes: {
    id: number;
    usuario: string;
    nombre_completo: string;
    carrera_id: number;
  }[];
  proyectos: {
    id: number;
    codigo: string;
    titulo: string;
    carrera_id: number;
    docente_id: number;
    est1_id: number;
    est2_id: number;
  }[];
};

function splitNombreCompleto(completo: string): { nombre: string; apellido: string } {
  const parts = completo.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { nombre: 'Sin', apellido: 'Nombre' };
  if (parts.length === 1) return { nombre: parts[0].slice(0, 80), apellido: 'Apellido' };
  return {
    nombre: parts[0].slice(0, 80),
    apellido: parts.slice(1).join(' ').slice(0, 80),
  };
}

function trunc(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n);
}

function randDecimal(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function syncSequences(prisma: PrismaClient) {
  const tables: [string, string][] = [
    ['Usuario',           'id_usuario'],
    ['Carrera',           'id_carrera'],
    ['Criterio',          'id_criterio'],
    ['Docente',           'id_docente'],
    ['Jurado',            'id_jurado'],
    ['Estudiante',        'id_estudiante'],
    ['Proyecto',          'id_proyecto'],
    ['Evaluacion',        'id_evaluacion'],
    ['DetalleEvaluacion', 'id_detalle'],
  ];
  for (const [table, col] of tables) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"', '${col}'), COALESCE((SELECT MAX("${col}") FROM "${table}"), 1));`,
    );
  }
}

async function main() {
  const jsonPath = path.resolve('prisma', 'seed-data.json');
  const raw = readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw) as SeedJson;

  const carreraById = new Map(data.carreras.map((c) => [c.id, c]));

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está definida');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // ── 1. LIMPIEZA ────────────────────────────────────────────────────────────
    console.log('Limpiando tablas (orden FK)...');
    await prisma.$transaction([
      prisma.usuario.deleteMany(),
      prisma.detalleEvaluacion.deleteMany(),
      prisma.evaluacion.deleteMany(),
      prisma.proyectoEstudiante.deleteMany(),
      prisma.proyecto.deleteMany(),
      prisma.estudiante.deleteMany(),
      prisma.docente.deleteMany(),
      prisma.jurado.deleteMany(),
      prisma.criterio.deleteMany(),
      prisma.carrera.deleteMany(),
    ]);

    // ── 2. ENTIDADES BASE ──────────────────────────────────────────────────────
    console.log(`Insertando carreras (${data.carreras.length})...`);
    await prisma.carrera.createMany({
      data: data.carreras.map((c) => ({
        id_carrera:     c.id,
        nombre_carrera: trunc(c.nombre, 100),
        codigo_carrera: trunc(c.codigo, 10),
      })),
    });

    console.log(`Insertando criterios (${data.criterios.length})...`);
    await prisma.criterio.createMany({
      data: data.criterios.map((cr) => ({
        id_criterio:     cr.id,
        nombre_criterio: trunc(`${cr.codigo}: ${cr.nombre}`, 100),
        descripcion:     cr.descripcion || null,
        puntaje_maximo:  cr.puntaje_maximo,
      })),
    });

    // ── 3. PERSONAS ────────────────────────────────────────────────────────────
    console.log(`Insertando docentes (${data.docentes.length})...`);
    await prisma.docente.createMany({
      data: data.docentes.map((d) => {
        const { nombre, apellido } = splitNombreCompleto(d.nombre_completo);
        const car = carreraById.get(d.carrera_id);
        return {
          id_docente:   d.id,
          ci:           `DOC-${String(d.id).padStart(6, '0')}`,
          nombre,
          apellido,
          correo:       d.email,
          especialidad: car ? `Tutor ${car.codigo}` : null,
        };
      }),
    });

    console.log(`Insertando jurados (${data.jurados.length})...`);
    await prisma.jurado.createMany({
      data: data.jurados.map((j) => {
        const { nombre, apellido } = splitNombreCompleto(j.nombre_completo);
        return {
          id_jurado:   j.id,
          ci:          `JUR-${String(j.id).padStart(6, '0')}`,
          nombre,
          apellido,
          institucion: trunc(j.institucion, 150),
          correo:      j.email,
        };
      }),
    });

    console.log(`Insertando estudiantes (${data.estudiantes.length})...`);
    await prisma.estudiante.createMany({
      data: data.estudiantes.map((e) => {
        const { nombre, apellido } = splitNombreCompleto(e.nombre_completo);
        return {
          id_estudiante: e.id,
          ci:            `EST-${e.id}`,
          nombre,
          apellido,
          correo:        `${e.usuario}@estudiante.incos.edu.bo`,
          id_carrera:    e.carrera_id,
        };
      }),
    });

    // ── 3.5 USUARIOS ───────────────────────────────────────────────────────────
    console.log('Insertando usuarios (docentes, jurados, estudiantes y admin)...');
    const defaultPassword = await bcrypt.hash('123456', 10);
    const usuariosBase: any[] = [
      {
        correo: 'admin@incos.edu.bo',
        password: defaultPassword,
        rol: Role.ADMIN,
      },
    ];

    data.docentes.forEach((d) => usuariosBase.push({ correo: d.email, password: defaultPassword, rol: Role.DOCENTE, id_docente: d.id }));
    data.jurados.forEach((j) => usuariosBase.push({ correo: j.email, password: defaultPassword, rol: Role.JURADO, id_jurado: j.id }));
    data.estudiantes.forEach((e) => usuariosBase.push({ correo: `${e.usuario}@estudiante.incos.edu.bo`, password: defaultPassword, rol: Role.ESTUDIANTE, id_estudiante: e.id }));

    await prisma.usuario.createMany({ data: usuariosBase });

    // ── 4. PROYECTOS ───────────────────────────────────────────────────────────
    const fechaRegistro = new Date('2024-08-15');

    console.log(`Insertando proyectos (${data.proyectos.length})...`);
    await prisma.proyecto.createMany({
      data: data.proyectos.map((p) => ({
        id_proyecto:    p.id,
        titulo:         trunc(p.titulo, 200),
        descripcion:    `Codigo: ${p.codigo}`,
        area_tematica:  null,
        fecha_registro: fechaRegistro,
        id_docente:     p.docente_id,
        id_carrera:     p.carrera_id,
      })),
    });

    const links = data.proyectos.flatMap((p) => [
      { id_proyecto: p.id, id_estudiante: p.est1_id },
      { id_proyecto: p.id, id_estudiante: p.est2_id },
    ]);
    console.log(`Insertando relaciones ProyectoEstudiante (${links.length})...`);
    await prisma.proyectoEstudiante.createMany({ data: links });

    // ── 5. EVALUACIONES ────────────────────────────────────────────────────────
    // Cada proyecto recibe 2 jurados distintos al azar
    const juradosIds = data.jurados.map((j) => j.id);
    const criterios  = data.criterios;

    type EvalInput = {
      id_proyecto:   number;
      id_jurado:     number;
      puntaje_total: number;
      detalles:      { id_criterio: number; puntaje_obtenido: number }[];
    };

    const evaluacionesInput: EvalInput[] = [];

    for (const p of data.proyectos) {
      const shuffled = [...juradosIds].sort(() => Math.random() - 0.5);
      const asignados = shuffled.slice(0, 2);

      for (const jid of asignados) {
        const detalles = criterios.map((cr) => ({
          id_criterio:      cr.id,
          puntaje_obtenido: randDecimal(cr.puntaje_maximo * 0.5, cr.puntaje_maximo),
        }));
        const puntaje_total = parseFloat(
          detalles.reduce((acc, d) => acc + d.puntaje_obtenido, 0).toFixed(2),
        );
        evaluacionesInput.push({ id_proyecto: p.id, id_jurado: jid, puntaje_total, detalles });
      }
    }

    // Insertar Evaluaciones en lotes de 100
    const BATCH_EVAL = 100;
    console.log(`Insertando ${evaluacionesInput.length} evaluaciones en lotes de ${BATCH_EVAL}...`);
    const fechaEval = new Date('2024-09-20');

    for (let i = 0; i < evaluacionesInput.length; i += BATCH_EVAL) {
      const lote = evaluacionesInput.slice(i, i + BATCH_EVAL);
      await prisma.evaluacion.createMany({
        data: lote.map((ev) => ({
          id_proyecto:      ev.id_proyecto,
          id_jurado:        ev.id_jurado,
          fecha_evaluacion: fechaEval,
          observaciones:    'Evaluacion generada por seed.',
          puntaje_total:    ev.puntaje_total,
        })),
      });
    }

    // Recuperar ids generados para armar los detalles
    const evaluacionesDB = await prisma.evaluacion.findMany({
      select: { id_evaluacion: true, id_proyecto: true, id_jurado: true },
    });

    const evalMap = new Map(
      evaluacionesDB.map((e) => [`${e.id_proyecto}-${e.id_jurado}`, e.id_evaluacion]),
    );

    // Construir todos los detalles en memoria
    const detallesInput: {
      id_evaluacion:    number;
      id_criterio:      number;
      puntaje_obtenido: number;
    }[] = [];

    for (const ev of evaluacionesInput) {
      const id_evaluacion = evalMap.get(`${ev.id_proyecto}-${ev.id_jurado}`);
      if (!id_evaluacion) continue;
      for (const d of ev.detalles) {
        detallesInput.push({
          id_evaluacion,
          id_criterio:      d.id_criterio,
          puntaje_obtenido: d.puntaje_obtenido,
        });
      }
    }

    // Insertar DetalleEvaluacion en lotes de 500
    const BATCH_DET = 500;
    console.log(`Insertando ${detallesInput.length} detalles en lotes de ${BATCH_DET}...`);
    for (let i = 0; i < detallesInput.length; i += BATCH_DET) {
      await prisma.detalleEvaluacion.createMany({
        data: detallesInput.slice(i, i + BATCH_DET),
      });
    }

    // ── 6. SECUENCIAS ──────────────────────────────────────────────────────────
    console.log('Sincronizando secuencias SERIAL...');
    await syncSequences(prisma);

    console.log('\nSeed completado con exito.');
    console.log(`  Carreras:     ${data.carreras.length}`);
    console.log(`  Criterios:    ${data.criterios.length}`);
    console.log(`  Docentes:     ${data.docentes.length}`);
    console.log(`  Jurados:      ${data.jurados.length}`);
    console.log(`  Estudiantes:  ${data.estudiantes.length}`);
    console.log(`  Proyectos:    ${data.proyectos.length}`);
    console.log(`  Evaluaciones: ${evaluacionesInput.length}`);
    console.log(`  Detalles:     ${detallesInput.length}`);
    console.log(`  Usuarios:     ${usuariosBase.length}`);

  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
