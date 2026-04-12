import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleEvaluacionDto } from './create-detalle-evaluacion.dto';

export class UpdateDetalleEvaluacionDto extends PartialType(
  CreateDetalleEvaluacionDto,
) {}
