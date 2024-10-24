import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Passworder } from 'src/lib/Passworder';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Roles } from '@/modules/users/types';

const admins = [
  {
    firstName: 'admin',
    lastName: 'admin',
    phone: 'none',
    role: Roles.ADMIN,
    password: '123456',
  },
];

export class AdminsSeeder implements Seeder {
  public async run(database: DataSource): Promise<void> {
    const userRepository = database.getRepository(UserEntity);

    const userEntities = [];

    for (let i = 0; i < admins.length; i++) {
      const hashedPassword = await Passworder.hashPassword(admins[i].password);

      userEntities.push(
        userRepository.create({
          ...admins[i],
          password: hashedPassword,
        }),
      );
    }

    await userRepository.createQueryBuilder().insert().values(userEntities).orIgnore().execute();
  }
}
