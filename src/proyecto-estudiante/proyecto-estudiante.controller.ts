import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProyectoEstudianteService } from './proyecto-estudiante.service';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';

@Controller('proyecto-estudiante')
export class ProyectoEstudianteController {
  constructor(private readonly proyectoEstudianteService: ProyectoEstudianteService) {}

  @Post()
  create(@Body() dto: CreateProyectoEstudianteDto) {
    return this.proyectoEstudianteService.create(dto);
  }

  @Get()
  findAll() {
    return this.proyectoEstudianteService.findAll();
  }

  @Get('proyecto/:idProyecto')
  findByProyecto(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    return this.proyectoEstudianteService.findByProyecto(idProyecto);
  }

  @Get('estudiante/:idEstudiante')
  findByEstudiante(@Param('idEstudiante', ParseIntPipe) idEstudiante: number) {
    return this.proyectoEstudianteService.findByEstudiante(idEstudiante);
  }

  @Get('proyecto/:idProyecto/estudiante/:idEstudiante')
  findOne(
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.proyectoEstudianteService.findOne(idProyecto, idEstudiante);
  }

  @Delete('proyecto/:idProyecto/estudiante/:idEstudiante')
  remove(
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.proyectoEstudianteService.remove(idProyecto, idEstudiante);
  }
}
