const createHttpError = require('http-errors');
const multer = require('multer');
const path = require('path');

function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  max_number_of_files,
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
      if (req.files.length > max_number_of_files) {
        cb(
          createHttpError(
            `Maximum ${max_number_of_files} files are allowed to upload!`
          )
        );
      } else {
        if (allowed_file_types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(createHttpError(error_msg));
        }
      }
    },
  });
  console.log('upload:', upload);
  return upload;
}

module.exports = uploader;
