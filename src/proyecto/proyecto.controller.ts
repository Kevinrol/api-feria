import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.findOne(id);
  }

  @Get('carrera/:idCarrera')
  findByCarrera(@Param('idCarrera', ParseIntPipe) idCarrera: number) {
    return this.proyectoService.findByCarrera(idCarrera);
  }

  @Get('docente/:idDocente')
  findByDocente(@Param('idDocente', ParseIntPipe) idDocente: number) {
    return this.proyectoService.findByDocente(idDocente);
  }

  @Get(':id/estudiantes')
  getEstudiantes(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.getEstudiantes(id);
  }

  @Get(':id/evaluaciones')
  getEvaluaciones(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.getEvaluaciones(id);
  }

  @Post(':idProyecto/estudiante/:idEstudiante')
  agregarEstudiante(
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.proyectoService.agregarEstudiante(idProyecto, idEstudiante);
  }

  @Delete(':idProyecto/estudiante/:idEstudiante')
  removerEstudiante(
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.proyectoService.removerEstudiante(idProyecto, idEstudiante);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.remove(id);
  }
}
