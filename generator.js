process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const rp = require("request-promise");
const { sleep } = require("./src/utils");
const utils = require("./src/utils");
const fs = require("fs");
const request = require("./src/request");
const { rawProxy } = require("../src/proxyRotator"); // add your own proxy rotator module

class Generator {
  constructor() {
    this.collectorUrl =
      "https://collector-pxur63h57z.px-cloud.net/api/v2/collector";
    this.tag = "v6.9.2";
    this.fTag = "226";
    this.appId = "PXuR63h57Z";
    this.proxy = null;
    this.uuid = null;
    this.data = null; // user data collected to fake payloads data
    this.count = 0;
    this.pxData = {};
    this.cookie = {};
    this.protectionLevel = 330;
    this.location = null;
    this.startTime = null;
    this.completionTime = null;
    this.highSec = false;
  }

  async savePerimeterx() {
    const response = await rp.get(
      "https://client.px-cloud.net/PXuR63h57Z/main.min.js",
      { proxy: this.proxyGen() }
    );
    fs.writeFileSync("perimeterx.js", response);
  }

  postPayload(payload) {
    const proxy = this.proxy.split(":");
    const opts = {
      method: "POST", // POST, GET
      url: this.collectorUrl, // String
      proxy: `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`,

      headers: {
        "content-length": "",
        "user-agent": this.data.PX59,
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
        origin: "https://www.solebox.com",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: "https://www.solebox.com",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7",
      },
      form: payload,
      debug: false, // Boolean
      retry: false, // Boolean
      timeout: 5000, // Number
      followRedirect: true, // Boolean
      maxRedirects: 4, // Number
      rejectUnauthorized: false, // Boolean
    };
    return request(opts);
  }

  async genPx2() {
    const currentTs = Date.now();
    const payload = [
      {
        t: "PX2",
        d: {
          PX96: this.location, // window.location.href
          PX63: this.data.PX63, // navigator.platform
          PX191: 0, // window.self === window.top ? 0 : 1
          PX850: this.count, // continously growing, prolly the payloads count
          PX851: utils.randomNumber(1000, 2000), // Math.round(window.performance.now) time we passed on the page
          PX1008: 3600, // Seems a fixed value
          PX1055: currentTs, // Date.now()
          PX1056: currentTs + utils.randomNumber(1, 20), // Date.now() with some added milliseconds
          PX1038: this.uuid, // uuid
          PX371: false, // always false
        },
      },
    ];
    this.count++;
    const stringPayload = JSON.stringify(payload);
    const encodedPayload = utils.payloadEncode(stringPayload);
    const payloadPc = utils.pcGen(
      stringPayload,
      `${this.uuid}:${this.tag}:${this.fTag}`
    );
    const payloadOptions = `payload=${encodedPayload}&appId=${this.appId}&tag=${this.tag}&uuid=${this.uuid}&ft=${this.fTag}&seq=${this.count}&en=NTA&pc=${payloadPc}&rsc=1`;
    const response = await this.postPayload(payloadOptions);
    const responseData = JSON.parse(response.body);
    responseData.do.map((x) => {
      const data = x.split(/\|/g);
      this.pxData[data.shift()] = data;
    });
    console.log(`[${Date.now() - currentTs}ms] Posted PX2 Payload`);
    return true;
  }
  genPx297() {
    this.count++;
    return {
      t: "PX297",
      d: {
        PX38: utils.randomPx38(),
        PX70: utils.randomNumber(50, 2500),
        PX157: "true",
        PX72: utils.randomHtmlPart(),
        PX34: "TypeError: Cannot read property '0' of null\n    at At (https://client.px-cloud.net/PXuR63h57Z/main.min.js:2:13985)\n    at HTMLBodyElement.le (https://client.px-cloud.net/PXuR63h57Z/main.min.js:2:26719)",
        PX78: utils.randomNumber(300, this.data.PX91),
        PX79: utils.randomNumber(300, this.data.PX92),
        PX850: this.count,
        PX851: utils.randomNumber(3000, 4000),
        PX1056: new Date().getTime() + utils.randomNumber(100, 200),
        PX1038: this.uuid,
        PX371: false,
        //  PX96: this.location,
      },
    };
  }

