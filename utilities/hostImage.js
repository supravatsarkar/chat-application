const fs = require("fs");
const path = require("path");
const axios = require("axios");

const hostImageToImageBB = (fileName, dir) => {
  const apiKey = process.env.IMAGE_BB_API_KEY;
  console.log("IMAGE_BB_API_KEY", apiKey);
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    dir,
    fileName
  );

  console.log("imagePath", imagePath);
  return new Promise((resolve, rejects) => {
    fs.readFile(imagePath, "base64", (err, data) => {
      if (!err) {
        const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
        // console.log("data");
        axios
          .post(
            url,
            {
              image: data,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              params: {
                //   expiration: 600,
              },
            }
          )
          .then(function (response) {
            console.log("axios response status", response.data.status);
            console.log("upload success", response.data.success);
            resolve(response.data?.data?.medium?.url);
          })
          .catch(function (error) {
            console.log("axios error", error.message);
            rejects(`axios error ${error.message}`);
          });
        // resolve("Success")
      } else {
        console.log("err", err);
        rejects(err);
      }
    });
  });
};
//"D:\Development\Projects\chat-application\\public\uploads\avatars\samplepngimage_500kbmb-1675664790076.png",
//"D:\\Development\\Projects\\chat-application\\public\\uploads\\avatars\\samplepngimage_500kbmb-1675664798658.png",

module.exports = {
  hostImageToImageBB,
};
