const fs = require("fs");

function base64Process(str) {
  return decodeURIComponent(
    Array.prototype.map
      .call(Buffer.from(str, "base64").toString(), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function payloadDecode(message) {
  message = base64Process(message);
  for (var e = "", r = 0; r < message.length; r++)
    e += String.fromCharCode(message.charCodeAt(r) ^ 50);
  return e;
}

const payload = fs.readFileSync("payload.txt", "utf8");

if (!fs.existsSync(__dirname + "/decoded/")) {
  fs.mkdirSync(__dirname + "/decoded/");
}

fs.writeFileSync(
  __dirname + `/decoded/${+new Date()}.json`,
  payloadDecode(payload)
);

console.log("Done!");
