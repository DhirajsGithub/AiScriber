import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";


const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={styles.sectionHeadText}>Overview</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        This project belongs to the General Track of the
        DevHack event. This is inclined towards solving the problem of
        reducing the time required by the learner for learning from any
        video source. This project brings along the technologies of Computer Vision, 
        Speech Processing, Natural Language Processing
        and Video Processing together to give the learner the crux of the
        whole video in a single document.
      </motion.p>

    </>
  );
};

export default SectionWrapper(About, "about");
