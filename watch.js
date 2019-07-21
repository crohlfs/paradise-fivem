const chokidar = require("chokidar");
const Q3RCon = require("quake3-rcon");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { debounce, uniq } = require("lodash");

let rcon;

chokidar
  .watch("server-data", {
    ignored: v => v.indexOf(".") !== -1 && v.indexOf(".cfg") === -1
  })
  .on("all", (_, path) => {
    if (path.indexOf(".cfg") === -1) return;

    const rl = readline.createInterface({
      input: fs.createReadStream(path)
    });

    rl.on("line", function(line) {
      const parts = line.split(" ");

      if (parts[0] === "rcon_password") {
        console.info(parts[1]);
        rcon = new Q3RCon({
          address: "127.0.0.1",
          port: 30120,
          password: parts[1]
        });
      }
    });
  });

const resourceRoot = "server-data\\resources";
const root = path.resolve(resourceRoot);

const queue = [];

const reloadResource = debounce(() => {
  for (const res of uniq(queue)) {
    console.info(`reloading ${res}`);
    rcon.send(`restart ${res}`, r => console.info(r));
  }
}, 250);

chokidar
  .watch(".", { cwd: resourceRoot, ignoreInitial: true })
  .on("all", (_, file) => {
    let dir = path.dirname(path.resolve(resourceRoot, file));

    while (root.length < dir.length) {
      if (fs.existsSync(path.resolve(dir, "__resource.lua"))) {
        const resource = path.basename(dir);

        queue.push(resource);
        reloadResource();
        return;
      }

      dir = path.resolve(dir, "/..");
    }
  });
