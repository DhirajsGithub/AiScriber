import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";


const VideoUploadForm = () => {
  const [lecture, setLecture] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setLecture(event.target.files[0]);
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
      .then((data) => {
        console.log(data);
        setLoading(false);
        setSummary(data);
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
            <input type="file" onChange={handleFileChange}  class="appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="file" name="file" required/>
            <button onClick={handleUpload} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">
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
        {summary && <h1 className={`mb-2 inline-block${styles.sectionHeadText}`}>Summary of Video</h1> }
        {summary && <p>{summary[0]}</p>}
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
