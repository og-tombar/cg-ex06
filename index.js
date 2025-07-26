import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;

app.use("/src", express.static(__dirname + "/src"));
app.use("/skybox", express.static(__dirname + "/skybox"));
app.use("/ui.css", express.static(__dirname + "/ui.css"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
