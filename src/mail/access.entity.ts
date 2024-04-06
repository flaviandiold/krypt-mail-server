import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Forwardable } from './forwardable.entity';

@Table({
  tableName: 'access-details',
})
export class Access extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.UUID,
  })
  token: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  verified: boolean;

  @Column({ type: DataType.INTEGER })
  fid: number;

  @BelongsTo(() => Forwardable, { foreignKey: 'fid' })
  fowardableDetail: Forwardable;
}
