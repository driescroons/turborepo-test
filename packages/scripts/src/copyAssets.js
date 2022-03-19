const fs = require("fs-extra");
const path = require("path");

fs.copySync(
  path.resolve(__dirname, "../../../apps/app/dist"),
  path.resolve(__dirname, "../../../apps/api/static"),
  { overwrite: true }
);

console.log("copied files");
