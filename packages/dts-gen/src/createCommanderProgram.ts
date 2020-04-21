import { Command } from "commander";

export function createCommanderProgram() {
    const program = new Command();

    program
        .option(
            "--demo",
            "Generate Type definition from demo data.",
            false
        )

        .option("--host [host]")
        .option("-u, --username [username]")
        .option("-p, --password [password]")
        .option(
            "--app-id [appId]",
            "id of kintone app",
            null
        )
        .option(
            "--guest-space-id [guestSpaceId]",
            "id of kintone guest space id",
            null
        )
        .option(
            "--preview",
            "set this option if kintone app is in preview mode",
            false
        )
        .option(
            "--type-name [typeName]",
            "type name to be generated",
            "Fields"
        )
        .option(
            "--namespace [namespace]",
            "namespace of type to be generated",
            "kintone.types"
        )
        .option(
            "--proxy-host [proxyHost]",
            "proxy host",
            null
        )
        .option(
            "--proxy-port [proxyPort]",
            "proxy port",
            null
        )
        .option(
            "--basic-auth-username [basicAuthUsername]",
            "username for basic authentication",
            null
        )
        .option(
            "--basic-auth-password [basicAuthPassword]",
            "password for basic authentication",
            null
        )
        .option(
            "-o, --output [output]",
            "output file name",
            "fields.d.ts"
        );

    return program;
}
