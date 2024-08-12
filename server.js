const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use("/", express.static("./"));

app.listen(5000);
