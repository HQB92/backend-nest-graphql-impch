import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Churches',
  timestamps: true,
})
export class Church extends Model<Church> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;
}
