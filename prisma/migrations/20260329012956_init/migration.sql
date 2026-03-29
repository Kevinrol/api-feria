-- CreateTable
CREATE TABLE "Carrera" (
    "id_carrera" SERIAL NOT NULL,
    "nombre_carrera" VARCHAR(100) NOT NULL,
    "codigo_carrera" VARCHAR(10) NOT NULL,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" SERIAL NOT NULL,
    "ci" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "apellido" VARCHAR(80) NOT NULL,
    "telefono" VARCHAR(15),
    "correo" VARCHAR(100),
    "id_carrera" INTEGER NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id_docente" SERIAL NOT NULL,
    "ci" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "apellido" VARCHAR(80) NOT NULL,
    "telefono" VARCHAR(15),
    "correo" VARCHAR(100),
    "especialidad" VARCHAR(100),

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id_docente")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id_proyecto" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "area_tematica" VARCHAR(100),
    "fecha_registro" DATE NOT NULL,
    "id_docente" INTEGER NOT NULL,
    "id_carrera" INTEGER NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id_proyecto")
);

-- CreateTable
CREATE TABLE "ProyectoEstudiante" (
    "id_proyecto" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,

    CONSTRAINT "ProyectoEstudiante_pkey" PRIMARY KEY ("id_proyecto","id_estudiante")
);

-- CreateTable
CREATE TABLE "Jurado" (
    "id_jurado" SERIAL NOT NULL,
    "ci" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "apellido" VARCHAR(80) NOT NULL,
    "institucion" VARCHAR(150),
    "especialidad" VARCHAR(100),
    "telefono" VARCHAR(15),
    "correo" VARCHAR(100),

    CONSTRAINT "Jurado_pkey" PRIMARY KEY ("id_jurado")
);

-- CreateTable
CREATE TABLE "Criterio" (
    "id_criterio" SERIAL NOT NULL,
    "nombre_criterio" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "puntaje_maximo" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id_criterio")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id_evaluacion" SERIAL NOT NULL,
    "id_jurado" INTEGER NOT NULL,
    "id_proyecto" INTEGER NOT NULL,
    "fecha_evaluacion" DATE NOT NULL,
    "observaciones" TEXT,
    "puntaje_total" DECIMAL(6,2),

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateTable
CREATE TABLE "DetalleEvaluacion" (
    "id_detalle" SERIAL NOT NULL,
    "id_evaluacion" INTEGER NOT NULL,
    "id_criterio" INTEGER NOT NULL,
    "puntaje_obtenido" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "DetalleEvaluacion_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_carrera_key" ON "Carrera"("nombre_carrera");

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_codigo_carrera_key" ON "Carrera"("codigo_carrera");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_ci_key" ON "Estudiante"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_ci_key" ON "Docente"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Jurado_ci_key" ON "Jurado"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Criterio_nombre_criterio_key" ON "Criterio"("nombre_criterio");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluacion_id_jurado_id_proyecto_key" ON "Evaluacion"("id_jurado", "id_proyecto");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleEvaluacion_id_evaluacion_id_criterio_key" ON "DetalleEvaluacion"("id_evaluacion", "id_criterio");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "Carrera"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "Docente"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "Carrera"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoEstudiante" ADD CONSTRAINT "ProyectoEstudiante_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoEstudiante" ADD CONSTRAINT "ProyectoEstudiante_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "Jurado"("id_jurado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEvaluacion" ADD CONSTRAINT "DetalleEvaluacion_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "Evaluacion"("id_evaluacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEvaluacion" ADD CONSTRAINT "DetalleEvaluacion_id_criterio_fkey" FOREIGN KEY ("id_criterio") REFERENCES "Criterio"("id_criterio") ON DELETE RESTRICT ON UPDATE CASCADE;
