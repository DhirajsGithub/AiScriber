import {
  carrent,
  jobit,
  tripguide
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "uploader",
    title: "Upload",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const projects = [
  {
    name: "Finding relevant sections",
    description:
      "During writing on the board or a sheet of paper we will try to track the movements of the relevant figure, say a man in our case. When the man is on the background we assume that the instructor is writing. So we start processing his speech for that particular section.",
    image: carrent
  },
  {
    name: "Processing the found sections",
    description:
      "We are using speech recognition to start off with the second part of our project. In this part we will get all the text of the relevant portions that we found in the last part and start summarizing them and create a document out of it.",
    image: jobit
  },
  {
    name: "Generating the transcripts",
    description:
      "In this section the summary generated through audio and images will be merged together and we will make the summary, lecture scribe and the AI Generate document of the whole lecture.",
    image: tripguide
  },
];

export { projects };
