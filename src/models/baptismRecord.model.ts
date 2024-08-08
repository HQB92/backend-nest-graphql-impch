import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'BaptismRecords',
  timestamps: true,
})
export class BaptismRecord extends Model<BaptismRecord> {
  @Column({
    type: DataType.STRING(12),
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  childRut: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  childFullName: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  childDateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fatherRut: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fatherFullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  motherRut: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  motherFullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeOfRegistration: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  baptismDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  registrationNumber: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  registrationDate: Date;
}
