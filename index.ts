let context: HTMLDivElement = document.querySelector(".context")!;

let color = document.querySelector<HTMLInputElement>("#color")!;
//@ts-ignore
let game = new BoardMaker({
  height: localStorage.getItem("height") || 10,
  width: localStorage.getItem("width") || 10,
  context,
});

let contextCopy = document.createElement("div");
contextCopy.classList.add("context");
contextCopy.innerHTML = context.innerHTML;

let heightInp = document.querySelector<HTMLInputElement>("#height")!;
let widthInp = document.querySelector<HTMLInputElement>("#width")!;
let cols = document.querySelectorAll<HTMLDivElement>(".col")!;
let switchBtn = document.querySelector<HTMLButtonElement>("#switch")!;

let rowHistory: { x: number; y: number }[] = [];

listen();

//@ts-ignore
switchBtn.addEventListener("click", (ev: { target: HTMLButtonElement }) => {
  if (ev.target.classList.contains("edit-mode")) {
    //@ts-ignore
    html2canvas(context, { backgroundColor: null }).then(function (
      canvas: HTMLCanvasElement
    ) {
      const img = canvas.toDataURL("image/png");
      context.innerHTML = '<img src="' + img + '"/>';
    });

    ev.target.classList.remove("edit-mode");
    ev.target.classList.add("image-mode");
    ev.target.textContent = "Image Mode";
  } else {
    game.init();

    context.innerHTML = contextCopy.innerHTML;

    ev.target.classList.remove("image-mode");
    ev.target.classList.add("edit-mode");
    ev.target.textContent = "Edit Mode";
  }
});

function listen() {
  cols = document.querySelectorAll<HTMLDivElement>(".col")!;

  if (localStorage.getItem("width"))
    widthInp.value = localStorage.getItem("width")!;

  if (localStorage.getItem("height"))
    heightInp.value = localStorage.getItem("height")!;

  cols.forEach((col) => {
    for (let row of col.children) {
      //@ts-ignore
      row.addEventListener("click", (ev: { target: HTMLDivElement }) => {
        let { x, y } = game.getPosition(ev.target);

        rowHistory.push({ x, y });

        if (color.value === "#ffffff") {
          ev.target.style.backgroundColor = "transparent";

          return;
        }

        ev.target.style.backgroundColor = color.value;
      });
    }
  });
}

heightInp.addEventListener(
  "change",

  //@ts-ignore
  (ev: Event & { target: HTMLInputElement }) => {
    game.height = parseInt(ev.target.value);
    game.init();

    cols = document.querySelectorAll<HTMLDivElement>(".col");

    localStorage.setItem("height", game.height);
    listen();
  }
);

widthInp.addEventListener(
  "change",

  //@ts-ignore
  (ev: Event & { target: HTMLInputElement }) => {
    game.width = parseInt(ev.target.value);

    localStorage.setItem("width", game.width);
    game.init();

    cols = document.querySelectorAll<HTMLDivElement>(".col");
    listen();
  }
);
