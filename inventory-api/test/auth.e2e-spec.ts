import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../src/environment';
import { UserEntity } from '../src/entities/user.entity';
import { UserTypesEnum } from '../src/enums/user-type-enum';
import { md5 } from '../src/_helper/md5';
import { RegisterRequest } from '../src/dtos/models';
import { CleanDB } from './test-user';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AuthModule,
        TypeOrmModule.forRoot(environment.typeormTestConfig as any)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get('GotbotUserRepository');
    const user: UserEntity = {
      Age: 73,
      Email: 'father@example.com',
      Id: 'id1',
      Password: md5('password123'),
      Name: "Elton",
      SubscribeToMarketing: false,
      Type: UserTypesEnum.PARENT,
      IsVerified: false
    };
    await userRepository.save(user);
  });

  afterAll(async () => {
    await CleanDB();
    await app.close();
  });

  describe("/auth/login (POST)", () => {
    it(' Given user does not exists should return status 500 with an error message', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(500)
        .then((response) => {
          expect(response.body.type).toBe('error');
        });
    });

    it('Given user credentials password is wrong should return status 500 with an error message', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: 'father@example.com', password: 'password1234' })
        .expect(500)
        .then((response) => {
          expect(response.body.type).toBe('error');
        });
    });

    it('Given valid user credentials should return status 200 with a token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: 'father@example.com', password: 'password123' })
        .expect(200)
        .then((response) => {
          expect(response.body.jwt).toBeDefined();
          expect(response.body.name).toBeDefined();
          expect(response.body.isVerified).toBeDefined();
        });
    });
  })

  describe('/auth/register (POST)', () => {
    it('should register a new chef', async () => {
      const parentSignUpRequest: RegisterRequest = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        age: 35,
        subscribeToMarketing: false,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(parentSignUpRequest)
        .expect(200);

      expect(response.body.message).toBe('Account created successfully');
      expect(response.body.type).toBe('success');
    });

    it('should return 500 if email is already registered', async () => {
      // create a user with the same email
      const userRepository = moduleFixture.get('GotbotUserRepository');
      const user: UserEntity = {
        Age: 73,
        Email: 'father@example.com',
        Id: "id1",
        Password: md5('password123'),
        Name: "Elton",
        SubscribeToMarketing: false,
        Type: UserTypesEnum.PARENT,
        IsVerified: false
      };
      await userRepository.save(user);

      const parentSignUpRequest: RegisterRequest = {
        name: 'Jane Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        age: 25,
        subscribeToMarketing: false,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(parentSignUpRequest)
        .expect(500);

      expect(response.body.message).toBe('Email already registered');
      expect(response.body.type).toBe('error');
    });
  });

  describe('/auth/reset-password (POST)', () => {
    it('should return a success response when step1 is successful', async () => {
      const requestBody = { email: 'father@example.com', newPassword: '123' };
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send(requestBody)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({ message: 'Please check your email to verify that its you', type: 'success' });
    });

    it('should return a warning response when step1 fails', async () => {
      const requestBody = { email: 'invalid-email', newPassword: '123' };
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send(requestBody)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: 'Please verify that your email is correct', type: 'warning' });
    });
  });

  describe('/auth/reset-password/:verificationToken (GET)', () => {

    it('should return a success response when step2 is successful', async () => {

      const gotbotResetPasswordRepository = moduleFixture.get('GotbotResetPasswordRepository');
      const item = await gotbotResetPasswordRepository.findOne({ where: { UserEmail: 'father@example.com' } })

      const verificationToken = item.Id;
      const response = await request(app.getHttpServer())
        .get(`/auth/reset-password/${verificationToken}`)
        .expect(HttpStatus.OK)


      expect(response.text).toEqual('Password changed');
    });

    it('should return a warning response when step2 fails', async () => {
      // This assumes that you have an invalid verification token
      const verificationToken = 'invalid-verification-token';
      const response = await request(app.getHttpServer())
        .get(`/auth/reset-password/${verificationToken}`)
        .expect(HttpStatus.OK);

      const gotbotResetPasswordRepository = moduleFixture.get('GotbotResetPasswordRepository');
      const item = await gotbotResetPasswordRepository.findOne({ where: { UserEmail: 'father@example.com' } })

      expect(item).toBeNull();
      expect(response.text).toEqual('Link already used');
    });
  });
});