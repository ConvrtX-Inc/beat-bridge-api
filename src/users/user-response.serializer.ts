import { User } from '../users/user.entity';

const userResponseSerializer = (user: User) => {
  delete user.password;
  delete user.previousPassword;
};

export default userResponseSerializer;
