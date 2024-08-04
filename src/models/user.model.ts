import {
  Column,
  Model,
  Table,
  DataType,
  AfterCreate,
} from 'sequelize-typescript';
import { Member } from './member.model';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(12),
    allowNull: false,
  })
  rut: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  roles: string[];

  @AfterCreate
  static async afterCreateHook(instance: User) {
    await Member.update(
      { userId: instance.id },
      { where: { rut: instance.rut } },
    );
  }
}
