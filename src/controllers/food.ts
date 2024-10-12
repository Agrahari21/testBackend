import { RequestHandler } from "express";
import Breakfast from "../config/models/Breakfast";
import Lunch from "../config/models/Lunch";
import Snack from "../config/models/Snack";
import Dinner from "../config/models/Dinner";
import FoodTransaction from "src/config/models/FoodTxn";
import sequelize from "src/config/dbConfig";
//import { DataType } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

////////////////////////////////////////////////////////////////////
export const getBreakfastList: RequestHandler = async (req, res) => {
  //const { email } = req.user;

  await Breakfast.sync({ alter: true });

  const breakfastList = await Breakfast.findAll({
    attributes: ["itemName", "itemValue"],
    order: ["itemValue"],
  });

  res.send(breakfastList);
};

////////////////////////////////////////////////////////////////////
export const getLunchList: RequestHandler = async (req, res) => {
  //const { email } = req.user;

  await Lunch.sync({ alter: true });

  const lunchList = await Lunch.findAll({
    attributes: ["itemName", "itemValue"],
    order: ["itemValue"],
  });

  res.send(lunchList);
};

////////////////////////////////////////////////////////////////////
export const getSnackList: RequestHandler = async (req, res) => {
  //const { email } = req.user;

  await Snack.sync({ alter: true });

  const snackList = await Snack.findAll({
    attributes: ["itemName", "itemValue"],
    order: ["itemValue"],
  });

  res.send(snackList);
};

////////////////////////////////////////////////////////////////////
export const getDinnerList: RequestHandler = async (req, res) => {
  //const { email } = req.user;

  await Dinner.sync({ alter: true });

  const dinnerList = await Dinner.findAll({
    attributes: ["itemName", "itemValue"],
    order: ["itemValue"],
  });

  res.send(dinnerList);
};

////////////////////////////////////////////////////////////////////
export const saveFoodData: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const {
    selDate,
    email,
    nYear,
    nWeek,
    nDay,
    pBreakfast,
    pLunch,
    pSnack,
    pDinner,
  } = req.body;

  await FoodTransaction.sync({ alter: true });

  const res1: FoodTransaction | null = await FoodTransaction.findOne({
    where: { nYear: nYear, nWeek: nWeek, nDay: nDay, email: email },
  });

  if (res1) {
    res.json({ message: "Record exist for selected date" });
  } else {
    const response = await FoodTransaction.create({
      email: email,
      selectedDate: selDate,
      nYear: nYear,
      nWeek: nWeek,
      nDay: nDay,
      pBreakfast: pBreakfast,
      pLunch: pLunch,
      pSnack: pSnack,
      pDinner: pDinner,
    });

    if (response) {
      res.json({ message: "Saved sucessfully! " });
    } else {
      res.json({ message: "Error in saving" });
    }
  }
};

////////////////////////////////////////////////////////////////////
export const updateFoodData: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const {
    selDate,
    email,
    nYear,
    nWeek,
    nDay,
    pBreakfast,
    pLunch,
    pSnack,
    pDinner,
  } = req.body;

  await FoodTransaction.sync({ alter: true });

  const res1: FoodTransaction | null = await FoodTransaction.findOne({
    where: { nYear: nYear, nWeek: nWeek, nDay: nDay, email: email },
  });

  if (res1) {
    const response = await FoodTransaction.update(
      {
        pBreakfast: pBreakfast,
        pLunch: pLunch,
        pSnack: pSnack,
        pDinner: pDinner,
      },
      {
        where: {
          email: email,
          // selectedDate: selDate,
          nYear: nYear,
          nWeek: nWeek,
          nDay: nDay,
        },
      }
    );
    if (response) res.json({ message: "Updated Successfully!" });
    else res.json({ message: "Error in updating!" });
  } else {
    res
      .status(422)
      .json({ message: "Record does not exist for selected date" });
  }
};

////////////////////////////////////////////////////////////////////
export const deleteFoodData: RequestHandler = async (req, res) => {
  const { email, nYear, nWeek, nDay } = req.body;

  await FoodTransaction.sync({ alter: true });

  const res1 = await FoodTransaction.destroy({
    where: { nYear: nYear, nWeek: nWeek, nDay: nDay, email: email },
  });

  if (res1) {
    res.json({ message: "Deleted Sucessfully! " });
  } else {
    res.json({ message: "Record does not exist for selected date" });
  }
};

