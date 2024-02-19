import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from '../../../../dtos/loginRequest';
import { RegisterRequest } from '../../../../dtos/registerRequest';
import { Public } from '../../../../_helper/jwt/public.decorator';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { AuthService } from '../../services/auth/auth.service';
import { Response } from 'express';
import { codes } from '../../../../codes';
import { LoginResponse } from '../../../../dtos/models';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login', description: "This endpoint authenticates a user into our inventory api" })
  @ApiResponse({ status: 200, description: 'Successful operation', type: LoginResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async login(@Body() loginRequest: LoginRequest, @Res() res: Response): Promise<void> {
    try {
      var result = await this.authService.login(loginRequest);

      if (!result.isSuccess) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          {
            message: "Incorrect credentials entered",
            type: ToastrResponse.TypeEnum.Error
          });
      } else {
        res.status(HttpStatus.OK).json(result.value);
      }

    } catch (e) {
      console.error("Error login in", e, codes.AuthController_LoginException)
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new chef', description: 'Ths endpoint registers a new user into our system' })
  @ApiCreatedResponse({ description: 'Successful operation', type: ToastrResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ToastrResponse })
  @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async register(@Body() payload: RegisterRequest, @Res() res: Response) {
    try {
      var results = await this.authService.register(payload);

      if (!results.isSuccess)
        res.status(500).json({
          message: "Email already registered",
          type: 'error'
        });
      else
        res.status(200).json({
          message: "Account created successfully",
          type: 'success'
        });


    } catch (e) {
      console.error("Error registering in", e, codes.AuthController_RegisterException)
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
