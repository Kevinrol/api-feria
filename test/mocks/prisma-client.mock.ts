/** Sustituye el cliente generado en e2e/unit Jest (resolución de módulos ESM del output de Prisma). */
export class PrismaClient {
  constructor(_opts?: unknown) {}

  $connect = jest.fn(async () => {});
  $disconnect = jest.fn(async () => {});
}
