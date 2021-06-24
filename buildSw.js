require("dotenv").config({
  path: ".env.local",
});
const fs = require("fs");

const swFileSrc = "./src/serviceWorker.js";
const swFileDist = "./public/serviceWorker.js";

const args = process.argv.slice(2);

const buildSw = () => {
  const fileContent = fs.readFileSync(swFileSrc, {
    encoding: "utf-8",
  });

  const replaced = fileContent.replace(/process\.env\.(\w+)/g, (match, p1) => {
    return `"${process.env[p1]}"`;
  });

  return fs.writeFileSync(swFileDist, replaced);
};

buildSw();

if (args.includes("--watch")) {
  fs.watch(swFileSrc, buildSw);
}
