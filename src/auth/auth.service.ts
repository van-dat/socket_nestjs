import { Injectable, UnauthorizedException } from '@nestjs/common';
import { checkPass } from 'src/util/helper';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async checkAccount(email: string) {
        try {
            const user = await this.userService.findByEmail(email);
            if (user) return user;
            throw new UnauthorizedException('User not found');
        } catch (error) {
            throw new UnauthorizedException('Error while fetching user');
        }
    }

    async login(user: any) {
        const payload = { username: user.name, sub: user._id, email: user.email };
        return {
            data:user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.checkAccount(email)
        const check = await checkPass(password, user.password)
        if (!user || !check) return null
        return user
    }
}
