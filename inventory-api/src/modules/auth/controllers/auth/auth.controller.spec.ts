import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ToastrResponse } from '../../../../dtos/toastrResponse';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let resultsToBeFalse: any = { isSuccess: false };;
    let resultsToBeTrue: any = { isSuccess: true };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(() => ({
                            isSuccess: true,
                            value: {
                                token: 'mockToken',
                                chef: { id: 'mockId' },
                            },
                        })),
                        sendVerificationMail: jest.fn(() => (resultsToBeTrue)),
                        verifyEmail: jest.fn(() => (resultsToBeTrue)),
                    },
                }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('resendVerificationEmail', () => {
        it('should return success response on successful resend', async () => {
            const email = 'test@example.com';
            const req: any = { get: jest.fn(() => 'localhost') };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(resultsToBeTrue);
            await controller.resendVerificationEmail(email, req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Verification email send, please check your inbox!',
                type: 'success',
            });
            expect(authService.sendVerificationMail).toHaveBeenCalledWith('localhost', email);
        });

        it('should return error response on unsuccessful resend', async () => {
            const email = 'test@example.com';
            const req: any = { get: jest.fn(() => 'localhost') };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(resultsToBeFalse);

            await controller.resendVerificationEmail(email, req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error sending verification email',
                type: 'error',
            });
            expect(authService.sendVerificationMail).toHaveBeenCalledWith('localhost', email);
        });

        it('should throw Internal Server Error on exception', async () => {
            const email = 'test@example.com';
            const req: any = { get: jest.fn(() => 'localhost') };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            jest.spyOn(authService, 'sendVerificationMail').mockRejectedValueOnce(new Error('Some error'));

            await expect(controller.resendVerificationEmail(email, req, res)).rejects.toThrowError(
                new HttpException({ message: 'Internal server error', type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR)
            );
            expect(authService.sendVerificationMail).toHaveBeenCalledWith('localhost', email);
        });
    });

    describe('verifyEmail', () => {
        it('should return "Email verified" on successful verification', async () => {
            const email = 'test@example.com';
            const code = '123456';

            jest.spyOn(authService, 'verifyEmail').mockResolvedValueOnce(resultsToBeTrue);

            const result = await controller.verifyEmail(email, code);

            expect(result).toEqual('Email verified');
            expect(authService.verifyEmail).toHaveBeenCalledWith(email, code);
        });

        it('should return "Link already used" on unsuccessful verification', async () => {
            const email = 'test@example.com';
            const code = '123456';

            jest.spyOn(authService, 'verifyEmail').mockResolvedValueOnce(resultsToBeFalse);

            const result = await controller.verifyEmail(email, code);

            expect(result).toEqual('Link already used');
            expect(authService.verifyEmail).toHaveBeenCalledWith(email, code);
        });

        it('should throw Internal Server Error on exception', async () => {
            const email = 'test@example.com';
            const code = '123456';

            jest.spyOn(authService, 'verifyEmail').mockRejectedValueOnce(new Error('Some error'));

            await expect(controller.verifyEmail(email, code)).rejects.toThrowError(
                new HttpException({ message: 'Internal server error', type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR)
            );
            expect(authService.verifyEmail).toHaveBeenCalledWith(email, code);
        });
    });
});