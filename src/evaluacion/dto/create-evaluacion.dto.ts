import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateDetalleEvaluacionDto {
  @IsInt()
  id_criterio: number;

  @IsNumber()
  puntaje_obtenido: number;
}

export class CreateEvaluacionDto {
  @IsInt()
  id_jurado: number;

  @IsInt()
  id_proyecto: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_evaluacion: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleEvaluacionDto)
  detalles: CreateDetalleEvaluacionDto[];
}
