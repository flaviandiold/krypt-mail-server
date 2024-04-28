import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
@Table({
  tableName: 'keys',
})
export class Keys extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  @Exclude()
  privateKey: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  publicKey: string;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
}
