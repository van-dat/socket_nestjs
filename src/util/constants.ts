import { SetMetadata } from '@nestjs/common';
export enum Role {
    User = 0,
    Admin = 1,
}



export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

