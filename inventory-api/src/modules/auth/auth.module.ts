import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environment';
import { AuthGuard } from '../../_helper/jwt/jwt-auth.guard';
import { AuthController } from './controllers/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GBUser, GBUserSchema } from '../../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    MongooseModule.forFeature([{ name: 'GBUser', schema: GBUserSchema }]),
    JwtModule.register({
      global: true,
      secret: environment.jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService,
    JwtModule.register({
      global: true,
      secret: environment.jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })
    ,],
})
export class AuthModule { }