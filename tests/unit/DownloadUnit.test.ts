import http from "http";
import path from "path";
import fs from "fs-extra";
import DownloadUnit from "@/libraries/net/downloader/DownloadUnit";
import { DownloadUnitProgressFactory } from "@/libraries/net/downloader/DownloadUnitProgress";

const SERVER_PORT = 8085;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

const downloadFolder = path.join(__dirname, "../data/download/");
const tmpFolder = path.join(downloadFolder, "tmp");
const pathToHelloZip = path.join(downloadFolder, "hello.zip");

const routing = {
  home: (res: http.ServerResponse) => {
    res.write("Hello");
  },
  dlItem: (res: http.ServerResponse) => {
    const buffer = fs.readFileSync(pathToHelloZip);
    res.setHeader("content-length", buffer.length);
    res.write(buffer);
    res.end();
  },
  dlItemNoHeader: (res: http.ServerResponse) => {
    const buffer = fs.readFileSync(pathToHelloZip);
    res.write(buffer);
    res.end();
  },
  timeout: (res: http.ServerResponse) => {
    setTimeout(() => {
      res.write("waited");
      res.end();
    }, 200);
  },
};

jest.mock("electron", () => ({
  remote: { session: { defaultSession: { getUserAgent: () => "foobar" } } },
}));

let server: http.Server;

describe("download unit", () => {
  beforeAll(() => {
    server = http
      .createServer((req, res) => {
        switch (req.url) {
          case "/":
            routing.home(res);
            break;
          case "/dl_item":
            routing.dlItem(res);
            break;
          case "/dl_item_no_header":
            routing.dlItemNoHeader(res);
            break;
          case "/timeout":
            routing.timeout(res);
            break;
          default:
            throw new Error("wrong routing");
        }
      })
      .listen(SERVER_PORT);

    if (!fs.pathExistsSync(tmpFolder)) {
      fs.mkdir(tmpFolder);
    }
  });

  afterAll(() => {
    server.close();
    fs.removeSync(tmpFolder);
  });

  it("should download correctly with the tracker stats", async () => {
    expect.assertions(6);

    await new Promise((done) => {
      const input = `${SERVER_URL}/dl_item`;
      const output = path.join(tmpFolder, "hello.zip");

      const progress = DownloadUnitProgressFactory();
      const download = new DownloadUnit(
        input,
        fs.createWriteStream(output),
        progress
      );

      download.onCompleted(() => {
        expect(fs.pathExistsSync(output)).toBe(true);
        expect(progress).toBeDefined();
        expect(progress.bytes.total).toBe(156);
        expect(progress.bytes.percent).toBe(1);
        expect(progress.time.remaining).toBe(0);
        expect(progress.bytes.speed).not.toBe(0);

        done();
      });
    });
  });

  it("should have a progress of 0 if there's not content-length header", async () => {
    expect.assertions(3);

    await new Promise((done) => {
      const input = `${SERVER_URL}/dl_item_no_header`;
      const output = path.join(tmpFolder, "hello_no_header.zip");

      const progress = DownloadUnitProgressFactory();
      const download = new DownloadUnit(input, fs.createWriteStream(output));

      download.onCompleted(() => {
        expect(fs.pathExistsSync(output)).toBe(true);
        expect(progress.bytes.percent).toBe(0);
        expect(progress.bytes.total).toBe(0);
        done();
      });
    });
  });

  it("should throw an error on bad url", async () => {
    expect.assertions(1);

    const input = "test";
    const output = path.join(tmpFolder, "no_url.zip");

    expect(() => new DownloadUnit(input, fs.createWriteStream(output))).toThrow(
      /Invalid URI/
    );
  });

  it("should manage timeout", async () => {
    expect.assertions(1);

    await new Promise((done) => {
      const oldTimeout = DownloadUnit.TimeoutMs;
      DownloadUnit.TimeoutMs = 50;

      const input = `${SERVER_URL}/timeout`;
      const output = path.join(tmpFolder, "no_url.zip");

      const download = new DownloadUnit(input, fs.createWriteStream(output));
      download.onError((err: Error) => {
        expect(err.message).toBe("ESOCKETTIMEDOUT");

        done();
      });

      DownloadUnit.TimeoutMs = oldTimeout;
    });
  });
});
