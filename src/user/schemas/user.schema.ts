
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Users = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({default: 0})
  role: number;

  @Prop({default: false})
  isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);