import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Status } from 'src/statuses/status.entity';
import { StatusEnum } from 'src/statuses/statuses.enum';

export default class CreateStatus implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select()
      .from(Status, 'Status')
      .getCount();

    if (count === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Status)
        .values([
          { id: StatusEnum.active, status_name: 'Active', is_active: true },
          { id: StatusEnum.inactive, status_name: 'Inactive', is_active: true },
        ])
        .execute();
    }
  }
}