  genPx23() {
    this.count++;
    return {
      t: "PX23",
      d: {
        PX123: this.uuid, // px uuid
        PX381: 2517,
        PX372: parseFloat(
          `${utils.randomNumber(1000, 1600)}.${utils.randomNumber(
            2549999966286,
            8549999966286
          )}`
        ),
        PX373: parseFloat(
          `${utils.randomNumber(10, 53)}.${utils.randomNumber(
            43999998876825,
            93999998876825
          )}`
        ),
        PX374: parseFloat(
          `${utils.randomNumber(1600, 2300)}.${utils.randomNumber(
            2850000038277,
            9850000038277
          )}`
        ),
        PX375: parseFloat(
          `${utils.randomNumber(54, 80)}.${utils.randomNumber(
            43999998876825,
            93999998876825
          )}`
        ),
        PX850: this.count, // this.count
        PX851: utils.randomNumber(3000, 4000),
        PX1056: new Date().getTime() + utils.randomNumber(100, 200),
        PX1038: this.uuid,
        PX371: false,
      },
    };
  }

  genPx203() {
    this.count++;
    return {
      t: "PX203",
      d: {
        PX204: this.count,
        PX59: this.data.PX59,
        PX887: true,
        PX888: 240000,
        PX839: 0,
        PX919: 0,
        PX359: utils.md5encrypt(this.uuid, this.data.PX59),
        PX357: utils.md5encrypt(this.pxData.vid[0], this.data.PX59),
        PX358: utils.md5encrypt(this.pxData.sid[0], this.data.PX59),
        PX850: this.count,
        PX851: utils.randomNumber(7000, 9000),
        PX1056: new Date().getTime(),
        PX1038: this.uuid,
        PX371: false,
        PX96: this.location,
      },
    };
  }

  async extraSec() {
    const currentTs = Date.now();
    const payload = [this.genPx23()];
    this.count++;
    const stringPayload = JSON.stringify(payload);
    const encodedPayload = utils.payloadEncode(stringPayload);
    const payloadPc = utils.pcGen(
      stringPayload,
      `${this.uuid}:${this.tag}:${this.fTag}`
    );
    const payloadOptions = `payload=${encodedPayload}&appId=${this.appId}&tag=${this.tag}&uuid=${this.uuid}&ft=${this.fTag}&seq=3&en=NTA&cs=${this.pxData.cs[0]}&pc=${payloadPc}&sid=${this.pxData.sid[0]}&vid=${this.pxData.vid[0]}&rsc=${this.count}`;
    const response = await this.postPayload(payloadOptions);
    const responseData = JSON.parse(response.body);
    console.log(`[${Date.now() - currentTs}ms] Posted Extra Sec Payload`);
    const px3Data = {};
    return true;
  }

  async extraSec2() {
    const currentTs = Date.now();
    const payload = [this.genPx203()];
    this.count++;
    const stringPayload = JSON.stringify(payload);
    const encodedPayload = utils.payloadEncode(stringPayload);
    const payloadPc = utils.pcGen(
      stringPayload,
      `${this.uuid}:${this.tag}:${this.fTag}`
    );
    const payloadOptions = `payload=${encodedPayload}&appId=${this.appId}&tag=${this.tag}&uuid=${this.uuid}&ft=${this.fTag}&seq=3&en=NTA&cs=${this.pxData.cs[0]}&pc=${payloadPc}&sid=${this.pxData.sid[0]}&vid=${this.pxData.vid[0]}&rsc=${this.count}`;
    const response = await this.postPayload(payloadOptions);
    const responseData = JSON.parse(response.body);
    console.log(`[${Date.now() - currentTs}ms] Posted Extra Sec 2 Payload`);
    const px3Data = {};
    return true;
  }

