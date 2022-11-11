const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const userData = require("../data/users.json");

const getRandomData = () => {
  return userData[Math.floor(Math.random() * userData.length)];
};

const randomUrl = () => {
  const urls = [
    "https://www.solebox.com/en_DE",
    "https://www.solebox.com/en_DE/search?srule=new&prefn1=soleboxExclusive&prefv1=true&prefn2=isNew&prefv2=true&openCategory=true",
    "https://www.solebox.com/en_DE/search?srule=new&prefn1=soleboxExclusive&prefv1=true&prefn2=isNew&prefv2=true&openCategory=true",
  ];
  return urls[Math.floor(Math.random() * urls.length)];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const payloadEncode = (message) => {
  for (var e = "", r = 0; r < message.length; r++)
    e += String.fromCharCode(50 ^ message.charCodeAt(r));
  return b64Encode(e);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const genUuid = () => uuidv4();

const px984Encoder = (t, n) => {
  for (var e = "", r = 0; r < t.length; r++)
    e += String.fromCharCode(n ^ t.charCodeAt(r));
  return e;
};

const b64Encode = (str) => {
  return Buffer.from(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    )
  ).toString("base64");
};

const md5encrypt = (message, key) => {
  return crypto.createHmac("md5", key).update(message).digest("hex");
};

const pcEncrypt = (md5Payload) => {
  for (var n = "", e = "", r = 0; r < md5Payload.length; r++) {
    var o = md5Payload.charCodeAt(r);
    o >= 48 && o <= 57 ? (n += md5Payload[r]) : (e += o % 10);
  }
  return n + e;
};

const pcGen = (payload, key) => {
  const md5Payload = md5encrypt(payload, key);
  const encryptedPayload = pcEncrypt(md5Payload);
  for (o = "", i = 0; i < encryptedPayload.length; i += 2)
    o += encryptedPayload[i];
  return o;
};

const PX946Gen = async (param) => {
  const wasmCode =
    "AGFzbQEAAAABHwJgAn9/AX9gFH9/f39/f39/f39/f39/f39/f39/AX8DAwIBAAcgAg5fYWR2YW5jZWRfdGVzdAAAC19iYXNpY190ZXN0AAEKqAECnQEAQQAgA0UgA2ogAEUgAGpsQcoPaiAIRSAIaiAHRSAHamxqIApFIApqIARFIARqbGogDkUgDmogBUUgBWpsaiARRSARaiACRSACamxqIA1FIA1qIAxFIAxqbCAGRSAGaiABRSABamxqIA9FIA9qIAtFIAtqbGogEEUgEGogCUUgCWpsamsiAWshACABQQBIBH8gAAUgASIACyAARWoLBwAgASAAags=";
  const wasmBuffer = Buffer.from(wasmCode, "base64");
  const wasm = await WebAssembly.instantiate(wasmBuffer, {
    env: {
      STACKTOP: 1,
      memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
    },
  });
  for (var t = [], e = 0; e < param.length; e++) t.push(param[e].charCodeAt());
  var r = wasm.instance.exports._advanced_test.apply(null, t);
  return r;
};
const randomPx38 = () => {
  const payloads = [
    "touchstart",
    "touchend",
    "touchmove",
    "touchenter",
    "touchleave",
    "mouseenter",
    "mouseleave",
    "scroll",
    "wheel",
  ];
  return payloads[Math.floor(Math.random() * payloads.length)];
};

const randomHtmlPart = () => {
  const payloads = [
    "BODY",
    "#main",
    "#main",
    "DIV3>DIV1>DIV2>DIV2>DIV1>DIV2",
    "DIV1>DIV2>DIV1>DIV1>DIV2>DIV1>DIV>PICTURE>IMG",
    "#main>DIV5>DIV3>DIV1",
    "#main>DIV5",
    "DIV3>DIV1>DIV2>DIV2>DIV1>DIV1>DIV2>DIV1>DIV1",
    "DIV1>DIV2>DIV1>DIV1>DIV3>DIV1>DIV>PICTURE>IMG",
    "DIV1>DIV1>DIV2>DIV1>DIV1>DIV3",
    "DIV:nth-child(51)>DIV:nth-child(1)",
  ];
  return payloads[Math.floor(Math.random() * payloads.length)];
};
module.exports = {
  randomNumber,
  payloadEncode,
  sleep,
  b64Encode,
  md5encrypt,
  pcEncrypt,
  pcGen,
  genUuid,
  px984Encoder,
  getRandomData,
  randomUrl,
  randomPx38,
  randomHtmlPart,
};
