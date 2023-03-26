import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  About,
  Contact,
  Uploader,
  Hero,
  Navbar,
  Approach,
  StarsCanvas,
} from "./components";

const App = () => {
  const [timeStamps, setTimeStamps] = useState([]);
  const [imgLocation, setImgLocation] = useState([]);

  const setTimeStampImgLoc = (time, imgLo) => {
    setTimeStamps(time);
    setImgLocation(imgLo);
  };
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Approach />
        <Uploader />

        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
