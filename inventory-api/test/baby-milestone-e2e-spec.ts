import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../src/dtos/userProfile';
import { environment } from '../src/environment';
import { InventoryModule } from '../src/modules/inventory/inventory.module';
import { AddUserToDB, AddBaby2ToDB, AddPermissionToDB, CleanDB, AddGrowthRecordsToDB } from './test-user';
import { GotbotBaby } from '../src/entities/baby.entity';
import * as moment from 'moment';
import { AuthModule } from '../src/modules/auth/auth.module';
import { BabyGrowthRecordRequest } from '../src/dtos/babyGrowthRecordRequest';
import { GetBabyGrowthRecordRequest } from '../src/dtos/getBabyGrowthRecordRequest';

describe('BabyGrowthRecordController (e2e)', () => {
    let app;
    var token: any;
    let user: UserProfile;
    let moduleFixture: TestingModule;
    let baby: GotbotBaby;

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [InventoryModule,
                AuthModule,
                TypeOrmModule.forRoot(environment.typeormTestConfig as any)],
            providers: [JwtService]

        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        user = await AddUserToDB(moduleFixture);
        baby = await AddBaby2ToDB(moduleFixture);
        await AddPermissionToDB(moduleFixture);

        const jwtService = moduleFixture.get<JwtService>(JwtService);
        token = jwtService.sign(user);
    });

    afterAll(async () => {
        await CleanDB();
        await app.close();
    });

    describe('PUT /baby/growth-record/:date', () => {

        it('should return 401 when unauthorized', async () => {
            const response = await request(app.getHttpServer())
                .put('/baby/growth-record/x')
                .send(baby);

            expect(response.status).toBe(401);

        });

        it('should handle an unsuccessful baby growth record addition', async () => {
            const testDate = moment().toDate();
            const testGrowthRecord: BabyGrowthRecordRequest = {
                headCircumference: 12,
                height: 14,
                id: 'growth-record1',
                weight: 13,
                babyId: ''
            };
            const response = await request(app.getHttpServer())
                .put(`/baby/growth-record/${testDate}`)
                .set('Authorization', `Bearer ${token}`)
                .send(testGrowthRecord);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error adding baby growth-record', type: 'error' });
        });

        it('should add a baby growth-record successfully', async () => {
            const testDate = moment().toDate();
            const testGrowthRecord: BabyGrowthRecordRequest = {
                babyId: baby.Id,
                headCircumference: 12,
                height: 14,
                id: 'milestone1',
                weight: 13
            };

            const response = await request(app.getHttpServer())
                .put(`/baby/growth-record/${testDate}`)
                .set('Authorization', `Bearer ${token}`)
                .send(testGrowthRecord);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Baby growth record added successfully', type: 'success' });
        });
    });

    describe('POST /baby/growth-record/:id', () => {
        it('should get baby growth records successfully', async () => {

            var records = await AddGrowthRecordsToDB(moduleFixture);

            var date = new Date("2023-01-03");
            var results = records.filter(x => new Date(x.captureDate) >= date)

            const testId = baby.Id;
            const testGrowthRecordRequest: GetBabyGrowthRecordRequest = { startdate: date };

            const response = await request(app.getHttpServer())
                .post(`/baby/growth-record/${testId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(testGrowthRecordRequest);

            expect(response.status).toBe(200);

            expect(response.body.length).toEqual(results.length);
        });

        it('should handle an unsuccessful baby growth record retrieval', async () => {

            const testId = '123';
            const testGrowthRecordRequest: GetBabyGrowthRecordRequest = { startdate: moment().subtract(1, 'day').toDate() };

            const response = await request(app.getHttpServer())
                .post(`/baby/growth-record/${testId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(testGrowthRecordRequest);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});