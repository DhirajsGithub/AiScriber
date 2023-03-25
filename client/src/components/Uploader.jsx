import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const { Dragger } = Upload;
const props = {
  name: "file",
  action: "localhost:3001/send_video",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

// const FetchSummaryComp = () => {

//   // const fetchSummary = async () => {
//   //   const response = fetch("http://127.0.0.1:8000/summary");
//   //   console.log(response);
//   //   resJson = (await response).json();
//   //   setSummary(resJson);
//   // };

// };

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
        console.log(response.data);
        // call audioToText function here, after video is successfully uplpaded
        try {
          await getTextFromAudio();
        } catch (error) {
          console.log("why this error");
        }
      })
      .catch((error) => console.log(error));
  };

  // <Dragger {...props}>
  //   <p className="ant-upload-drag-icon">
  //     <InboxOutlined />
  //   </p>
  //   <p className={`${styles.sectionSubText}`}>Click or drag file to this area to upload.</p>
  // </Dragger>
  return (
    <>
      <div>
        <p className={`${styles.sectionSubText}`}>Click here to upload.</p>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        <br />
        <br />
        {loading && <h1>Loading....</h1>}
        <br />
        <br />
        <h1>Summary of Video</h1>
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
