import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Access } from 'src/mail/access.entity';
import { Forwardable } from 'src/mail/forwardable.entity';
import { Mail } from 'src/mail/mail.entity';
import { Keys } from 'src/user/keys.entity';
import { User } from 'src/user/user.entity';

export const databaseProvider: Provider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize: Sequelize = new Sequelize({
      dialect: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'admin',
      database: 'kryptmail',
    });
    sequelize.addModels([User, Keys, Mail, Forwardable, Access]);
    await sequelize.sync({ alter: true });
    return sequelize;
  },
};
