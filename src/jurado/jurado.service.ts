import { Injectable } from '@nestjs/common';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JuradoService {
  constructor(private prisma: PrismaService) {}

  create(createJuradoDto: CreateJuradoDto) {
    return this.prisma.jurado.create({
      data: createJuradoDto,
    });
  }

  findAll() {
    return this.prisma.jurado.findMany({
      include: {
        evaluaciones: {
          include: {
            proyecto: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.jurado.findUnique({
      where: { id_jurado: id },
      include: {
        evaluaciones: {
          include: {
            proyecto: true,
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

  findByCi(ci: string) {
    return this.prisma.jurado.findUnique({
      where: { ci },
    });
  }

  update(id: number, updateJuradoDto: UpdateJuradoDto) {
    return this.prisma.jurado.update({
      where: { id_jurado: id },
      data: updateJuradoDto,
    });
  }

  remove(id: number) {
    return this.prisma.jurado.delete({
      where: { id_jurado: id },
    });
  }

  getEvaluaciones(idJurado: number) {
    return this.prisma.evaluacion.findMany({
      where: { id_jurado: idJurado },
      include: {
        proyecto: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });
  }
}
