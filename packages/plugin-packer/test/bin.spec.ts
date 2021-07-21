import path from "path";
import execa from "execa";
import pkg from "../package.json";

describe("bin", () => {
  it("should output version with --version", () =>
    exec("--version").then((result) => {
      expect(result.stdout).toBe(pkg.version);
    }));

  it("should fail without args", () =>
    exec().then(
      () => {
        throw new Error("should be rejected");
      },
      (result) => {
        expect(/An argument `PLUGIN_DIR` is required/.test(result.stderr)).toBe(
          true
        );
      }
    ));

  it("should recieve 1st arg as PLUGIN_DIR", () =>
    exec("foo").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: false },
      });
    }));

  it("should recieve --ppk", () =>
    exec("foo", "--ppk", "bar").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: false, ppk: "bar" },
      });
    }));

  it("should recieve --out", () =>
    exec("foo", "--out", "bar").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: false, out: "bar" },
      });
    }));

  it("should recieve --watch", () =>
    exec("foo", "--watch").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: true },
      });
    }));

  it("should recieve -w as an alias of --watch", () =>
    exec("foo", "-w").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: true },
      });
    }));

  it("should filter unexpected option", () =>
    exec("foo", "--bar").then((result) => {
      expect(JSON.parse(result.stdout)).toStrictEqual({
        pluginDir: "foo",
        flags: { watch: false },
      });
    }));
});

function exec(...args: string[]) {
  const binPath = path.resolve(
    __dirname,
    "..",
    pkg.bin["kintone-plugin-packer"]
  );
  const env = Object.assign({}, process.env, { NODE_ENV: "test" });
  return execa(binPath, args, { env });
}
