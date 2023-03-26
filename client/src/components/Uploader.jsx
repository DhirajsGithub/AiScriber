import React, { useEffect, useState } from "react";
import axios from "axios";

import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import Approach from "./Approach";
import { projects2 } from "../constants";
// import img from "../../../server_node/client/extracted";

const ProjectCard2 = ({ index, name, image }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
        </div>
      </Tilt>
    </motion.div>
  );
};

const VideoUploadForm = (props) => {
  const [lecture, setLecture] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeStamps, setTimeStamps] = useState([2, 3, 54, 56]);
  const [imgLocation, setImgLocation] = useState([0, 2]);
  console.log(timeStamps[0]);
  console.log(imgLocation[1]);

  const handleFileChange = (event) => {
    setLecture(event.target.files[0]);
  };

  const fetchTimeStamps = async () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/objDet", {
      method: "GET",
      credentials: "include", // include cookies and authorization headers
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setTimeStamps(data.objDetect[0]);
        setImgLocation(data.objDetect[1]);
        console.log(data.objDetect[0]);
      })
      .catch((error) => console.error(error));
  };

  const fetchSummary = async (data) => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/summary", {
      method: "POST",
      credentials: "include", // include cookies and authorization headers
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        setLoading(false);
        setSummary(data);
        // objdetect
        try {
          await fetchTimeStamps();
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => console.error(error));
  };

  const getTextFromAudio = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/audioToText", {
      method: "GET",
      // credentials: "include", // include cookies and authorization headers
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // setSummary(data.subtitle);
        fetchSummary(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("lecture", lecture);
    axios
      .post("http://localhost:3001/send_video", formData)
      .then(async (response) => {
        console.log("Video file uploaded.");
        // call audioToText function here, after video is successfully uplpaded
        try {
          await getTextFromAudio();
        } catch (error) {
          console.log("Why this error");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {/* <div>
        <p className={`mb-2 inline-block${styles.sectionSubText}`}>Click here to upload.</p>
         <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>  */}

      <div class="max-w-md mx-auto p-6 rounded-md bg-transparent">
        <div class="flex items-center justify-between mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            class="appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            name="file"
            required
          />
          <button
            onClick={handleUpload}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Upload
          </button>
        </div>
      </div>

      <div>
        <br />
        <br />
        {loading && <h1>Loading....</h1>}
        <br />
        <br />
        {summary && (
          <h1 className={`mb-2 inline-block${styles.sectionHeadText}`}>
            Summary of Video
          </h1>
        )}
        {summary && <p>{summary[0]}</p>}
      </div>
      <div className="mt-20 flex flex-wrap gap-7">
        {projects2.map((project, index) => (
          <ProjectCard2 key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

const Uploader = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Upload your video here</h2>
      </motion.div>
      <br />
      <br />
      <br />
      <VideoUploadForm />
      <br />
      <br />
      <br />
    </>
  );
};

export default SectionWrapper(Uploader, "uploader");
