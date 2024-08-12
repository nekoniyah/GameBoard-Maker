var context = document.querySelector(".context");
var textarea = document.querySelector("textarea");
//@ts-ignore
var game = new BoardMaker({
    boxNames: ["blue", "red", "wall", "empty", "power", "must"],
    height: localStorage.getItem("height") || 10,
    width: localStorage.getItem("width") || 10,
    context: context,
});
game.init();
setTimeout(function () {
    var metadatas = localStorage.getItem("board-data")
        ? JSON.parse(localStorage.getItem("board-data"))
        : [];
    metadatas.forEach(function (data) {
        var _a = data.position, x = _a.x, y = _a.y;
        var item = game.getElement({ x: x, y: y });
        item.classList.add(data.name);
    });
}, 200);
var buttonGet = document.querySelector(".get");
var buttonSet = document.querySelector(".set");
var heightInp = document.querySelector("#height");
var widthInp = document.querySelector("#width");
var cols = document.querySelectorAll(".col");
listen();
function listen() {
    cols = document.querySelectorAll(".col");
    if (localStorage.getItem("width"))
        widthInp.value = localStorage.getItem("width");
    if (localStorage.getItem("height"))
        heightInp.value = localStorage.getItem("height");
    var selectedName = "empty";
    var lastItem = null;
    cols.forEach(function (col) {
        var _loop_1 = function (row) {
            var classes = Array.from(row.classList);
            //@ts-ignore
            row.addEventListener("click", function (ev) {
                var _a = game.getPosition(row), x = _a.x, y = _a.y;
                var classes = Array.from(row.classList);
                var lastName = classes.at(-1);
                if (lastName === selectedName) {
                    row.classList.remove(lastName);
                    row.classList.add("empty");
                    if (lastItem === game.getElemet({ x: x, y: y }))
                        game.removeData({ x: x, y: y });
                }
                else {
                    if (lastName.startsWith("item-")) {
                        row.classList.add(selectedName);
                        // game.addData({
                        //   position: { x, y },
                        //   name: selectedName,
                        // });
                    }
                    else {
                        row.classList.remove(lastName);
                        row.classList.add(selectedName);
                        // game.addData({
                        //   position: { x, y },
                        //   name: selectedName,
                        // });
                    }
                }
            });
        };
        for (var _i = 0, _a = col.children; _i < _a.length; _i++) {
            var row = _a[_i];
            _loop_1(row);
        }
    });
    var boxNames = document.querySelector(".boxNames");
    for (var _i = 0, _a = boxNames === null || boxNames === void 0 ? void 0 : boxNames.children; _i < _a.length; _i++) {
        var a = _a[_i];
        // @ts-ignore
        a.addEventListener("click", function (ev) {
            ev.preventDefault();
            var name = ev.target.textContent;
            ev.target.classList.add("targeted");
            var allA = Array.from(boxNames.children).filter(function (a) { return a.textContent !== name; });
            allA.forEach(function (a) {
                a.classList.remove("targeted");
            });
            selectedName = name;
        });
    }
    buttonGet.addEventListener("click", function (ev) {
        textarea.value = JSON.stringify(game.toMetadatas());
        context = document.querySelector(".context");
        game.context = context;
        localStorage.setItem("board-data", textarea.value);
        listen();
    });
    buttonSet.addEventListener("click", function (ev) {
        var metadatas = JSON.parse(textarea.value);
        game.metadatas = metadatas;
        game.init();
        game.metadatas.forEach(function (data) {
            var _a = data.position, x = _a.x, y = _a.y, name = data.name;
            var item = game.getElement({ x: x, y: y });
            item.classList.add(name);
        });
        listen();
    });
}
heightInp === null || heightInp === void 0 ? void 0 : heightInp.addEventListener("change", 
//@ts-ignore
function (ev) {
    game.height = parseInt(ev.target.value);
    game.init();
    cols = document.querySelectorAll(".col");
    localStorage.setItem("height", game.height);
    listen();
});
widthInp === null || widthInp === void 0 ? void 0 : widthInp.addEventListener("change", 
//@ts-ignore
function (ev) {
    game.width = parseInt(ev.target.value);
    localStorage.setItem("width", game.width);
    game.init();
    cols = document.querySelectorAll(".col");
    listen();
});
