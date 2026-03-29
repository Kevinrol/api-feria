import { Injectable } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocenteService {
  constructor(private prisma: PrismaService) {}

  create(createDocenteDto: CreateDocenteDto) {
    return this.prisma.docente.create({
      data: createDocenteDto,
    });
  }

  findAll() {
    return this.prisma.docente.findMany({
      include: {
        proyectos: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.docente.findUnique({
      where: { id_docente: id },
      include: {
        proyectos: true,
      },
    });
  }

  findByCi(ci: string) {
    return this.prisma.docente.findUnique({
      where: { ci },
      include: {
        proyectos: true,
      },
    });
  }

  update(id: number, updateDocenteDto: UpdateDocenteDto) {
    return this.prisma.docente.update({
      where: { id_docente: id },
      data: updateDocenteDto,
    });
  }

  remove(id: number) {
    return this.prisma.docente.delete({
      where: { id_docente: id },
    });
  }

  getProyectos(idDocente: number) {
    return this.prisma.proyecto.findMany({
      where: { id_docente: idDocente },
      include: {
        carrera: true,
        estudiantes: {
          include: {
            estudiante: true,
          },
        },
        evaluaciones: true,
      },
    });
  }
}
