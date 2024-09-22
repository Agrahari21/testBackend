import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";

import User from "./User";

@Table({
  timestamps: true,
  tableName: "profiles",
  modelName: "Profile",
})
class Profile extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  /* @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare user_id: string; */

  @Column({
    type: DataType.STRING,
  })
  declare profileName: string;

  @Column({
    type: DataType.STRING,
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
  })
  declare goal: string;

  @Column({
    type: DataType.STRING,
  })
  declare phone: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare dob: Date;

  @Column({
    type: DataType.DATEONLY,
  })
  declare starting_date: Date;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

export default Profile;
