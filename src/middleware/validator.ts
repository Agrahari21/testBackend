import { RequestHandler } from "express";
import { InstanceError } from "sequelize";
import { sendErrorRes } from "src/utils/helper";
import * as yup from "yup";
//same as import {object, string, number, date, InferType} from 'yup';
//validate newUserSchema
const validate = (schema: yup.Schema): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validate(
        { ...req.body },
        { strict: true, abortEarly: true }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        sendErrorRes(res, error.message, 422);
      } else {
        next(error);
      }
    }
  };
};
export default validate;
