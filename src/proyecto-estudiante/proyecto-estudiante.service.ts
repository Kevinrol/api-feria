import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProyectoEstudianteService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProyectoEstudianteDto) {
    return this.prisma.proyectoEstudiante.create({
      data: {
        id_proyecto: dto.id_proyecto,
        id_estudiante: dto.id_estudiante,
      },
      include: {
        proyecto: true,
        estudiante: true,
      },
    });
  }

  findAll() {
    return this.prisma.proyectoEstudiante.findMany({
      include: {
        proyecto: true,
        estudiante: true,
      },
    });
  }

  findByProyecto(idProyecto: number) {
    return this.prisma.proyectoEstudiante.findMany({
      where: { id_proyecto: idProyecto },
      include: {
        estudiante: true,
      },
    });
  }

  findByEstudiante(idEstudiante: number) {
    return this.prisma.proyectoEstudiante.findMany({
      where: { id_estudiante: idEstudiante },
      include: {
        proyecto: true,
      },
    });
  }

  async findOne(idProyecto: number, idEstudiante: number) {
    const row = await this.prisma.proyectoEstudiante.findUnique({
      where: {
        id_proyecto_id_estudiante: {
          id_proyecto: idProyecto,
          id_estudiante: idEstudiante,
        },
      },
      include: {
        proyecto: true,
        estudiante: true,
      },
    });
    if (!row) {
      throw new NotFoundException(
        `Relación proyecto ${idProyecto} — estudiante ${idEstudiante} no encontrada`,
      );
    }
    return row;
  }

  async remove(idProyecto: number, idEstudiante: number) {
    await this.findOne(idProyecto, idEstudiante);
    return this.prisma.proyectoEstudiante.delete({
      where: {
        id_proyecto_id_estudiante: {
          id_proyecto: idProyecto,
          id_estudiante: idEstudiante,
        },
      },
    });
  }
}
