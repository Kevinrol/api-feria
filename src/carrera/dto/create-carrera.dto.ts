//create-carrera.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty()
  nombre_carrera: string;

  @IsString()
  @IsNotEmpty()
  codigo_carrera: string;
}
