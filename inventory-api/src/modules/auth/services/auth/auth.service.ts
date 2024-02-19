import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../../../dtos/models';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { GBUser, GBUserDocument } from '../../../../entities/user.entity';
import { md5 } from '../../../../_helper/md5';

@Injectable()
export class AuthService {
    resetEmailSecrete = 'GotbotToken23';
    constructor(
        @InjectModel(GBUser.name) private userModel: Model<GBUserDocument>,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<GBUser> {
        const user = await this.userModel.findOne({ email }).exec();

        if (user && user.password === pass) {
            const { password, ...result } = user.toObject();
            return result as GBUser;
        }

        return null;
    }

    async login(user: LoginRequest): Promise<Result<LoginResponse>> {
        try {
            var credentials = { ...user, password: md5(user.password) };
            const payload = await this.validateUser(credentials.email, credentials.password);
            const expiresIn = 3 * 60 * 60; // expires 3 hours

            if (!payload) {
                console.error("Login error", user)
                return new Result(false);
            }

            const results: LoginResponse = {
                name: payload.name,

                jwt: this.jwtService.sign(
                    payload,
                    { expiresIn }
                )
            };

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error login in", e, codes.AuthService_LoginException)
            return new Result(false);
        }
    }

    async register(user: RegisterRequest): Promise<Result<boolean>> {
        try {
            const exist = await this.userModel.exists({ email: user.email });

            if (exist) {
                return new Result(false)
            }

            const newUser = new this.userModel({ ...user, password: md5(user.password) });

            await newUser.save();

            return new Result(true)

        } catch (e) {
            console.error("Error registering", e, codes.AuthService_ErrorRegisteringUserCode);
            return new Result(false);
        }
    }
}
