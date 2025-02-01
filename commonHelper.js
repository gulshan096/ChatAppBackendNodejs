import logger from "./logger.js";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";

const commonHelper = {
  sendEvent(socket, eventName, flag, msg, data = {}) {
    try {
      const response = { success: flag, msg: msg, data: data };
      logger.info(
        `\nResponse Time: ${new Date()} : Data: ${JSON.stringify(response)}`
      );
      socket.emit(eventName, response);
    } catch (error) {
      logger.error("socketFunction.js:-->", error.message);
    }
  },
  saveFile(file) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "uploads/image", file.name);
    fs.writeFileSync(filePath, file.data);
    // return filePath;
    return "";
  },
};

export default commonHelper;
