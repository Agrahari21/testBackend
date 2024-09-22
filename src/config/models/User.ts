import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";
import Profile from "./Profile";
import { HasOne } from "sequelize";
import AuthVerifyToken from "./AuthVerifyToken";
import { hash, compare, genSalt } from "bcrypt";

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @Column({
    type: DataType.STRING,
  })
  declare slug: string;

  @Column({
    type: DataType.STRING,
  })
  declare tokens: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  /* @HasMany(() => Profile)
  declare profiles: Profile[]; */

  @BeforeCreate
  static async generatePasswd(instance: User) {
    const salt = await genSalt(10);
    instance.password = await hash(instance.password, salt);
  }

  comparePassword = async (password: string) => {
    return await compare(password, this.password);
  };
}

export default User;
