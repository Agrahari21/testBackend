import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasOne,
  HasMany,
  BelongsTo,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import Profile from "./Profile";
//import { HasOne } from "sequelize";
import AuthVerifyToken from "./AuthVerifyToken";
import { hash, compare, genSalt } from "bcrypt";

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
class User extends Model {
  @Column({
    //primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column
  declare name: string;

  @Column({
    type: DataType.STRING,
    //unique: true,
    primaryKey: true,
  })
  declare email: string;

  @Column
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @Column
  declare tokens: string;

  @HasOne(() => AuthVerifyToken)
  // @BelongsTo(() => User)
  @HasMany(() => Profile)
  //declare profiles: Profile[];
  // @BelongsToMany(() => User)
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
