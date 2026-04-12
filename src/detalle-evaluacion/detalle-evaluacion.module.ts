import { Module } from '@nestjs/common';
import { DetalleEvaluacionService } from './detalle-evaluacion.service';
import { DetalleEvaluacionController } from './detalle-evaluacion.controller';
import { EvaluacionModule } from '../evaluacion/evaluacion.module';

@Module({
  imports: [EvaluacionModule],
  controllers: [DetalleEvaluacionController],
  providers: [DetalleEvaluacionService],
})
export class DetalleEvaluacionModule {}
