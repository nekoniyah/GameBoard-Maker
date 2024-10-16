// index.ts
function listen() {
  let down = false;
  cols = document.querySelectorAll(".col");
  context = document.querySelector(".context");
  if (localStorage.getItem("width"))
    widthInp.value = localStorage.getItem("width");
  if (localStorage.getItem("height"))
    heightInp.value = localStorage.getItem("height");
  cols.forEach((col) => {
    let children = Array.from(col.children);
    for (let row of children) {
      let click2 = function(ev) {
        let { x, y } = game.getPosition(ev.target);
        let colors = JSON.parse(localStorage.getItem("colors"));
        let val = color.value === "#ffffff" ? "transparent" : color.value;
        ev.target.style.backgroundColor = val;
        rowHistory = [{ x, y, color: "transparent" }, ...rowHistory];
        if (!colors.includes(val)) {
          colors = [...colors, val];
          window.localStorage.setItem("colors", JSON.stringify(colors));
          let div = document.createElement("div");
          div.classList.add("color");
          div.style.backgroundColor = val;
          lastColorsDiv.appendChild(div);
        }
      };
      var click = click2;
      row.addEventListener("mousedown", (ev) => {
        down = true;
      });
      row.addEventListener("mouseup", (ev) => {
        down = false;
      });
      row.addEventListener("mouseenter", (ev) => {
        ev.target.classList.add("hovered");
        if (down) {
          click2(ev);
        }
      });
      row.addEventListener("click", click2);
      row.addEventListener("mouseleave", (ev) => {
        ev.target.classList.remove("hovered");
      });
    }
  });
}
var context = document.querySelector(".context");
var color = document.querySelector("#color");
var game = new BoardMaker(context, localStorage.getItem("height") ? parseInt(localStorage.getItem("height")) : 10, localStorage.getItem("width") ? parseInt(localStorage.getItem("width")) : 10);
game.init();
var contextCopy = document.createElement("div");
contextCopy.classList.add("context");
contextCopy.innerHTML = context.innerHTML;
var heightInp = document.querySelector("#height");
var widthInp = document.querySelector("#width");
var cols = document.querySelectorAll(".col");
var switchBtn = document.querySelector("#switch");
var undoBtn = document.querySelector("#undo");
var lastColorsDiv = document.querySelector(".last-colors");
var rowHistory = [];
lastColorsDiv.innerHTML = "";
if (localStorage.getItem("colors")) {
  let colors = JSON.parse(window.localStorage.getItem("colors"));
  colors.forEach((colorx) => {
    let div = document.createElement("div");
    div.classList.add("color");
    div.style.backgroundColor = colorx;
    lastColorsDiv.appendChild(div);
    div.addEventListener("click", (ev) => {
      color.value = chroma(ev.target.style.backgroundColor).hex();
    });
  });
} else {
  localStorage.setItem("colors", JSON.stringify([]));
}
listen();
switchBtn.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("edit-mode")) {
    html2canvas(context, { backgroundColor: null }).then(function(canvas) {
      const img = canvas.toDataURL("image/png");
      context.innerHTML = '<img src="' + img + '"/>';
    });
    listen();
    ev.target.classList.remove("edit-mode");
    ev.target.classList.add("image-mode");
    ev.target.textContent = "Image Mode";
  } else {
    context.innerHTML = "";
    context.innerHTML = contextCopy.innerHTML;
    ev.target.classList.remove("image-mode");
    ev.target.classList.add("edit-mode");
    ev.target.textContent = "Edit Mode";
    listen();
  }
});
undoBtn.addEventListener("click", (ev) => {
  let el = game.getElement(rowHistory[0]);
  if (rowHistory.length === 1) {
    rowHistory = [];
  } else if (rowHistory.length === 0)
    return;
  else {
    let recent = rowHistory.shift();
  }
  el.style.backgroundColor = "transparent";
});
heightInp.addEventListener("change", (ev) => {
  game.height = parseInt(ev.target.value);
  game.init();
  cols = document.querySelectorAll(".col");
  localStorage.setItem("height", `${game.height}`);
  listen();
});
widthInp.addEventListener("change", (ev) => {
  game.width = parseInt(ev.target.value);
  localStorage.setItem("width", `${game.width}`);
  game.init();
  cols = document.querySelectorAll(".col");
  listen();
});
