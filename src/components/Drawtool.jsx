import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { fabric } from "fabric";
import "fabric-history";
import delicon from "../assets/delicon.svg";
import edit from "../assets/edit.svg";
import reset from "../assets/reset.svg";
import backgroundTransparent from "../assets/trans.png";
import CropperTool from "./CropperTool";
import "./Drawtool.css";
import { useHotkeys } from "react-hotkeys-hook";

const Drawtool = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  // hot keys
  useHotkeys(
    "ctrl+z",
    () => {
      if (canvas) {
        canvas.undo();
      }
    },
    [canvas]
  );
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [brushColor, setBrushColor] = useState(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth - 256,
    height: window.innerHeight,
  });
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSizeCropModal, setShowSizeCropModal] = useState(false);
  const [customSize, setCustomSize] = useState({
    width: canvasSize.width,
    height: canvasSize.height,
  });
  // State variables for background fill
  const [fillColor, setFillColor] = useState("#ffffff");
  const [fillType, setFillType] = useState("solid"); // 'solid' or 'gradient'
  const [gradientStartColor, setGradientStartColor] = useState("#ffffff");
  const [gradientEndColor, setGradientEndColor] = useState("#000000");
  // New state variables for brush/pen tool
  const [textContent, setTextContent] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("");
  const [brushSize, setBrushSize] = useState(10);
  const [randomAngle, setRandomAngle] = useState(false);
  const isDeleting = useRef(false);
  // state variables for image filter
  const [isImage, setisImage] = useState(false);
  // state variables for layers
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentObjectimg, setcurrentObjectimg] = useState();
  const [deleteIconVisible, setDeleteIconVisible] = useState(false);
  const [currentObject, setcurrentObject] = useState({ x: 0, y: 0 });
  const [deleteIconPosition, setDeleteIconPosition] = useState({ x: 0, y: 0 });
  const [currentObjectimgt, setcurrentObjectimgt] = useState();
  const selectRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [fontSize, setFontSize] = useState(20); // Initial font size
  const [textColor, setTextColor] = useState("#000000"); // Initial text color
  const [borderCanvas, setborderCanvas] = useState(false); // Initial text color
  const [backgroundColor, setbackgroundColor] = useState(false);
  const [activeBlock, setactiveBlock] = useState({
    zoom: false,
    crop: false,
    shapes: false,
    brush: false,
    fill: false,
  });

  const toggleDropdown = () => setIsOpen(!isOpen);
  const textToDraw = textContent;
  const minFontSize = 8;
  const maxFontSize = 300;
  let textIndex = 0;
  let position = { x: 0, y: window.innerHeight / 2 };
  let lastPointerPosition = { x: 0, y: 0 };
  const [currentCropImg, setcurrentCropImg] = useState();
  const getCanvasSizeCB = (width, height) => {
    let customSize = { width, height };
    resizeCanvas(customSize);
  };
  //  set border active to the canvas
  useEffect(() => {
    if (canvas) {
      if (selectedTool === "select") {
        canvas.on("mouse:up", (options) => {
          if (backgroundColor) {
            setborderCanvas(true);
          } else {
            setborderCanvas(false);
          }
        });
      }
    }
  }, [selectedTool, backgroundColor, borderCanvas]);

  const handleDownload = (format) => {
    // Save current background
    const currentBackground = canvas.backgroundImage;
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
    exportCanvas(format);
    setIsOpen(false); // Close dropdown after selection
    // Restore background after download
    canvas.setBackgroundImage(currentBackground, canvas.renderAll.bind(canvas));
  };
  // Function to export canvas data to an image blob
  const exportCanvas = (format) => {
    // Logic for high-resolution export
    let highResolution = true;
    let lowResolution = false;
    if (highResolution) {
      const exportWidth = canvas.width * 2; // Example: doubling the width for higher resolution
      const exportHeight = canvas.height * 2; // Example: doubling the height for higher resolution

      // Temporarily set canvas dimensions for high-resolution export
      canvas.setDimensions({ width: exportWidth, height: exportHeight });
    }

    if (lowResolution) {
      const exportWidth = canvas.width / 2; // Example: doubling the width for higher resolution
      const exportHeight = canvas.height / 2; // Example: doubling the height for higher resolution

      // Temporarily set canvas dimensions for high-resolution export
      canvas.setDimensions({ width: exportWidth, height: exportHeight });
    }
    // Choose format based on user selection or default
    format = format || "png";

    if (format === "pdf" || format === "svg") {
      // Handle PDF and SVG exports using Fabric.js methods
      // Example:
      const data = canvas.toSVG(); // For SVG export
      // const data = canvas.toDataURL('pdf'); // For PDF export (requires plugin or server-side processing)
      // Implement server-side logic for PDF generation if needed
      // Send data to server for PDF generation and download
    } else {
      // For image formats (jpg, png)
      const dataURL = canvas.toDataURL({ format: "image/" + format });
      downloadURI(dataURL, `drawing.${format}`);
    }
  };

  // Helper function to trigger download
  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const initCanvas = () => {
      const canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
      });
      canvas.setWidth(2000); // Set canvas width larger than the container for scrolling
      canvas.setHeight(2000); // Set canvas height larger than the container for scrolling
      fabric.Object.prototype.transparentCorners = false; // Ensure corner colors are visible
      fabric.Object.prototype.cornerColor = "#3f51b5"; // Change corner color
      fabric.Object.prototype.cornerSize = 20;
      fabric.Image.fromURL(backgroundTransparent, function (img) {
        // add background image
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width, // times to fit the canvas by scale formula
          scaleY: canvas.height / img.height,
        });
      });

      // delete icon
      const img = document.createElement("img");
      img.src = delicon;
      // reset icon
      const resetImg = document.createElement("img");
      resetImg.src = reset;
      // edit icon
      const editImg = document.createElement("img");
      editImg.src = edit;

      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "blue";
      fabric.Object.prototype.cornerStyle = "circle";
      // 1.Delete control for Fabric objects
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.55,
        y: -0.6,
        offsetY: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIconDelete,
        cornerSize: 30,
      });

      // Delete object function
      function deleteObject(eventData, transform) {
        if (canvas) {
          isDeleting.current = true;
          const target = transform.target;
          const canvas = target.canvas;
          canvas.remove(target);
          canvas.requestRenderAll();
          setTimeout(() => {
            isDeleting.current = false;
          }, 200); // small delay to ensure state is managed
        }
      }

      // Render delete icon function
      function renderIconDelete(ctx, left, top, styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      //   ...........ends delete............

      // 2. Reset control
      // fabric.Object.prototype.controls.resetControl = new fabric.Control({
      //   x: 0.55,
      //   y: 0.48,
      //   offsetY: 16,
      //   cursorStyle: 'pointer',
      //   mouseUpHandler: resetObject,
      //   render: renderIconReset,
      //   cornerSize: 30,
      // });
      // function resetObject(eventData, transform) {
      //   const target = transform.target;
      //   target.set({ scaleX: 1, scaleY: 1, angle: 0 });
      //   target.setCoords();
      //   target.canvas.requestRenderAll();
      //     // not working right now but possible
      //     isImage.filters = [];
      //     isImage.applyFilters(); // Apply no filters
      //     canvas.renderAll(); // Render canvas

      // }
      // function renderIconReset(ctx, left, top, styleOverride, fabricObject) {
      //   const size = this.cornerSize;
      //   ctx.save();
      //   ctx.translate(left, top);
      //   ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      //   ctx.drawImage(resetImg, -size / 2, -size / 2, size, size);
      //   ctx.restore();
      // };

      // 3.edit...
      // fabric.Object.prototype.controls.editControl = new fabric.Control({
      //   x: 0.56,
      //   y: 0.4,
      //   offsetY: 16,
      //   cursorStyle: "pointer",
      //   mouseUpHandler: editObject,
      //   render: renderIconEdit,
      //   cornerSize: 30,
      // });

      // function editObject(eventData, transform) {
      //   const target = transform.target;
      //   alert("You can edit and continue its design");
      // }

      // Render Edit icon function
      function renderIconEdit(ctx, left, top, styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(editImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      //////////edit ends////////////
      canvas.on("text:changed", () => {
        updateHistory();
      });
      canvas.on("selection:created", (e) => {
        let obj = canvas.getActiveObject();
        setcurrentObject(obj);
        setSelectedObject(e.target);
      });

      canvas.on("selection:updated", (e) => {
        let obj = canvas.getActiveObject();
        setcurrentObject(obj);
        if (obj && obj.type === "image") {
          setisImage(obj);
          setcurrentObjectimg(obj);
        }
        setSelectedObject(e.target);
      });

      canvas.on("selection:cleared", () => {
        setcurrentObject(null);
        setSelectedObject(null);
      });
      // texter tool
      return canvas;
    };
    const canvasElement = initCanvas();
    setCanvas(canvasElement);
    const updateHistory = () => {
      const canvasState = JSON.stringify(canvasElement.toJSON());
      setHistory((prevHistory) => [...prevHistory, canvasState]);
    };

    canvasElement.on("object:added", updateHistory);
    canvasElement.on("object:modified", updateHistory);
    canvasElement.on("object:removed", updateHistory);
    canvasElement.on("mouse:move", handleMouseMove);
    // Cleanup on unmount
    return () => {
      canvasElement.off("object:added", updateHistory);
      canvasElement.off("object:modified", updateHistory);
      canvasElement.off("object:removed", updateHistory);
      canvasElement.dispose(); // very important
    };
  }, []);

  // texter tool
  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleMouseDown = (options) => {
    isDrawingRef.current = true;
    const pointer = canvas.getPointer(options.e);
    position = { x: pointer.x, y: pointer.y };
    lastPointerPosition = { x: pointer.x, y: pointer.y };
    // draw();
  };

  const handleMouseMovet = throttle((options) => {
    if (isDrawingRef.current) {
      const pointer = canvas.getPointer(options.e);
      lastPointerPosition = { x: pointer.x, y: pointer.y };
      draw();
    }
  }, 10); // Throttling

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  const draw = () => {
    if (canvas) {
      const newDistance = distance(position, lastPointerPosition);
      let currentFontSize = fontSize;

      if (currentFontSize > maxFontSize) {
        currentFontSize = maxFontSize;
      }

      const letter = textContent.charAt(textIndex);
      const stepSize = textWidth(letter, currentFontSize);

      if (newDistance > stepSize) {
        const angle = Math.atan2(
          lastPointerPosition.y - position.y,
          lastPointerPosition.x - position.x
        );
        const textObject = new fabric.Text(letter, {
          left: position.x,
          top: position.y,
          fontFamily: fontFamily,
          fontSize: brushSize,
          fill: brushColor, // Set text color dynamically
          selectable: false,
          fontWeight: fontWeight,
          styles: { textDecoration: textDecoration },
          fontStyle: fontStyle,
          randomAngle: randomAngle,
        });
        canvas.add(textObject);
        textIndex = (textIndex + 1) % textToDraw.length;
        position.x += Math.cos(angle) * stepSize;
        position.y += Math.sin(angle) * stepSize;
      }
    }
  };

  const distance = (pt1, pt2) =>
    Math.sqrt((pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2);

  const textWidth = (string, size) => {
    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");
    tempContext.font = size + "px Georgia";
    return tempContext.measureText(string).width;
  };

  // These two below are not working...
  const handleFontSizeChange = (event) => {
    setFontSize(parseInt(event.target.value));
  };

  const handleColorChange = (color) => {
    setTextColor(color);
  };

  const changefillcolor = (e) => {
    setFillType(e.target.value);
  };

  // const handleDownloadForTexter = () => {
  //   // Export canvas as image
  //   const dataUrl = canvas.toDataURL({
  //     format: 'png',
  //     quality: 1,
  //   });

  //   // Create download link
  //   const link = document.createElement('a');
  //   link.download = 'drawing.png';
  //   link.href = dataUrl;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  // Logic if we draw on the image...
  // useEffect(() => {
  //   if (canvas) {
  //     // Set up the brush tool
  //     const brush = new fabric.PencilBrush(canvas);
  //     brush.width = 5;
  //     brush.color = 'black';
  //     canvas.freeDrawingBrush = brush;

  //     canvas.isDrawingMode = true;

  //     const imgElement = document.createElement('img');
  //     imgElement.src = imgg;

  //     imgElement.onload = () => {
  //       const imgInstance = new fabric.Image(imgElement, {
  //         left: 50,
  //         top: 50,
  //       });

  //       canvas.add(imgInstance);
  //       // This single line causes to show the controlls
  //       canvas.setActiveObject(imgInstance);

  //       setcurrentObjectimgt(imgInstance)
  //       const isWithinImage = (x, y, img) => {
  //         return (
  //           x >= img.left &&
  //           x <= img.left + img.width * img.scaleX &&
  //           y >= img.top &&
  //           y <= img.top + img.height * img.scaleY
  //         );
  //       };

  //       canvas.on('mouse:down', (opt) => {
  //         const { x, y } = canvas.getPointer(opt.e);
  //         if (!isWithinImage(x, y, imgInstance)) {
  //           canvas.isDrawingMode = false;
  //         } else {
  //           canvas.isDrawingMode = true;
  //         }
  //       });

  //       canvas.on('mouse:move', (opt) => {
  //         const { x, y } = canvas.getPointer(opt.e);
  //         if (!isWithinImage(x, y, imgInstance)) {
  //           canvas.isDrawingMode = false;
  //         } else {
  //           canvas.isDrawingMode = true;
  //         }
  //       });
  //       canvas.on('mouse:up', (opt) => {
  //         console.log("mouse is up")
  //         canvas.isDrawingMode = false
  //       })

  //     };
  //   }
  // }, [canvas])

  useEffect(() => {
    // Update canvas size when canvasSize state changes
    if (canvas) {
      canvas.setWidth(canvasSize.width);
      canvas.setHeight(canvasSize.height);
      canvas.renderAll();
      setWidth(canvasSize.width);
      setHeight(canvasSize.height);
    }
  }, [canvasSize, canvas]);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.selectedIndex = 0;
    }
  }, [isImage, currentObjectimg]);

  const resizeCanvas = (newSize) => {
    if (canvas) {
      setCanvasSize(newSize);
      // Check if the canvas already has a fill color
      const currentFill = canvas.backgroundColor;
      if (currentFill) {
        // Apply the fill color
        canvas.setBackgroundColor(currentFill, canvas.renderAll.bind(canvas));
      } else {
        // Add background image if no fill color is present
        fabric.Image.fromURL(backgroundTransparent, function (img) {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
        });
      }
    }
  };

  function handleDrawShapes(shape) {
    switch (shape) {
      case "Rectangle":
        drawRect();
        break;
      case "Circle":
        drawCircle();
        break;
      case "Polygon":
        break;

      default:
        break;
    }
  }
  // drawing shapes
  // 1. rectangle
  const drawRect = () => {
    let isDrawing = false;
    let startPosition = { x: 0, y: 0 };
    let rect = null;
    if (canvas) {
      canvas.on("mouse:down", (options) => {
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);
        startPosition = { x: pointer.x, y: pointer.y };
        rect = new fabric.Rect({
          left: startPosition.x,
          top: startPosition.y,
          width: 0,
          height: 0,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
        });
        canvas.add(rect);
      });

      canvas.on("mouse:move", (options) => {
        if (!isDrawing) return;
        const pointer = canvas.getPointer(options.e);
        rect.set({
          width: pointer.x - startPosition.x,
          height: pointer.y - startPosition.y,
        });
        canvas.renderAll();
      });

      canvas.on("mouse:up", () => {
        isDrawing = false;
        rect.setCoords();
      });
    }
  };
  // 2. circle
  const drawCircle = () => {
    if (canvas) {
      let isDrawing = false;
      let circle = null;
      let startPosition = { x: 0, y: 0 };

      canvas.on("mouse:down", (options) => {
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);
        startPosition = { x: pointer.x, y: pointer.y };

        // Check if there's already a circle being drawn
        if (!circle) {
          circle = new fabric.Circle({
            left: startPosition.x,
            top: startPosition.y,
            radius: 0,
            fill: "transparent",
            stroke: "black",
            strokeWidth: 2,
          });
          canvas.add(circle);
        }
      });

      canvas.on("mouse:move", (options) => {
        if (!isDrawing) return;
        const pointer = canvas.getPointer(options.e);
        const radius = Math.abs(pointer.x - startPosition.x);
        circle.set({ radius });
        canvas.renderAll();
      });

      canvas.on("mouse:up", () => {
        isDrawing = false;
        circle = null; // Reset circle for next draw
      });
    }
  };
  // Function to handle mouse move event and update delete icon position
  const handleMouseMove = (e) => {
    if (canvas && currentObject) {
      setDeleteIconPosition({ x: currentObject.left, y: currentObject.top });
    }
  };
  // handleTexture
  const handleBrushMain = (canvas) => {
    setactiveBlock({ brush: !activeBlock.brush });
  };

  // cropCanvasSize; This function may needed more
  const cropCanvasSize = () => {
    return;
    // canvas.isDrawingMode = false;
    // setShowSizeCropModal(true);
    // let isDrawing = false;
    // let rect = null;
    // if (canvas) {
    //   canvas.off('mouse:down');
    //   canvas.off('mouse:move');
    //   canvas.off('mouse:up');

    //   canvas.on('mouse:down', (options) => {
    //     if (!rect) {
    //       isDrawing = true;
    //       const pointer = canvas.getPointer(options.e);
    //       rect = new fabric.Rect({
    //         left: pointer.x,
    //         top: pointer.y,
    //         width: 0,
    //         height: 0,
    //         fill: 'transparent',
    //         stroke: 'black',
    //         strokeWidth: 2,
    //         selectable: false,
    //       });
    //       canvas.add(rect);
    //     }
    //   });

    //   canvas.on('mouse:move', (options) => {
    //     if (!isDrawing) return;
    //     if (rect) {
    //       const pointer = canvas.getPointer(options.e);
    //       rect.set({
    //         width: pointer.x - rect.left,
    //         height: pointer.y - rect.top
    //       });
    //       canvas.renderAll();
    //     }
    //   });

    //   canvas.on('mouse:up', () => {
    //     if (rect) {
    //       const zoom = canvas.getZoom();
    //       const left = rect.left / zoom;
    //       const top = rect.top / zoom;
    //       const width = rect.width / zoom;
    //       const height = rect.height / zoom;

    //       if (width <= 0 || height <= 0) {
    //         console.error('Invalid rectangle dimensions for cropping.');
    //         canvas.remove(rect);
    //         rect = null;
    //         isDrawing = false;
    //         return;
    //       }

    //       const croppedDataURL = canvas.toDataURL({
    //         left: left,
    //         top: top,
    //         width: width,
    //         height: height,
    //       });

    //       fabric.Image.fromURL(backgroundTransparent, (croppedImage) => {
    //         if (!croppedImage) {
    //           console.error('Cropped image could not be loaded.');
    //           return;
    //         }
    //         canvas.setWidth(width);
    //         canvas.setHeight(height);
    //         croppedImage.set({
    //           left: 0,
    //           top: 0,
    //           scaleX: 1,
    //           scaleY: 1,
    //           selectable: false,
    //         });
    //         canvas.clear();
    //         setcurrentCropImg(croppedImage)
    //         canvas.setBackgroundImage(croppedImage, canvas.renderAll.bind(canvas), {
    //           scaleX: canvas.width / croppedImage.width,
    //           scaleY: canvas.height / croppedImage.height
    //         });
    //         // canvas.add(croppedImage);
    //         canvas.setZoom(1); // Reset zoom to 1
    //         canvas.renderAll();
    //         canvas.calcOffset(); // Recalculate the canvas offset
    //         console.log('Cropped image added and canvas updated.');
    //         canvas.off("mouse:move")
    //         canvas.off("mouse:down")
    //       });

    //       rect = null; // Reset the rect variable
    //       isDrawing = false; // Reset the drawing flag
    //     }
    //   });
    // }
  };

  // removeBackgroundColor
  const removeBackgroundColor = () => {
    if (canvas) {
      fabric.Image.fromURL(backgroundTransparent, function (img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      });
      setborderCanvas(false);
      setbackgroundColor(false);
    }
  };

  const handleSelectTool = (tool) => {
    setSelectedTool(tool); // please integrate one of that tool.
    switch (tool) {
      case "select":
        canvas.isDrawingMode = false;
        break;
      case "brush":
        // canvas.isDrawingMode = true;
        // canvas.freeDrawingBrush.color = brushColor;
        // canvas.freeDrawingBrush.width = brushSize;
        handleBrushMain(canvas);
        break;
      // we will add a pencil or other shapes we can draw
      case "zoom":
        setactiveBlock({ zoom: !activeBlock.zoom });
        canvas.isDrawingMode = false;
        break;
      case "crop":
        cropCanvasSize();
        setactiveBlock({ crop: !activeBlock.crop });
        break;
      case "fill":
        setactiveBlock({ fill: !activeBlock.fill });
        break;
      case "shapes":
        setactiveBlock({ shapes: !activeBlock.shapes });
        break;
      case "image":
        canvas.isDrawingMode = false;
        handleAddImage();
        break;
      case "layers":
        canvas.isDrawingMode = false;
        addLayer();
        // Implement layers functionality
        break;
      case "undo":
        handleUndo();
        break;
      default:
        canvas.isDrawingMode = false;
    }
  };

  const handleBrushColorChange = (e) => {
    setBrushColor(e.target.value);
    isDrawingRef.current = false; // Reset drawing state
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(e.target.value);
  };

  const handleAddImage = () => {
    if (isImage) return;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target.result;
        fabric.Image.fromURL(data, (img) => {
          img.scaleToWidth(canvasSize.width / 2);
          img.scaleToHeight(canvasSize.height / 2);
          canvas.add(img);
          canvas.renderAll();
          setisImage(img);
        });
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  // Apply image filters
  const applyImageEffects = (selectedFilter) => {
    switch (selectedFilter) {
      case "reset":
        isImage.filters = [];
        isImage.applyFilters(); // Apply no filters
        canvas.renderAll(); // Render canvas
        return; // Exit function early for reset
      case "grayscale":
        isImage.filters.push(new fabric.Image.filters.Grayscale());
        isImage.applyFilters();
        break;
      case "sepia":
        isImage.filters.push(new fabric.Image.filters.Sepia());
        isImage.applyFilters();
        break;
      case "invert":
        isImage.filters.push(new fabric.Image.filters.Invert());
        isImage.applyFilters();
        break;
      case "brightness":
        isImage.filters.push(
          new fabric.Image.filters.Brightness({ brightness: 0.5 })
        );
        isImage.applyFilters();
        break;
      case "contrast":
        isImage.filters.push(
          new fabric.Image.filters.Contrast({ contrast: 0.5 })
        );
        isImage.applyFilters();
        break;
      case "blur":
        isImage.filters.push(new fabric.Image.filters.Blur({ blur: 0.5 }));
        isImage.applyFilters();
        break;
      // Add more filters as needed
      default:
        break;
    }
    isImage.applyFilters();
    canvas.renderAll();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoHistory((prevRedoHistory) => [
        JSON.stringify(canvas.toJSON()),
        ...prevRedoHistory,
      ]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
      });
    }
  };

  // const handleRedo = () => {
  //   if (redoHistory.length > 0) {
  //     const nextState = redoHistory[0];
  //     setHistory(prevHistory => [...prevHistory, JSON.stringify(canvas.toJSON())]);
  //     setRedoHistory(prevRedoHistory => prevRedoHistory.slice(1));
  //     canvas.loadFromJSON(nextState, () => {
  //       canvas.renderAll();
  //     });
  //   }
  // };

  const handleDeleteObject = () => {
    if (selectedObject) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      setSelectedObject(null);
      canvas.renderAll();
    }
  };

  const handleRotateObject = () => {
    if (selectedObject) {
      selectedObject.rotate((selectedObject.angle + 45) % 360);
      canvas.renderAll();
    }
  };

  const handleZoom = (zoomIn) => {
    const newZoomLevel = zoomIn ? zoomLevel * 1.1 : zoomLevel / 1.1;
    canvas.setZoom(newZoomLevel);
    setZoomLevel(newZoomLevel);
  };

  const handleSizeCropSubmit = () => {
    resizeCanvas(customSize);
    setShowSizeCropModal(false);
  };

  const handleDefaultSize = () => {
    resizeCanvas({
      width: window.innerWidth - 256,
      height: window.innerHeight,
    });
    setShowSizeCropModal(false);
  };
  useEffect(() => {
    if (canvas && activeBlock.brush) {
      // useeffect can capture state correctly if it was else update any where
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMovet);
      canvas.on("mouse:up", handleMouseUp);
    }
    // Cleanup function: Detach event listeners when component unmounts
    return () => {
      // it will be called if dep updates
      if (canvas && brushColor) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && brushSize) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && textContent) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && fontFamily) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && letterSpacing) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && fontWeight) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && textDecoration) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && fontStyle) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      } else if (canvas && randomAngle) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMovet);
        canvas.off("mouse:up", handleMouseUp);
      }
    };
  }, [
    canvas,
    brushColor,
    brushSize,
    textContent,
    fontFamily,
    letterSpacing,
    fontWeight,
    textDecoration,
    fontStyle,
    randomAngle,
  ]); // pass deps array it will cause the unmount when state changes,

  const handleAddText = () => {
    if (brushColor) {
      setactiveBlock({ brush: !activeBlock.brush });
    } else if (!brushColor) {
      toast.error("Please add one color to draw.");
    } else if (textContent === "") {
      toast.error(" Please add some text.");
    }
  };

  const handleBackgroundFill = () => {
    if (fillType === "solid") {
      canvas.setBackgroundImage(null); // Remove background image
      canvas.setBackgroundColor(fillColor, canvas.renderAll.bind(canvas));
      setbackgroundColor(true);
      // set the whole canvas background
    } else if (fillType === "gradient") {
      canvas.setBackgroundImage(null); // Remove background image
      setbackgroundColor(true);
      // Define the gradient object
      let gradient = new fabric.Gradient({
        type: "linear",
        coords: {
          x1: canvas.width / 2,
          y1: canvas.height / 2,
          // x2: canvas.width / 2, // these types will be for the radial
          // y2: canvas.height / 2,
          // r1: 10, // inner circle radius
          // r2: canvas.width / 2, // outer circle radius
        },
        colorStops: [
          { offset: 0, color: gradientStartColor },
          { offset: 0.2, color: gradientEndColor },
        ],
      });
      canvas.set("backgroundColor", gradient);
      canvas.renderAll();
    }
  };

  // layer management functions
  const addLayer = () => {
    const newLayer = new fabric.Rect({
      width: 500,
      height: 500,
      fill: "rgba(0, 0, 0, 0)",
      selectable: true,
      left: canvasSize.width / 2 - 50, // Center horizontally
      top: canvasSize.height / 2 - 50, // Center vertically
    });
    canvas.add(newLayer); // first add a new layer to canvas
    canvas.setActiveObject(newLayer); // then active the controls selection
    setLayers([...layers, newLayer]);
    // setSelectedLayer(newLayer); // Select the newly added layer
  };

  const deleteLayer = () => {
    if (selectedLayer) {
      canvas.remove(selectedLayer);
      setLayers(layers.filter((layer) => layer !== selectedLayer));
      setSelectedLayer(null);
      canvas.renderAll();
    }
  };

  const moveLayerUp = () => {
    if (selectedLayer) {
      const index = layers.indexOf(selectedLayer);
      if (index !== -1 && index < layers.length - 1) {
        canvas.moveTo(selectedLayer, index + 1);
        setLayers([
          ...layers.slice(0, index),
          layers[index + 1],
          layers[index],
          ...layers.slice(index + 2),
        ]);
        setSelectedLayer(layers[index + 1]);
      }
    }
  };

  const moveLayerDown = () => {
    if (selectedLayer) {
      const index = layers.indexOf(selectedLayer);
      if (index > 0) {
        canvas.moveTo(selectedLayer, index - 1);
        setLayers([
          ...layers.slice(0, index - 1),
          layers[index],
          layers[index - 1],
          ...layers.slice(index + 1),
        ]);
        setSelectedLayer(layers[index - 1]);
      }
    }
  };

  const toggleLayerVisibility = () => {
    if (selectedLayer) {
      selectedLayer.visible = !selectedLayer.visible;
      canvas.renderAll();
    }
  };

  const toggleLayerLock = () => {
    if (selectedLayer) {
      selectedLayer.lockMovementX = !selectedLayer.lockMovementX;
      selectedLayer.lockMovementY = !selectedLayer.lockMovementY;
      selectedLayer.lockScalingX = !selectedLayer.lockScalingX;
      selectedLayer.lockScalingY = !selectedLayer.lockScalingY;
      selectedLayer.lockRotation = !selectedLayer.lockRotation;
      canvas.renderAll();
    }
  };

  // saved drawing functions
  const handleExportAsImage = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
  };

  // handleSaveDrawing
  const handleSaveDrawing = () => {
    const json = JSON.stringify(canvas.toJSON());
    localStorage.setItem("savedDrawing", json);
    alert("Drawing saved!");
  };
  // handleLoadDrawing
  const handleLoadDrawing = () => {
    const json = localStorage.getItem("savedDrawing");
    if (json) {
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
      alert("Drawing loaded!");
    } else {
      alert("No saved drawing found!");
    }
  };
  // icons list
  let cursorIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
      />
    </svg>
  );
  let zoom = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
  let crop = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
      />
    </svg>
  );

  let brush = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
      />
    </svg>
  );
  let fill = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
      />
    </svg>
  );
  let image = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );

  let layer = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );

  let undo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3"
      />
    </svg>
  );

  let tools = [
    { name: "select", icon: cursorIcon },
    { name: "zoom", icon: zoom },
    { name: "crop", icon: crop },
    // , { name: 'shapes', icon: shapes }
    { name: "brush", icon: brush },
    // { name: "pencil", icon: cursorIcon },
    { name: "fill", icon: fill },
    { name: "image", icon: image },
    { name: "layers", icon: layer },
    { name: "undo", icon: undo },
  ];
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex relative">
        <div>
          <div>
            {/* save drawing */}
            <button
              onClick={handleSaveDrawing}
              className="fixed top-0 z-20 right-10 rounded-l-md p-2 bg-gray-800 text-white hover:bg-yellow-300 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                />
              </svg>
            </button>
            {/* download drawings */}
            <button
              type="button"
              onClick={toggleDropdown}
              className="fixed top-0 right-0 z-20 inline-flex justify-center px-2 py-2 text-sm font-medium text-white bg-gray-800 shadow-md hover:bg-yellow-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>

              {isOpen && (
                <div className="relative inline-block text-left my-3">
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => handleDownload("jpg")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        JPG
                      </button>
                      <button
                        onClick={() => handleDownload("png")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDownload("svg")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        SVG
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* <button onClick={handleLoadDrawing} className="absolute top-[55%] left-0  w-full p-2 bg-yellow-500 hover:bg-yellow-400 rounded">
      Load Drawing
    </button>
    <button onClick={handleExportAsImage} className="absolute top-[60%] left-0  w-full p-2 bg-blue-500 hover:bg-blue-400 rounded">
      Export as PNG
    </button> */}

          <div className="h-screen bg-gray-900 w-[97px] mt-3 ml-2 rounded-lg shadow-lg m-auto text-white">
            {tools.map((tool, index) => (
              <div key={index} className="py-1 relative">
                <button
                  key={tool.name}
                  className={`w-24 p-2 bg-transparent focus:bg-yellow-300 rounded-lg hover:bg-yellow-300 hover:text-black ${
                    selectedTool === tool.name
                      ? "bg-yellow-300 text-black rounded-lg"
                      : "bg-gray-600 rounded-lg"
                  }`}
                  onClick={() => handleSelectTool(tool.name)}
                >
                  <span className="flex items-center space-x-1">
                    <span>{tool.icon}</span>{" "}
                    <span>
                      {tool.name.charAt(0).toUpperCase() + tool.name.slice(1)}
                    </span>
                  </span>
                </button>
                {tool.name === selectedTool &&
                  selectedTool === "zoom" &&
                  activeBlock.zoom && (
                    <div className="fixed left-24 top-9 p-2 flex flex-col z-50">
                      <button
                        className="w-24 p-2 bg-gray-700 hover:bg-yellow-600 rounded"
                        onClick={() => handleZoom(true)}
                      >
                        Zoom In
                      </button>
                      <button
                        className="w-24 p-2 bg-gray-700 hover:bg-yellow-600 rounded"
                        onClick={() => handleZoom(false)}
                      >
                        Zoom Out
                      </button>
                    </div>
                  )}
                {/* 2.shape tools */}
                {selectedTool === "shapes" && activeBlock.shapes && (
                  <div className="fixed left-[97px] top-[100px] p-2 flex flex-col z-50">
                    {["Rectangle", "Circle", "Polygon"].map((tool, index) => (
                      <button
                        key={index}
                        className={`w-full p-2 bg-gray-700 hover:bg-yellow-600 rounded ${
                          selectedTool === tool
                            ? "bg-yellow-500"
                            : "bg-gray-600"
                        }`}
                        onClick={() => handleDrawShapes(tool)}
                      >
                        {tool.charAt(0).toUpperCase() + tool.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
                {/* brush tool */}
                {selectedTool === "brush" && activeBlock.brush && (
                  <div className="fixed left-[97px] top-0 p-2 flex flex-col z-50">
                    <div className="grid grid-cols-2 gap-1 p-2 text-white bg-gray-600 border rounded-md border-yellow-200">
                      <label className="block mb-2">Brush Color:</label>
                      <input
                        className="text-black"
                        type="color"
                        value={brushColor}
                        onChange={handleBrushColorChange}
                      />
                      <label className="block mb-2">Brush Size:</label>
                      <input
                        className="text-black"
                        type="number"
                        value={brushSize}
                        onChange={handleBrushSizeChange}
                        min="1"
                        max="100"
                      />
                      <label className="block mb-2">Text Content:</label>
                      <input
                        type="text"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="border p-2 w-full text-black"
                      />
                      <label className="block mb-2">Font Family:</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="border p-2 w-full text-black"
                      >
                        {/* Add Google Fonts here */}
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        {/* Add more fonts as needed */}
                      </select>
                      <label className="block mb-2">Letter Spacing:</label>
                      <input
                        type="number"
                        value={letterSpacing}
                        onChange={(e) => setLetterSpacing(e.target.value)}
                        className="border p-2 w-full text-black"
                      />
                      <label className="block mb-2">Word Spacing:</label>
                      <input
                        type="number"
                        value={wordSpacing}
                        onChange={(e) => setWordSpacing(e.target.value)}
                        className="border p-2 w-full text-black"
                      />
                      <label className="block mb-2">Font Weight:</label>
                      <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                        className="border p-2 w-full text-black"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                      <label className="block mb-2">Font Style:</label>
                      <select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="border p-2 w-full text-black"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                      <label className="block mb-2">Text Decoration:</label>
                      <select
                        value={textDecoration}
                        onChange={(e) => setTextDecoration(e.target.value)}
                        className="border p-2 w-full text-black"
                      >
                        <option value="">None</option>
                        <option value="underline">Underline</option>
                        <option value="line-through">Strikethrough</option>
                      </select>
                      <label className="block mb-2">Random Angle:</label>
                      <input
                        className="text-black"
                        type="checkbox"
                        checked={randomAngle}
                        onChange={(e) => setRandomAngle(e.target.checked)}
                      />
                      <button
                        onClick={handleAddText}
                        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded"
                      >
                        Start Drawing
                      </button>
                    </div>
                  </div>
                )}

                {/* fill */}
                {selectedTool === "fill" && activeBlock.fill && (
                  <div className="fixed left-[97px] top-52 p-2 flex flex-col z-50">
                    <div className="p-4 mb-2 bg-gray-700 rounded border border-yellow-300">
                      <label className="block mb-2">Fill Type</label>
                      <select
                        value={fillType}
                        onChange={(e) => changefillcolor(e)}
                        className="w-full mb-2 text-black"
                      >
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                      </select>
                      {fillType === "solid" && (
                        <div>
                          <label className="block mb-2">Fill Color</label>
                          <input
                            type="color"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                            className="w-full mb-2"
                          />
                        </div>
                      )}
                      {fillType === "gradient" && (
                        <div>
                          <label className="block mb-2">
                            Gradient Start Color
                          </label>
                          <input
                            type="color"
                            value={gradientStartColor}
                            onChange={(e) =>
                              setGradientStartColor(e.target.value)
                            }
                            className="w-full mb-2"
                          />
                          <label className="block mb-2">
                            Gradient End Color
                          </label>
                          <input
                            type="color"
                            value={gradientEndColor}
                            onChange={(e) =>
                              setGradientEndColor(e.target.value)
                            }
                            className="w-full mb-2"
                          />
                        </div>
                      )}
                      <button
                        onTouchStart={handleBackgroundFill}
                        onClick={handleBackgroundFill}
                        className="w-full p-2 bg-yellow-600 hover:bg-yellow-500 rounded"
                      >
                        Apply Background Fill
                      </button>
                    </div>
                  </div>
                )}
                {/* Image tool */}
                {tool.name === selectedTool && (
                  <div className="fixed left-[97px] top-64 p-2 z-50">
                    {selectedTool === "image" && isImage && (
                      <>
                        <form className="max-w-sm mx-auto">
                          <select
                            ref={selectRef}
                            onChange={(e) => {
                              applyImageEffects(e.target.value);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option selected>Choose a Filter</option>
                            <option value="reset">Reset</option>
                            <option value="grayscale">Grayscale</option>
                            <option value="sepia">Sepia</option>
                            <option value="brightness">Brightness</option>
                            <option value="contrast">Contrast</option>
                            <option value="blur">Blur</option>
                          </select>
                        </form>
                      </>
                    )}
                  </div>
                )}
                {/* layers */}
                {tool.name === selectedTool && (
                  <div className="fixed left-[110px] top-[270px] z-50">
                    <div className="flex-1 overflow-y-auto p-2 broder border-yellow-300 rounded-md">
                      {/* <div className="mb-4">
                  <button className="w-full p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded" onClick={addLayer}>
                    Add Layer
                  </button>
                </div> */}
                      {layers.map((layer) => (
                        <div
                          key={layer.id}
                          className={`p-2 rounded ${
                            selectedLayer === layer
                              ? "bg-yellow-600"
                              : "bg-yellow-700 hover:bg-yellow-600"
                          }`}
                        >
                          <button
                            className="text-left w-full"
                            onClick={() => setSelectedLayer(layer)}
                          >
                            Layer {layers.indexOf(layer) + 1}
                          </button>
                        </div>
                      ))}
                      {/* Layer actions */}
                      {selectedLayer && (
                        <div className="p-4">
                          <button
                            className="p-2 mb-2 bg-red-500 hover:bg-red-400 rounded"
                            onClick={deleteLayer}
                          >
                            Delete Layer
                          </button>
                          <button
                            className="p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
                            onClick={moveLayerUp}
                          >
                            Move Layer Up
                          </button>
                          <button
                            className="p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
                            onClick={moveLayerDown}
                          >
                            Move Layer Down
                          </button>
                          <button
                            className="p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
                            onClick={toggleLayerVisibility}
                          >
                            {selectedLayer.visible
                              ? "Hide Layer"
                              : "Show Layer"}
                          </button>
                          <button
                            className="p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
                            onClick={toggleLayerLock}
                          >
                            {selectedLayer.lockMovementX
                              ? "Unlock Layer"
                              : "Lock Layer"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Crop / resize canvas tool */}
                {tool.name === selectedTool && (
                  <div className="fixed left-[110px] top-[10px] z-50">
                    {showSizeCropModal && activeBlock.crop && (
                      <div>
                        <div className="bg-gray-700 p-2 rounded border border-yellow-400">
                          <h2 className="text-2xl mb-4">Custom size</h2>
                          <div className="mb-4">
                            <label className="block mb-2">Width:</label>
                            <input
                              type="number"
                              value={customSize.width}
                              onChange={(e) =>
                                setCustomSize({
                                  ...customSize,
                                  width: e.target.value,
                                })
                              }
                              className="border p-2 w-6/12 text-black"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block mb-2">Height:</label>
                            <input
                              type="number"
                              value={customSize.height}
                              onChange={(e) =>
                                setCustomSize({
                                  ...customSize,
                                  height: e.target.value,
                                })
                              }
                              className="border p-2 w-6/12 text-black"
                            />
                          </div>
                          <div className="flex justify-between">
                            {/* <button
                              onClick={handleDefaultSize}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded"
                            >
                              Default Size
                            </button> */}
                            <button
                              onClick={handleSizeCropSubmit}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => setShowSizeCropModal(false)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedObject && (
            <div className="p-4">
              <button
                className="w-full p-2 mb-2 bg-red-500 hover:bg-red-400 rounded"
                onClick={handleDeleteObject}
              >
                Delete
              </button>
              <button
                className="w-full p-2 mb-2 bg-blue-500 hover:bg-blue-400 rounded"
                onClick={handleRotateObject}
              >
                Rotate
              </button>
              {/* Add more object-specific actions here */}
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          {/* <div className="flex z-40 fixed top-0 items-center w-full max-w-xs p-2 space-x-4 rtl:space-x-reverse bg-white opacity-45 text-black divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800">
            <div className="ps-4 text-sm font-normal">Canvas Size: {Math.round(width)} x {Math.round(height)}
            </div>
          </div> */}

          <div className="flex justify-center h-[screen]">
            <CropperTool
              selectedTool={selectedTool}
              getCanvasSizeCB={getCanvasSizeCB}
              showSizeCropModal={showSizeCropModal}
              setShowSizeCropModal={setShowSizeCropModal}
            />
            {/* direct conditions are not allowed, while there are needed to  */}
            <div className="relative">
              {borderCanvas ? (
                <div className="flex flex-col p-3 space-y-2">
                  {" "}
                  <button
                    className="bg-black rounded-full text-white p-2 text-lg font-bold"
                    onClick={removeBackgroundColor}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                  <button
                    className="bg-black rounded-full text-white p-2 text-lg font-bold"
                    onClick={() => {
                      setborderCanvas(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{ border: borderCanvas ? "2px solid yellow" : "none" }}
            ></canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawtool;
