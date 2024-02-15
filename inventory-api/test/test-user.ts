import { md5 } from "../src/_helper/md5";
import { UserEntity } from "../src/entities/user.entity";
import { UserTypesEnum } from "../src/enums/user-type-enum";
import { GotbotBabySharedProfile } from "../src/entities/stock.entity";
import { GotbotBaby } from "../src/entities/baby.entity";
import { toEntity } from "../src/_helper/toEntity/toEntity";
import { createDatabase } from "typeorm-extension";
import * as path from "path";
import { BabyGrowthRecordRequest } from "../src/dtos/models";
import { GotbotBabyGrowthRecord } from "../src/entities/baby-growth-record.entity";
const fs = require('fs');

export function GetTestUser() {
    const user: UserEntity = {
        Age: 73,
        Email: 'father@example.com',
        Id: 'userid2',
        Password: md5('password123'),
        Name: "Elton",
        SubscribeToMarketing: false,
        Type: UserTypesEnum.PARENT,
        IsVerified: false
    };

    return user;
}

export function GetBabyPayload() {
    return {
        id: 'babyid2',
        name: "Elton",
        gender: "Male",
        DOB: '1996-01-01',
        weightAtBirth: 13,
        heightAtBirth: 15,
        headCircumferenceAtBirth: 10,
        relationshipWithUser: "mother",
        UserId: null
    }
}

export function GetBabyPermission(): GotbotBabySharedProfile {
    const baby = GetBaby();
    const user = GetTestUser();

    return {
        BabyId: baby.Id,
        Email: user.Email,
        Id: 'shared12',
        Permission: "READ"
    }
}

export function GetBaby(): GotbotBaby {
    var getBabyPayload: GotbotBaby = {
        Id: 'babyid3',
        Name: "baby tesr",
        Gender: "Female",
        DOB: new Date('2001-01-01'),
        WeightAtBirth: 20,
        HeightAtBirth: 20,
        HeadCircumferenceAtBirth: 20,
        RelationshipWithUser: "falther",
        UserId: 'userid2',
        Picture: ''
    };
    var baby = new toEntity().create<GotbotBaby>(getBabyPayload);

    const user = GetTestUser();
    baby.UserId = user.Id;

    return baby;
}


export function AddBaby2ToDB(moduleFixture): Promise<GotbotBaby> {
    const repository = moduleFixture.get('GotbotBabyRepository');
    var baby = GetBaby();
    return repository.save(baby);
}

export function AddPermissionToDB(moduleFixture) {
    const repository = moduleFixture.get('GotbotBabySharedProfileRepository');
    return repository.save(GetBabyPermission());
}

export function AddUserToDB(moduleFixture) {
    const repository = moduleFixture.get('GotbotUserRepository');
    return repository.save(GetTestUser());
}

export async function AddGrowthRecordsToDB(moduleFixture): Promise<any[]> {
    const baby = await AddBaby2ToDB(moduleFixture);

    const repository = moduleFixture.get('GotbotBabyGrowthRecordRepository');

    const milestone1: GotbotBabyGrowthRecord = {
        BabyId: baby.Id,
        HeadCircumference: 12,
        Id: 'milestone1',
        Height: 30,
        Weight: 45,
        Date: new Date("2023-01-02")
    }

    const milestone2: GotbotBabyGrowthRecord = {
        BabyId: baby.Id,
        HeadCircumference: 13,
        Id: 'milestone2',
        Height: 31,
        Weight: 46,
        Date: new Date("2023-01-03")
    }

    const milestone3: GotbotBabyGrowthRecord = {
        BabyId: baby.Id,
        HeadCircumference: 13,
        Id: 'milestone4',
        Height: 31,
        Weight: 46,
        Date: new Date("2023-01-04")
    }

    await repository.save(milestone1);
    await repository.save(milestone2);
    await repository.save(milestone3);

    var entity = new toEntity();
    return [entity.produce(milestone1), entity.produce(milestone2), entity.produce(milestone3)];
}

export async function AddSharedProfiles(moduleFixture) {
    const baby = await AddBaby2ToDB(moduleFixture);
    const repository = moduleFixture.get('GotbotBabySharedProfileRepository');

    var list: GotbotBabySharedProfile[] = [
        {
            BabyId: baby.Id,
            Email: "nhlana",
            Id: "id1",
            Permission: 'READ'
        },
        {
            BabyId: baby.Id,
            Email: "smomo",
            Id: "id2",
            Permission: 'READ-WRITE'
        }
    ]

    return await repository.save(list)
}

export function CleanDB() {
    setTimeout(() => removeFolder('./data'), 10000);
}

function removeFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log('Folder does not exist.');
        return;
    }

    fs.readdirSync(folderPath).forEach(file => {
        const curPath = path.join(folderPath, file);

        if (fs.lstatSync(curPath).isDirectory()) {
            // Recursive call for subfolders
            removeFolder(curPath);
        } else {
            // Delete file
            fs.unlinkSync(curPath);
        }
    });

    // Remove the empty folder
    fs.rmdirSync(folderPath);
    console.log('Folder removed:', folderPath);
}