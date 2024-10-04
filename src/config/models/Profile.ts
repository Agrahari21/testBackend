import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";

import User from "./User";

@Table({
  timestamps: true,
  tableName: "profiles",
  modelName: "Profile",
})
class Profile extends Model {
  @Column
  declare profileName: string;

  @ForeignKey(() => User)
  // @BelongsTo(() => User)
  @Column({
    allowNull: false,
  })
  declare email: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column
  declare address: string;

  @Column
  declare goal: string;

  @Column
  declare phone: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare dob: Date;

  @Column({
    defaultValue: new Date(),
  })
  declare starting_date: Date;
}

export default Profile;
