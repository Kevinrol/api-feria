import { Injectable } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProyectoService {
  constructor(private prisma: PrismaService) {}

  create(createProyectoDto: CreateProyectoDto) {
    return this.prisma.proyecto.create({
      data: createProyectoDto,
      include: {
        carrera: true,
        docente: true,
      },
    });
  }

  findAll() {
    return this.prisma.proyecto.findMany({
      include: {
        carrera: true,
        docente: true,
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
        evaluaciones: {
          include: {
            jurado: true,
            detalles: {
              include: {
                criterio: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.proyecto.findUnique({
      where: { id_proyecto: id },
      include: {
        carrera: true,
        docente: true,
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
        evaluaciones: {
          include: {
            jurado: true,
            detalles: {
              include: {
                criterio: true,
              },
            },
          },
        },
      },
    });
  }

  findByCarrera(idCarrera: number) {
    return this.prisma.proyecto.findMany({
      where: { id_carrera: idCarrera },
      include: {
        carrera: true,
        docente: true,
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
      },
    });
  }

  findByDocente(idDocente: number) {
    return this.prisma.proyecto.findMany({
      where: { id_docente: idDocente },
      include: {
        carrera: true,
        docente: true,
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
      },
    });
  }

  update(id: number, updateProyectoDto: UpdateProyectoDto) {
    return this.prisma.proyecto.update({
      where: { id_proyecto: id },
      data: updateProyectoDto,
      include: {
        carrera: true,
        docente: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.proyecto.delete({
      where: { id_proyecto: id },
    });
  }

  agregarEstudiante(idProyecto: number, idEstudiante: number) {
    return this.prisma.proyectoEstudiante.create({
      data: {
        id_proyecto: idProyecto,
        id_estudiante: idEstudiante,
      },
      include: {
        estudiante: true,
        proyecto: true,
      },
    });
  }

  removerEstudiante(idProyecto: number, idEstudiante: number) {
    return this.prisma.proyectoEstudiante.delete({
      where: {
        id_proyecto_id_estudiante: {
          id_proyecto: idProyecto,
          id_estudiante: idEstudiante,
        },
      },
    });
  }

  async getEstudiantes(idProyecto: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { id_proyecto: idProyecto },
      include: {
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
      },
    });
    return proyecto?.estudiantes.map((pe) => pe.estudiante) || [];
  }

  async getEvaluaciones(idProyecto: number) {
    return this.prisma.evaluacion.findMany({
      where: { id_proyecto: idProyecto },
      include: {
        jurado: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });
  }
}
