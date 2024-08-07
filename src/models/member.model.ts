import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Church } from './church.model';
import { Status } from './status.model';
import { User } from './user.model';

@Table({
  tableName: 'Members',
  timestamps: true,
})
export class Member extends Model<Member> {
  @Column({
    type: DataType.STRING(12),
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  rut: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  names: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastNameDad: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastNameMom: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  telephone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mobile: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  maritalStatus: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  probationStartDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  fullMembershipDate: Date;

  @ForeignKey(() => Church)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  churchId: number;

  @ForeignKey(() => Status)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  statusId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  sexo: string;

  @BelongsTo(() => Status, 'statusId')
  status: Status;

  @BelongsTo(() => Church, 'churchId')
  church: Church;
}
