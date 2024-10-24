/* eslint-disable no-console */
import { DataSource } from 'typeorm';
import { SeederConstructor, runSeeder } from 'typeorm-extension';

import { connectionSource } from 'src/config/ormConfig';
import { AdminsSeeder } from '@/database/seeds/admins.seeder';

const runSeederWithLogs = async (source: DataSource, seeder: string | SeederConstructor) => {
  const scoup = typeof seeder !== 'string' ? seeder.name : 'No scoup';

  console.log(`\n[${scoup}] Seed generation begins...`);
  await runSeeder(source, seeder);
  console.log(`[${scoup}] Seed creation completed successfully!`);
};

export const runSeeds = async (scope: 'launch' | 'script' | 'fillRooms') => {
  console.log('\nStart seeds...');

  try {
    const source = await connectionSource.initialize();

    switch (scope) {
      case 'launch':
        await runSeederWithLogs(source, AdminsSeeder);
        break;

      case 'script':
        await runSeederWithLogs(source, AdminsSeeder);
        break;
    }

    console.log('\nSeeds completed successfully');
  } catch (error) {
    console.log('\nSeeds starting error');
    console.log(error);
  } finally {
    console.log('');
  }
};
