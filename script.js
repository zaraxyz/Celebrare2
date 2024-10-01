document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("textContainer");
  const undoBtn = document.getElementById("undoBtn");
  const redoBtn = document.getElementById("redoBtn");
  const fontSelect = document.getElementById("fontSelect");
  const decreaseSize = document.getElementById("decreaseSize");
  const increaseSize = document.getElementById("increaseSize");
  const fontSize = document.getElementById("fontSize");
  const boldBtn = document.getElementById("boldBtn");
  const italicBtn = document.getElementById("italicBtn");
  const underlineBtn = document.getElementById("underlineBtn");
  const alignSelect = document.getElementById("alignSelect");
  const addTextBtn = document.getElementById("addTextBtn");

  let selectedElement = null;

  // Undo and Redo functionality using History
  const history = [];
  let currentStep = -1;

  function saveState() {
    currentStep++;
    history.splice(currentStep);
    history.push(textContainer.innerHTML);
  }

  undoBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      textContainer.innerHTML = history[currentStep];
      addDragListeners();
    }
  });

  redoBtn.addEventListener("click", () => {
    if (currentStep < history.length - 1) {
      currentStep++;
      textContainer.innerHTML = history[currentStep];
      addDragListeners();
    }
  });

  // Text controls
  fontSelect.addEventListener("change", () => {
    if (selectedElement) {
      selectedElement.style.fontFamily = fontSelect.value;
      saveState();
    }
  });

  function updateFontSize(newSize) {
    if (newSize >= 8 && newSize <= 72 && selectedElement) {
      fontSize.value = newSize;
      selectedElement.style.fontSize = `${newSize}px`;
      saveState();
    }
  }

  decreaseSize.addEventListener("click", () => {
    updateFontSize(Math.max(8, parseInt(fontSize.value) - 1));
  });

  increaseSize.addEventListener("click", () => {
    updateFontSize(Math.min(72, parseInt(fontSize.value) + 1));
  });

  fontSize.addEventListener("change", () => {
    updateFontSize(parseInt(fontSize.value));
  });

  boldBtn.addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.style.fontWeight =
        selectedElement.style.fontWeight === "bold" ? "normal" : "bold";
      saveState();
    }
  });

  italicBtn.addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.style.fontStyle =
        selectedElement.style.fontStyle === "italic" ? "normal" : "italic";
      saveState();
    }
  });

  underlineBtn.addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.style.textDecoration =
        selectedElement.style.textDecoration === "underline"
          ? "none"
          : "underline";
      saveState();
    }
  });

  alignSelect.addEventListener("change", () => {
    if (selectedElement) {
      selectedElement.style.textAlign = alignSelect.value;
      saveState();
    }
  });

  addTextBtn.addEventListener("click", () => {
    const text = prompt("Enter text to add:");
    if (text) {
      const textElement = document.createElement("div");
      textElement.className = "text-element";
      textElement.textContent = text;
      textElement.style.left = "10px";
      textElement.style.top = "10px";
      textContainer.appendChild(textElement);
      addDragListeners();
      saveState();
    }
  });

  function addDragListeners() {
    const textElements = document.querySelectorAll(".text-element");
    textElements.forEach((element) => {
      element.addEventListener("mousedown", startDragging);
      element.addEventListener("click", selectElement);
    });
  }

  function selectElement(e) {
    if (selectedElement) {
      selectedElement.style.border = "1px solid transparent";
    }
    selectedElement = e.target;
    selectedElement.style.border = "1px solid #007bff";
    updateControlsFromElement(selectedElement);
  }

  function updateControlsFromElement(element) {
    fontSelect.value = element.style.fontFamily || "Arial";
    fontSize.value = parseInt(element.style.fontSize) || 16;
    boldBtn.classList.toggle("active", element.style.fontWeight === "bold");
    italicBtn.classList.toggle("active", element.style.fontStyle === "italic");
    underlineBtn.classList.toggle(
      "active",
      element.style.textDecoration === "underline"
    );
    alignSelect.value = element.style.textAlign || "left";
  }

  function startDragging(e) {
    e.preventDefault();
    selectElement(e);

    const startX = e.clientX - selectedElement.offsetLeft;
    const startY = e.clientY - selectedElement.offsetTop;

    function dragElement(e) {
      e.preventDefault();
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;

      selectedElement.style.left = `${newX}px`;
      selectedElement.style.top = `${newY}px`;
    }

    function stopDragging() {
      document.removeEventListener("mousemove", dragElement);
      document.removeEventListener("mouseup", stopDragging);
      saveState();
    }

    document.addEventListener("mousemove", dragElement);
    document.addEventListener("mouseup", stopDragging);
  }

  // Initialize history
  saveState();
});
