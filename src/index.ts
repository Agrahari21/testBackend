import "dotenv/config";
import "express-async-errors";
import express from "express";
import authRouter from "./routes/auth";
import foodRouter from "./routes/food";
import cors from "cors";
import "./config/dbConfig";
import User from "./config/models/User";
import Profile from "./config/models/Profile";

//console.log("Env variable:", process.env);
const app = express();

app.use(express.static("src/public"));

var corOptions = {
  origin: [
    "http://localhost:8000",
    "http://192.168.56.1:8000",
    "http://192.168.75.118:8000",
    "http://10.0.2.15",
    "http://193.203.184.29:8000",
  ],
};

//app.use(cors({ origin: "*" }));
app.use(cors(corOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API routes
app.use("/auth", authRouter);
app.use("/food", foodRouter);

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.get("/message/:name", (req, res) => {
  return res.json({ message: `hello ${req.params.name}` });
});

app.post("/api/users/:id/profiles", async (req, res) => {
  const data = {
    user_id: req.params.id,
    ...req.body,
  };
  await Profile.sync();
  const profiles = await Profile.create(data);
});

app.get("/api/users", async (req, res) => {
  const users = await User.findAll({ include: [Profile] });
  return res.status(200).json(users);
});

app.listen(process.env.PORT || 9000, () => {
  console.log("App is listening on http://localhost:8000 ");
});
