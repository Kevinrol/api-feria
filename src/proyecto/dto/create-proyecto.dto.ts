export class CreateProyectoDto {
  titulo: string;
  descripcion?: string;
  area_tematica?: string;
  fecha_registro: Date;
  id_docente: number;
  id_carrera: number;
}
