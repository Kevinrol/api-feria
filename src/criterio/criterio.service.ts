import { Injectable } from '@nestjs/common';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CriterioService {
  constructor(private prisma: PrismaService) {}

  create(createCriterioDto: CreateCriterioDto) {
    return this.prisma.criterio.create({
      data: createCriterioDto,
    });
  }

  findAll() {
    return this.prisma.criterio.findMany({
      include: {
        detalles: {
          include: {
            evaluacion: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.criterio.findUnique({
      where: { id_criterio: id },
      include: {
        detalles: {
          include: {
            evaluacion: {
              include: {
                proyecto: true,
                jurado: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateCriterioDto: UpdateCriterioDto) {
    return this.prisma.criterio.update({
      where: { id_criterio: id },
      data: updateCriterioDto,
    });
  }

  remove(id: number) {
    return this.prisma.criterio.delete({
      where: { id_criterio: id },
    });
  }
}
