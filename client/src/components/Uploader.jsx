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

const FetchSummaryComp = () => {
  const [summary, setSummary] = useState(null);
  // const fetchSummary = async () => {
  //   const response = fetch("http://127.0.0.1:8000/summary");
  //   console.log(response);
  //   resJson = (await response).json();
  //   setSummary(resJson);
  // };
  const fetchSummary = async () => {
    fetch("http://127.0.0.1:8000/summary", {
      method: "GET",
      credentials: "include", // include cookies and authorization headers
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    try {
      fetchSummary();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div>
      <h1>Summary of Video</h1>
      {summary && <p>{summary}</p>}
    </div>
  );
};

const VideoUploadForm = () => {
  const [lecture, setLecture] = useState(null);

  const handleFileChange = (event) => {
    setLecture(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("lecture", lecture);
    axios
      .post("http://localhost:3001/send_video", formData)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  };

  // <Dragger {...props}>
  //   <p className="ant-upload-drag-icon">
  //     <InboxOutlined />
  //   </p>
  //   <p className={`${styles.sectionSubText}`}>Click or drag file to this area to upload.</p>
  // </Dragger>
  return (
    <div>
      <p className={`${styles.sectionSubText}`}>Click here to upload.</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
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
      <FetchSummaryComp />
    </>
  );
};

export default SectionWrapper(Uploader, "uploader");
