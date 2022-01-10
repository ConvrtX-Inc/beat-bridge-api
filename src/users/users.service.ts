import { HttpStatus, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<User>) {
    return this.usersRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<User>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  async getOneBase(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async saveEntity(data: DeepPartial<User>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
  async getClosestUsers(latitude: string, longitude: string, user: User) {
    const query = this.usersRepository.createQueryBuilder('u');
    const users = await query
      .select([
        'u.username as username',
        'u.email as email',
        'u.phone_no as phone_no',
        'u.latitude as latitude',
        'u.longitude as longitude',
      ])
      .where("u.id::text <> '" + user.id + "'")
      .getRawMany();

    const results = [];
    for (let i = 0; i < users.length; i++) {
      const use = await this.usersRepository
        .createQueryBuilder('u')
        .innerJoin('user_connection', 'uc', 'uc.to_user_id::text = u.id::text')
        .select(['u.username as username'])
        .where("uc.to_user_id::text = '" + users[i]['id'] + "'")
        .getRawOne();
      if (!use && !Number.isNaN(parseFloat(users[i]['latitude']))) {
        if (
          this.closestLocation(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(users[i]['latitude']),
            parseFloat(users[i]['longitude']),
            'K',
          ) <= 1
        ) {
          results.push(users[i]);
        }
      }
    }
    return {
      status: HttpStatus.OK,
      response: {
        data: {
          details: results,
        },
      },
    };
  }

  closestLocation(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let distance =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance);
    distance = (distance * 180) / Math.PI;
    distance = distance * 60 * 1.1515;
    if (unit == 'K') {
      distance = distance * 1.609344;
    }
    if (unit == 'N') {
      distance = distance * 0.8684;
    }
    return distance;
  }
}
