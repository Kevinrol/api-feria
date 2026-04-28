import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(correo: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(correo);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id_usuario, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: user.id_usuario,
        correo: user.correo,
        rol: user.rol,
        id_docente: user.id_docente,
        id_estudiante: user.id_estudiante,
        id_jurado: user.id_jurado
      }
    };
  }

  async register(data: any) {
    const { role, ci, nombre, apellido, telefono, correo, password, carrera, institucion, especialidad, clave } = data;

    // Verificar si el correo ya existe
    const existing = await this.usuarioService.findByEmail(correo);
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rolEnum = role === 'jurado' ? 'JURADO' : role === 'docente' ? 'DOCENTE' : 'ESTUDIANTE';

    // Para evitar complejidad, buscamos el id_carrera si es necesario
    let id_carrera_number: number = 0;
    if (rolEnum === 'ESTUDIANTE' || rolEnum === 'DOCENTE') {
      const dbCarrera = await this.prisma.carrera.findFirst({
        where: { nombre_carrera: { contains: carrera } }
      });
      if (!dbCarrera) throw new BadRequestException('Carrera no válida');
      id_carrera_number = dbCarrera.id_carrera;
    }

    // Transacción de creación
    try {
      const newUser = await this.prisma.usuario.create({
        data: {
          correo,
          password: hashedPassword,
          rol: rolEnum,
          ...(rolEnum === 'ESTUDIANTE' && {
            estudiante: {
              create: { ci, nombre, apellido, telefono, correo, id_carrera: id_carrera_number }
            }
          }),
          ...(rolEnum === 'DOCENTE' && {
            docente: {
              create: { ci, nombre, apellido, telefono, correo, especialidad: `Tutor ${carrera}` }
            }
          }),
          ...(rolEnum === 'JURADO' && {
            jurado: {
              create: { ci, nombre, apellido, telefono, correo, institucion, especialidad }
            }
          })
        }
      });
      return { success: true, message: 'Usuario registrado exitosamente', id: newUser.id_usuario };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al registrar usuario. Verifique los datos (CI o Correo duplicado).');
    }
  }
}
