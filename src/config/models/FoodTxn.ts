import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "foodtxn",
  modelName: "FoodTransaction",
})
class FoodTransaction extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.DATE,
  })
  declare selectedDate: Date;

  @Column({
    type: DataType.INTEGER,
  })
  declare nYear: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare nWeek: number;

  @Column({
    type: DataType.STRING,
  })
  declare nDay: string;

  @Column({
    type: DataType.STRING,
  })
  declare pBreakfast: string;

  @Column({
    type: DataType.STRING,
  })
  declare pLunch: string;

  @Column({
    type: DataType.STRING,
  })
  declare pSnack: string;

  @Column({
    type: DataType.STRING,
  })
  declare pDinner: string;

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

export default FoodTransaction;
