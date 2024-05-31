import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const TypographyTool = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, down: false });
  const [position, setPosition] = useState({ x: 0, y: window.innerHeight / 2 });
  const [textIndex, setTextIndex] = useState(0);
  const text = "Texto de prueba";
  const textColor = "#000000";
  const bgColor = "#ffffff";
  const minFontSize = 8;
  const maxFontSize = 300;
  const angleDistortion = 0.01;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: bgColor,
      width: window.innerWidth,
      height: window.innerHeight,
    });

     setFabricCanvas(canvas);

    const handleResize = () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      canvas.setBackgroundColor(bgColor);
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event) => {
      const pointer = canvas.getPointer(event.e);
      // console.log("Mouse move:", pointer); // Log mouse move coordinates
      setMouse((prevMouse) => ({
        ...prevMouse,
        x: pointer.x,
        y: pointer.y,
      }));
      if (mouse.down) {
        requestAnimationFrame(draw);
      }
    };

    const handleMouseDown = (event) => {
      const pointer = canvas.getPointer(event.e);
      // console.log("Mouse down:", pointer); // Log mouse down coordinates
      setMouse((prevMouse) => ({
        ...prevMouse,
        down: true,
      }));
      setPosition({ x: pointer.x, y: pointer.y });
      requestAnimationFrame(draw);
    };

    const handleMouseUp = () => {
      // console.log("Mouse up"); // Log mouse up event
      setMouse((prevMouse) => ({
        ...prevMouse,
        down: false,
      }));
    };

    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:up', handleMouseUp);
      canvas.dispose();
    };
  }, [mouse.down]);

  const distance = (pt, pt2) => {
    const xs = pt2.x - pt.x;
    const ys = pt2.y - pt.y;
    return Math.sqrt(xs * xs + ys * ys);
  };

  const textWidth = (string, size) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${size}px Georgia`;
    return ctx.measureText(string).width;
  };

  const draw = () => {
    if (mouse.down && fabricCanvas) {
      // console.log('Drawing...'); // Check if the draw function is being called
      const newDistance = distance(position, mouse);
      // console.log('New distance:', newDistance); // Log new distance value
      let fontSize = minFontSize + newDistance / 2;
      if (fontSize > maxFontSize) fontSize = maxFontSize;

      const letter = text[textIndex];
      const stepSize = textWidth(letter, fontSize);
      // console.log('Step size:', stepSize); // Log step size value

      if (newDistance > stepSize) {
        // // console.log('Condition met: newDistance > stepSize'); // Log when condition is met
        const angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);
        const textObject = new fabric.Text(letter, {
          left: position.x,
          top: position.y,
          fontSize: fontSize,
          fontFamily: 'Georgia',
          fill: textColor,
          angle: (angle * 180) / Math.PI + (Math.random() * angleDistortion * 2 - angleDistortion),
          originX: 'center',
          originY: 'center',
        });

         fabricCanvas.add(textObject);
        fabricCanvas.renderAll();

        setTextIndex((prevIndex) => (prevIndex + 1) % text.length);
        setPosition({
          x: position.x + Math.cos(angle) * stepSize,
          y: position.y + Math.sin(angle) * stepSize,
        });
      }
    }
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default TypographyTool;
