const stdin = process.openStdin();
const fs = require("fs");

const consoleInputHandler = (data) => {
  const input = data.toString().trim();
  const args = input.split(" ");

  const listHosts = (err, data) => {
    var json = JSON.parse(data);
    var i = 0;
    for (i = 0; i < json.length; i++) {
      console.log(json[i]);
    }
    console.log();
  };

  const addForbiddenHost = (err, data) => {
    var json = JSON.parse(data);
    console.log(JSON.stringify(json));
    json.push(args[2]);
    fs.writeFile("forbidden_hosts.json", JSON.stringify(json));
  };

  const removeForbiddenHost = (err, data) => {
    var json = JSON.parse(data);
    var i = 0;
    while (json[i] !== args[2] && i < json.length) {
      i++;
    }
    console.log(i);
    json.splice(i, 1);
    console.log(json);
    fs.writeFile("forbidden_hosts.json", JSON.stringify(json));
  };

  switch (args[0]) {
    case "test":
      process.stdout.write("logging test\n");
      break;
    case "forbidden-hosts":
      switch (args[1]) {
        case "list":
          process.stdout.write("Listing all forbidden hosts:\n\n");
          fs.readFile('forbidden_hosts.json', listHosts)
          break;
        case "add":
          process.stdout.write("Add a forbidden host to list\n");
          fs.readFile('forbidden_hosts.json', addForbiddenHost);
          break;
        case "remove":
          fs.readFile('forbidden_hosts.json', removeForbiddenHost);
          break;
        default:
        process.stdout.write("Undefined/Invalid Argument followed by \"allowed-hosts\"\n");
      }
      break;
    case "cache":
      process.stdout.write("cache mode\n");
      break;
    default:
      process.stdout.write("usage mode\n");
  }
}

stdin.addListener("data", consoleInputHandler);

module.exports.stdin = stdin;
module.exports.consoleInputHandler = consoleInputHandler;
