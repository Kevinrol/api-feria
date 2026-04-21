-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'JURADO', 'ESTUDIANTE', 'DOCENTE');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'ESTUDIANTE',
    "id_estudiante" INTEGER,
    "id_docente" INTEGER,
    "id_jurado" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_estudiante_key" ON "Usuario"("id_estudiante");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_docente_key" ON "Usuario"("id_docente");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_jurado_key" ON "Usuario"("id_jurado");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id_estudiante") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "Docente"("id_docente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "Jurado"("id_jurado") ON DELETE SET NULL ON UPDATE CASCADE;
