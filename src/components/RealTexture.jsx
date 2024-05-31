import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [fontSize, setFontSize] = useState(20); // Initial font size
    const [textColor, setTextColor] = useState('#000000'); // Initial text color
    const textToDraw = "Your paragraph to draw";
    const minFontSize = 8;
    const maxFontSize = 300;
    let textIndex = 0;
    let position = { x: 0, y: window.innerHeight / 2 };
    let lastPointerPosition = { x: 0, y: 0 };
    let canvas;

    useEffect(() => {
        canvas = new fabric.Canvas(canvasRef.current, {
            width: 500,
            height: 500,
            selection: false, // Disable object selection
        });

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);

        window.addEventListener('resize', handleResize);

        return () => {
            canvas.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isDrawingRef.current) {
            draw();
        }
    }, [textColor, fontSize]);

    const handleMouseDown = (options) => {
        isDrawingRef.current = true;
        const pointer = canvas.getPointer(options.e);
        position = { x: pointer.x, y: pointer.y };
        lastPointerPosition = { x: pointer.x, y: pointer.y };
        draw();
    };

    const handleMouseMove = (options) => {
        if (isDrawingRef.current) {
            const pointer = canvas.getPointer(options.e);
            lastPointerPosition = { x: pointer.x, y: pointer.y };
            draw();
        }
    };

    const handleMouseUp = () => {
        isDrawingRef.current = false;
    };

    const handleResize = () => {
        canvas.setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const draw = () => {
        if (isDrawingRef.current) {
            const newDistance = distance(position, lastPointerPosition);
            let currentFontSize = fontSize;

            if (currentFontSize > maxFontSize) {
                currentFontSize = maxFontSize;
            }

            const letter = textToDraw.charAt(textIndex);
            const stepSize = textWidth(letter, currentFontSize);

            if (newDistance > stepSize) {
                const angle = Math.atan2(lastPointerPosition.y - position.y, lastPointerPosition.x - position.x);
                const textObject = new fabric.Text(letter, {
                    left: position.x,
                    top: position.y,
                    fontFamily: 'Georgia',
                    fontSize: currentFontSize,
                    fill: textColor, // Set text color dynamically
                    selectable: false,
                });
                canvas.add(textObject);
                textIndex = (textIndex + 1) % textToDraw.length;
                position.x += Math.cos(angle) * stepSize;
                position.y += Math.sin(angle) * stepSize;
            }
        }
    };

    const distance = (pt1, pt2) => Math.sqrt((pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2);

    const textWidth = (string, size) => {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempContext.font = size + 'px Georgia';
        return tempContext.measureText(string).width;
    };

    const handleFontSizeChange = (event) => {
        setFontSize(parseInt(event.target.value));
    };

    const handleColorChange = (color) => {
        setTextColor(color);
    };

    const handleDownload = () => {
        // Export canvas as image
        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1 className="m-auto">You can draw the text with a texter tool</h1>
            <canvas ref={canvasRef}></canvas>
            <div>
                <label>Font Size: {fontSize}</label>
                <input type="range" min={minFontSize} max={maxFontSize} value={fontSize} onChange={handleFontSizeChange} />
            </div>
            <div>
                <label>Text Color:</label>
                <input type="color" value={textColor} onChange={(e) => handleColorChange(e.target.value)} />
            </div>
            <button onClick={handleDownload}>Download Drawing</button>
        </div>
    );
};

export default DrawingCanvas;
