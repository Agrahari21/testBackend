import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  BeforeCreate,
  ForeignKey,
} from "sequelize-typescript";

import User from "./User";
import { compare, genSalt, hash } from "bcrypt";

@Table({
  //timestamps: true,
  tableName: "passresettokens",
  modelName: "PassResetToken",
})
class PassResetToken extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
  })
  declare owner: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
  declare created_at: Date;

  @BeforeCreate
  static async generateToken(instance: PassResetToken) {
    const salt = await genSalt(10);
    instance.token = await hash(instance.token, salt);
  }

  compareToken = async (token: string) => {
    return await compare(token, this.token);
  };
}

export default PassResetToken;
