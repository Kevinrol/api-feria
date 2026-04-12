import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCriterioDto {
  @IsString()
  @IsNotEmpty()
  nombre_criterio: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  puntaje_maximo: number;
}
