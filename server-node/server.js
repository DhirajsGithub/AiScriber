const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const upload = require("./server/multer/multerUpload.js");
const app = express();
// const upload = multer({ dest: "./client/uploads" });
app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "./server/sendVideo.html";
  fs.unlinkSync(__dirname + "/client/uploads/audio.wav", (err) => {
    if (err) {
      res.sendFile(fileName, options, function (err2) {
        if (err2) {
          console.log(err2);
        }
      });
    }
  });
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

app.get("/foundAudio", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "/client/uploads/audio.wav";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log("Underway");
    }
  });
});

app.post("/send_video", upload.single("lecture"), (req, res) => {
  let newFileName = __dirname + "/client/uploads/Lecture.mp4";
  let targetLocn = __dirname + "/client/uploads/audio.wav";
  const response = ffmpeg(newFileName)
    .toFormat("wav")
    .on("error", (err) => {
      console.log(err);
      res.send("Video has no audio");
    })
    .on("end", () => {
      console.log("Finished");
      res.redirect("/foundAudio");
    })
    .save(targetLocn, () => {});
  console.log(response);
});

app.listen(3001, () => {
  console.log("Hello");
});
