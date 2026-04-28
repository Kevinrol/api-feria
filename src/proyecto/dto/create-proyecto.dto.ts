import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  area_tematica?: string;

  @IsOptional()
  @IsString()
  imageSrc?: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_registro: string;

  @IsInt()
  id_docente: number;

  @IsInt()
  id_carrera: number;

  @IsOptional()
  @IsInt({ each: true })
  estudiantesIds?: number[];
}
