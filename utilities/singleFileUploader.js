const createHttpError = require('http-errors');
const multer = require('multer');
const path = require('path');

function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) {
  //file upload folder
  const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;
  // define the Storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });
  // make upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createHttpError(error_msg));
      }
    },
  });
  return upload;
}

module.exports = uploader;
