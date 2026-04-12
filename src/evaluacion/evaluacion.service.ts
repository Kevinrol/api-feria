import { Injectable } from '@nestjs/common';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluacionDto: CreateEvaluacionDto) {
    const { detalles, ...evaluacionData } = createEvaluacionDto;

    const evaluacion = await this.prisma.evaluacion.create({
      data: {
        ...evaluacionData,
        detalles: {
          create: detalles.map((d) => ({
            id_criterio: d.id_criterio,
            puntaje_obtenido: d.puntaje_obtenido,
          })),
        },
      },
      include: {
        jurado: true,
        proyecto: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });

    await this.recalcularPuntajeTotal(evaluacion.id_evaluacion);

    return this.findOne(evaluacion.id_evaluacion);
  }

  findAll() {
    return this.prisma.evaluacion.findMany({
      include: {
        jurado: true,
        proyecto: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.evaluacion.findUnique({
      where: { id_evaluacion: id },
      include: {
        jurado: true,
        proyecto: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });
  }

  findByProyecto(idProyecto: number) {
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

  findByJurado(idJurado: number) {
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

  async update(id: number, updateEvaluacionDto: UpdateEvaluacionDto) {
    const { detalles, ...evaluacionData } = updateEvaluacionDto;

    if (detalles && detalles.length > 0) {
      await this.prisma.detalleEvaluacion.deleteMany({
        where: { id_evaluacion: id },
      });

      await this.prisma.detalleEvaluacion.createMany({
        data: detalles.map((d) => ({
          id_evaluacion: id,
          id_criterio: d.id_criterio,
          puntaje_obtenido: d.puntaje_obtenido,
        })),
      });
    }

    const evaluacion = await this.prisma.evaluacion.update({
      where: { id_evaluacion: id },
      data: evaluacionData,
      include: {
        jurado: true,
        proyecto: true,
        detalles: {
          include: {
            criterio: true,
          },
        },
      },
    });

    await this.recalcularPuntajeTotal(id);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.prisma.evaluacion.delete({
      where: { id_evaluacion: id },
    });
  }

  async recalcularPuntajeTotal(idEvaluacion: number) {
    const detalles = await this.prisma.detalleEvaluacion.findMany({
      where: { id_evaluacion: idEvaluacion },
    });

    const puntajeTotal = detalles.reduce(
      (sum, d) => sum + Number(d.puntaje_obtenido),
      0,
    );

    await this.prisma.evaluacion.update({
      where: { id_evaluacion: idEvaluacion },
      data: { puntaje_total: puntajeTotal },
    });
  }

  async getPromedioEvaluacionesProyecto(idProyecto: number) {
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: { id_proyecto: idProyecto },
    });

    if (evaluaciones.length === 0) return 0;

    const total = evaluaciones.reduce(
      (sum, e) => sum + Number(e.puntaje_total || 0),
      0,
    );

    return total / evaluaciones.length;
  }
}
