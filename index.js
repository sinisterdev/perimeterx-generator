const Generator = require("./generator");
const { sleep } = require("./src/utils");
const { rawProxy } = require("../src/proxyRotator"); // add your own proxy rotator module
const request = require("./src/request");

class Manager {
  constructor() {
    this.url =
      "https://www.solebox.com/de_DE/p/asics_sportstyle-gel-kayano_14-white%2Fpure_gold-01863625.html?format=ajax&chosen=product&dwvar_212_=";
    this.cookie = {};
    this.generator = new Generator();
    this.valid = false;
    this.forceRun = false;
    this.runningTime = [8, 9, 19];
  }

  startHighSec() {
    this.generator.highSec = true;
  }
  stopHighSec() {
    this.generator.highSec = false;
  }

  async startForce() {
    await this.generateCookie();
    this.forceRun = true;
  }
  stopForce() {
    this.forceRun = false;
  }

  shouldRun() {
    const currentTime = new Date().getHours() + 2;
    return true; //this.runningTime.includes(currentTime);
  }

  async generateCookie() {
    this.cookie = await this.generator.generate();
  }
  getCookie() {
    return this.cookie;
  }

  async monitor() {
    try {
      const proxy =
        (this.cookie && this.cookie.proxy && this.cookie.proxy.split(":")) ||
        rawProxy().split(":");
      const options = {
        uri: this.url,
        method: "GET",
        proxy: `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`,
        followRedirect: false,
        headers: {
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "cache-control": "no-cache",
          cookie: `_px3=${this.cookie.px3}; _pxvid=${this.cookie.vid}`,
          "sec-fetch-site": "none",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7",
        },
      };
      const response = await request(options);
      if (
        response &&
        response.statusCode === 302 &&
        response.headers.location.includes("PX-")
      ) {
        this.valid = false;
        console.log("[Generator Monitor] Got PerimeterX Page", "error");
        await this.generateCookie();
        return false;
      }
      console.log("[PX CHECKER]", response.statusCode);
      if (this.valid) return true;
      this.valid = true;
      this.sendPxGenAlert();
    } catch (err) {
      console.log(err, this.cookie);
      return false;
    }
  }

  async testCookie() {
    try {
      const proxy = this.cookie.proxy.split(":");
      const options = {
        uri: this.url,
        method: "GET",
        proxy: `http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`,
        followRedirect: false,
        headers: {
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "cache-control": "no-cache",
          cookie: `_px3=${this.cookie.px3}; _pxvid=${this.cookie.vid}`,
          "sec-fetch-site": "none",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7",
        },
      };
      const response = await request(options);
      if (
        response &&
        response.statusCode === 302 &&
        response.headers.location.includes("PX-")
      )
        throw new Error("PX");
      this.sendPxGenAlert();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async sendPxGenAlert() {
    const pxHook = "https://discord.com/api/webhooks/sleepy__dev";
    const options = {
      uri: pxHook,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      form: JSON.stringify({
        embeds: [
          {
            title: "PerimeterX V3 Cookie is valid!",
            thumbnail: {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Checkmark_green.svg/1180px-Checkmark_green.svg.png",
            },
            color: 3329330,
            timestamp: new Date().toJSON(),
            footer: {
              text: "PerimeterX by Sleepy",
            },
          },
        ],
      }),
    };
    request(options);
  }

  async start() {
    if (this.shouldRun() || this.forceRun) await this.monitor();
    await sleep(50000);
    return this.start();
  }
}
module.exports = Manager;
