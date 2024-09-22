//import { IsUUID } from "sequelize-typescript";
import { validate as isValidUUID } from "uuid";
import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:',.<>?])[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|;:',.<>?]{8,}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const password = {
  password: yup
    .string()
    .required("password is missing")
    .min(8, "Password should be at least 8 char long!")
    .matches(passwordRegex, "Password is too simple"),
};

export const newUserSchema = yup.object({
  name: yup.string().required("Name is missing"),
  email: yup.string().email("Invalid Email!").required("Email is missing"),
  ...password,
});

const tokenAndId = {
  id: yup.string().test({
    name: "valid-id",
    message: "Invalid User Id",
    test: (value: string | undefined) => {
      if (value) return isValidUUID(value);
    },
  }),
  token: yup.string().required("Token is missing"),
};

export const verifyTokenSchema = yup.object({
  ...tokenAndId,
});

export const resetPassSchema = yup.object({
  ...tokenAndId,
  ...password,
});
