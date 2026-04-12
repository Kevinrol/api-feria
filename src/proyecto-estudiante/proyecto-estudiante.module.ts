import { Module } from '@nestjs/common';
import { ProyectoEstudianteService } from './proyecto-estudiante.service';
import { ProyectoEstudianteController } from './proyecto-estudiante.controller';

@Module({
  controllers: [ProyectoEstudianteController],
  providers: [ProyectoEstudianteService],
})
export class ProyectoEstudianteModule {}
