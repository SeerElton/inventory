import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserProfile } from '../src/dtos/userProfile';
import { AddBaby2ToDB, AddPermissionToDB, AddUserToDB, CleanDB, GetBabyPayload } from './test-user';
import { InventoryModule } from '../src/modules/inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../src/environment';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';

describe('BabyController (e2e)', () => {
    let app;
    var token: any;
    let user: UserProfile;
    let moduleFixture: TestingModule;
    let baby = GetBabyPayload()

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [InventoryModule,
                AuthModule,
                TypeOrmModule.forRoot(environment.typeormTestConfig as any)],
            providers: [JwtService]

        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        user = await AddUserToDB(moduleFixture)
        await AddBaby2ToDB(moduleFixture);
        await AddPermissionToDB(moduleFixture)

        const jwtService = moduleFixture.get<JwtService>(JwtService);
        token = jwtService.sign(user);
    });

    afterAll(async () => {
        await CleanDB();
        await app.close();
    });

    describe('baby/add (POST)', () => {

        it('should return 401 when unauthorized', async () => {
            const response = await request(app.getHttpServer())
                .put('/baby/add')
                .send(baby);

            expect(response.status).toBe(401);

        });

        it('should return 200 and success message if adding a baby succeeded', async () => {
            const response = await request(app.getHttpServer())
                .put('/baby/add')
                .set('Authorization', `Bearer ${token}`)
                .send(baby);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Baby profile created',
                type: 'success',
            });
        });

        it('should return 500 and error message if adding a baby failed', async () => {
            const response = await request(app.getHttpServer())
                .put('/baby/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    gender: "Male2",
                    DOB: '1996-01-01',
                    weightAtBirth: 13,
                    heightAtBirth: 15,
                    headCircumferenceAtBirth: 10,
                    relationshipWithUser: "mother"
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'Error adding a baby',
                type: 'error',
            });
        });
    });

    describe('/baby/profile/:id (GET)', () => {

        it('should return 401 when unauthorized', async () => {
            const response = await request(app.getHttpServer())
                .get(`/baby/profile/x`)
                .send(baby);

            expect(response.status).toBe(401);

        });
        it('should return baby profile with status 200 when provided with a valid id', async () => {
            // Arrange
            const baby = GetBabyPayload();

            // Act
            const response = await request(app.getHttpServer())
                .get(`/baby/profile/${baby.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(baby.id);
            expect(response.body.name).toEqual(baby.name);
            expect(response.body.gender).toEqual(baby.gender);
            expect(response.body.headCircumferenceAtBirth).toEqual(baby.headCircumferenceAtBirth);
            // expect(new Date(response.body.dOB)).toEqual(new Date(baby.DOB));
            expect(response.body.heightAtBirth).toEqual(baby.heightAtBirth);
            expect(response.body.relationshipWithUser).toEqual(baby.relationshipWithUser);

        });

        it('should return error message with status 500 when baby profile not found', async () => {

            // Act
            const response = await request(app.getHttpServer())
                .get('/baby/profile/1')
                .set('Authorization', `Bearer ${token}`)
                .send()

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'Error getting baby information, please try again later',
                type: 'error',
            });
        });
    });

    describe('/baby/lookup (GET)', () => {
        it('should return a list of babies', async () => {
            const res = await request(app.getHttpServer())
                .get('/baby/lookup')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).toEqual(expect.any(Array));
            expect(res.body).toEqual(expect.any(Array));
        });
    });
});