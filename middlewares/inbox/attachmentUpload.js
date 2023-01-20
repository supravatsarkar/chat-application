const multipleFileUploader = require('./../../utilities/multipleFileUploader');
const attachmentUpload = function (req, res, next) {
  const upload = multipleFileUploader(
    'attachments', //dir name
    ['image/jpeg', 'image/jpg', 'image/png', 'pdf', 'xls', 'doc', 'text/txt'], //accepted file format
    1000000, // maximum 1mb file size allowed
    2,
    'Only .jpg, jpeg,.png, pdf, doc, xls, txt format allowed' // error message set
  );

  // call the middleware function
  console.log('uploader:==>', upload);
  upload.any()(req, res, (err) => {
    console.log('err', err);
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
