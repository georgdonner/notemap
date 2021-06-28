require("dotenv").config({
  path: ".env.local",
});
const fs = require("fs");

const swFilename = "serviceWorker.js";
const swSrc = `./src/${swFilename}`;
const swDist = {
  dev: "public",
  prod: "build",
};

const args = process.argv.slice(2);
const env = args.includes("--watch") ? "dev" : "prod";

const buildSw = async () => {
  const fileContent = fs.readFileSync(swSrc, {
    encoding: "utf-8",
  });

  const replaced = fileContent.replace(/process\.env\.(\w+)/g, (match, p1) => {
    return `"${process.env[p1]}"`;
  });

  await fs.writeFileSync(`./${swDist[env]}/${swFilename}`, replaced);

  console.log("Service worker build complete");
};

buildSw();

if (env === "dev") {
  fs.watch(swSrc, buildSw);
}
