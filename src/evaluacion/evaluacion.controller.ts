import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  create(@Body() createEvaluacionDto: CreateEvaluacionDto) {
    return this.evaluacionService.create(createEvaluacionDto);
  }

  @Get()
  findAll() {
    return this.evaluacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionService.findOne(id);
  }

  @Get('proyecto/:idProyecto')
  findByProyecto(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    return this.evaluacionService.findByProyecto(idProyecto);
  }

  @Get('jurado/:idJurado')
  findByJurado(@Param('idJurado', ParseIntPipe) idJurado: number) {
    return this.evaluacionService.findByJurado(idJurado);
  }

  @Get('proyecto/:idProyecto/promedio')
  getPromedioEvaluaciones(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    return this.evaluacionService.getPromedioEvaluacionesProyecto(idProyecto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEvaluacionDto: UpdateEvaluacionDto) {
    return this.evaluacionService.update(id, updateEvaluacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionService.remove(id);
  }
}
