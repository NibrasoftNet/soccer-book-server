import { User } from '../../../users/entities/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  id: User['id'];
  role: User['role'];
  iat: number;
  exp: number;
};
