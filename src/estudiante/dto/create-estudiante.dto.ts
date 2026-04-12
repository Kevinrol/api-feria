import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  ci: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsInt()
  id_carrera: number;
}
