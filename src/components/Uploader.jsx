import React from "react";
import { motion } from "framer-motion";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";


const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};


const Here = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className={`${styles.sectionSubText}`}>Click or drag file to this area to upload.</p>
  </Dragger>
);


const Uploader = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Upload your video here</h2>
      </motion.div>
      <br /><br /><br />
      <Here />
    </>
  );
};

export default SectionWrapper(Uploader, "uploader");
