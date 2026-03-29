import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';

@Controller('jurado')
export class JuradoController {
  constructor(private readonly juradoService: JuradoService) {}

  @Post()
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradoService.create(createJuradoDto);
  }

  @Get()
  findAll() {
    return this.juradoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.juradoService.findOne(id);
  }

  @Get('ci/:ci')
  findByCi(@Param('ci') ci: string) {
    return this.juradoService.findByCi(ci);
  }

  @Get(':id/evaluaciones')
  getEvaluaciones(@Param('id', ParseIntPipe) id: number) {
    return this.juradoService.getEvaluaciones(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateJuradoDto: UpdateJuradoDto) {
    return this.juradoService.update(id, updateJuradoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.juradoService.remove(id);
  }
}
