import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CarreraModule } from '../src/carrera/carrera.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

/** Prisma mínimo en memoria solo para `carrera` (evita DB y el cliente generado en Jest). */
function createCarreraMemoryPrisma() {
  const rows: Array<{
    id_carrera: number;
    nombre_carrera: string;
    codigo_carrera: string;
    estudiantes: unknown[];
    proyectos: unknown[];
  }> = [];
  let seq = 1;

  const withInclude = (c: (typeof rows)[0]) => ({
    ...c,
    estudiantes: [],
    proyectos: [],
  });

  return {
    carrera: {
      create: jest.fn(async ({ data }: { data: { nombre_carrera: string; codigo_carrera: string } }) => {
        const row = {
          id_carrera: seq++,
          nombre_carrera: data.nombre_carrera,
          codigo_carrera: data.codigo_carrera,
          estudiantes: [] as unknown[],
          proyectos: [] as unknown[],
        };
        rows.push(row);
        return withInclude(row);
      }),
      findMany: jest.fn(async () => rows.map(withInclude)),
      findUnique: jest.fn(
        async ({ where }: { where: { id_carrera?: number; codigo_carrera?: string } }) => {
          if (where.id_carrera != null) {
            const c = rows.find((r) => r.id_carrera === where.id_carrera);
            return c ? withInclude(c) : null;
          }
          if (where.codigo_carrera != null) {
            const c = rows.find((r) => r.codigo_carrera === where.codigo_carrera);
            return c ? withInclude(c) : null;
          }
          return null;
        },
      ),
      update: jest.fn(
        async ({
          where,
          data,
        }: {
          where: { id_carrera: number };
          data: Partial<{ nombre_carrera: string; codigo_carrera: string }>;
        }) => {
          const c = rows.find((r) => r.id_carrera === where.id_carrera);
          if (!c) {
            const err = new Error('Record not found');
            (err as { code?: string }).code = 'P2025';
            throw err;
          }
          Object.assign(c, data);
          return withInclude(c);
        },
      ),
      delete: jest.fn(async ({ where }: { where: { id_carrera: number } }) => {
        const i = rows.findIndex((r) => r.id_carrera === where.id_carrera);
        if (i === -1) {
          const err = new Error('Record not found');
          (err as { code?: string }).code = 'P2025';
          throw err;
        }
        const [removed] = rows.splice(i, 1);
        return withInclude(removed);
      }),
    },
  } as unknown as PrismaService;
}

describe('Carrera CRUD (e2e, Prisma en memoria)', () => {
  let app: INestApplication<App>;
  const suffix = `${Date.now()}`;
  const payload = {
    nombre_carrera: `Ingeniería de Prueba ${suffix}`,
    codigo_carrera: `IP${suffix.slice(-8)}`,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, CarreraModule],
    })
      .overrideProvider(PrismaService)
      .useValue(createCarreraMemoryPrisma())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST → GET lista → GET por id → PATCH → DELETE', async () => {
    const server = request(app.getHttpServer());

    const createRes = await server.post('/carrera').send(payload).expect(201);

    const id = createRes.body.id_carrera as number;
    expect(id).toBeDefined();
    expect(createRes.body.nombre_carrera).toBe(payload.nombre_carrera);

    const listRes = await server.get('/carrera').expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(
      listRes.body.some((c: { id_carrera: number }) => c.id_carrera === id),
    ).toBe(true);

    const oneRes = await server.get(`/carrera/${id}`).expect(200);
    expect(oneRes.body.id_carrera).toBe(id);

    const nuevoNombre = `${payload.nombre_carrera} (editada)`;
    const patchRes = await server
      .patch(`/carrera/${id}`)
      .send({ nombre_carrera: nuevoNombre })
      .expect(200);
    expect(patchRes.body.nombre_carrera).toBe(nuevoNombre);

    await server.delete(`/carrera/${id}`).expect(200);

    const afterDelete = await server.get(`/carrera/${id}`).expect(200);
    const gone =
      afterDelete.body === null ||
      (typeof afterDelete.body === 'object' &&
        afterDelete.body !== null &&
        Object.keys(afterDelete.body).length === 0);
    expect(gone).toBe(true);

    const listAfter = await server.get('/carrera').expect(200);
    expect(
      listAfter.body.some((c: { id_carrera: number }) => c.id_carrera === id),
    ).toBe(false);
  });
});
