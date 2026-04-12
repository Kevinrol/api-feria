import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleEvaluacionService } from './detalle-evaluacion.service';
import { CreateDetalleEvaluacionDto } from './dto/create-detalle-evaluacion.dto';
import { UpdateDetalleEvaluacionDto } from './dto/update-detalle-evaluacion.dto';

@Controller('detalle-evaluacion')
export class DetalleEvaluacionController {
  constructor(private readonly detalleEvaluacionService: DetalleEvaluacionService) {}

  @Post()
  create(@Body() dto: CreateDetalleEvaluacionDto) {
    return this.detalleEvaluacionService.create(dto);
  }

  @Get()
  findAll() {
    return this.detalleEvaluacionService.findAll();
  }

  @Get('evaluacion/:idEvaluacion')
  findByEvaluacion(@Param('idEvaluacion', ParseIntPipe) idEvaluacion: number) {
    return this.detalleEvaluacionService.findByEvaluacion(idEvaluacion);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleEvaluacionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDetalleEvaluacionDto,
  ) {
    return this.detalleEvaluacionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleEvaluacionService.remove(id);
  }
}
