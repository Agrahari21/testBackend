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
  timestamps: true,
  tableName: "authverifytokens",
  modelName: "AuthVerifyToken",
})
class AuthVerifyToken extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.UUID,
    // unique: true,
    allowNull: false,
  })
  declare owner: string;

  @Column
  declare token: string;

  @BeforeCreate
  static async generateToken(instance: AuthVerifyToken) {
    const salt = await genSalt(10);
    instance.token = await hash(instance.token, salt);
  }

  compreToken = async (token: string) => {
    return await compare(token, this.token);
  };
}

export default AuthVerifyToken;
