const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    switch (file.fieldname) {
      case "id":
        folder = "id";
        break;
      case "domicile":
        folder = "domicile";
        break;
      case "status":
        folder = "status";
        break;
      default:
        folder = "";
    }
    const uploadDir = path.join(
      __dirname,
      "../uploads",
      folder,
      req.user.id.toString()
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const uploadFiles = multer({ storage });
module.exports = uploadFiles;
