import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../src/dtos/userProfile';
import { environment } from '../src/environment';
import { InventoryModule } from '../src/modules/inventory/inventory.module';
import { AddUserToDB, AddBaby2ToDB, CleanDB, AddSharedProfiles } from './test-user';
import { GotbotBaby } from '../src/entities/baby.entity';
import { ShareBabyRequest } from '../src/dtos/models';
import { AuthModule } from '../src/modules/auth/auth.module';

describe('BabyProfileShareController (e2e)', () => {
    let app;
    var token: any;
    let moduleFixture: TestingModule;
    let baby: GotbotBaby;
    let user: UserProfile;

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

        const jwtService = moduleFixture.get<JwtService>(JwtService);
        token = jwtService.sign(user);

    });

    afterAll(async () => {
        await CleanDB();
        await app.close();
    });

    describe('GET /baby-profile-share/:babyId', () => {
        it('should return 401 when unauthorized', async () => {
            const response = await request(app.getHttpServer())
                .get('/baby-profile-share/babyId')
                .send(baby);

            expect(response.status).toBe(401);

        });

        it('should get a list of shared profiles successfully', async () => {
            const babyId = baby.Id;
            var results = (await AddSharedProfiles(moduleFixture)).map(x => ({ email: x.Email, id: x.Id, permission: x.Permission }));

            const response = await request(app.getHttpServer())
                .get(`/baby-profile-share/${babyId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toEqual(results);
        });

        it('should return null when profile does not exist', async () => {
            const babyId = '123';

            const response = await request(app.getHttpServer())
                .get(`/baby-profile-share/${babyId}`)
                .set('Authorization', `Bearer ${token}`)
                .send()

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

    });

    describe('PUT /baby-profile-share/:babyId', () => {
        it('should share a baby profile successfully', async () => {
            const babyId = baby.Id;
            const shareRequest: ShareBabyRequest = {
                email: "nhlana.2@gmail.com",
                id: baby.Id,
                permission: 'READ'
            };
            const repository = moduleFixture.get('GotbotBabySharedProfileRepository');

            const response = await request(app.getHttpServer())
                .post(`/baby-profile-share/${babyId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(shareRequest);

            var entity = (await repository.find()).find(x => x.Email == shareRequest.email);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Baby profile shared successfully');
            expect(response.body.type).toBe('success');
            expect(entity.BabyId).toBe(babyId);
            expect(entity.Email).toBe(shareRequest.email);
            expect(entity.Permission).toBe(shareRequest.permission);

        });

        it('should handle error sharing a baby profile', async () => {
            const babyId = '123';
            const shareRequest = {
                email: "nhlana.2@gmail.com",
                //Missing baby Id
                permission: 'READ'
            };

            const response = await request(app.getHttpServer())
                .post(`/baby-profile-share/${babyId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(shareRequest);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error sharing baby profile');
            expect(response.body.type).toBe('error');
        });
    });

    describe('DELETE /baby-profile-share/:babyId', () => {

        it('should remove shared access successfully', async () => {
            await AddSharedProfiles(moduleFixture);

            const profileId = 'id1';

            const response = await request(app.getHttpServer())
                .delete(`/baby-profile-share/${profileId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            const repository = moduleFixture.get('GotbotBabySharedProfileRepository');

            const removed = await repository.findOne({ where: { Id: profileId } })

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Baby profile shared successfully');
            expect(response.body.type).toBe('success');
            expect(removed).toBeNull();
        });

        it('should handle error removing access', async () => {
            const profileId = '123';

            const response = await request(app.getHttpServer())
                .delete(`/baby-profile-share/${profileId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error occurred, system admins have been notified');
            expect(response.body.type).toBe('error');
        });
    });
});