  async genPx3() {
    const currentTs = Date.now();
    const PX822 = utils.randomNumber(1111111, this.data.PX821);
    const PX823 = utils.randomNumber(111111, PX822);
    const payload = [
      {
        t: "PX3",
        d: {
          PX234: false, // !!window.spawn
          PX235: false, // !!window.emit
          PX151: false, //  window.hasOwnProperty(vv) || !!window[vv] ||"true" === document.getElementsByTagName("html")[0].getAttribute(vv))
          PX239: false, // !!window._Selenium_IDE_Recorder
          PX240: false, // !!document.__webdriver_script_fn
          PX152: false, // !!window.domAutomation || !!window.domAutomationController
          PX153: false, // !!window._phantom || !!window.callPhantom
          PX314: false, // !!window.geb
          PX192: false, // !!window.awesomium
          PX196: false, // Vt(window.RunPerfTest) check for native function
          PX207: false, // !!window.fmget_targets
          PX251: false, // !!window.__nightmare
          PX982: parseInt(this.pxData.sts[0]), //sts
          PX983: this.pxData.cls[0], //cls[0]
          [utils.px984Encoder(
            this.pxData.cls[0],
            (this.pxData.sts[0] % 10) + 2
          )]: utils.px984Encoder(
            this.pxData.cls[0],
            (this.pxData.sts[0] % 10) + 1
          ), //px984 basically: [PX983, (PX982 % 10) + 2] : PX983, (PX982 % 10) + 1
          PX986: this.pxData.cls[1], // cls[1]
          PX985: parseInt(this.pxData.drc[0]), // drc
          ...(this.pxData.sff[0] === "scs"
            ? { PX1057: this.pxData.sff[2].split(",")[1] }
            : null),
          PX1033: "e0eaf10e",
          PX1019: "d1917ca4",
          PX1020: "7766a52d",
          PX1021: "7edf266a",
          PX1022: "6a90378d",

          PX1035: false /* (
            navigator[t] ||
              navigator.hasOwnProperty(t) ||
              ((navigator[t] = 1), (n = 1 !== navigator[t]), delete navigator[t]),
            n
          ) */,
          PX1025: false, // window.navigator checks
          PX359: utils.md5encrypt(this.uuid, this.data.PX59), // md5 uuid + user agent
          PX943: this.pxData.wcs[0], // wcs
          PX357: utils.md5encrypt(this.pxData.vid[0], this.data.PX59), // md5  pxvid + user agent
          //   PX358: utils.md5encrypt(this.pxData.sid[0], this.data.PX59), // md5   pxsid + user agent
          PX229: this.data.PX229, // (window.screen && +screen.colorDepth) || 0
          PX230: this.data.PX230, // (screen && +screen.pixelDepth) || 0)
          PX91: this.data.PX91, // (window.screen && window.screen.width) || -1
          PX92: this.data.PX92, // (window.screen && window.screen.height) || -1
          PX269: this.data.PX269, // (window.screen && window.screen.availWidth) || -1,
          PX270: this.data.PX270, // (window.screen && window.screen.availHeight) || -1
          PX93: this.data.PX93, // PX91 + "x" + PX92
          PX185: this.data.PX185, // window.innerHeight || -1
          PX186: this.data.PX186, //  window.innerWidth || -1
          PX187: this.data.PX187, // window.scrollX || window.pageXOffset || 0
          PX188: this.data.PX188, // window.scrollY || window.pageYOffset || 0
          PX95: true, // !(0 === window.outerWidth && 0 === window.outerHeight)
          PX400: 281 /*  function ki() {
            var t = window[$d],
              n = t ? (t + "").length : 0;
            return (
              (n += Gd && Gd[Kd] ? (Gd[Kd] + "").length : 0),
              (n += document && document[qd] ? (document[qd] + "").length : 0)
            );
          } */,
          PX404: "144|54|54|180|68",
          PX90: ["loadTimes", "csi", "app", "runtime"],
          PX190: "" /* (window.chrome &&
            window.chrome.runtime &&
            window.chrome.runtime.id) ||
          "") */,
          PX552: "undefined", // navigator.webdriver + ""
          PX399: "undefined", // navigator.webdriver + ""
          PX549: 0, //  Qd in navigator ? 1 : 0;
          PX411: 0, // same as above
          PX402: 1, //  new window.SharedArrayBuffer(1).byteLength || -1
          PX548: 1, //   new window.SharedArrayBuffer(1).byteLength || -1
          PX405: true, // !!window.caches
          PX547: true, // !!window.caches
          PX134: true, // always true
          PX89: true, // always true
          PX170: this.data.PX170, // navigator.plugins.length
          PX85: this.data.PX85, // t.push(navigator.plugins[n].name);
          PX59: this.data.PX59,
          PX61: "en",
          PX313: ["en", "it-IT", "it", "en-US", "de", "eu", "ru", "pl"], // navigator.language
          PX63: this.data.PX63, // navigator.platform
          PX86: this.data.PX86 /* !!(
            navigator.doNotTrack ||
            null === navigator.doNotTrack ||
            navigator.msDoNotTrack ||
            window.doNotTrack
          )) */,
          PX154: this.data.PX154, // new Date().getTimezoneOffset();
          PX133:
            this.data
              .PX133 /* var t = navigator.mimeTypes && navigator.mimeTypes.toString();
          return (
            "[object MimeTypeArray]" === t || /MSMimeTypesCollection/i.test(t)
          ); */,
          PX88: this.data.PX88, // same as above
          PX169: this.data.PX169, // navigator.mimeTypes && navigator.mimeTypes.length || -1
          PX62: this.data.PX62, // navigator.product
          PX69: this.data.PX69, // navigator.productSub
          PX64: this.data.PX64, // navigator.appVersion
          PX65: this.data.PX65, // navigator.appName
          PX66: this.data.PX66, // navigator.appCodeName
          PX60: this.data.PX60, //  "onLine" in navigator && !0 === navigator.onLine
          PX87: this.data.PX87, // navigator.geolocation + "" == "[object Geolocation]"
          PX821: this.data.PX821, // window.performance.memory.jsHeapSizeLimit
          PX822, // window.performance.memory.totalJSHeapSize
          PX823, // window.performance.memory.usedJSHeapSize
          PX147: this.data.PX147, // !!window.ActiveXObject
          PX155: Date(), // window.Date()
          PX236: this.data.PX236, // !!window.Buffer
          PX194: this.data.PX194, // !!window.v8Locale
          PX195: this.data.PX195, // !!navigator.sendBeacon
          PX237:
            this.data
              .PX237 /* return "number" == typeof navigator.maxTouchPoints
          ? navigator.maxTouchPoints
          : "number" == typeof navigator.msMaxTouchPoints
          ? navigator.msMaxTouchPoints
          : void 0;*/,
          PX238: this.data.PX238, // navigator.msDoNotTrack || dv
          PX208: this.data.PX208, // document.visibilityState
          PX218: this.data.PX218, // +document.documentMode || 0
          PX231: this.data.PX231, // +window.outerHeight || 0
          PX232: this.data.PX232, // +window.outerWidth || 0
          PX254: false, // !!window.showModalDialog
          PX295: false, //  document.createEvent("TouchEvent");
          PX268: false, //  window.hasOwnProperty("ontouchstart") || !!window.ontouchstart
          PX166: true, // window.setTimeout NATIVE
          PX138: true, // window.openDatabase NATIVE
          PX143: true /* Vt(window.BatteryManager) ||
          Vt(navigator.battery) ||
          Vt(navigator.getBattery)), native checks*/,
          PX714: "64556c77", // weird checks about functions
          PX715: "", // ^
          PX724: "10207b2f", // ^
          PX725: "10207b2f", // ^
          PX729: "", // ^
          PX443: true, // !!window.isSecureContext
          PX466: true, // !!window.Worklet
          PX467: true, // !!window.AudioWorklet
          PX468: true, // !!window.AudioWorkletNode
          PX191: 0, // window.self === window.top ? 0 : 1
          PX94: utils.randomNumber(1, 10), // window.history.length || -1
          PX120: [], // document.location.ancestorOrigins
          PX141: false, // window.hasOwnProperty("onorientationchange") || !!window.onorientationchange
          PX96: this.location, // window.location.href
          PX55: "", //  document.referrer
          PX1069: "$11268862155096150373",
          $11268862155096150373: "PX1068",
          PX1065: this.count, // 1?
          PX850: this.count,
          PX851: utils.randomNumber(2000, 3000), // Math.round(window.performance.now())
          PX1054: currentTs + utils.randomNumber(100, 200), // new Date().getTime()
          PX1008: 3600, // gotta check if its fixed
          PX1055: currentTs + utils.randomNumber(100, 200), // new Date().getTime()
          PX1056: currentTs + utils.randomNumber(1000, 1200), // new Date().getTime()
          PX1038: this.uuid, // window._pxUuid
          PX371: false, // CD
        },
      },
      this.genPx297(),
    ];
    this.count++;
    const stringPayload = JSON.stringify(payload);
    const encodedPayload = utils.payloadEncode(stringPayload);
    const payloadPc = utils.pcGen(
      stringPayload,
      `${this.uuid}:${this.tag}:${this.fTag}`
    );
    const payloadOptions = `payload=${encodedPayload}&appId=${this.appId}&tag=${this.tag}&uuid=${this.uuid}&ft=${this.fTag}&seq=2&en=NTA&cs=${this.pxData.cs[0]}&pc=${payloadPc}&sid=${this.pxData.sid[0]}&vid=${this.pxData.vid[0]}&rsc=2`;
    const response = await this.postPayload(payloadOptions);
    const responseData = JSON.parse(response.body);
    console.log(`[${Date.now() - currentTs}ms] Posted PX3 Payload`);
    const px3Data = {};
    responseData.do.map((x) => {
      const data = x.split(/\|/g);
      px3Data[data.shift()] = data;
    });
    this.protectionLevel = px3Data.bake[1];
    this.cookie = {
      px3: px3Data.bake[2],
      ua: this.data.PX59,
      vid: this.pxData.vid[0],
      proxy: this.proxy,
    };
    this.completionTime = Date.now() - this.startTime;
    return true;
  }
  async sendPxGenAlert(level) {
    const pxHook = "https://discord.com/api/webhooks/sleepy__dev";
    const options = {
      uri: pxHook,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "PerimeterX V3 Generated a cookie",
            description: `Time: ${new Date().toISOString()} \n Level: ${
              parseInt(level) < 100 ? "Protection up" : "Protection down"
            }\n Cookie time: ${level}s \n Generation time: ${
              this.completionTime
            }ms`,
            color: 3329330,
            timestamp: new Date().toJSON(),
            footer: {
              text: "PerimeterX by sleepy",
            },
          },
        ],
      }),
    };
    rp(options);
  }
  async generate() {
    try {
      this.startTime = Date.now();
      this.count = 0;
      this.data = utils.getRandomData();
      this.location = utils.randomUrl();
      this.data.PX59 =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36";
      this.data.PX64 =
        "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36";
      this.proxy = rawProxy();
      console.log("[PX-GEN] Got random user data", "info");
      this.uuid = utils.genUuid();
      console.log("[PX-GEN] Generated UUID successfully", "info");
      await this.genPx2();
      await this.genPx3();
      if (this.highSec) {
        console.log(
          `[PX-GEN WARNING] High security is currently active, generating high-sec payload`,
          "warn"
        );
        await this.extraSec();
        await this.extraSec2();
      }
      if (this.protectionLevel != 330)
        this.sendPxGenAlert(this.protectionLevel);
      console.log(
        `[${Date.now() - this.startTime}ms] Generated a new cookie!`,
        "success"
      );
      return this.cookie;
    } catch (err) {
      console.log(err);
      console.log(`Error while genning px3 cookie: ${err.message}`, "error");
      await sleep(1000);
      return this.generate();
    }
  }
}
module.exports = Generator;
