import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const countUser = await connection
      .createQueryBuilder()
      .select()
      .from(User, 'User')
      .where('"User"."username" = :username', { username: 'johndoe' })
      .getCount();

    if (countUser === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          plainToClass(User, {
            username: 'johndoe',
            email: 'john.doe@example.com',
            password: 'secret',
          }),
        ])
        .execute();
    }
  }
}
