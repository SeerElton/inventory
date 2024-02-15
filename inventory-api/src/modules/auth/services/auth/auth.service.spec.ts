import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { GBUser } from '../../../../entities/user.entity';
import { ServeEmailerService } from '../../../../emails/email.sender';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../../../dtos/models';
import { Result } from '../../../../dtos/results';
import { getRepositoryToken } from '@nestjs/typeorm';
import { md5 } from '../../../../_helper/md5';

describe('AuthService', () => {
  let authService: AuthService;
  let gotbotUserRepository: Repository<GBUser>;
  let serveEmailerService: ServeEmailerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(GBUser), useClass: Repository },
        ServeEmailerService,
        JwtService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    gotbotUserRepository = module.get<Repository<GBUser>>(getRepositoryToken(GBUser));
    serveEmailerService = module.get<ServeEmailerService>(ServeEmailerService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user profile on successful validation', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser: GBUser = {
        id: '1',
        name: 'Test User',
        email: email,
        password: password,
        isVerified: true,
      };
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result: GBUser = await authService.validateUser(email, password);

      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });

      expect(result).toEqual({
        id: '1',
        name: 'Test User',
        email: email,
        isVerified: true
      });
    });

    it('should return null on unsuccessful validation', async () => {
      const email = 'test@example.com';
      const password = 'invalidPassword';
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(null);

      const result: GBUser = await authService.validateUser(email, password);

      expect(result).toBeNull();
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
    });
  });

  describe('login', () => {
    it('should return a successful login response', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        isVerified: true
      } as GBUser;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');

      const result: Result<LoginResponse> = await authService.login(loginRequest);

      expect(result).toEqual({
        isSuccess: true,
        value: {
          name: 'Test User',
          isVerified: true,
          jwt: 'jwtToken',
        },
      });
      expect(authService.validateUser).toHaveBeenCalledWith(loginRequest.email, md5(loginRequest.password));
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          isVerified: true
        },
        { expiresIn: 3 * 60 * 60 },
      );
    });

    it('should return an unsuccessful login response on invalid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(null);

      const result: Result<LoginResponse> = await authService.login(loginRequest);

      expect(result).toEqual(new Result(false));
      expect(authService.validateUser).toHaveBeenCalledWith(loginRequest.email, md5(loginRequest.password));
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful login response on error', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(authService, 'validateUser').mockRejectedValueOnce(new Error('Some error'));
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(null);

      const result: Result<LoginResponse> = await authService.login(loginRequest);

      expect(result).toEqual(new Result(false));
      expect(authService.validateUser).toHaveBeenCalledWith(loginRequest.email, md5(loginRequest.password));
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return a successful registration response', async () => {
      const user: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      jest.spyOn(gotbotUserRepository, 'exist').mockResolvedValueOnce(false);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);
      jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(new Result(true));

      const result: Result<boolean> = await authService.register(user, 'localhost');

      expect(result).toEqual(new Result(true));
      expect(gotbotUserRepository.exist).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(gotbotUserRepository.save).toHaveBeenCalledWith(expect.objectContaining(user));
      expect(authService.sendVerificationMail).toHaveBeenCalledWith('localhost', user.email, user.name);
    });

    it('should return an unsuccessful registration response if user already exists', async () => {
      const user: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      jest.spyOn(gotbotUserRepository, 'exist').mockResolvedValueOnce(true);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);
      jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.register(user, 'localhost');

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.exist).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
      expect(authService.sendVerificationMail).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful registration response on error', async () => {
      const user: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(gotbotUserRepository, 'exist').mockRejectedValueOnce(new Error('Some error'));
      jest.spyOn(gotbotUserRepository, 'exist').mockResolvedValueOnce(true);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);
      jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.register(user, 'localhost');

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.exist).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
      expect(authService.sendVerificationMail).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful registration response if sendVerificationMail fails', async () => {
      const user: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(gotbotUserRepository, 'exist').mockResolvedValueOnce(false);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);
      jest.spyOn(authService, 'sendVerificationMail').mockResolvedValueOnce(new Result(false));

      const result: Result<boolean> = await authService.register(user, 'localhost');

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.exist).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(gotbotUserRepository.save).toHaveBeenCalledWith(expect.objectContaining(user));
      expect(authService.sendVerificationMail).toHaveBeenCalledWith('localhost', user.email, user.name);
    });
  });

  describe('verifyEmail', () => {
    it('should return a successful verification response', async () => {
      const email = 'test@example.com';
      const code = md5(email + 'GotbotToken23');
      const mockUser: GBUser = { id: '1', email: email, isVerified: false } as GBUser;
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.verifyEmail(email, code);

      expect(result).toEqual(new Result(true));
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(gotbotUserRepository.save).toHaveBeenCalledWith({ ...mockUser, isVerified: true });
    });

    it('should return an unsuccessful verification response if user is already verified', async () => {
      const email = 'test@example.com';
      const code = md5(email + 'GotbotToken23');
      const mockUser: GBUser = { id: '1', email: email, isVerified: true } as GBUser;
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.verifyEmail(email, code);

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful verification response if user not found', async () => {
      const email = 'test@example.com';
      const code = md5(email + 'GotbotToken23');
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.verifyEmail(email, code);

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful verification response if code is incorrect', async () => {
      const email = 'test@example.com';
      const code = 'incorrectCode';
      const mockUser: GBUser = { id: '1', email: email, isVerified: false } as GBUser;
      jest.spyOn(gotbotUserRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.verifyEmail(email, code);

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
    });

    it('should return an unsuccessful verification response on error', async () => {
      const email = 'test@example.com';
      const code = md5(email + 'GotbotToken23');
      jest.spyOn(gotbotUserRepository, 'findOne').mockRejectedValueOnce(new Error('Some error'));
      jest.spyOn(gotbotUserRepository, 'save').mockResolvedValueOnce(undefined);

      const result: Result<boolean> = await authService.verifyEmail(email, code);

      expect(result).toEqual(new Result(false));
      expect(gotbotUserRepository.findOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(gotbotUserRepository.save).not.toHaveBeenCalled();
    });
  });
});