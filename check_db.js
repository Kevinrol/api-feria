const { PrismaClient } = require('./generated/prisma/index.js');

const prisma = new PrismaClient();

async function main() {
  const docente = await prisma.docente.findFirst();
  console.log("Docente:", docente);
  const carrera = await prisma.carrera.findFirst();
  console.log("Carrera:", carrera);
}
main().catch(console.error).finally(() => prisma.$disconnect());
