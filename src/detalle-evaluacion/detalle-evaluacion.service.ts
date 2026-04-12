import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleEvaluacionDto } from './dto/create-detalle-evaluacion.dto';
import { UpdateDetalleEvaluacionDto } from './dto/update-detalle-evaluacion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluacionService } from '../evaluacion/evaluacion.service';

@Injectable()
export class DetalleEvaluacionService {
  constructor(
    private prisma: PrismaService,
    private evaluacionService: EvaluacionService,
  ) {}

  async create(dto: CreateDetalleEvaluacionDto) {
    const created = await this.prisma.detalleEvaluacion.create({
      data: {
        id_evaluacion: dto.id_evaluacion,
        id_criterio: dto.id_criterio,
        puntaje_obtenido: dto.puntaje_obtenido,
      },
      include: {
        evaluacion: true,
        criterio: true,
      },
    });
    await this.evaluacionService.recalcularPuntajeTotal(dto.id_evaluacion);
    return created;
  }

  findAll() {
    return this.prisma.detalleEvaluacion.findMany({
      include: {
        evaluacion: true,
        criterio: true,
      },
    });
  }

  findByEvaluacion(idEvaluacion: number) {
    return this.prisma.detalleEvaluacion.findMany({
      where: { id_evaluacion: idEvaluacion },
      include: {
        criterio: true,
      },
    });
  }

  async findOne(id: number) {
    const row = await this.prisma.detalleEvaluacion.findUnique({
      where: { id_detalle: id },
      include: {
        evaluacion: true,
        criterio: true,
      },
    });
    if (!row) {
      throw new NotFoundException(`Detalle de evaluación ${id} no encontrado`);
    }
    return row;
  }

  async update(id: number, dto: UpdateDetalleEvaluacionDto) {
    await this.findOne(id);
    const updated = await this.prisma.detalleEvaluacion.update({
      where: { id_detalle: id },
      data: dto,
      include: {
        evaluacion: true,
        criterio: true,
      },
    });
    await this.evaluacionService.recalcularPuntajeTotal(updated.id_evaluacion);
    return this.findOne(id);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.prisma.detalleEvaluacion.delete({
      where: { id_detalle: id },
    });
    await this.evaluacionService.recalcularPuntajeTotal(row.id_evaluacion);
    return row;
  }
}
