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

  @Prop({ default: 0 })
  roles: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  codeId: string;

  @Prop()
  codeExpire: Date;


  @Prop({ type: Date, default: () => new Date() })
  createAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
