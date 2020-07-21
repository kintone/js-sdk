import * as commander from "commander";
import { createCommanderProgram } from "./createCommanderProgram";

describe("createCommanderProgram", () => {
    let program: commander.Command;
    beforeEach(() => {
        program = createCommanderProgram();
    });

    test("default values", () => {
        program.parse(["node", "index.js"]);

        expect(program.demo).toBe(false);
        expect(program.host).toBeUndefined();
        expect(program.username).toBeUndefined();
        expect(program.password).toBeUndefined();
        expect(program.appId).toBeNull();
        expect(program.guestSpaceId).toBeNull();
        expect(program.preview).toBe(false);
        expect(program.namespace).toBe("kintone.types");
        expect(program.proxyHost).toBeNull();
        expect(program.proxyPort).toBeNull();
        expect(program.basicAuthUsername).toBeNull();
        expect(program.basicAuthPassword).toBeNull();
        expect(program.output).toBe("fields.d.ts");
    });

    test("long flag values", () => {
        // prettier-ignore
        program.parse([
          "node", "index.js",
          "--demo",
          "--host", "HOST",
          "--username", "USERNAME",
          "--password", "PASSWORD",
          "--app-id", "APP_ID",
          "--guest-space-id", "GUEST_SPACE_ID",
          "--preview",
          "--type-name", "TYPE_NAME",
          "--namespace", "NAMESPACE",
          "--proxy-host", "PROXY_HOST",
          "--proxy-port", "PROXY_PORT",
          "--basic-auth-username", "BASIC_AUTH_USERNAME",
          "--basic-auth-password", "BASIC_AUTH_PASSWORD",
          "--output", "OUTPUT"
        ]);

        expect(program.demo).toBe(true);
        expect(program.host).toBe("HOST");
        expect(program.username).toBe("USERNAME");
        expect(program.password).toBe("PASSWORD");
        expect(program.appId).toBe("APP_ID");
        expect(program.guestSpaceId).toBe("GUEST_SPACE_ID");
        expect(program.preview).toBe(true);
        expect(program.namespace).toBe("NAMESPACE");
        expect(program.proxyHost).toBe("PROXY_HOST");
        expect(program.proxyPort).toBe("PROXY_PORT");
        expect(program.basicAuthUsername).toBe(
            "BASIC_AUTH_USERNAME"
        );
        expect(program.basicAuthPassword).toBe(
            "BASIC_AUTH_PASSWORD"
        );
        expect(program.output).toBe("OUTPUT");
    });

    test("short flag values", () => {
        // prettier-ignore
        program.parse([
          "node", "index.js",
          "-u", "USERNAME",
          "-p", "PASSWORD",
          "-o", "OUTPUT"
        ]);

        expect(program.username).toBe("USERNAME");
        expect(program.password).toBe("PASSWORD");
        expect(program.output).toBe("OUTPUT");
    });
});
