import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, RegisterRequest } from '../../../../dtos/models';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { md5 } from '../../../../_helper/md5';
import { GBUser, GBUserDocument } from '../../../../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(GBUser.name),
          useValue: {
            findOne: jest.fn(),
            exists: jest.fn(),
            findOneAndUpdate: jest.fn(),
            new: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      const mockUser = { email: 'test@example.com', password: 'password', name: 'Test User' };
      jest.spyOn(service['userModel'], 'findOne').mockResolvedValue(mockUser);

      const result = await service.validateUser(user.email, user.password);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found or credentials are invalid', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      jest.spyOn(service['userModel'], 'findOne').mockResolvedValue(null);

      const result = await service.validateUser(user.email, user.password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return successful login result if credentials are valid', async () => {
      const user: LoginRequest = { email: 'test@example.com', password: 'password' };
      const mockUser: any = { email: 'test@example.com', password: md5('password'), name: 'Test User' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(service['jwtService'], 'sign').mockReturnValue('mockJWT');

      const result = await service.login(user);

      expect(result.isSuccess).toBe(true);
      expect(result.value.name).toEqual(mockUser.name);
      expect(service['jwtService'].sign).toHaveBeenCalledWith(mockUser, { expiresIn: 3 * 60 * 60 });
    });

    it('should return failed login result if credentials are invalid', async () => {
      const user: LoginRequest = { email: 'test@example.com', password: 'password' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      const result = await service.login(user);

      expect(result.isSuccess).toBe(false);
    });
  });

  describe('register', () => {
    it('should return successful registration result if user does not exist', async () => {
      const user: RegisterRequest = { email: 'test@example.com', password: 'password', name: 'Test User' };
      jest.spyOn(service['userModel'], 'exists').mockResolvedValue(false);

      const result = await service.register(user);

      expect(result.isSuccess).toBe(true);
      expect(service['userModel'].new).toHaveBeenCalledWith({ ...user, password: md5(user.password) });
      expect(service['userModel'].save).toHaveBeenCalled();
    });

    it('should return failed registration result if user already exists', async () => {
      const user: RegisterRequest = { email: 'test@example.com', password: 'password', name: 'Test User' };
      jest.spyOn(service['userModel'], 'exists').mockResolvedValue(true);

      const result = await service.register(user);

      expect(result.isSuccess).toBe(false);
    });
  });
});

