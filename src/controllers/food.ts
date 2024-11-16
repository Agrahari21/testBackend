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
  const { isEnglish } = req.params;

  await Breakfast.sync({ alter: true });
  const { Op } = require("sequelize");
  let breakfastList = null;
  if (isEnglish === "true") {
    breakfastList = await Breakfast.findAll({
      where: { itemName: { [Op.ne]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemName"],
    });
  } else {
    breakfastList = await Breakfast.findAll({
      where: { itemValue: { [Op.ne]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemValue"],
    });
  }

  res.send(breakfastList);
};

////////////////////////////////////////////////////////////////////
export const getLunchList: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const { isEnglish } = req.params;

  await Lunch.sync({ alter: true });

  const { Op } = require("sequelize");
  let lunchList = null;
  if (isEnglish === "true") {
    lunchList = await Lunch.findAll({
      where: { itemName: { [Op.ne]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemName"],
    });
  } else {
    lunchList = await Lunch.findAll({
      where: { itemValue: { [Op.ne]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemValue"],
    });
  }

  res.send(lunchList);
};

////////////////////////////////////////////////////////////////////
export const getSnackList: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const { isEnglish } = req.params;

  await Snack.sync({ alter: true });
  const { Op } = require("sequelize");
  let snackList = null;
  //console.log("isEnglish", isEnglish);
  if (isEnglish === "true") {
    snackList = await Snack.findAll({
      where: { itemName: { [Op.notLike]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemName"],
    });
  } else {
    snackList = await Snack.findAll({
      where: { itemValue: { [Op.notLike]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemValue"],
    });
  }

  res.send(snackList);
};

////////////////////////////////////////////////////////////////////
export const getDinnerList: RequestHandler = async (req, res) => {
  //const { email } = req.user;
  const { isEnglish } = req.params;

  await Dinner.sync({ alter: true });

  const { Op } = require("sequelize");
  let dinnerList = null;
  //console.log("isEnglish", isEnglish);
  if (isEnglish === "true") {
    dinnerList = await Dinner.findAll({
      where: { itemName: { [Op.notLike]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemName"],
    });
  } else {
    dinnerList = await Dinner.findAll({
      where: { itemValue: { [Op.notLike]: "---" } },
      attributes: ["itemName", "itemValue"],
      order: ["itemValue"],
    });
  }

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
    res.json({ message: "Duplicate" });
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
      res.json({ message: "Saved" });
    } else {
      res.json({ message: "Error" });
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
    if (response) res.json({ message: "Updated" });
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
    res.json({ message: "Deleted" });
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
  const {
    itemName,
    foodCategory,
    foodType,
    userType,
    isDinner,
    isSnack,
    isEnglish,
  } = req.body.newFoodInfo;

  const email = req.user.email;

  //console.log("email", email);
  console.log("itemName-", itemName);
  //let itemValue: string = translate(itemName);
  /* translate(itemName, { from: "en", to: "hi" })
    .then((res) => {
      console.log(res.text);
      //=> Ik spreek Nederlands!
      console.log(res.from.text.autoCorrected);
      //=> tru
      console.log(res.from.text.value);
      //=> I [speak] Dutch!
      console.log(res.from.text.didYouMean);
      //=> false
    })
    .catch((err) => {
      console.error(err);
    }); */
  //console.log("itemValue", res1.text);

  await Dinner.sync({ alter: true });
  await Breakfast.sync({ alter: true });
  await Snack.sync({ alter: true });

  const { QueryTypes } = require("sequelize");
  let q1 = "";
  if (isEnglish)
    q1 = `SELECT count(itemName) as count FROM ${process.env.DB_NAME}.${foodCategory}master WHERE itemName= "${itemName}" `;
  else
    q1 = `SELECT count(itemValue) as count FROM ${process.env.DB_NAME}.${foodCategory}master WHERE itemValue= "${itemName}" `;
  const exist = await sequelize.query(q1, {
    type: QueryTypes.SELECT,
  });

  // console.log("exist=>", exist);
  if (exist[0]) {
    if (exist[0].count === 1) {
      res.json({ message: "DuplicateItem" });
      return;
    }
  }

  if (exist[0].count === 0) {
    let myuuid = uuidv4();
    const response = await sequelize.query(
      `INSERT into ${process.env.DB_NAME}.${foodCategory}master ( itemName,itemValue,userType,foodType, email ) VALUES ( ?, ?, ?, ?, ?)`,
      {
        replacements: [
          isEnglish ? itemName : "---",
          isEnglish ? "---" : itemName,
          userType,
          foodType,
          email,
        ],
        type: QueryTypes.INSERT,
      }
    );
    // console.log("response", response);
    if (response) {
      if (isDinner || isSnack) {
        const response1 = await sequelize.query(
          `INSERT into ${process.env.DB_NAME}.${
            isDinner ? "dinner" : "snack"
          }master ( itemName,itemValue,userType,foodType, email ) VALUES (?, ?, ?, ?, ?)`,
          {
            replacements: [
              isEnglish ? itemName : "---",
              isEnglish ? "---" : itemName,
              userType,
              foodType,
              email,
            ],
            type: QueryTypes.INSERT,
          }
        );
        //  console.log("response1", response1);
        if (response1) {
          res.json({
            message: "NewFoodSaved",
          });
          /*  res.json({
            message: `New Food Item Saved Successfully as ${foodCategory} and ${
              isDinner ? "dinner" : "snack"
            } item!`,
          }); */
          return;
        } else {
          res.json({
            message: `${isDinner ? "ErrAddDinner" : "ErrAddSnack"}`,
          });
          /*  res.json({
            message: `Error in Adding new food item as ${
              isDinner ? "dinner" : "snack"
            } item!`,
          }); */
          return;
        }
      }
      res.json({
        // message: `New Food Item as ${foodCategory} Saved Successfully!`,
        message: "NewFoodSaved",
      });
      return;
    } else {
      // res.json({ message: `Error in Adding new food item as ${foodCategory}` });
      res.json({ message: "NewFoodError" });
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
