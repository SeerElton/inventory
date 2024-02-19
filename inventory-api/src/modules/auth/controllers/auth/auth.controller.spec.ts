import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrResponse } from '../../../../dtos/toastrResponse';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
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
});