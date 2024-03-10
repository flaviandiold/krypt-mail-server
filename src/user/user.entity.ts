import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import { Keys } from './keys.entity';
@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
  })
  email: string;

  @Column({
    allowNull: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: DataType.UUID,
    unique: true,
  })
  token: string;

  @HasOne(() => Keys, { foreignKey: 'userId' })
  key: Keys;
}
