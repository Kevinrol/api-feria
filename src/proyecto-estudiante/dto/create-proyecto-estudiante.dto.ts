import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProyectoEstudianteDto {
  @IsInt()
  @IsNotEmpty()
  id_proyecto: number;

  @IsInt()
  @IsNotEmpty()
  id_estudiante: number;
}
