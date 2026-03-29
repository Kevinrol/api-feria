import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstudianteService {
  constructor(private prisma: PrismaService) {}

  create(createEstudianteDto: CreateEstudianteDto) {
    return this.prisma.estudiante.create({
      data: createEstudianteDto,
      include: {
        carrera: true,
      },
    });
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      include: {
        carrera: true,
        proyectos: {
          include: {
            proyecto: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.estudiante.findUnique({
      where: { id_estudiante: id },
      include: {
        carrera: true,
        proyectos: {
          include: {
            proyecto: true,
          },
        },
      },
    });
  }

  findByCi(ci: string) {
    return this.prisma.estudiante.findUnique({
      where: { ci },
      include: {
        carrera: true,
        proyectos: {
          include: {
            proyecto: true,
          },
        },
      },
    });
  }

  findByCarrera(idCarrera: number) {
    return this.prisma.estudiante.findMany({
      where: { id_carrera: idCarrera },
      include: {
        carrera: true,
      },
    });
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return this.prisma.estudiante.update({
      where: { id_estudiante: id },
      data: updateEstudianteDto,
      include: {
        carrera: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.estudiante.delete({
      where: { id_estudiante: id },
    });
  }

  asignarAProyecto(idEstudiante: number, idProyecto: number) {
    return this.prisma.proyectoEstudiante.create({
      data: {
        id_estudiante: idEstudiante,
        id_proyecto: idProyecto,
      },
      include: {
        proyecto: true,
        estudiante: true,
      },
    });
  }

  removerDeProyecto(idEstudiante: number, idProyecto: number) {
    return this.prisma.proyectoEstudiante.delete({
      where: {
        id_proyecto_id_estudiante: {
          id_estudiante: idEstudiante,
          id_proyecto: idProyecto,
        },
      },
    });
  }
}
