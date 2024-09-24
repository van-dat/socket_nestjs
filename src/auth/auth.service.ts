import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    loginService () {
        return {mesage : "loggin success caa"}
    }
}
