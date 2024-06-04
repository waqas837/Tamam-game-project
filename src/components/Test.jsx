import React, { useState, useRef, useEffect } from 'react';
import fabric from 'fabric';

function Test() {
  const canvasRef = useRef(null);
  const [state, setState] = useState(null);
  const undo = useRef([]);
  const redo = useRef([]);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);
    canvas.setWidth(500);
    canvas.setHeight(500);

    // Save initial state
    saveState();

    // Register event listener for object modification
    canvas.on('object:modified', saveState);

    return () => canvas.dispose(); // Cleanup canvas on unmount
  }, []);

  const saveState = () => {
    redo.current = [];
    setState(JSON.stringify(canvasRef.current));
  };

  const drawCircle = () => {
    const circle = new fabric.Circle({
      fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      radius: Math.random() * 250,
      left: Math.random() * 250,
      top: Math.random() * 250,
    });
    canvasRef.current.add(circle);
    canvasRef.current.renderAll();
    saveState();
  };

  const undoAction = () => {
    if (undo.current.length) {
      redo.current.push(state);
      setState(undo.current.pop());
      canvasRef.current.clear();
      canvasRef.current.loadFromJSON(state, canvasRef.current.renderAll);
    }
  };

  const redoAction = () => {
    if (redo.current.length) {
      undo.current.push(state);
      setState(redo.current.pop());
      canvasRef.current.clear();
      canvasRef.current.loadFromJSON(state, canvasRef.current.renderAll);
    }
  };

  return (
    <div>
      <button onClick={drawCircle}>Draw Circle</button>
      <button disabled={!undo.current.length} onClick={undoAction}>
        Undo
      </button>
      <button disabled={!redo.current.length} onClick={redoAction}>
        Redo
      </button>
      <canvas ref={canvasRef} style={{ border: 'solid 1px black' }} />
    </div>
  );
}

export default Test;
