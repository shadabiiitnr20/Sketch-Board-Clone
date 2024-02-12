let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencil_color = document.querySelectorAll(".pencil-color");
let pencil_width_element = document.querySelector(".pencil-width");
let eraser_width_element = document.querySelector(".eraser-width");
let download_icon = document.querySelector(".download-icon");
let redo_icon = document.querySelector(".redo-icon");
let undo_icon = document.querySelector(".undo-icon");

let mouseDown = false;

let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tarcker array

let pencilColor = "red";
let eraserColor = "white";
let pencilWidth = pencil_width_element.value;
let eraserWidth = eraser_width_element.value;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

//beginPath , moveTo , lineTo , stroke
//tool.stroketyle , tool.lineWidth

//mousedown -> start new path, //mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  beginPath({
    x: e.clientX,
    y: e.clientY,
  });
  // let data = {
  //   x: e.clientX,
  //   y: e.clientY,
  // };

  //send data to server
  // socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraser_tool_open ? eraserColor : pencilColor,
      width: eraser_tool_open ? eraserWidth : pencilWidth,
    };

    //send data to server
    // socket.emit("drawStroke", data);
    drawStroke(data);
  }
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

const beginPath = (strokeObj) => {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
};

const drawStroke = (strokeObj) => {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
};

pencil_color.forEach((colorElement) => {
  colorElement.addEventListener("click", () => {
    let color = colorElement.classList[0];
    pencilColor = color;
    tool.strokeStyle = pencilColor;
  });
});

pencil_width_element.addEventListener("change", () => {
  pencilWidth = pencil_width_element.value;
  tool.lineWidth = pencilWidth;
});

eraser_width_element.addEventListener("change", () => {
  eraserWidth = eraser_width_element.value;
  tool.lineWidth = eraserWidth;
});

eraser_icon.addEventListener("click", () => {
  if (eraser_tool_open) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidth;
  }
});

download_icon.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

redo_icon.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;
  let trackObj = {
    trackValue: track,
    undoRedoTracker,
  };
  // socket.emit("undoRedo", trackObj);
  undoRedoCanvas(trackObj);
});

undo_icon.addEventListener("click", (e) => {
  if (track > 0) track--;
  let trackObj = {
    trackValue: track,
    undoRedoTracker,
  };
  // socket.emit("undoRedo", trackObj);
  undoRedoCanvas(trackObj);
});

const undoRedoCanvas = (trackObj) => {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image();
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
};

// socket.on("beginPath", (data) => {
//   //data from back-end
//   beginPath(data);
// });

// socket.on("drawStroke", (data) => {
//   //data from back-end
//   drawStroke(data);
// });

// socket.on("undoRedo", (data) => {
//   undoRedo(data);
// });