////////////////////////////////////////////////////////////////////
export const getFoodDatalist: RequestHandler = async (req, res) => {
  const { email, year, week } = req.params;

  const { QueryTypes } = require("sequelize");

  const result = await sequelize.query(
    `SELECT selectedDate, nDay, pBreakfast, pLunch, pSnack, pDinner FROM ${process.env.DB_NAME}.foodtxn WHERE nYear= ? and nWeek=? and email= ? order by selectedDate`,
    {
      replacements: [+year, +week, email],
      type: QueryTypes.SELECT,
    }
  );

  res.json({ data: result });
};

////////////////////////////////////////////////////////////////////
export const getMaxWeekOfYear: RequestHandler = async (req, res) => {
  const { email, year } = req.params;

  await FoodTransaction.sync();

  const { QueryTypes } = require("sequelize");

  const result = await sequelize.query(
    `SELECT max(nWeek) as maxWeek FROM ${process.env.DB_NAME}.foodtxn WHERE nYear= ? and email= ?`,
    {
      replacements: [year, email],
      type: QueryTypes.SELECT,
    }
  );

  /* const result = await FoodTransaction.findOne({
    where: { email: email, nYear: year },
  }); */
  let maxWeek: number = 0;
  if (result) {
    maxWeek = result[0]?.maxWeek;

    res.json({ maxWeek: maxWeek });
  } else {
    res.json({ maxWeek: null });
  }
};

////////////////////////////////////////////////////////////////////
export const addFoodItem: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const { itemName, foodCategory, foodType, userType, isDinner, isSnack } =
    req.body.newFoodInfo;

  const email = req.user.email;

  console.log("email", email);

  await Dinner.sync({ alter: true });
  await Breakfast.sync({ alter: true });
  await Snack.sync({ alter: true });

  const { QueryTypes } = require("sequelize");

  const exist = await sequelize.query(
    `SELECT count(itemName) as count FROM ${process.env.DB_NAME}.${foodCategory}master WHERE itemName= "${itemName}" `,
    {
      type: QueryTypes.SELECT,
    }
  );

  // console.log("exist=>", exist);
  if (exist[0]) {
    if (exist[0].count === 1) {
      res.json({ message: "Item Already exist, use other name" });
      return;
    }
  }

  if (exist[0].count === 0) {
    let myuuid = uuidv4();
    const response = await sequelize.query(
      `INSERT into ${process.env.DB_NAME}.${foodCategory}master ( itemName,itemValue,userType,foodType, email ) VALUES ( ?, ?, ?, ?, ?)`,
      {
        replacements: [itemName, itemName, userType, foodType, email],
        type: QueryTypes.INSERT,
      }
    );
    // console.log("response", response);
    if (response) {
      if (isDinner || isSnack) {
        const response1 = await sequelize.query(
          `INSERT into ${process.env.DB_NAME}.${
            isDinner ? "dinner" : "snack"
          }master ( itemName,itemValue,userType,foodType ) VALUES (?, ?, ?, ?)`,
          {
            replacements: [itemName, itemName, userType, foodType],
            type: QueryTypes.INSERT,
          }
        );
        //  console.log("response1", response1);
        if (response1) {
          res.json({
            message: `New Food Item Saved Successfully as ${foodCategory} and ${
              isDinner ? "dinner" : "snack"
            } item!`,
          });
          return;
        } else {
          res.json({
            message: `Error in Adding new food item as ${
              isDinner ? "dinner" : "snack"
            } item!`,
          });
          return;
        }
      }
      res.json({
        message: `New Food Item as ${foodCategory} Saved Successfully!`,
      });
      return;
    } else {
      res.json({ message: `Error in Adding new food item as ${foodCategory}` });
      return;
    }
  }

  /* const response = await Lunch.create({
    itemName: itemName,
    itemValue: itemName,
    userType: userType,
    foodType: foodType,
  }); */
};
