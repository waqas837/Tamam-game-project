import React, { useRef, useState } from "react";
import { getImageSrc } from "./imgsrc";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null); // Reference to the video element
  const [playCount, setPlayCount] = useState(0); // State to keep track of play count
  const [isPlayable, setIsPlayable] = useState(true); // State to manage if video is playable

  const handleVideoEnd = () => {
    if (playCount < 1) {
      // Check if the video has played less than 2 times
      setPlayCount((prevCount) => prevCount + 1); // Increment the play count
      videoRef.current.play(); // Play the video again
    } else {
      setIsPlayable(false); // Disable further play if the video has played twice
    }
  };

  const handlePlay = () => {
    if (!isPlayable) {
      // Prevent further play if the video is not playable
      videoRef.current.pause();
    }
  };

  return (
    <video
      ref={videoRef}
      controls={isPlayable} // Dynamically set controls based on playability
      onEnded={handleVideoEnd} // Event handler for video end
      onPlay={handlePlay} // Event handler for preventing play on click
      className="w-[100%] h-[335px] rounded-lg mb-4 shadow-sm"
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
};

// Usage example
const VideoLoop = ({ categories, modalContent }) => {
  let videoSrc;
  // Regular expression to check for any video format
  const videoRegex =
    /\.(mp4|avi|mov|webm|mkv|flv|wmv|3gp|m4v|ogv|vob|mts|ts|m2ts|mxf|asf|rm|rmvb|f4v|mpe?g)$/i;

  // Extract the image and document from the category object
  const { image, document } =
    categories[modalContent.category].questions[modalContent.questionIndex];

  // Check if either image or document matches the video format
  const isVideoImage = image?.match(videoRegex);
  const isVideoDocument = document?.match(videoRegex);

  // Run the code only if one of them is a video
  if (isVideoImage || isVideoDocument) {
    videoSrc = getImageSrc(isVideoImage ? image : document);
    // Handle video source logic here
  } else {
    // Handle cases where neither is a video
  }

  return (
    <>
      <VideoPlayer src={videoSrc} />
    </>
  );
};

export default VideoLoop;
