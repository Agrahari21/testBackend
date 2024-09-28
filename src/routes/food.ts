import { Router } from "express";
import {
  getBreakfastList,
  getLunchList,
  getSnackList,
  getDinnerList,
  saveFoodData,
  getFoodDatalist,
  getMaxWeekOfYear,
  addFoodItem,
} from "../controllers/food";
import { isAuth } from "src/middleware/auth";

const foodRouter = Router();

foodRouter.get("/bReakfast", getBreakfastList);
foodRouter.get("/lUnch", getLunchList);
foodRouter.get("/sNack", getSnackList);
foodRouter.get("/dInner", getDinnerList);
foodRouter.post("/saveDayList", saveFoodData);
foodRouter.patch("/updateDayList", updateFoodData);
foodRouter.delete("/deleteDayList", deleteFoodData);
foodRouter.get("/getFoodData/:email/:year/:week", getFoodDatalist);
foodRouter.get("/getMaxWeek/:email/:year", getMaxWeekOfYear);
foodRouter.post("/aDdFoodItem", isAuth, addFoodItem);

export default foodRouter;
