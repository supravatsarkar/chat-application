const multipleFileUploader = require("./../../utilities/multipleFileUploader");
const attachmentUpload = function (req, res, next) {
  const upload = multipleFileUploader(
    "attachments", //dir name
    ["image/jpeg", "image/jpg", "image/png"], //accepted file format
    10000000, // maximum 10mb file size allowed
    2,
    "Only .jpg, jpeg,.png format allowed" // error message set
  );

  // call the middleware function
  console.log("uploader:==>", upload);
  upload.any()(req, res, (err) => {
    console.log("err", err);
    if (err) {
      res.status(500).json({
        errors: {
          attachment: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = attachmentUpload;
