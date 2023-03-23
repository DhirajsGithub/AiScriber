const ffmpeg = require("fluent-ffmpeg");
const convertToAudio = (filename) => {
  let newFileName = __dirname + "/../../client/uploads/" + filename;
  let targetLocn = __dirname + "/../../client/uploads/audio.wav";
  ffmpeg(newFileName)
    .toFormat("wav")
    .on("error", (err) => {
      console.log(err);
    })
    .on("end", () => {
      console.log("Finished");
    })
    .save(targetLocn, () => {
      console.log("saved");
    });
};

const isConverted = (filename) => {
  convertToAudio(filename);
};

module.exports = isConverted;
