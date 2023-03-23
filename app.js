const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const multer = require("multer");
const upload = require("./server/multer/multerUpload.js");
const convertToAudio = require("./server/ffmpegCommands/videoToAudio.js");
const isConverted = require("./server/ffmpegCommands/videoToAudio.js");
const app = express();
// const upload = multer({ dest: "./client/uploads" });
app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "./server/sendVideo.html";
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
  const fileName = "./client/uploads/audio.wav";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log("Path not yet created");
      res.redirect("/foundAudio");
    }
  });
});

app.post("/send_video", upload.single("lecture"), (req, res) => {
  convertToAudio("Lecture.mp4");
  res.redirect("/foundAudio");
});

app.listen(3000, () => {
  console.log("Hello");
});
