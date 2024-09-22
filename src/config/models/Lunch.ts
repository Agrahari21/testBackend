import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "lunchmaster",
  modelName: "Lunch",
})
class Lunch extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare itemName: string;

  @Column({
    type: DataType.STRING,
  })
  declare itemValue: string;

  @Column({
    type: DataType.STRING,
    // unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isItemVerified: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: "Indian",
  })
  declare userType: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Veg",
  })
  declare foodType: string;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
  declare created_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
  declare updated_at: Date;
}

export default Lunch;
