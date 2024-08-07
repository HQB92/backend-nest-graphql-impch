import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'merriageRecords',
  timestamps: true,
})
export class MerriageRecord extends Model<MerriageRecord> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(12),
    allowNull: false,
  })
  husbandId: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  fullNameHusband: string;

  @Column({
    type: DataType.STRING(12),
    allowNull: false,
  })
  wifeId: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  fullNameWife: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  civilCode: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  civilDate: Date;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  civilPlace: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  religiousDate: Date;
}
