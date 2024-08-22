"use strict";
let context = document.querySelector(".context");
let color = document.querySelector("#color");
//@ts-ignore
let game = new BoardMaker({
    height: localStorage.getItem("height") || 10,
    width: localStorage.getItem("width") || 10,
    context,
});
let contextCopy = document.createElement("div");
contextCopy.classList.add("context");
contextCopy.innerHTML = context.innerHTML;
let heightInp = document.querySelector("#height");
let widthInp = document.querySelector("#width");
let cols = document.querySelectorAll(".col");
let switchBtn = document.querySelector("#switch");
let clearBtn = document.querySelector("#clear");
let undoBtn = document.querySelector("#undo");
let rowHistory = [];
listen();
//@ts-ignore
switchBtn.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("edit-mode")) {
        //@ts-ignore
        html2canvas(context, { backgroundColor: null }).then(function (canvas) {
            const img = canvas.toDataURL("image/png");
            context.innerHTML = '<img src="' + img + '"/>';
        });
        listen();
        ev.target.classList.remove("edit-mode");
        ev.target.classList.add("image-mode");
        ev.target.textContent = "Image Mode";
    }
    else {
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
    }
    else if (rowHistory.length === 0)
        return;
    else {
        let recent = rowHistory.shift();
    }
    el.style.backgroundColor = "transparent";
});
function listen() {
    let down = false;
    cols = document.querySelectorAll(".col");
    context = document.querySelector(".context");
    if (localStorage.getItem("width"))
        widthInp.value = localStorage.getItem("width");
    if (localStorage.getItem("height"))
        heightInp.value = localStorage.getItem("height");
    cols.forEach((col) => {
        for (let row of col.children) {
            row.addEventListener("mousedown", (ev) => {
                down = true;
            });
            row.addEventListener("mouseup", (ev) => {
                down = false;
            });
            function click(ev) {
                let { x, y } = game.getPosition(ev.target);
                if (color.value === "#ffffff") {
                    ev.target.style.backgroundColor = "transparent";
                    rowHistory = [{ x, y, color: "transparent" }, ...rowHistory];
                    return;
                }
                ev.target.style.backgroundColor = color.value;
                rowHistory = [{ x, y, color: color.value }, ...rowHistory];
                console.log(rowHistory);
            }
            //@ts-ignore
            row.addEventListener("mouseenter", (ev) => {
                ev.target.classList.add("hovered");
                if (down) {
                    click(ev);
                }
            });
            //@ts-ignore
            row.addEventListener("click", click);
            //@ts-ignore
            row.addEventListener("mouseleave", (ev) => {
                ev.target.classList.remove("hovered");
            });
        }
    });
}
clearBtn.addEventListener("click", (ev) => {
    rowHistory = [];
    game.init();
    listen();
});
heightInp.addEventListener("change", 
//@ts-ignore
(ev) => {
    game.height = parseInt(ev.target.value);
    game.init();
    cols = document.querySelectorAll(".col");
    localStorage.setItem("height", game.height);
    listen();
});
widthInp.addEventListener("change", 
//@ts-ignore
(ev) => {
    game.width = parseInt(ev.target.value);
    localStorage.setItem("width", game.width);
    game.init();
    cols = document.querySelectorAll(".col");
    listen();
});
