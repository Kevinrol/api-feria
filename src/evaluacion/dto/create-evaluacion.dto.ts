export class CreateDetalleEvaluacionDto {
  id_criterio: number;
  puntaje_obtenido: number;
}

export class CreateEvaluacionDto {
  id_jurado: number;
  id_proyecto: number;
  fecha_evaluacion: Date;
  observaciones?: string;
  detalles: CreateDetalleEvaluacionDto[];
}
