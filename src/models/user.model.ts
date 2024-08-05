import {
  Column,
  Model,
  Table,
  DataType,
  AfterCreate,
} from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from './member.model';

@ObjectType()
@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model<User> {
  @Field()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Field()
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

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Field(() => [String])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
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
