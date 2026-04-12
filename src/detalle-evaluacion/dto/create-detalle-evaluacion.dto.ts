import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetalleEvaluacionDto {
  @IsInt()
  @IsNotEmpty()
  id_evaluacion: number;

  @IsInt()
  @IsNotEmpty()
  id_criterio: number;

  @IsNumber()
  @IsNotEmpty()
  puntaje_obtenido: number;
}
