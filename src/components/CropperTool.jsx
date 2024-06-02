import React, { useState, useRef } from 'react';

const CropperTool = ({ selectedTool, getCanvasSizeCB }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isDrawn, setIsDrawn] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (isDrawn) return
    setStartPos({ x: e.clientX, y: e.clientY });
    setRect({ width: 0, height: 0, left: e.clientX, top: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
    setIsDrawing(true);
    setIsDrawn(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const width = e.clientX - startPos.x;
    const height = e.clientY - startPos.y;

    setRect({
      width: Math.abs(width),
      height: Math.abs(height),
      left: width < 0 ? e.clientX : startPos.x,
      top: height < 0 ? e.clientY : startPos.y,
    });

    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDrawn(true);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prevScale) => Math.max(0.1, prevScale * scaleChange));
  };

  const handleConfirm = () => {
    // alert(`Rectangle confirmed with Width: ${rect.width}px, Height: ${rect.height}px`);
    setIsDrawn(false);
    getCanvasSizeCB(rect.width, rect.height)
  };

  const handleCancel = () => {
    setRect({ width: 0, height: 0, left: 0, top: 0 });
    setIsDrawn(false);
  };

  const cornerBoxSize = 8; // Size of the corner boxes
  if (selectedTool !== "crop") {
    return <div></div>
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{
        width: '93vw',
        height: '100vh',
        position: 'fixed', // Ensure it overlays everything
        overflow: 'hidden',
        cursor: isDrawing ? 'crosshair' : 'default',
        zIndex: "100", // set max value of zindex
        marginRight: "auto"
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {(isDrawing || isDrawn) && (
          <>
            <div
              style={{
                position: 'absolute',
                border: '1px solid blue',
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                boxSizing: 'border-box',
              }}
            >
              {/* Corner boxes */}
              <div
                style={{
                  width: `${cornerBoxSize}px`,
                  height: `${cornerBoxSize}px`,
                  backgroundColor: 'blue',
                  position: 'absolute',
                  top: '-4px',
                  left: '-4px',
                }}
              />
              <div
                style={{
                  width: `${cornerBoxSize}px`,
                  height: `${cornerBoxSize}px`,
                  backgroundColor: 'blue',
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                }}
              />
              <div
                style={{
                  width: `${cornerBoxSize}px`,
                  height: `${cornerBoxSize}px`,
                  backgroundColor: 'blue',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '-4px',
                }}
              />
              <div
                style={{
                  width: `${cornerBoxSize}px`,
                  height: `${cornerBoxSize}px`,
                  backgroundColor: 'blue',
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                }}
              />

              {/* Horizontal and vertical lines */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'blue',
                  top: '50%',
                  left: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '1px',
                  backgroundColor: 'blue',
                  top: 0,
                  left: '50%',
                }}
              />
            </div>
            {isDrawing && (
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  border: '1px solid blue',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  left: `${currentPos.x + 10}px`,
                  top: `${currentPos.y + 10}px`,
                  zIndex: 10,
                  color: 'blue',
                  fontSize: '12px',
                }}
              >
                {`(${currentPos.x}, ${currentPos.y})`}
              </div>
            )}
            {isDrawn && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling to parent elements
                    handleConfirm(); // Call your confirm function
                  }}
                  style={{
                    position: 'absolute',
                    left: `${rect.left + rect.width + 10}px`,
                    top: `${rect.top}px`,
                    backgroundColor: 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    position: 'absolute',
                    left: `${rect.left + rect.width + 10}px`,
                    top: `${rect.top + 40}px`,
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                >
                  ✕
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '10px', fontSize: '14px', color: 'blue' }}>
        {`Width: ${rect.width}px, Height: ${rect.height}px`}
      </div>
    </div>
  );
};

export default CropperTool;
