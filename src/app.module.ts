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
import { ProyectoEstudianteModule } from './proyecto-estudiante/proyecto-estudiante.module';
import { DetalleEvaluacionModule } from './detalle-evaluacion/detalle-evaluacion.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    CarreraModule,
    EstudianteModule,
    DocenteModule,
    ProyectoModule,
    ProyectoEstudianteModule,
    JuradoModule,
    CriterioModule,
    EvaluacionModule,
    DetalleEvaluacionModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
