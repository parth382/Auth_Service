// // src/seeds/create-roles.seed.ts
// import { Factory, Seeder } from 'typeorm-seeding';
// import { DataSource } from 'typeorm';
// import { Roles } from '../model/Roles';

// export default class CreateRolesSeed implements Seeder {
//   public async run(factory: Factory, dataSource: DataSource): Promise<void> {
//     const roleRepository = dataSource.getRepository(Roles);

//     const roles = ['admin', 'customer', 'airline_business'];

//     for (const name of roles) {
//       const exists = await roleRepository.findOne({ where: { name } });
//       if (!exists) {
//         await roleRepository.save(roleRepository.create({ name }));
//         // console.log(`Seeded role: ${name}`);
//       }
//     }
//   }
// }
