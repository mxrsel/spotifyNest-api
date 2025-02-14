import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  displayName?: string;
  token: string;
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

const SALT = 8;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  displayName: string;
  @Prop({ required: true })
  token: string;
  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = randomUUID();
};

UserSchema.methods.passwordCheckout = function (
  this: UserDocument,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
