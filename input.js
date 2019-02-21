const stdin = process.openStdin();
const fs = require("fs");

const consoleInputHandler = (data) => {
  const input = data.toString().trim();
  const args = input.split(" ");

  const addForbiddenHost = (err, data) => {
    var json = JSON.parse(data);
    json.push(args[2] + '":"' + args[2]);
    fs.writeFile("forbidden_hosts.json", JSON.stringify(json));
  };

  const removeForbiddenHost = (err, data) => {
    var json = JSON.parse(data);
    var i = json.findIndex(obj => obj.name == args[2]);
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
          process.stdout.write("Listing all forbidden hosts\n");
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
