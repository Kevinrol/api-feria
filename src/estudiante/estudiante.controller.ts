import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteService.create(createEstudianteDto);
  }

  @Get()
  findAll() {
    return this.estudianteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudianteService.findOne(id);
  }

  @Get('ci/:ci')
  findByCi(@Param('ci') ci: string) {
    return this.estudianteService.findByCi(ci);
  }

  @Get('carrera/:idCarrera/disponibles')
  findByCarreraSinProyecto(@Param('idCarrera', ParseIntPipe) idCarrera: number) {
    return this.estudianteService.findByCarreraSinProyecto(idCarrera);
  }

  @Get('carrera/:idCarrera')
  findByCarrera(@Param('idCarrera', ParseIntPipe) idCarrera: number) {
    return this.estudianteService.findByCarrera(idCarrera);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEstudianteDto: UpdateEstudianteDto) {
    return this.estudianteService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estudianteService.remove(id);
  }

  @Post(':idEstudiante/proyecto/:idProyecto')
  asignarAProyecto(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
  ) {
    return this.estudianteService.asignarAProyecto(idEstudiante, idProyecto);
  }

  @Delete(':idEstudiante/proyecto/:idProyecto')
  removerDeProyecto(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
  ) {
    return this.estudianteService.removerDeProyecto(idEstudiante, idProyecto);
  }
}
