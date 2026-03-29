import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CriterioService } from './criterio.service';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';

@Controller('criterio')
export class CriterioController {
  constructor(private readonly criterioService: CriterioService) {}

  @Post()
  create(@Body() createCriterioDto: CreateCriterioDto) {
    return this.criterioService.create(createCriterioDto);
  }

  @Get()
  findAll() {
    return this.criterioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.criterioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCriterioDto: UpdateCriterioDto) {
    return this.criterioService.update(id, updateCriterioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.criterioService.remove(id);
  }
}
