let context: HTMLDivElement = document.querySelector(".context")!;

let textarea = document.querySelector("textarea")!;
//@ts-ignore
let game = new BoardMaker({
  boxNames: ["blue", "red", "wall", "empty", "power", "must"],
  height: localStorage.getItem("height") || 10,
  width: localStorage.getItem("width") || 10,
  context,
});

game.init();

setTimeout(() => {
  let metadatas = localStorage.getItem("board-data")
    ? JSON.parse(localStorage.getItem("board-data")!)
    : [];

  metadatas.forEach(
    (data: { position: { x: number; y: number }; name: string }) => {
      let {
        position: { x, y },
      } = data;

      let item = game.getElement({ x, y });
      item.classList.add(data.name);
    }
  );
}, 200);

let buttonGet: HTMLButtonElement = document.querySelector(".get")!;
let buttonSet: HTMLButtonElement = document.querySelector(".set")!;

let heightInp = document.querySelector<HTMLInputElement>("#height")!;
let widthInp = document.querySelector<HTMLInputElement>("#width")!;
let cols = document.querySelectorAll<HTMLDivElement>(".col")!;

listen();

function listen() {
  cols = document.querySelectorAll<HTMLDivElement>(".col")!;

  if (localStorage.getItem("width"))
    widthInp.value = localStorage.getItem("width")!;

  if (localStorage.getItem("height"))
    heightInp.value = localStorage.getItem("height")!;

  let selectedName = "empty";
  let lastItem: HTMLDivElement | null = null;

  cols.forEach((col) => {
    for (let row of col.children) {
      let classes = Array.from(row.classList);

      //@ts-ignore
      row.addEventListener("click", (ev: { target: HTMLDivElement }) => {
        let { x, y } = game.getPosition(row);
        let classes = Array.from(row.classList);

        let lastName = classes.at(-1)!;

        if (lastName === selectedName) {
          row.classList.remove(lastName);
          row.classList.add("empty");

          if (lastItem === game.getElemet({ x, y })) game.removeData({ x, y });
        } else {
          if (lastName.startsWith("item-")) {
            row.classList.add(selectedName);

            // game.addData({
            //   position: { x, y },
            //   name: selectedName,
            // });
          } else {
            row.classList.remove(lastName);
            row.classList.add(selectedName);

            // game.addData({
            //   position: { x, y },
            //   name: selectedName,
            // });
          }
        }
      });
    }
  });

  let boxNames = document.querySelector(".boxNames")!;

  for (let a of boxNames?.children) {
    // @ts-ignore
    a.addEventListener("click", (ev: Event & { target: HTMLLinkElement }) => {
      ev.preventDefault();

      let name = ev.target.textContent!;

      ev.target.classList.add("targeted");

      let allA = Array.from(boxNames.children).filter(
        (a) => a.textContent! !== name
      );

      allA.forEach((a) => {
        a.classList.remove("targeted");
      });

      selectedName = name;
    });
  }

  buttonGet.addEventListener("click", (ev) => {
    textarea.value = JSON.stringify(game.toMetadatas());

    context = document.querySelector<HTMLDivElement>(".context")!;

    game.context = context;

    localStorage.setItem("board-data", textarea.value);

    listen();
  });

  buttonSet.addEventListener("click", (ev) => {
    let metadatas = JSON.parse(textarea.value);

    game.metadatas = metadatas;

    game.init();

    game.metadatas.forEach((data: any) => {
      let {
        position: { x, y },
        name,
      } = data;

      let item = game.getElement({ x, y });
      item.classList.add(name);
    });

    listen();
  });
}

heightInp?.addEventListener(
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

widthInp?.addEventListener(
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
