import { Module } from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { JuradoController } from './jurado.controller';

@Module({
  controllers: [JuradoController],
  providers: [JuradoService],
})
export class JuradoModule {}
