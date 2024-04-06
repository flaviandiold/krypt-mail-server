import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Mail } from './mail.entity';
import { Access } from './access.entity';

@Table({
  tableName: 'forwardable-details',
})
export class Forwardable extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  mid: number;

  @Column({ type: DataType.STRING })
  to: string;

  @BelongsTo(() => Mail, { foreignKey: 'mid' })
  mail: Mail;

  @HasMany(() => Access, { foreignKey: 'fid' })
  accessDetails: Access[];
}
