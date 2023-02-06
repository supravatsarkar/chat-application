const uploader = require("./../../utilities/singleFileUploader");

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars", //dir name
    ["image/jpeg", "image/jpg", "image/png"], //accepted file format
    10000000, // maximum 10mb file size allowed
    "Only .jpg, jpeg or .png format allowed" // error message set
  );
  upload.any()(req, res, (err) => {
    if (err) {
      // console.log('error-->', err);
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
