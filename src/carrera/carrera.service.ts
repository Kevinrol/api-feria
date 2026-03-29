//carrera.service.ts

import { Injectable } from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarreraService {
  constructor(private prisma: PrismaService) {}
  

  create(createCarreraDto: CreateCarreraDto) {
    console.log('Datos recibidos en create:', createCarreraDto);
    return this.prisma.carrera.create({
      data: createCarreraDto,
      include: {
        estudiantes: true,
        proyectos: true,
      },
    });
  }

  findAll() {
    return this.prisma.carrera.findMany({
      include: {
        estudiantes: true,
        proyectos: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.carrera.findUnique({
      where: { id_carrera: id },
      include: {
        estudiantes: true,
        proyectos: true,
      },
    });
  }

  findByCodigo(codigo: string) {
    return this.prisma.carrera.findUnique({
      where: { codigo_carrera: codigo },
      include: {
        estudiantes: true,
        proyectos: true,
      },
    });
  }

  update(id: number, updateCarreraDto: UpdateCarreraDto) {
    return this.prisma.carrera.update({
      where: { id_carrera: id },
      data: updateCarreraDto,
      include: {
        estudiantes: true,
        proyectos: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.carrera.delete({
      where: { id_carrera: id },
    });
  }
}
