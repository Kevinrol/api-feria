import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CarreraModule } from './carrera/carrera.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { DocenteModule } from './docente/docente.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { JuradoModule } from './jurado/jurado.module';
import { CriterioModule } from './criterio/criterio.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';

@Module({
  imports: [
    PrismaModule,
    CarreraModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
