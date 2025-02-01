import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { login, signup, userList } from "../controller/userController.js";

const route = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload/image"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

route.post("/register", upload.single("image"), signup);
route.post("/login", login);
route.post("/user-list", userList);

export default route;
