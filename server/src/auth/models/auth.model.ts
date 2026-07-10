import { Token } from './token.model';
import { User } from 'src/users/models/user.model';

export class Auth extends Token {
  user: User;
}
