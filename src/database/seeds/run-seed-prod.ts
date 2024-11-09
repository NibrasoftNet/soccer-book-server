import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  const seedService = process.argv[2]; // Get the service name from the command-line argument

  if (!seedService) {
    // If no argument is provided, run all seed services
    await app.get(RoleSeedService).run();
    await app.get(StatusSeedService).run();
    await app.get(UserSeedService).run();
    console.log('All seed services have been run.');
  } else {
    // If an argument is provided, run the specific seed service
    switch (seedService) {
      case 'role':
        await app.get(RoleSeedService).run();
        console.log('RoleSeedService has been run.');
        break;
      case 'status':
        await app.get(StatusSeedService).run();
        console.log('StatusSeedService has been run.');
        break;
      case 'user':
        await app.get(UserSeedService).run();
        console.log('UserSeedService has been run.');
        break;
      default:
        console.log(
          'Please specify a valid seed service: role, status, or user.',
        );
    }
  }

  await app.close();
};

void runSeed();
