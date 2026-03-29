export class CreateEstudianteDto {
  ci: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  id_carrera: number;
}
