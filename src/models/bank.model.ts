import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Church } from './church.model';

@Table({
  tableName: 'Banks',
  timestamps: true,
})
export class Bank extends Model<Bank> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type: string;

  @ForeignKey(() => Church)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  churchId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  state: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment: string;

  @BelongsTo(() => Church)
  church: Church;
}
