import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Statuses',
  timestamps: false,
})
export class Status extends Model<Status> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}
