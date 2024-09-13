import React, { useState } from "react";
import { getImageSrc } from "./imgsrc";
import "./ImageZoomer.css";

const ImageZoomer = ({ src }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
      setScale(2); // Adjust this value for the desired zoom level
    }
  };

  const handleMouseMove = (e) => {
    if (isZoomed) {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setPosition({ x, y });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Thumbnail image that opens the modal on click */}
      <div className="w-[100%] h-[350px] rounded-md" onClick={handleImageClick}>
        <img
          src={getImageSrc(src)}
          alt={"name"}
          className="w-full h-full object-cover cursor-pointer"
        />
      </div>

      {/* Modal for zooming in/out the image */}
      {isModalOpen && (
        <>
          {/* Fixed position close button */}
          <button
            className="fixed top-4 right-4 text-white bg-black rounded-full p-2 w-10 h-10 flex items-center justify-center z-50"
            onClick={handleCloseModal}
            style={{ fontSize: "70px" }} // Adjust font size for button
          >
            &times;
          </button>

          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-40"
            onClick={handleCloseModal} // Close modal on outside click
          >
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
            >
              <img
                src={getImageSrc(src)}
                className={`cursor-${
                  isZoomed ? "zoom-out" : "zoom-in"
                } transition-transform duration-200 ease-out`}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: `${position.x}% ${position.y}%`,
                  maxWidth: isZoomed ? "90vw" : "auto", // Fixed width when zoomed
                  maxHeight: isZoomed ? "90vh" : "auto", // Fixed height when zoomed
                }}
                onClick={handleModalClick} // Zoom in/out on image click
                onMouseMove={handleMouseMove}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ImageZoomer;
