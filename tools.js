let hamburger_icon = document.querySelector(".hamburger-icon-container");

let tools_container = document.querySelector(".tools-container");
let show_tools_bar = true;

let pencil_tool_container = document.querySelector(".pencil-tool-container");
let eraser_tool_container = document.querySelector(".eraser-tool-container");

let pencil_icon = document.querySelector(".pen-icon");
let pencil_tool_open = false;
let eraser_icon = document.querySelector(".eraser-icon");
let eraser_tool_open = false;

let note_icon = document.querySelector(".note-icon");

let upload_icon = document.querySelector(".upload-icon");

hamburger_icon.addEventListener("click", (e) => {
  show_tools_bar = !show_tools_bar;
  if (show_tools_bar) openToolsBar();
  else closeToolsBar();
});

const openToolsBar = () => {
  let iconElement = hamburger_icon.children[0];
  iconElement.classList.remove("fa-times");
  iconElement.classList.add("fa-bars");
  tools_container.style.display = "flex";
};

const closeToolsBar = () => {
  let iconElement = hamburger_icon.children[0];
  iconElement.classList.remove("fa-bars");
  iconElement.classList.add("fa-times");
  tools_container.style.display = "none";

  pencil_tool_container.style.display = "none";
  eraser_tool_container.style.display = "none";
};

pencil_icon.addEventListener("click", () => {
  pencil_tool_open = !pencil_tool_open;
  if (pencil_tool_open) pencil_tool_container.style.display = "block";
  else pencil_tool_container.style.display = "none";
});

eraser_icon.addEventListener("click", () => {
  eraser_tool_open = !eraser_tool_open;
  if (eraser_tool_open) eraser_tool_container.style.display = "block";
  else eraser_tool_container.style.display = "none";
});

upload_icon.addEventListener("click", () => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", () => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let sticky_note_templateHTML = `
        <img src="${url}"/>
    `;

    createStickyNoteUpload(sticky_note_templateHTML);
  });
});

note_icon.addEventListener("click", () => {
  sticky_note_templateHTML = `
    <div class="note-header-container">
        <div class="minimize"></div>
        <div class="close"></div>
  </div>
  <div class="note-textarea-container">
        <textarea spellcheck="false"></textarea>
  </div>
    `;

  createStickyNote(sticky_note_templateHTML);
});

const createStickyNote = (sticky_note_templateHTML) => {
  let sticky_note_container = document.createElement("div");
  sticky_note_container.setAttribute("class", "sticky-note-container");
  sticky_note_container.innerHTML = sticky_note_templateHTML;
  document.body.appendChild(sticky_note_container);

  sticky_note_container.onmousedown = function (event) {
    dragAndDrop(sticky_note_container, event);
  };

  sticky_note_container.ondragstart = function () {
    return false;
  };

  let minimize = sticky_note_container.querySelector(".minimize");
  let close = sticky_note_container.querySelector(".close");
  noteActions(minimize, close, sticky_note_container);
};

const createStickyNoteUpload = (sticky_note_templateHTML) => {
    let sticky_note_container = document.createElement("div");
    sticky_note_container.setAttribute("class", "sticky-note-container");
    sticky_note_container.innerHTML = sticky_note_templateHTML;
    document.body.appendChild(sticky_note_container);
  
    sticky_note_container.onmousedown = function (event) {
      dragAndDrop(sticky_note_container, event);
    };
  
    sticky_note_container.ondragstart = function () {
      return false;
    };
  
  };

const noteActions = (minimize, close, sticky_note_container) => {
  close.addEventListener("click", () => {
    sticky_note_container.remove();
  });

  minimize.addEventListener("click", () => {
    let note_textarea_container = sticky_note_container.querySelector(
      ".note-textarea-container"
    );

    let display = getComputedStyle(note_textarea_container).getPropertyValue(
      "display"
    );

    if (display === "none") note_textarea_container.style.display = "block";
    else note_textarea_container.style.display = "none";
  });
};

const dragAndDrop = (element, event) => {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
};
