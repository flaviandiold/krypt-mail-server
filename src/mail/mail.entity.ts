import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Forwardable } from './forwardable.entity';

@Table({
  tableName: 'mail-details',
})
export class Mail extends Model {
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
  messageId: string;

  @Column
  from: string;

  @Column
  to: string;

  @Column
  passphrase: string;

  @Column({
    type: DataType.DATE,
  })
  validTill: Date;

  @Column({
    allowNull: false,
  })
  depth: number;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  forwardable: boolean;

  @Column({
    type: DataType.STRING(10000),
  })
  content: string;

  @HasOne(() => Forwardable, { foreignKey: 'mid' })
  forwardContent: Forwardable;
}
