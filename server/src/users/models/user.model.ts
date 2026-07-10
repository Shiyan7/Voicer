import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';

export class User extends BaseModel {
  @IsEmail()
  email: string;

  name: string;

  avatar: string;

  password: string;

  googleId?: string;
}
