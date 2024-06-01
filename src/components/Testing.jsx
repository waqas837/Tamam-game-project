import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const cropRectRef = useRef(null);
  let isCropping = false;
  let cropStart = { x: 0, y: 0 };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'red', // Set red background color
    });

    canvas.on('mouse:down', (event) => {
      if (!isCropping) {
        isCropping = true;
        cropStart = canvas.getPointer(event.e);
        cropRectRef.current = new fabric.Rect({
          left: cropStart.x,
          top: cropStart.y,
          width: 1,
          height: 1,
          fill: 'rgba(0, 0, 0, 0)',
          stroke: '#333',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        canvas.add(cropRectRef.current);
      }
    });

    canvas.on('mouse:move', (event) => {
      if (isCropping && cropRectRef.current) {
        const pointer = canvas.getPointer(event.e);
        cropRectRef.current.set({
          width: pointer.x - cropStart.x,
          height: pointer.y - cropStart.y,
        });
        canvas.renderAll();
      }
    });

    canvas.on('mouse:up', () => {
      if (isCropping && cropRectRef.current) {
        // Get the cropped area bounds
        const croppedArea = cropRectRef.current.getBoundingRect();

        // Iterate over all canvas objects and adjust visibility based on intersecting with crop rectangle
        canvas.forEachObject((obj) => {
          const objBounds = obj.getBoundingRect();
          const isIntersecting =
            objBounds.left < croppedArea.left + croppedArea.width &&
            objBounds.left + objBounds.width > croppedArea.left &&
            objBounds.top < croppedArea.top + croppedArea.height &&
            objBounds.top + objBounds.height > croppedArea.top;
          obj.set({ visible: isIntersecting });
        });

        // Remove the crop rectangle
        canvas.remove(cropRectRef.current);
        cropRectRef.current = null;
        isCropping = false;

        canvas.renderAll();
      }
    });

    // Clean up Fabric.js canvas on unmount or as needed
    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default CanvasComponent;
