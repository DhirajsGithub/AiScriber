const express = require("express");
const cors = require("cors");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const path = require("path");
const upload = require("./server/multer/multerUpload.js");
const app = express();
// const upload = multer({ dest: "./client/uploads" });
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "./server/sendVideo.html";
  console.log(__dirname);
  if (fs.existsSync(__dirname + "/client/uploads/audio.wav")) {
    fs.unlinkSync(__dirname + "/client/uploads/audio.wav", (err) => {
      if (err) {
        res.sendFile(fileName, options, function (err2) {
          if (err2) {
            console.log(err2);
          }
        });
      }
    });
  } else {
    res.sendFile(fileName, options, function (err2) {
      if (err2) {
        console.log(err2);
      }
    });
  }
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
  console.log(__dirname);
  let newFileName = path.join(__dirname, "/client/uploads/Lecture.mp4");
  let targetLocn = path.join(__dirname, "/client/uploads/audio.wav");
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
  console.log("OK uploaded sucess");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
